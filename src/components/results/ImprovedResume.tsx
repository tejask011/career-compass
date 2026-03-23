import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  text: string;
}

export default function ImprovedResume({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-display">Your Improved Resume</CardTitle>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-foreground/90 bg-muted rounded-lg p-6 
          prose-headings:font-display prose-headings:text-foreground prose-headings:font-semibold
          prose-h2:text-lg prose-h2:mt-5 prose-h2:mb-2 prose-h2:border-b prose-h2:border-border prose-h2:pb-1
          prose-h3:text-base prose-h3:mt-3 prose-h3:mb-1
          prose-ul:my-1 prose-li:my-0.5 prose-p:my-1
          prose-strong:text-foreground">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
