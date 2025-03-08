import { generateTOC, generateTOCHtml } from "../utils/tocGenerator.js";

/**
 * Middleware to generate table of contents for pages
 */
export default function tocMiddleware(req, res, next) {
  // Store the original render method
  const originalRender = res.render;

  // Override the render method
  res.render = function (view, options, callback) {
    // Check if TOC is enabled for this view
    if (options && options.tocEnabled) {
      // First render the view to get its HTML content
      originalRender.call(this, view, options, (err, html) => {
        if (err) {
          return callback ? callback(err) : next(err);
        }

        try {
          // Generate TOC from the rendered HTML
          const tocItems = generateTOC(html);
          const tocHtml = generateTOCHtml(tocItems);

          // Add the TOC HTML to the options
          const newOptions = { ...options, tocHtml };

          // Now render the view again with the original render method
          originalRender.call(this, view, newOptions, callback);
        } catch (error) {
          console.error("Error generating TOC:", error);
          // If TOC generation fails, continue with the original render
          originalRender.call(this, view, options, callback);
        }
      });
    } else {
      // If TOC is not enabled, just use the original render method
      originalRender.call(this, view, options, callback);
    }
  };

  next();
}
