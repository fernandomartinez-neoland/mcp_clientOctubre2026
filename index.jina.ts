import { Client } from "@modelcontextprotocol/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import "dotenv/config";

async function runJinaClient() {
  const client = new Client({
    name: "mi-cliente-jina",
    version: "1.0.0",
  });

  // URL proporcionada por Jina AI para su servidor remoto
  const jinaEndpoint = "https://mcp.jina.ai/v1";

  // Pasamos el API Key de Jina AI directamente en los headers
  const transport = new StreamableHTTPClientTransport(new URL(jinaEndpoint), {
    // Inyectamos nuestro propio fetch para agregar los headers en cada petición
    fetch: (input, init) => {
      // Usamos la clase Headers nativa para evitar problemas si 'init.headers' ya existe
      const customHeaders = new Headers(init?.headers);
      customHeaders.set("Authorization", `Bearer ${process.env.jinaApiKey}`);

      // Ejecutamos la petición original pero con nuestros headers modificados
      return fetch(input, {
        ...init,
        headers: customHeaders,
      });
    },
  });

  try {
    await client.connect(transport);
    console.log("¡Conectado al Remote MCP Server de Jina AI!");

    // Listar y usar las herramientas que ofrece Jina (como búsqueda web, reader, etc.)
    const { tools } = await client.listTools();
    console.log(
      "Herramientas de Jina disponibles:",
      tools.map((t) => t.name),
    );

    const result = await client.callTool({
      name: "read_url", // Cambia esto por el nombre exacto si Jina lo llama diferente
      arguments: {
        url: "https://creanovatech.com/",
      },
    });

    result.content.forEach((block) => {
      if (block.type === "text") {
        console.log(`El resultado devuelto es: ${block.text}`);
      }
    });
  } catch (error) {
    console.error("Error conectando a Jina:", error);
  } finally {
    console.log("fila");
    await transport.terminateSession();
    await client.close();
  }
}

runJinaClient();
