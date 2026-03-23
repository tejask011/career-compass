import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Sparkles, Loader2, File } from "lucide-react";
import { motion } from "framer-motion";
import { extractTextFromPdf } from "@/utils/pdfTextExtractor";
import { extractTextFromImage } from "@/utils/imageTextExtractor";
import { useToast } from "@/hooks/use-toast";

interface ResumeInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export default function ResumeInput({ onAnalyze, isLoading }: ResumeInputProps) {
  const [text, setText] = useState("");
  const [pdfFile, setPdfFile] = useState<{ name: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setIsExtracting(true);
      try {
        const extractedText = await extractTextFromPdf(file);
        toast({
          title: "PDF Processed",
          description: "Text extracted successfully. Starting analysis...",
        });
        onAnalyze(extractedText);
      } catch (error: any) {
        toast({
          title: "PDF parsing failed",
          description: error.message || "Could not read the PDF.",
          variant: "destructive",
        });
      } finally {
        setIsExtracting(false);
      }
    } else if (file.type.startsWith("image/")) {
      setIsExtracting(true);
      try {
        toast({
          title: "Processing Image",
          description: "Extracting text using OCR. This might take a few seconds...",
        });
        const extractedText = await extractTextFromImage(file);
        setText(extractedText);
        setPdfFile(null);
        toast({
          title: "Image Processed",
          description: `Extracted ${extractedText.length} characters. Review and click Analyze.`,
        });
      } catch (error: any) {
        toast({
          title: "Image parsing failed",
          description: error.message || "Could not read text from the image.",
          variant: "destructive",
        });
      } finally {
        setIsExtracting(false);
      }
    } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const content = await file.text();
      setText(content);
      setPdfFile(null);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF, Image, or TXT file.",
        variant: "destructive",
      });
    }
  }, [toast, onAnalyze]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const hasInput = pdfFile !== null || text.trim().length >= 20;

  const handleAnalyze = () => {
    onAnalyze(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-colors duration-200 p-1 ${
          dragOver ? "border-accent bg-emerald-light" : "border-border bg-card"
        }`}
      >
        {pdfFile ? (
          <div className="flex flex-col items-center justify-center min-h-[220px] gap-3">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
              <File className="w-7 h-7 text-accent" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">{pdfFile.name}</p>
              <p className="text-sm text-muted-foreground mt-2">Text extracted and ready to analyze. You can edit the text below.</p>
            </div>
            <div className="w-full">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] mt-4 border bg-muted/50 text-base focus-visible:ring-1 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPdfFile(null);
                setText("");
              }}
              className="text-muted-foreground mt-2"
            >
              Clear
            </Button>
          </div>
        ) : (
          <>
            <Textarea
              placeholder="Paste your resume here, or upload a PDF..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[220px] resize-none border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isExtracting}
            />
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload PDF, Image, or TXT</span>
                <input
                  type="file"
                  accept=".pdf,.txt,image/*"
                  className="hidden"
                  disabled={isExtracting}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFile(file);
                      e.target.value = ''; // reset file input
                    }
                  }}
                />
              </label>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="w-3 h-3" />
                {text.length} characters
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Button
          variant="hero"
          size="lg"
          onClick={handleAnalyze}
          disabled={isLoading || isExtracting || !hasInput}
          className="text-base px-10 py-6 rounded-xl"
        >
          {isLoading || isExtracting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isExtracting ? 'Extracting text...' : 'Analyzing...'}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze My Resume
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
