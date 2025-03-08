// import fs from "fs/promises";
// import path from "path";

// /**
//  * Cache for template parts
//  */
// const templateCache = {
//   header: null,
//   footer: null,
// };

// /**
//  * Get the header HTML content
//  * @returns {Promise<string>} The header HTML content
//  */
// export async function getHeader() {
//   if (templateCache.header) {
//     return templateCache.header;
//   }

//   try {
//     const headerPath = path.resolve("public", "parts", "header.html");
//     templateCache.header = await fs.readFile(headerPath, "utf-8");
//     return templateCache.header;
//   } catch (error) {
//     console.error("Error reading header template:", error);
//     return ""; // Return empty string if header can't be loaded
//   }
// }

// /**
//  * Get the footer HTML content
//  * @returns {Promise<string>} The footer HTML content
//  */
// export async function getFooter() {
//   if (templateCache.footer) {
//     return templateCache.footer;
//   }

//   try {
//     const footerPath = path.resolve("public", "parts", "footer.html");
//     templateCache.footer = await fs.readFile(footerPath, "utf-8");
//     return templateCache.footer;
//   } catch (error) {
//     console.error("Error reading footer template:", error);
//     return ""; // Return empty string if footer can't be loaded
//   }
// }

// /**
//  * Inject the header into an HTML page
//  * @param {string} html The HTML content
//  * @returns {Promise<string>} The HTML content with header injected
//  */
// export async function injectHeader(html) {
//   const header = await getHeader();

//   // If no header or HTML is empty, return the original HTML
//   if (!header || !html) {
//     return html;
//   }

//   // Check if the HTML has a body tag
//   if (html.includes("<body")) {
//     // Insert the header after the opening body tag and any class attributes
//     const bodyRegex = /<body[^>]*>/;
//     const match = html.match(bodyRegex);

//     if (match && match[0]) {
//       return html.replace(match[0], `${match[0]}${header}`);
//     }
//   }

//   // If no body tag found, return the original HTML
//   return html;
// }

// /**
//  * Inject the footer into an HTML page
//  * @param {string} html The HTML content
//  * @returns {Promise<string>} The HTML content with footer injected
//  */
// export async function injectFooter(html) {
//   const footer = await getFooter();

//   // If no footer or HTML is empty, return the original HTML
//   if (!footer || !html) {
//     return html;
//   }

//   // Check if the HTML has a closing body tag
//   if (html.includes("</body>")) {
//     // Insert the footer before the closing body tag
//     return html.replace("</body>", `${footer}</body>`);
//   }

//   // If no closing body tag, append the footer to the end
//   return html + footer;
// }

// /**
//  * Inject both header and footer into an HTML page
//  * @param {string} html The HTML content
//  * @returns {Promise<string>} The HTML content with header and footer injected
//  */
// export async function injectTemplates(html) {
//   let processedHtml = html;

//   // First inject the header
//   processedHtml = await injectHeader(processedHtml);

//   // Then inject the footer
//   processedHtml = await injectFooter(processedHtml);

//   return processedHtml;
// }

// export default {
//   getHeader,
//   getFooter,
//   injectHeader,
//   injectFooter,
//   injectTemplates,
// };
