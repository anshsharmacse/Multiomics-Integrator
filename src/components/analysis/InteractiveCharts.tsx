"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DataPoint {
  x: number;
  y: number;
  cluster: number;
  label: string;
}

interface Props {
  type: "umap" | "tsne";
  isAnimating?: boolean;
}

export function InteractiveVisualization({ type, isAnimating = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const animationRef = useRef<number | null>(null);
  const pointsRef = useRef<DataPoint[]>([]);

  const colors = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];
  const clusterLabels = ["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4", "Cluster 5"];

  // Generate initial points using useMemo
  const initialPoints = useMemo(() => {
    const newPoints: DataPoint[] = [];
    const numClusters = 5;
    const pointsPerCluster = 40;

    for (let cluster = 0; cluster < numClusters; cluster++) {
      const centerX = (cluster % 3) * 150 + 100;
      const centerY = Math.floor(cluster / 3) * 150 + 100;

      for (let i = 0; i < pointsPerCluster; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 50;
        
        newPoints.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          cluster,
          label: `${clusterLabels[cluster]} - Sample ${i + 1}`,
        });
      }
    }

    return newPoints;
  }, [type]);

  // Initialize pointsRef
  useMemo(() => {
    pointsRef.current = initialPoints;
  }, [initialPoints]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points = pointsRef.current;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, canvas.height / 2);
    ctx.lineTo(canvas.width - 50, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 50);
    ctx.lineTo(canvas.width / 2, canvas.height - 50);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(type === "umap" ? "UMAP 1" : "t-SNE 1", canvas.width - 80, canvas.height / 2 - 10);
    ctx.fillText(type === "umap" ? "UMAP 2" : "t-SNE 2", canvas.width / 2 + 10, 40);

    // Draw points
    points.forEach((point) => {
      const isHovered = hoveredPoint === point;
      const baseRadius = isHovered ? 8 : 5;
      const color = colors[point.cluster];
      
      // Glow effect
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, baseRadius * 3
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "transparent");
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, baseRadius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Main point
      ctx.beginPath();
      ctx.arc(point.x, point.y, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      if (isHovered) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw legend
    const legendX = 20;
    let legendY = 20;
    
    clusterLabels.forEach((label, i) => {
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(legendX + 5, legendY + 5, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.textAlign = "left";
      ctx.fillText(label, legendX + 15, legendY + 9);
      legendY += 20;
    });
  }, [type, hoveredPoint, colors, clusterLabels]);

  // Animation loop
  useEffect(() => {
    drawCanvas();

    if (isAnimating) {
      const animate = () => {
        pointsRef.current = pointsRef.current.map((p) => ({
          ...p,
          x: p.x + (Math.random() - 0.5) * 2,
          y: p.y + (Math.random() - 0.5) * 2,
        }));
        drawCanvas();
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [drawCanvas, isAnimating]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const hovered = pointsRef.current.find(
      (p) => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 15
    );
    setHoveredPoint(hovered || null);
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
      />
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 bg-background/90 border border-emerald-500/50 rounded-lg px-3 py-2 text-sm"
          >
            <p className="font-medium">{hoveredPoint.label}</p>
            <p className="text-muted-foreground text-xs">
              Position: ({hoveredPoint.x.toFixed(1)}, {hoveredPoint.y.toFixed(1)})
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
