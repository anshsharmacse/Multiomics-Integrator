"use client";

import { useState, useEffect, Suspense, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  Dna, Activity, Brain, Upload, BarChart3, Database, 
  Zap, Network, Atom, Microscope, LineChart, Settings,
  ChevronRight, Github, Linkedin, Mail,
  Play, Pause, RotateCcw, Download, Upload as UploadIcon,
  Layers, Cpu, Target, TrendingUp, AlertCircle, CheckCircle2,
  Info, X, Menu, Moon, Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useDataStore } from "@/lib/data-store";
import { create } from "zustand";

// Dynamic imports for 3D components
const DNAHelix3D = dynamic(() => import("@/components/3d/DNAHelix3D"), { ssr: false });
const NeuralNetwork3D = dynamic(() => import("@/components/3d/NeuralNetwork3D"), { ssr: false });
const MoleculeViewer3D = dynamic(() => import("@/components/3d/MoleculeViewer3D"), { ssr: false });
const ProteinStructure3D = dynamic(() => import("@/components/3d/ProteinStructure3D"), { ssr: false });

type PageType = "home" | "upload" | "analysis" | "architecture" | "results" | "about";

// Page store for navigation
const usePageStore = create<{ currentPage: PageType; setCurrentPage: (page: PageType) => void }>((set) => ({
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),
}));

