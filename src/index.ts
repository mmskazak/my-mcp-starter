import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export async function runMain() {
  // Создаем MCP сервер
  const server = new McpServer({
    name: "Test MCP Server",
    version: "1.0.0"
  });

  // Добавляем простой инструмент для сложения чисел
  server.tool(
    "add",
    {
      a: z.string(),
      b: z.string()
    },
    async ({ a, b }) => ({
      content: [{
        type: "text",
        text: `Результат сложения: ${Number(a) + Number(b)}`
      }]
    })
  );

  server.tool(
    "subtract",
    {
      a: z.string(),
      b: z.string()
    },
    async ({ a, b }) => ({
      content: [{
        type: "text",
        text: `Результат вычитания: ${Number(a) - Number(b)}`
      }]
    })
  );

  server.tool(
    "multiply",
    {
      a: z.string(),
      b: z.string()
    },
    async ({ a, b }) => ({
      content: [{
        type: "text",
        text: `Результат умножения: ${Number(a) * Number(b)}`
      }]
    })
  );

  // Добавляем ресурс для получения приветствия
  server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, params) => ({
      contents: [{
        uri: uri.href,
        text: `Привет, ${params.name}!`
      }]
    })
  );

  // Добавляем промпт для анализа текста
  server.prompt(
    "analyze-text",
    { text: z.string() },
    ({ text }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Пожалуйста, проанализируй следующий текст: ${text}`
        }
      }]
    })
  );

  // Запускаем сервер
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runMain().catch(error => {
  process.stderr.write(`Error starting server: ${error}\n`);
  process.exit(1);
});


