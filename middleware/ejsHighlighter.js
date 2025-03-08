import { highlight } from "../utils/shiki.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Process EJS content and highlight code blocks
 * @param {string} content - The EJS content to process
 * @returns {Promise<string>} - The processed content with highlighted code blocks
 */
export async function processEjsContent(content) {
  try {
    // Find all code blocks in pre tags
    let processedContent = await replaceCodeBlocks(content);
    return processedContent;
  } catch (error) {
    console.error("Error processing EJS content:", error);
    return content; // Return original content if processing fails
  }
}

/**
 * Replace code blocks in HTML with highlighted versions
 * @param {string} html - The HTML content
 * @returns {Promise<string>} - The HTML with highlighted code blocks
 */
async function replaceCodeBlocks(html) {
  try {
    // Regular expression to match pre tags with language class
    const codeBlockRegex = /<pre class="language-([a-z]+)">([\s\S]*?)<\/pre>/g;

    // Find all matches
    const matches = [...html.matchAll(codeBlockRegex)];

    // If no matches, return the original HTML
    if (matches.length === 0) {
      return html;
    }

    // Process each match
    let lastIndex = 0;
    let result = "";

    for (const match of matches) {
      const [fullMatch, language, code] = match;
      const matchIndex = match.index;

      // Add the text before this match
      result += html.substring(lastIndex, matchIndex);

      // Decode HTML entities in the code
      const decodedCode = decodeHtmlEntities(code.trim());

      try {
        // Highlight the code
        const highlightedCode = await highlight(decodedCode, language);
        result += highlightedCode;
      } catch (error) {
        console.error(`Error highlighting ${language} code:`, error);
        result += fullMatch; // Use original if highlighting fails
      }

      lastIndex = matchIndex + fullMatch.length;
    }

    // Add the remaining text
    result += html.substring(lastIndex);

    return result;
  } catch (error) {
    console.error("Error replacing code blocks:", error);
    return html; // Return original HTML if replacement fails
  }
}

/**
 * Decode HTML entities in a string
 * @param {string} html - The HTML string to decode
 * @returns {string} - The decoded string
 */
function decodeHtmlEntities(html) {
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Middleware to process EJS templates with code highlighting
 */
export default function ejsCodeHighlighterMiddleware(req, res, next) {
  // Store the original render method
  const originalRender = res.render;

  // Override the render method
  res.render = async function (view, options, callback) {
    // Call the original render method
    originalRender.call(this, view, options, async (err, html) => {
      if (err) {
        // If there's an error, pass it to the callback or next middleware
        return callback ? callback(err) : next(err);
      }

      try {
        // Process the rendered HTML to highlight code blocks
        const processedHtml = await processEjsContent(html);

        // Send the processed HTML
        if (callback) {
          callback(null, processedHtml);
        } else {
          res.send(processedHtml);
        }
      } catch (error) {
        console.error("Error in EJS code highlighter:", error);
        // If processing fails, use the original HTML
        if (callback) {
          callback(null, html);
        } else {
          res.send(html);
        }
      }
    });
  };

  next();
}
