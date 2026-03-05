import { Server } from "socket.io";

const PORT = 3003;

const io = new Server(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

console.log(`Analysis Service running on port ${PORT}`);

// Analysis simulation data
const genes = [
  "TP53", "MYC", "EGFR", "BRCA1", "KRAS", "PTEN", "RB1", "CDKN2A", 
  "APC", "VHL", "BRAF", "PIK3CA", "NRAS", "HER2", "ALK", "MET"
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
  "Acetylation",
  "SUMOylation"
];

// Generate random analysis metrics
function generateMetrics(epoch: number, totalEpochs: number) {
  const progress = epoch / totalEpochs;
  return {
    epoch,
    totalEpochs,
    loss: 2.5 - progress * 2 + Math.random() * 0.1,
    klDivergence: 1.2 - progress * 0.8 + Math.random() * 0.05,
    correlation: 0.3 + progress * 0.6 + Math.random() * 0.05,
    reconstructionError: 0.5 - progress * 0.4 + Math.random() * 0.02,
  };
}

// Generate discordant pair
function generateDiscordantPair() {
  const gene = genes[Math.floor(Math.random() * genes.length)];
  return {
    gene,
    protein: `P${String(Math.floor(10000 + Math.random() * 90000)).padStart(5, "0")}`,
    correlation: -(0.2 + Math.random() * 0.5),
    pValue: Math.random() * 0.05,
    mechanism: mechanisms[Math.floor(Math.random() * mechanisms.length)],
    foldChange: (Math.random() * 6 - 3).toFixed(2),
  };
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("start-analysis", async (config) => {
    const epochs = config?.epochs || 100;
    const batchSize = config?.batchSize || 32;
    
    console.log(`Starting analysis with ${epochs} epochs, batch size ${batchSize}`);
    
    // Send initial status
    socket.emit("analysis-status", {
      status: "initializing",
      message: "Initializing model and loading data...",
    });

    await new Promise((r) => setTimeout(r, 1000));

    // Training loop simulation
    for (let epoch = 1; epoch <= epochs; epoch++) {
      const metrics = generateMetrics(epoch, epochs);
      
      socket.emit("analysis-progress", {
        epoch,
        progress: (epoch / epochs) * 100,
        metrics,
      });

      // Randomly emit discovered discordant pairs
      if (epoch % 10 === 0) {
        socket.emit("discordant-pair-found", generateDiscordantPair());
      }

      await new Promise((r) => setTimeout(r, 50));
    }

    // Final results
    socket.emit("analysis-complete", {
      success: true,
      timestamp: new Date().toISOString(),
      finalMetrics: generateMetrics(epochs, epochs),
      summary: {
        totalSamples: 1247,
        integratedFeatures: 15234,
        discordantPairs: Math.floor(200 + Math.random() * 200),
        canonicalCorrelation: 0.85 + Math.random() * 0.1,
      },
    });
  });

  socket.on("stop-analysis", () => {
    console.log("Analysis stopped by client");
    socket.emit("analysis-status", {
      status: "stopped",
      message: "Analysis stopped by user",
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Health check endpoint
console.log("Analysis WebSocket Service initialized");
