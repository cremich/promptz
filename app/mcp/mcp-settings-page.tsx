"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Copy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Amplify } from "aws-amplify";
import { toast } from "sonner";

export default function MCPSettingsPage() {
  const config = Amplify.getConfig();

  const apiUrl = config.API?.GraphQL?.endpoint || "";
  const apiKey = config.API?.GraphQL?.apiKey || "";

  const snippet = `"promptz.dev/mcp": {
  "command": "npx",
  "args": [
    "-y",
    "@promptz/mcp"
  ],
  "env": {
    "PROMPTZ_API_URL": "${apiUrl}",
    "PROMPTZ_API_KEY": "${apiKey}"
  },
  "disabled": false,
  "autoApprove": []
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard.");
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6 dark">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          MCP Server Configuration
        </h1>
        <p className="text-zinc-400 mt-2">
          View the MCP server connection details for PROMPTZ
        </p>
      </div>

      <Alert className="border-violet-800 bg-zinc-900">
        <AlertCircle className="h-4 w-4 text-violet-400" />
        <AlertTitle className="text-white">Important</AlertTitle>
        <AlertDescription className="text-zinc-300">
          Use these settings to configure your MCP server connection. Copy the
          API URL and API Key into your configuration file.
        </AlertDescription>
      </Alert>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Server Details</CardTitle>
          <CardDescription className="text-zinc-400">
            Default connection details for the PROMPTZ MCP server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-url" className="text-zinc-300">
              API URL
            </Label>
            <div className="flex items-center gap-2">
              <div className="bg-zinc-800 p-2 rounded-md font-mono text-sm flex-1 overflow-x-auto text-violet-300">
                {apiUrl}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(apiUrl)}
                title="Copy to clipboard"
                className="border-zinc-700 hover:bg-zinc-800 hover:text-violet-300"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-zinc-400">
              The base URL of the PROMPTZ MCP server API endpoint
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-zinc-300">
              API Key
            </Label>
            <div className="flex items-center gap-2">
              <div className="bg-zinc-800 p-2 rounded-md font-mono text-sm flex-1 overflow-x-auto text-violet-300">
                {apiKey}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(apiKey)}
                title="Copy to clipboard"
                className="border-zinc-700 hover:bg-zinc-800 hover:text-violet-300"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-zinc-400">
              The public API key for authentication with the PROMPTZ MCP server
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">MCP Settings Snippet</CardTitle>
          <CardDescription className="text-zinc-400">
            Snippet for configuring your MCP server settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-zinc-800 p-4 rounded-md font-mono text-sm overflow-x-auto text-zinc-300">
              {snippet}
            </pre>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 border-zinc-700 hover:bg-zinc-800 hover:text-violet-300"
              onClick={() => copyToClipboard(snippet)}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-zinc-400 mt-4">
            Copy this configuration snippet and paste it in your MCP server
            configuration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
