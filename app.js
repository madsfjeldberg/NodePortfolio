import express from "express";
import path from "path";
import { processHtmlWithCodeHighlighting } from "./middleware/codeHighlighter.js";
import proxy from "express-http-proxy";

const app = express();
const PORT = 8081;

app.use(express.static(path.resolve("public")));
app.use('/betterproxy', proxy('https://www.google.com'));

// Custom middleware to handle HTML responses with code highlighting
app.use(async (req, res, next) => {
  // Store the original sendFile method
  const originalSendFile = res.sendFile;

  // Override the sendFile method
  res.sendFile = async function (filePath, options, callback) {
    // Check if it's an HTML file
    if (filePath.endsWith(".html")) {
      try {
        // Process the HTML file with code highlighting
        const processedContent = await processHtmlWithCodeHighlighting(
          filePath
        );

        if (processedContent) {
          // Send the processed content
          res.setHeader("Content-Type", "text/html");
          return res.send(processedContent);
        }
      } catch (error) {
        console.error("Error processing HTML file:", error);
        // Fall back to the original sendFile method if there's an error
      }
    }

    // Call the original sendFile method if not an HTML file or if processing failed
    return originalSendFile.call(this, filePath, options, callback);
  };

  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "frontpage", "frontpage.html"));
});

app.get("/restapi", (req, res) => {
  res.sendFile(path.resolve("public", "restapi.html"));
});

app.get("/javascript", (req, res) => {
  res.sendFile(path.resolve("public", "javascript.html"));
});

app.get("/nodejs", (req, res) => {
  res.sendFile(path.resolve("public", "nodejs.html"));
});

app.get("/express", (req, res) => {
  res.sendFile(path.resolve("public", "express.html"));
});

app.get("/proxy", (req, res) => {
  let url = "https://www.google.com";
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      res.send(data);
    }); 
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
