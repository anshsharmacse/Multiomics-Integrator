"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface AnalysisMetrics {
  epoch: number;
  totalEpochs: number;
  loss: number;
  klDivergence: number;
  correlation: number;
  reconstructionError: number;
}

interface DiscordantPair {
  gene: string;
  protein: string;
  correlation: number;
  pValue: number;
  mechanism: string;
  foldChange: string;
}

interface AnalysisSummary {
  totalSamples: number;
  integratedFeatures: number;
  discordantPairs: number;
  canonicalCorrelation: number;
}

interface AnalysisState {
  isConnected: boolean;
  isAnalyzing: boolean;
  progress: number;
  metrics: AnalysisMetrics | null;
  discordantPairs: DiscordantPair[];
  summary: AnalysisSummary | null;
  error: string | null;
}

export function useAnalysis() {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<AnalysisState>({
    isConnected: false,
    isAnalyzing: false,
    progress: 0,
    metrics: null,
    discordantPairs: [],
    summary: null,
    error: null,
  });

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("/?XTransformPort=3003", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to analysis service");
      setState((prev) => ({ ...prev, isConnected: true, error: null }));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from analysis service");
      setState((prev) => ({ ...prev, isConnected: false }));
    });

    socket.on("analysis-status", (data) => {
      console.log("Analysis status:", data);
    });

    socket.on("analysis-progress", (data) => {
      setState((prev) => ({
        ...prev,
        progress: data.progress,
        metrics: data.metrics,
      }));
    });

    socket.on("discordant-pair-found", (pair: DiscordantPair) => {
      setState((prev) => ({
        ...prev,
        discordantPairs: [...prev.discordantPairs, pair].slice(-50), // Keep last 50
      }));
    });

    socket.on("analysis-complete", (data) => {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        summary: data.summary,
      }));
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to connect to analysis service",
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startAnalysis = useCallback((config?: { epochs?: number; batchSize?: number }) => {
    if (!socketRef.current || !state.isConnected) {
      console.error("Socket not connected");
      return;
    }

    setState((prev) => ({
      ...prev,
      isAnalyzing: true,
      progress: 0,
      metrics: null,
      discordantPairs: [],
      summary: null,
      error: null,
    }));

    socketRef.current.emit("start-analysis", config || { epochs: 100, batchSize: 32 });
  }, [state.isConnected]);

  const stopAnalysis = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit("stop-analysis");
    setState((prev) => ({ ...prev, isAnalyzing: false }));
  }, []);

  return {
    ...state,
    startAnalysis,
    stopAnalysis,
  };
}
