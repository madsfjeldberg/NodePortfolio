import express from "express";
import path from "path";
// import { processHtmlWithCodeHighlighting } from "./middleware/codeHighlighter.js";
import proxy from "express-http-proxy";
import ejsHighlighterMiddleware from "./middleware/ejsCodeHighlighter.js";
import tocMiddleware from "./middleware/tocMiddleware.js";
const app = express();
const PORT = 8085;

app.use(express.static(path.resolve("public")));
app.use("/betterproxy", proxy("https://www.google.com"));

app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

app.use(ejsHighlighterMiddleware);
app.use(tocMiddleware);

// // Custom middleware to handle HTML responses with code highlighting
// app.use(async (req, res, next) => {
//   // Store the original sendFile method
//   const originalSendFile = res.sendFile;

//   // Override the sendFile method
//   res.sendFile = async function (filePath, options, callback) {
//     // Check if it's an HTML file
//     if (filePath.endsWith(".html")) {
//       try {
//         // Process the HTML file with code highlighting
//         const processedContent = await processHtmlWithCodeHighlighting(
//           filePath
//         );

//         if (processedContent) {
//           // Send the processed content
//           res.setHeader("Content-Type", "text/html");
//           return res.send(processedContent);
//         }
//       } catch (error) {
//         console.error("Error processing HTML file:", error);
//         // Fall back to the original sendFile method if there's an error
//       }
//     }

//     // Call the original sendFile method if not an HTML file or if processing failed
//     return originalSendFile.call(this, filePath, options, callback);
//   };

//   next();
// });

// Helper function to render content within the layout
app.use((req, res, next) => {
  res.locals.currentPath = req.path;

  const originalRender = res.render;
  res.render = function (view, options, callback) {
    const opts = options || {};

    // Render the view first
    originalRender.call(this, view, opts, (err, content) => {
      if (err) return callback ? callback(err) : next(err);

      // Then render the layout with the view content
      originalRender.call(
        this,
        "layouts/main",
        {
          ...opts,
          content: content,
        },
        callback
      );
    });
  };
  next();
});

app.get("/", (req, res) => {
  res.render("pages/frontpage", {
    title: "Frontpage | NodePortfolio",
    tocEnabled: false,
  });
});

app.get("/restapi", (req, res) => {
  res.render("pages/restapi", {
    title: "REST API | NodePortfolio",
    tocEnabled: true,
  });
});

app.get("/javascript", (req, res) => {
  res.render("pages/javascript", {
    title: "JavaScript | NodePortfolio",
    tocEnabled: true,
  });
});

app.get("/nodejs", (req, res) => {
  res.render("pages/nodejs", {
    title: "Node.js | NodePortfolio",
    tocEnabled: true,
  });
});

app.get("/express", (req, res) => {
  res.render("pages/express", {
    title: "Express | NodePortfolio",
    tocEnabled: true,
  });
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
