/**
 * Scrollspy functionality for table of contents
 * Automatically generates TOC from headings and highlights the current section in the table of contents based on scroll position
 */
document.addEventListener("DOMContentLoaded", function () {
  // Get TOC container
  const tocContainer = document.querySelector(
    ".hidden.lg\\:block .toc-container"
  );

  if (!tocContainer) {
    // No TOC container found, exit early
    return;
  }

  // Find all headings in the main content area (h2, h3, h4)
  const mainContent =
    document.querySelector(".lg\\:col-span-3") ||
    document.querySelector("main");
  if (!mainContent) return;

  // Get all sections with IDs
  const sections = mainContent.querySelectorAll("section[id]");
  if (sections.length === 0) {
    // If no sections with IDs are found, try to find headings directly
    generateTocFromHeadings(mainContent, tocContainer);
  } else {
    // If sections with IDs are found, use them for the TOC
    generateTocFromSections(sections, tocContainer);
  }

  // Get all TOC items after generation
  const tocItems = document.querySelectorAll(".toc-item");
  if (tocItems.length === 0) return;

  // Function to determine which section is currently in view
  function highlightTocItem() {
    // Get current scroll position
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // First, remove active class from all items
    tocItems.forEach((item) => {
      item.classList.remove("active");
    });

    // If we're at the bottom of the page, highlight the last item
    if (scrollY + windowHeight >= documentHeight - 50) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionId = lastSection.id;
        const activeItems = document.querySelectorAll(
          `.toc-item[data-section="${sectionId}"]`
        );
        activeItems.forEach((item) => {
          item.classList.add("active");
        });
      }
      return;
    }

    // Find the section that is currently in view
    let currentSection = null;

    // If we're at the top of the page or before the second section, highlight the first item
    if (sections.length > 1) {
      const secondSectionTop = sections[1].offsetTop - 100;
      if (scrollY < secondSectionTop) {
        currentSection = sections[0].id;
      } else {
        // Loop through sections to find the one in view
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const sectionTop = section.offsetTop - 100; // Offset for better UX

          // For the last section, check if we're below its top
          if (i === sections.length - 1) {
            if (scrollY >= sectionTop) {
              currentSection = section.id;
              break;
            }
          }
          // For other sections, check if we're between this section's top and the next section's top
          else {
            const nextSection = sections[i + 1];
            const nextSectionTop = nextSection.offsetTop - 100;

            if (scrollY >= sectionTop && scrollY < nextSectionTop) {
              currentSection = section.id;
              break;
            }
          }
        }
      }
    } else if (sections.length === 1) {
      // If there's only one section, always highlight it
      currentSection = sections[0].id;
    }

    // If we found a current section, highlight it
    if (currentSection) {
      const activeItems = document.querySelectorAll(
        `.toc-item[data-section="${currentSection}"]`
      );
      activeItems.forEach((item) => {
        item.classList.add("active");

        // Ensure the active item is visible in the TOC container
        const tocContainer = item.closest(".toc-container");
        if (tocContainer) {
          const itemTop = item.offsetTop;
          const containerScrollTop = tocContainer.scrollTop;
          const containerHeight = tocContainer.offsetHeight;

          // If item is above or below visible area, scroll to it
          if (
            itemTop < containerScrollTop ||
            itemTop > containerScrollTop + containerHeight
          ) {
            tocContainer.scrollTop = itemTop - containerHeight / 2;
          }
        }
      });
    }
  }

  // Add click event listeners to TOC links for smooth scrolling
  tocItems.forEach((item) => {
    const link = item.querySelector(".toc-link");
    if (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 50,
            behavior: "smooth",
          });

          // Update URL hash without jumping
          history.pushState(null, null, targetId);

          // Remove active class from all items
          tocItems.forEach((item) => {
            item.classList.remove("active");
          });

          // Add active class to clicked item
          item.classList.add("active");
        }
      });
    }
  });

  // Check if there's a hash in the URL and scroll to that section
  if (window.location.hash) {
    const targetSection = document.querySelector(window.location.hash);
    if (targetSection) {
      // Delay to ensure page is fully loaded
      setTimeout(() => {
        window.scrollTo({
          top: targetSection.offsetTop - 50,
          behavior: "smooth",
        });

        // Highlight the corresponding TOC item
        const sectionId = window.location.hash.substring(1);
        const activeItems = document.querySelectorAll(
          `.toc-item[data-section="${sectionId}"]`
        );

        // Remove active class from all items
        tocItems.forEach((item) => {
          item.classList.remove("active");
        });

        // Add active class to the items corresponding to the hash
        activeItems.forEach((item) => {
          item.classList.add("active");
        });
      }, 100);
    }
  }

  // Call the highlight function on load and scroll
  highlightTocItem();
  window.addEventListener("scroll", highlightTocItem);
});

/**
 * Generate TOC from sections with IDs
 * @param {NodeList} sections - The sections with IDs
 * @param {HTMLElement} tocContainer - The TOC container
 */
function generateTocFromSections(sections, tocContainer) {
  // Create TOC list
  const tocList = createTocList(sections);

  // Add title to TOC container
  if (tocContainer) {
    tocContainer.innerHTML = '<h4 class="toc-title">On This Page</h4>';
    tocContainer.appendChild(tocList);
  }
}

/**
 * Generate TOC from headings
 * @param {HTMLElement} mainContent - The main content element
 * @param {HTMLElement} tocContainer - The TOC container
 */
function generateTocFromHeadings(mainContent, tocContainer) {
  // Find all headings (h2, h3, h4)
  const headings = mainContent.querySelectorAll("h2, h3, h4");
  if (headings.length === 0) return;

  // Create sections for headings that don't have a section parent
  headings.forEach((heading, index) => {
    // Check if heading is already in a section
    const parentSection = heading.closest("section");
    if (!parentSection) {
      // Create a section for this heading
      const section = document.createElement("section");
      const id = heading.id || `section-${index}`;
      section.id = id;
      heading.id = id;

      // Wrap the heading in the section
      heading.parentNode.insertBefore(section, heading);
      section.appendChild(heading);

      // Move all siblings until the next heading into this section
      let nextSibling = section.nextSibling;
      while (
        nextSibling &&
        !["H2", "H3", "H4"].includes(nextSibling.nodeName)
      ) {
        const current = nextSibling;
        nextSibling = nextSibling.nextSibling;
        section.appendChild(current);
      }
    } else if (!heading.id) {
      // If heading is in a section but doesn't have an ID, use the section's ID
      heading.id = parentSection.id;
    }
  });

  // Get all sections with IDs after creating them
  const sections = mainContent.querySelectorAll("section[id]");
  generateTocFromSections(sections, tocContainer);
}

/**
 * Create a TOC list from sections
 * @param {NodeList} sections - The sections with IDs
 * @returns {HTMLElement} - The TOC list
 */
function createTocList(sections) {
  const tocList = document.createElement("ul");
  tocList.className = "toc-list";

  sections.forEach((section) => {
    const sectionId = section.id;

    // Find the heading in this section
    const heading =
      section.querySelector("h2, h3, h4") || section.firstElementChild;
    if (!heading) return;

    // Create TOC item
    const tocItem = document.createElement("li");
    tocItem.className = "toc-item";
    tocItem.setAttribute("data-section", sectionId);

    // Create TOC link
    const tocLink = document.createElement("a");
    tocLink.className = "toc-link";
    tocLink.href = `#${sectionId}`;
    tocLink.textContent = heading.textContent;

    tocItem.appendChild(tocLink);
    tocList.appendChild(tocItem);
  });

  return tocList;
}
