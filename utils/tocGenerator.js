import * as cheerio from "cheerio";

/**
 * Generate a table of contents from HTML content
 * @param {string} html - The HTML content to generate TOC from
 * @returns {Array} - Array of TOC items with id and title
 */
export function generateTOC(html) {
  try {
    const $ = cheerio.load(html);
    const tocItems = [];

    // Find all sections with IDs
    $("section[id]").each((i, section) => {
      const id = $(section).attr("id");
      // Find the first heading in the section
      const heading = $(section).find("h2, h3, h4").first();

      if (heading.length) {
        tocItems.push({
          id: id,
          title: heading.text().trim(),
        });
      }
    });

    return tocItems;
  } catch (error) {
    console.error("Error generating TOC:", error);
    return [];
  }
}

/**
 * Generate HTML for the table of contents
 * @param {Array} tocItems - Array of TOC items with id and title
 * @returns {string} - HTML for the table of contents
 */
export function generateTOCHtml(tocItems) {
  if (!tocItems || tocItems.length === 0) {
    return '<div class="toc-container"><p>No table of contents available</p></div>';
  }

  let html = '<div class="toc-container">';
  html += '<h4 class="toc-title">On This Page</h4>';
  html += '<ul class="toc-list">';

  tocItems.forEach((item) => {
    html += `<li class="toc-item" data-section="${item.id}">`;
    html += `<a href="#${item.id}" class="toc-link">${item.title}</a>`;
    html += "</li>";
  });

  html += "</ul></div>";
  return html;
}
