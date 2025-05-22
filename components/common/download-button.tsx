"use client";

import { Schema } from "../../amplify/data/resource";
import { Button } from "@/components/ui/button";
import { generateClient } from "aws-amplify/api";
import { Download } from "lucide-react";
import { useState } from "react";

interface DownloadButtonProps {
  /**
   * The ID of the content to be downloaded
   */
  id: string;
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

const api = generateClient<Schema>();

/**
 * A button component that triggers a download of content as a file
 */
export function DownloadButton({
  id,
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
  async function handleDownload() {
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
      await api.mutations.downloadProjectRule({
        id,
      });
    }
  }

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
