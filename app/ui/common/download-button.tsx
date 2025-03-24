"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

interface DownloadButtonProps {
  /**
   * The content to be downloaded
   */
  content: string;

  /**
   * The filename for the downloaded file
   */
  filename: string;

  /**
   * Optional variant for the button styling
   */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

  /**
   * Optional size for the button
   */
  size?: "default" | "sm" | "lg" | "icon";

  /**
   * Optional label for the button
   */
  label?: string;
}

/**
 * A button component that triggers a download of content as a file
 */
export function DownloadButton({
  content,
  filename,
  variant = "outline",
  size = "sm",
  label = "Download",
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Handles the click event to download the content
   */
  const handleDownload = () => {
    setIsDownloading(true);

    try {
      // Create a blob with the content
      const blob = new Blob([content], { type: "text/markdown" });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.download = filename.endsWith(".md") ? filename : `${filename}.md`;

      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the object URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
      aria-label={`Download ${filename}`}
    >
      <Download className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
