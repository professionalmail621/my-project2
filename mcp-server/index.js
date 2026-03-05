// mcp-server/index.js
// A minimal custom MCP server that provides a "project_stats" tool

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new Server(
  { name: "project-stats", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_project_stats",
      description: "Get statistics about the project: file count, line count, etc.",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_project_stats") {
    const srcDir = path.join(__dirname, "..", "src");
    let fileCount = 0, lineCount = 0;

    function countFiles(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) countFiles(path.join(dir, entry.name));
        else {
          fileCount++;
          lineCount += fs.readFileSync(path.join(dir, entry.name), "utf-8").split("\n").length;
        }
      }
    }
    countFiles(srcDir);

    return {
      content: [{ type: "text", text: `Project has ${fileCount} source files with ${lineCount} total lines.` }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main();
