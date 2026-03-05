import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MultiOmics-Integrator | Deep Learning for Proteomics-Transcriptomics Data Fusion",
  description: "Advanced AI-powered platform for integrating proteomics and transcriptomics data using multi-modal variational autoencoders and cross-modal attention mechanisms.",
  keywords: "multi-omics, proteomics, transcriptomics, machine learning, VAE, neural networks, bioinformatics",
  authors: [{ name: "Ansh Sharma", url: "https://github.com/anshsharmacse" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
