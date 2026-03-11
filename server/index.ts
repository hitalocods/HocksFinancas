import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url );
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Determine the static path based on environment
  let staticPath: string;
  
  if (process.env.NODE_ENV === "production") {
    // In production, Vite builds to dist/public
    staticPath = path.resolve(__dirname, "..", "dist", "public");
  } else {
    // In development, use dist/public
    staticPath = path.resolve(__dirname, "..", "dist", "public");
  }

  // Serve static files
  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        // If index.html doesn't exist, send a helpful error
        console.error("Error serving index.html:", err);
        res.status(500).send("Application failed to load. Please ensure the build was successful.");
      }
    });
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/` );
  });
}

startServer().catch(console.error);
