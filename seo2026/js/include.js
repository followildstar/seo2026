async function loadInclude(targetId, filePath) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load include: ${filePath}`);
    }

    const html = await response.text();
    target.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

async function initIncludes() {
  const pageType = document.body.dataset.page;

  if (pageType === "project") {
    await loadInclude("header-include", "./components/header-project.html");
  } else {
    await loadInclude("header-include", "./components/header-home.html");
    await loadInclude("footer-include", "./components/footer-home.html");
  }

  if (typeof updateProjectHeaderTitle === "function") {
    updateProjectHeaderTitle();
  }

  if (typeof initTopbarScroll === "function") {
    initTopbarScroll();
  }
}

document.addEventListener("DOMContentLoaded", initIncludes);