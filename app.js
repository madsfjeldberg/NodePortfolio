import express from "express";
import path from "path";
import proxy from "express-http-proxy";
import ejsHighlighterMiddleware from "./middleware/ejsCodeHighlighter.js";
import pagesRouter from "./routers/pagesRouter.js";
import expressEjsLayouts from "express-ejs-layouts";

const app = express();
const PORT = 8085;

// Set the view engine to ejs
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.resolve("views"));

// Set the layout file
app.set("layout", "layouts/main");

// Use the static files directory
app.use(express.static(path.resolve("public")));

// Use the proxy middleware
app.use("/betterproxy", proxy("https://www.google.com"));

// Use the ejs code highlighter middleware
app.use(ejsHighlighterMiddleware);

// Use the express-ejs-layouts middleware
app.use(expressEjsLayouts);

// Add current path to the locals object
// Used to highlight the current page in the navigation bar
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Use the pages router
app.use(pagesRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
