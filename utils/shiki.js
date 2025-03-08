import { createHighlighter } from "shiki";

// Initialize the highlighter
let highlighter;

async function initHighlighter() {
  try {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: ["javascript", "html", "css", "typescript", "json", "bash"],
    });
  } catch (error) {
    console.error("Error initializing Shiki highlighter:", error);
  }
}

// Initialize the highlighter when this module is imported
initHighlighter();

/**
 * Highlight code using Shiki
 * @param {string} code - The code to highlight
 * @param {string} lang - The language of the code
 * @returns {Promise<string>} - The highlighted HTML
 */
export async function highlight(code, lang = "javascript") {
  // Wait for highlighter to be initialized if it's not ready yet
  if (!highlighter) {
    await initHighlighter();
  }

  try {
    return highlighter.codeToHtml(code, {
      lang,
      theme: "github-dark",
    });
  } catch (error) {
    console.error("Error highlighting code:", error);
    // Fallback to plain code with basic styling if highlighting fails
    return `<pre class="shiki-fallback bg-dark-bg p-4 rounded-md text-dark-text"><code>${escapeHtml(
      code
    )}</code></pre>`;
  }
}

/**
 * Escape HTML special characters
 * @param {string} html - The HTML to escape
 * @returns {string} - The escaped HTML
 */
function escapeHtml(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default { highlight };
