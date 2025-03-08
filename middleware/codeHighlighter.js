import { highlight } from "../utils/shiki.js";
import { injectTemplates } from "../utils/templateUtils.js";
import fs from "fs/promises";
import path from "path";

/**
 * Middleware to process HTML files and highlight code blocks
 * @param {string} filePath - Path to the HTML file
 * @returns {Promise<string>} - The processed HTML content
 */
export async function processHtmlWithCodeHighlighting(filePath) {
  try {
    // Read the HTML file
    const content = await fs.readFile(filePath, "utf-8");

    // Find all code blocks in pre tags
    let processedContent = await replaceCodeBlocks(content);

    // Inject the header and footer
    processedContent = await injectTemplates(processedContent);

    return processedContent;
  } catch (error) {
    console.error("Error processing HTML file:", error);
    return null;
  }
}

/**
 * Replace code blocks in HTML with highlighted code
 * @param {string} html - The HTML content
 * @returns {Promise<string>} - The HTML with highlighted code blocks
 */
async function replaceCodeBlocks(html) {
  // Regular expression to match code blocks in pre tags
  const codeBlockRegex =
    /<pre class=".*?"><code class=".*?">([\s\S]*?)<\/code><\/pre>|<pre class=".*?">([\s\S]*?)<\/pre>/g;

  // Find language from class if available (e.g., class="language-javascript")
  const languageRegex = /language-(\w+)/;

  let result = html;
  let match;
  const replacements = [];

  // Find all code blocks
  while ((match = codeBlockRegex.exec(html)) !== null) {
    const fullMatch = match[0];
    const codeContent = match[1] || match[2];

    if (codeContent) {
      // Try to determine the language from the class
      const langMatch = fullMatch.match(languageRegex);
      const language = langMatch ? langMatch[1] : "javascript"; // Default to JavaScript

      // Decode HTML entities in the code content
      const decodedCode = decodeHtmlEntities(codeContent);

      // Highlight the code
      const highlightedCode = await highlight(decodedCode, language);

      // Store the replacement
      replacements.push({
        original: fullMatch,
        highlighted: highlightedCode,
      });
    }
  }

  // Apply all replacements
  for (const replacement of replacements) {
    result = result.replace(replacement.original, replacement.highlighted);
  }

  return result;
}

/**
 * Decode HTML entities in a string
 * @param {string} html - The HTML string with entities
 * @returns {string} - The decoded string
 */
function decodeHtmlEntities(html) {
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export default { processHtmlWithCodeHighlighting };
