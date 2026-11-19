import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

async function runClient() {
  // 1. Inicializar el cliente MCP con un nombre y versión
  const client = new Client({
    name: "mi-cliente-calculadora",
    version: "1.0.0",
  });

  // 2. Configurar el transporte stdio
  // Si ejecutas TypeScript directamente, puedes usar npx tsx y la ruta a tu archivo del server.
  // Si tu servidor ya está compilado, usa command: "node", args: ["build/index.js"]
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "C:/Users/el_se/Documents/Neoland/octubre2026/mcp/src/index.ts"], 
  });

  // 3. Conectar el cliente al servidor
  // ¡Importante! Esto automáticamente levanta el proceso del servidor. No lo ejecutes por separado.
  await client.connect(transport);
  console.log("¡Conexión establecida con el servidor MCP!");

  // 4. Listar las herramientas que expone el servidor
  const { tools } = await client.listTools();
  console.log("Herramientas descubiertas:");
  tools.forEach(tool => console.log(`- ${tool.name}: ${tool.description}`));

  // 5. Ejecutar la herramienta "suma" de tu servidor
  console.log("\nLlamando a la herramienta 'suma' con los números 5 y 7...");
  const result = await client.callTool({
    name: "suma",
    arguments: { 
      a: 5, 
      b: 7 
    },
  });

  // 6. Leer y mostrar el contenido de la respuesta
  result.content.forEach(block => {
    if (block.type === "text") {
      console.log(`El resultado devuelto es: ${block.text}`);
    }
  });

  // 7. Cerrar limpiamente la conexión, lo que también detendrá el proceso del servidor
  await client.close();
}

runClient().catch(console.error);