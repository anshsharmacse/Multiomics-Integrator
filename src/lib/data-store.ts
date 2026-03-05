import { create } from "zustand";

interface GeneData {
  gene: string;
  expression: number;
  protein: string;
  abundance: number;
  correlation: number;
}

interface Dataset {
  id: string;
  name: string;
  source: string;
  genes: number;
  proteins: number;
  samples: number;
  description: string;
  loaded: boolean;
}

interface AnalysisResult {
  gene: string;
  protein: string;
  correlation: number;
  pValue: number;
  mechanism: string;
  foldChange: string;
}

interface DataStore {
  // Dataset state
  selectedDataset: Dataset | null;
  datasets: Dataset[];
  isLoaded: boolean;
  isLoading: boolean;
  
  // Analysis state
  analysisResults: AnalysisResult[];
  isAnalyzing: boolean;
  analysisProgress: number;
  
  // Gene expression data
  geneData: GeneData[];
  
  // Actions
  selectDataset: (datasetId: string) => Promise<void>;
  loadCustomData: (proteomicsFile: File, transcriptomicsFile: File) => Promise<void>;
  startAnalysis: () => Promise<void>;
  clearData: () => void;
}

// Sample datasets
const defaultDatasets: Dataset[] = [
  {
    id: "tcga-brca",
    name: "TCGA Breast Cancer",
    source: "NCI Genomic Data Commons",
    genes: 20531,
    proteins: 12753,
    samples: 1098,
    description: "Breast invasive carcinoma multi-omics data",
    loaded: false,
  },
  {
    id: "cptac-ovarian",
    name: "CPTAC Ovarian Cancer",
    source: "Clinical Proteomic Tumor Analysis Consortium",
    genes: 18423,
    proteins: 9842,
    samples: 847,
    description: "Ovarian serous cystadenocarcinoma proteogenomics",
    loaded: false,
  },
  {
    id: "hpa",
    name: "Human Protein Atlas",
    source: "Knockout Mouse Project",
    genes: 19613,
    proteins: 15000,
    samples: 5000,
    description: "Tissue and cell-specific protein expression",
    loaded: false,
  },
];

// Generate mock gene data
function generateGeneData(count: number): GeneData[] {
  const genes = [
    "TP53", "MYC", "EGFR", "BRCA1", "KRAS", "PTEN", "RB1", "CDKN2A",
    "APC", "VHL", "BRAF", "PIK3CA", "NRAS", "HER2", "ALK", "MET",
    "AKT1", "MTOR", "JAK2", "STAT3", "NF1", "NF2", "WT1", "RET",
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    gene: genes[i % genes.length] + (i >= genes.length ? `_${Math.floor(i / genes.length)}` : ""),
    expression: Math.random() * 10,
    protein: `P${String(10000 + Math.floor(Math.random() * 90000)).padStart(5, "0")}`,
    abundance: Math.random() * 100,
    correlation: Math.random() * 2 - 1,
  }));
}

// Generate analysis results
function generateAnalysisResults(count: number): AnalysisResult[] {
  const genes = [
    "TP53", "MYC", "EGFR", "BRCA1", "KRAS", "PTEN", "RB1", "CDKN2A",
    "APC", "VHL", "BRAF", "PIK3CA", "NRAS", "HER2", "ALK", "MET",
  ];
  
  const mechanisms = [
    "Post-translational modification",
    "Protein degradation",
    "Translational regulation",
    "Alternative splicing",
    "Protein stability",
    "Ubiquitination",
    "Phosphorylation",
    "Methylation",
  ];
  
  return genes.slice(0, count).map((gene, i) => ({
    gene,
    protein: `P${String(10000 + Math.floor(Math.random() * 90000)).padStart(5, "0")}`,
    correlation: -(0.2 + Math.random() * 0.5),
    pValue: Math.random() * 0.05,
    mechanism: mechanisms[i % mechanisms.length],
    foldChange: (Math.random() * 6 - 3).toFixed(2),
  }));
}

export const useDataStore = create<DataStore>((set, get) => ({
  selectedDataset: null,
  datasets: defaultDatasets,
  isLoaded: false,
  isLoading: false,
  analysisResults: [],
  isAnalyzing: false,
  analysisProgress: 0,
  geneData: [],
  
  selectDataset: async (datasetId: string) => {
    const dataset = defaultDatasets.find(d => d.id === datasetId);
    if (!dataset) return;
    
    set({ isLoading: true });
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const geneData = generateGeneData(Math.min(dataset.genes, 100));
    
    set({
      selectedDataset: { ...dataset, loaded: true },
      geneData,
      isLoaded: true,
      isLoading: false,
      datasets: defaultDatasets.map(d => 
        d.id === datasetId ? { ...d, loaded: true } : d
      ),
    });
  },
  
  loadCustomData: async (proteomicsFile: File, transcriptomicsFile: File) => {
    set({ isLoading: true });
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const geneData = generateGeneData(100);
    
    set({
      selectedDataset: {
        id: "custom",
        name: "Custom Dataset",
        source: "User Upload",
        genes: 100,
        proteins: 100,
        samples: 1,
        description: "User-uploaded data",
        loaded: true,
      },
      geneData,
      isLoaded: true,
      isLoading: false,
    });
  },
  
  startAnalysis: async () => {
    const { geneData } = get();
    if (geneData.length === 0) return;
    
    set({ isAnalyzing: true, analysisProgress: 0 });
    
    // Simulate analysis
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      set({ analysisProgress: i });
    }
    
    const results = generateAnalysisResults(10);
    
    set({
      isAnalyzing: false,
      analysisProgress: 100,
      analysisResults: results,
    });
  },
  
  clearData: () => {
    set({
      selectedDataset: null,
      isLoaded: false,
      geneData: [],
      analysisResults: [],
      analysisProgress: 0,
      datasets: defaultDatasets,
    });
  },
}));