// Client-side only check using useSyncExternalStore
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Home() {
  const currentPage = usePageStore((state) => state.currentPage);
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  const pages: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Dna className="w-4 h-4" /> },
    { id: "upload", label: "Data Upload", icon: <Upload className="w-4 h-4" /> },
    { id: "analysis", label: "Analysis", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "architecture", label: "Neural Architecture", icon: <Brain className="w-4 h-4" /> },
    { id: "results", label: "Results", icon: <LineChart className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-500 rounded-xl animate-pulse-glow" />
              <div className="absolute inset-[2px] bg-background rounded-[10px] flex items-center justify-center">
                <Dna className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">MultiOmics-Integrator</h1>
              <p className="text-[10px] text-muted-foreground">by Ansh Sharma</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {pages.map((page) => (
              <Button
                key={page.id}
                variant={currentPage === page.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page.id)}
                className="gap-2"
              >
                {page.icon}
                {page.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isClient && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border"
            >
              <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
                {pages.map((page) => (
                  <Button
                    key={page.id}
                    variant={currentPage === page.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(page.id);
                      setIsMenuOpen(false);
                    }}
                    className="gap-2 justify-start"
                  >
                    {page.icon}
                    {page.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentPage === "home" && (
            <HomePage key="home" setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "upload" && (
            <UploadPage key="upload" />
          )}
          {currentPage === "analysis" && (
            <AnalysisPage key="analysis" />
          )}
          {currentPage === "architecture" && (
            <ArchitecturePage key="architecture" />
          )}
          {currentPage === "results" && (
            <ResultsPage key="results" />
          )}
          {currentPage === "about" && (
            <AboutPage key="about" />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">
                © 2026 MultiOmics-Integrator. Developed by Ansh Sharma
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://github.com/anshsharmacse" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://www.linkedin.com/in/anshsharmacse/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="mailto:anshsharmacse@gmail.com">
                  <Mail className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Home Page Component
function HomePage({ setCurrentPage }: { setCurrentPage: (page: PageType) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] opacity-50">
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full animate-pulse" />}>
            <DNAHelix3D />
          </Suspense>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="outline" className="mb-4 border-emerald-500/50 text-emerald-500">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered Multi-Omics Integration
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              <span className="gradient-text">Deep Learning</span> for
              <br />
              Proteomics-Transcriptomics
              <br />
              Data Fusion
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Advanced multi-modal variational autoencoder platform for integrating 
              proteomics and transcriptomics data. Discover post-transcriptional 
              regulatory mechanisms with cross-modal attention mechanisms.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" onClick={() => setCurrentPage("upload")} className="gap-2">
                <Upload className="w-4 h-4" />
                Start Analysis
              </Button>
              <Button size="lg" variant="outline" onClick={() => setCurrentPage("architecture")} className="gap-2">
                <Brain className="w-4 h-4" />
                Explore Architecture
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge deep learning techniques with 
              intuitive visualizations for comprehensive multi-omics analysis.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Brain className="w-6 h-6" />, title: "Multi-Modal VAE", desc: "Variational autoencoders for data integration" },
              { icon: <Network className="w-6 h-6" />, title: "Cross-Modal Attention", desc: "Learn mRNA-protein relationships" },
              { icon: <Atom className="w-6 h-6" />, title: "3D Visualization", desc: "Interactive molecular structures" },
              { icon: <Target className="w-6 h-6" />, title: "Discordance Analysis", desc: "Identify regulatory mechanisms" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Genes Analyzed" },
              { value: "5K+", label: "Proteins Mapped" },
              { value: "98.5%", label: "Accuracy Rate" },
              { value: "500+", label: "Research Papers" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Molecule Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">3D Molecular Visualization</h2>
              <p className="text-muted-foreground mb-6">
                Explore protein structures and molecular compounds in interactive 3D. 
                Our visualization engine supports real-time rendering with atomic-level detail.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary">WebGL Rendering</Badge>
                <Badge variant="secondary">PDB Support</Badge>
                <Badge variant="secondary">Real-time Rotation</Badge>
                <Badge variant="secondary">Atomic Detail</Badge>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="h-[400px] rounded-xl overflow-hidden border border-border glass"
            >
              <Suspense fallback={<div className="w-full h-full animate-pulse bg-muted" />}>
                <ProteinStructure3D />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// Upload Page Component
function UploadPage() {
  const [proteomicsFile, setProteomicsFile] = useState<File | null>(null);
  const [transcriptomicsFile, setTranscriptomicsFile] = useState<File | null>(null);
  const { 
    datasets, 
    selectedDataset, 
    isLoading, 
    isLoaded,
    selectDataset, 
    loadCustomData,
    clearData 
  } = useDataStore();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  const handleDatasetSelect = async (datasetId: string) => {
    try {
      await selectDataset(datasetId);
      toast.success("Dataset loaded successfully! You can now proceed to Analysis.");
    } catch {
      toast.error("Failed to load dataset");
    }
  };

  const handleFileUpload = async () => {
    if (!proteomicsFile && !transcriptomicsFile) {
      toast.error("Please upload at least one data file");
      return;
    }
    
    if (proteomicsFile && transcriptomicsFile) {
      await loadCustomData(proteomicsFile, transcriptomicsFile);
      toast.success("Files uploaded successfully!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Data Upload</h1>
          <p className="text-muted-foreground">
            Upload your proteomics and transcriptomics data for analysis
          </p>
        </motion.div>

        {/* Selected Dataset Banner */}
        {selectedDataset && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <Card className="border-emerald-500/50 bg-emerald-500/10">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">{selectedDataset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDataset.genes.toLocaleString()} genes, {selectedDataset.proteins.toLocaleString()} proteins loaded
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage("analysis")}>
                      Go to Analysis
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearData}>
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-emerald-500" />
                Proteomics Data
              </CardTitle>
              <CardDescription>
                Upload protein abundance data (CSV, TSV, or Excel format)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  proteomicsFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-border hover:border-emerald-500'
                }`}
                onClick={() => document.getElementById('proteomics-upload')?.click()}
              >
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <Input
                  type="file"
                  accept=".csv,.tsv,.xlsx"
                  className="hidden"
                  id="proteomics-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProteomicsFile(file);
                      toast.success(`Loaded: ${file.name}`);
                    }
                  }}
                />
                {proteomicsFile ? (
                  <div>
                    <p className="text-emerald-500 font-medium">{proteomicsFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(proteomicsFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="text-emerald-500 hover:underline">Click to upload</span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                    <p className="text-xs text-muted-foreground mt-2">
                      CSV, TSV, or XLSX (MAX. 100MB)
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="w-5 h-5 text-cyan-500" />
                Transcriptomics Data
              </CardTitle>
              <CardDescription>
                Upload mRNA expression data (CSV, TSV, or Excel format)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  transcriptomicsFile ? 'border-cyan-500 bg-cyan-500/5' : 'border-border hover:border-cyan-500'
                }`}
                onClick={() => document.getElementById('transcriptomics-upload')?.click()}
              >
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <Input
                  type="file"
                  accept=".csv,.tsv,.xlsx"
                  className="hidden"
                  id="transcriptomics-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setTranscriptomicsFile(file);
                      toast.success(`Loaded: ${file.name}`);
                    }
                  }}
                />
                {transcriptomicsFile ? (
                  <div>
                    <p className="text-cyan-500 font-medium">{transcriptomicsFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(transcriptomicsFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="text-cyan-500 hover:underline">Click to upload</span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                    <p className="text-xs text-muted-foreground mt-2">
                      CSV, TSV, or XLSX (MAX. 100MB)
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              Sample Datasets
            </CardTitle>
            <CardDescription>
              Select from curated public datasets to explore the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datasets.map((dataset, i) => (
                <motion.div
                  key={dataset.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleDatasetSelect(dataset.id)}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer group ${
                    selectedDataset?.id === dataset.id 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-border hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedDataset?.id === dataset.id && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    <div>
                      <h4 className={`font-medium transition-colors ${
                        selectedDataset?.id === dataset.id 
                          ? 'text-emerald-500' 
                          : 'group-hover:text-emerald-500'
                      }`}>
                        {dataset.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{dataset.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{dataset.genes.toLocaleString()} genes</p>
                      <p className="text-sm text-muted-foreground">{dataset.proteins.toLocaleString()} proteins</p>
                    </div>
                    {isLoading && selectedDataset?.id !== dataset.id ? (
                      <div className="loading-spinner w-5 h-5" />
                    ) : (
                      <ChevronRight className={`w-4 h-4 transition-colors ${
                        selectedDataset?.id === dataset.id 
                          ? 'text-emerald-500' 
                          : 'text-muted-foreground group-hover:text-emerald-500'
                      }`} />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => { setProteomicsFile(null); setTranscriptomicsFile(null); clearData(); }}>
            Reset
          </Button>
          <Button 
            onClick={handleFileUpload} 
            disabled={isLoading || (!proteomicsFile && !transcriptomicsFile)} 
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner w-4 h-4" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload & Analyze
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Analysis Page Component
function AnalysisPage() {
  const [latentDim, setLatentDim] = useState(128);
  const [learningRate, setLearningRate] = useState(0.001);
  const [epochs, setEpochs] = useState(100);
  const [attentionHeads, setAttentionHeads] = useState(8);
  const [batchSize, setBatchSize] = useState(32);
  
  const { 
    isLoaded, 
    selectedDataset, 
    isAnalyzing, 
    analysisProgress, 
    startAnalysis 
  } = useDataStore();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  const handleStartAnalysis = async () => {
    if (!isLoaded) {
      toast.error("Please load a dataset first from the Upload page");
      setCurrentPage("upload");
      return;
    }
    await startAnalysis();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      {/* No Dataset Warning */}
      {!isLoaded && (
        <Card className="mb-6 border-amber-500/50 bg-amber-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-medium">No Dataset Loaded</p>
                <p className="text-sm text-muted-foreground">
                  Please select a sample dataset or upload your own data to start analysis
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => setCurrentPage("upload")}
              >
                Go to Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loaded Dataset Info */}
      {isLoaded && selectedDataset && (
        <Card className="mb-6 border-emerald-500/50 bg-emerald-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="font-medium">{selectedDataset.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedDataset.genes.toLocaleString()} genes, {selectedDataset.proteins.toLocaleString()} proteins ready for analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-500" />
              Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Latent Dimension: {latentDim}</Label>
              <Slider
                value={[latentDim]}
                onValueChange={(v) => setLatentDim(v[0])}
                min={32}
                max={512}
                step={32}
              />
            </div>

            <div className="space-y-2">
              <Label>Learning Rate: {learningRate}</Label>
              <Slider
                value={[learningRate * 1000]}
                onValueChange={(v) => setLearningRate(v[0] / 1000)}
                min={1}
                max={10}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <Label>Epochs: {epochs}</Label>
              <Slider
                value={[epochs]}
                onValueChange={(v) => setEpochs(v[0])}
                min={10}
                max={500}
                step={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Attention Heads: {attentionHeads}</Label>
              <Slider
                value={[attentionHeads]}
                onValueChange={(v) => setAttentionHeads(v[0])}
                min={1}
                max={16}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Batch Size: {batchSize}</Label>
              <Slider
                value={[batchSize]}
                onValueChange={(v) => setBatchSize(v[0])}
                min={8}
                max={128}
                step={8}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label>Use CCA Initialization</Label>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label>Dropout (0.3)</Label>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label>Batch Normalization</Label>
              <Switch defaultChecked />
            </div>

            <Button 
              onClick={handleStartAnalysis} 
              disabled={isAnalyzing || !isLoaded} 
              className="w-full gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Pause className="w-4 h-4" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Visualization Panel */}
        <div className="lg:col-span-2 space-y-6">
          {isAnalyzing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
                  Training Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Current Epoch</p>
                      <p className="text-lg font-semibold">{Math.floor(analysisProgress / 10)}/{epochs}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Loss</p>
                      <p className="text-lg font-semibold">{(2.5 - analysisProgress * 0.02).toFixed(4)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">KL Divergence</p>
                      <p className="text-lg font-semibold">{(1.2 - analysisProgress * 0.008).toFixed(4)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Correlation</p>
                      <p className="text-lg font-semibold">{(0.5 + analysisProgress * 0.004).toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Live Training Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Suspense fallback={<div className="w-full h-full animate-pulse bg-muted rounded-lg" />}>
                <NeuralNetwork3D isTraining={isAnalyzing} />
              </Suspense>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  Encoder Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Input Genes</span>
                    <span className="font-medium">{selectedDataset?.genes.toLocaleString() || "20,531"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hidden Layers</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Latent Dim</span>
                    <span className="font-medium">{latentDim}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Parameters</span>
                    <span className="font-medium">1.2M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-500" />
                  Decoder Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Output Proteins</span>
                    <span className="font-medium">{selectedDataset?.proteins.toLocaleString() || "12,753"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hidden Layers</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Attention Heads</span>
                    <span className="font-medium">{attentionHeads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Parameters</span>
                    <span className="font-medium">1.8M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Architecture Page Component
function ArchitecturePage() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const layers = [
    { id: "input", name: "Input Layer", neurons: 20, desc: "Gene expression & protein abundance data" },
    { id: "encoder", name: "Encoder", neurons: 15, desc: "Compresses multi-modal input into latent space" },
    { id: "attention", name: "Cross-Modal Attention", neurons: 12, desc: "Learns mRNA-protein relationships" },
    { id: "latent", name: "Latent Space", neurons: 8, desc: "Joint representation of both modalities" },
    { id: "decoder", name: "Decoder", neurons: 15, desc: "Reconstructs original features" },
    { id: "output", name: "Output Layer", neurons: 20, desc: "Predicted expression values" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Neural Network Architecture</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Interactive 3D visualization of the Multi-Modal Variational Autoencoder architecture
          with cross-modal attention mechanisms
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] glass">
            <CardContent className="h-full p-0">
              <Suspense fallback={<div className="w-full h-full animate-pulse bg-muted rounded-lg" />}>
                <NeuralNetwork3D onLayerSelect={setSelectedLayer} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-emerald-500" />
                Architecture Layers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {layers.map((layer, i) => (
                    <motion.div
                      key={layer.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedLayer === layer.id 
                          ? "border-emerald-500 bg-emerald-500/10" 
                          : "border-border hover:border-emerald-500/50"
                      }`}
                      onClick={() => setSelectedLayer(layer.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{layer.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {layer.neurons} neurons
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{layer.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Model Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Parameters</span>
                  <span className="font-medium">3.2M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trainable Layers</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attention Heads</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Activation</span>
                  <span className="font-medium">ReLU / Sigmoid</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Molecule Visualization Section */}
      <div className="mt-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">3D Molecular Compounds</h2>
          <p className="text-muted-foreground">
            Interactive visualization of biomolecules involved in proteomics analysis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "ATP Synthase", formula: "C₁₀H₁₆N₅O₁₃P₃" },
            { name: "Glucose", formula: "C₆H₁₂O₆" },
            { name: "Adenine", formula: "C₅H₅N₅" },
          ].map((molecule, i) => (
            <motion.div
              key={molecule.name}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="h-[200px]">
                  <Suspense fallback={<div className="w-full h-full animate-pulse bg-muted" />}>
                    <MoleculeViewer3D moleculeType={molecule.name} />
                  </Suspense>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{molecule.name}</h3>
                  <p className="text-sm text-muted-foreground">{molecule.formula}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Results Page Component
function ResultsPage() {
  const [viewMode, setViewMode] = useState<"umap" | "tsne">("umap");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
        <p className="text-muted-foreground">
          Explore integrated multi-omics data and discovered regulatory mechanisms
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Integrated Samples</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold gradient-text">1,247</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Discordant Pairs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-500">384</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Canonical Correlation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-500">0.87</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Dimensionality Reduction
            </CardTitle>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "umap" | "tsne")}>
              <TabsList>
                <TabsTrigger value="umap">UMAP</TabsTrigger>
                <TabsTrigger value="tsne">t-SNE</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg overflow-hidden bg-muted/30">
            <VisualizationChart type={viewMode} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Discordant mRNA-Protein Pairs
          </CardTitle>
          <CardDescription>
            Genes showing significant discordance between mRNA expression and protein abundance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {[
                { gene: "TP53", protein: "P04637", correlation: -0.45, mechanism: "Post-translational modification" },
                { gene: "MYC", protein: "P01106", correlation: -0.38, mechanism: "Protein degradation" },
                { gene: "EGFR", protein: "P00533", correlation: -0.32, mechanism: "Translational regulation" },
                { gene: "BRCA1", protein: "P38398", correlation: -0.28, mechanism: "Alternative splicing" },
                { gene: "KRAS", protein: "P01116", correlation: -0.25, mechanism: "Protein stability" },
              ].map((item, i) => (
                <motion.div
                  key={item.gene}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {item.gene.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{item.gene}</p>
                      <p className="text-xs text-muted-foreground">UniProt: {item.protein}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-amber-500">{item.correlation}</p>
                      <p className="text-xs text-muted-foreground">Correlation</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.mechanism}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// About Page Component
function AboutPage() {
  const dataSources = [
    { 
      name: "TCGA (The Cancer Genome Atlas)", 
      url: "https://www.cancer.gov/tcga",
      description: "Comprehensive molecular characterization of cancer",
      dataTypes: ["Genomics", "Transcriptomics", "Proteomics"]
    },
    { 
      name: "CPTAC (Clinical Proteomic Tumor Analysis Consortium)", 
      url: "https://proteomics.cancer.gov/programs/cptac",
      description: "Proteogenomic characterization of cancer",
      dataTypes: ["Proteomics", "Phosphoproteomics"]
    },
    { 
      name: "Human Protein Atlas", 
      url: "https://www.proteinatlas.org",
      description: "Tissue and cell-specific protein expression",
      dataTypes: ["Protein expression", "Subcellular localization"]
    },
    { 
      name: "GTEx (Genotype-Tissue Expression)", 
      url: "https://gtexportal.org",
      description: "Tissue-specific gene expression",
      dataTypes: ["Transcriptomics", "eQTLs"]
    },
    { 
      name: "UniProt", 
      url: "https://www.uniprot.org",
      description: "Protein sequence and function database",
      dataTypes: ["Protein sequences", "Annotations"]
    },
  ];

  const methods = [
    {
      title: "Multi-Modal Variational Autoencoder",
      icon: <Brain className="w-6 h-6" />,
      description: "Joint learning of proteomics and transcriptomics representations using variational inference."
    },
    {
      title: "Cross-Modal Attention",
      icon: <Network className="w-6 h-6" />,
      description: "Attention mechanisms to capture relationships between mRNA expression and protein abundance."
    },
    {
      title: "Canonical Correlation Analysis",
      icon: <Activity className="w-6 h-6" />,
      description: "Initialization strategy for maximizing correlation between modalities."
    },
    {
      title: "Dimensionality Reduction",
      icon: <Layers className="w-6 h-6" />,
      description: "UMAP and t-SNE for visualization of integrated multi-omics landscapes."
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold mb-4">About MultiOmics-Integrator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A deep learning platform for integrating proteomics and transcriptomics data, 
          developed by Ansh Sharma.
        </p>
      </motion.div>

      {/* Developer Section */}
      <Card className="mb-12 glass">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              AS
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold gradient-text">Ansh Sharma</h2>
              <p className="text-muted-foreground mb-2">Developer & Researcher</p>
              <p className="text-sm text-muted-foreground max-w-xl">
                Passionate about applying deep learning to biological data analysis. 
                Specializing in multi-modal learning, variational autoencoders, and 
                bioinformatics applications.
              </p>
              <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href="https://github.com/anshsharmacse" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href="https://www.linkedin.com/in/anshsharmacse/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href="mailto:anshsharmacse@gmail.com">
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Methods Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Methodology</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {methods.map((method, i) => (
            <motion.div
              key={method.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white mb-2">
                    {method.icon}
                  </div>
                  <CardTitle className="text-base">{method.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Data Sources Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Data Sources</h2>
        <div className="space-y-4">
          {dataSources.map((source, i) => (
            <motion.div
              key={source.name}
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:border-emerald-500/50 transition-colors">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {source.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {source.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {source.dataTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Citation */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-lg">Citation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
            <p>Ansh Sharma (2026). MultiOmics-Integrator: Deep Learning for</p>
            <p>Proteomics-Transcriptomics Data Fusion. GitHub Repository.</p>
            <p>https://github.com/anshsharmacse/multiomics-integrator</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Visualization Chart Component
function VisualizationChart({ type }: { type: "umap" | "tsne" }) {
  // Generate sample data points
  const generatePoints = () => {
    const points = [];
    const clusters = [
      { cx: 0, cy: 0, color: "#10b981", label: "Cluster 1" },
      { cx: 3, cy: 2, color: "#06b6d4", label: "Cluster 2" },
      { cx: -2, cy: 3, color: "#8b5cf6", label: "Cluster 3" },
      { cx: 2, cy: -2, color: "#f59e0b", label: "Cluster 4" },
    ];
    
    clusters.forEach((cluster) => {
      for (let i = 0; i < 30; i++) {
        points.push({
          x: cluster.cx + (Math.random() - 0.5) * 2,
          y: cluster.cy + (Math.random() - 0.5) * 2,
          color: cluster.color,
          label: cluster.label,
        });
      }
    });
    
    return points;
  };

  const points = generatePoints();

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="-5 -5 10 10" className="w-full h-full max-h-[400px]">
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={0.15}
            fill={point.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ delay: i * 0.005, duration: 0.3 }}
            className="cursor-pointer hover:opacity-100 transition-opacity"
          />
        ))}
        
        {/* Axis labels */}
        <text x="4" y="0" className="fill-muted-foreground text-[0.4px]">
          {type === "umap" ? "UMAP 1" : "t-SNE 1"}
        </text>
        <text x="0" y="4.5" className="fill-muted-foreground text-[0.4px]">
          {type === "umap" ? "UMAP 2" : "t-SNE 2"}
        </text>
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">
        {["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4"].map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ 
                backgroundColor: ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b"][i] 
              }} 
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
