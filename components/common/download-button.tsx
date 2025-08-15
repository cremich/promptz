"use client";

import { ModelType } from "@/lib/forms/schema-definitions";
import { Schema } from "../../amplify/data/resource";
import { Button } from "@/components/ui/button";
import { generateClient } from "aws-amplify/api";
import { Download } from "lucide-react";
import { useState } from "react";
import { Agent } from "@/lib/models/agent-model";

interface DownloadButtonProps {
  /**
   * The ID of the content to be downloaded
   */
  id: string;

  /**
   * The content to be downloaded
   */
  content: string | Agent;

  /**
   * The filename for the downloaded file
   */
  filename: string;

  /**
   * Optional label for the button
   */
  label?: string;

  /**
   * Is it a prompt, a project rule or an agent?
   */
  modelType: ModelType;
}

const api = generateClient<Schema>();

/**
 * A button component that triggers a download of content as a file
 */
export function DownloadButton({
  id,
  content,
  filename,
  label = "Download",
  modelType,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  function downloadFile() {
    const blob = createBlob();

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download =
      modelType === ModelType.AGENT ? `${filename}.json` : `${filename}.md`;

    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the object URL
    URL.revokeObjectURL(url);
  }

  function createBlob(): Blob {
    let blobContent = "";

    if (modelType === ModelType.AGENT) {
      const filteredAgent = {
        name: (content as Agent).name,
        description: (content as Agent).description,
        prompt: (content as Agent).prompt,
        tools: (content as Agent).tools,
        mcpServers: (content as Agent).mcpServers,
        resources: (content as Agent).resources,
        hooks: (content as Agent).hooks,
        toolsSettings: (content as Agent).toolsSettings,
        toolAliases: (content as Agent).toolAliases,
        allowedTools: (content as Agent).allowedTools,
        useLegacyMcpJson: (content as Agent).useLegacyMcpJson,
      };

      blobContent = JSON.stringify(filteredAgent, null, 2);
    } else {
      blobContent = content as string;
    }

    return new Blob([blobContent], {
      type:
        modelType === ModelType.AGENT ? "application/json" : "text/markdown",
    });
  }

  /**
   * Handles the click event to download the content
   */
  async function handleDownload() {
    setIsDownloading(true);
    downloadFile();
    try {
      // Create a blob with the content
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      if (modelType === ModelType.RULE) {
        await api.mutations.downloadProjectRule({
          id,
        });
      } else if (modelType === ModelType.PROMPT) {
        await api.mutations.downloadPrompt({
          id,
        });
      } else if (modelType === ModelType.AGENT) {
        await api.mutations.downloadAgent({
          id,
        });
      }
      setIsDownloading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isDownloading}
      aria-label={`Download ${filename}`}
    >
      <Download className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
