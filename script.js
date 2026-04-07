const ACCESS_PASSWORD = "welcome";
const ACCESS_DURATION = 24 * 60 * 60 * 1000; // 24시간

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("is-open");
}

function closeModal(el) {
  const modal = el.closest(".modal");
  if (modal) modal.classList.remove("is-open");
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("is-open");
  });
}

function grantAccess() {
  const expiresAt = Date.now() + ACCESS_DURATION;

  localStorage.setItem(
    "portfolio_access",
    JSON.stringify({
      granted: true,
      expiresAt,
    })
  );
}

function hasAccess() {
  const raw = localStorage.getItem("portfolio_access");
  if (!raw) return false;

  try {
    const data = JSON.parse(raw);

    if (!data.granted) return false;

    if (!data.expiresAt || Date.now() > data.expiresAt) {
      localStorage.removeItem("portfolio_access");
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem("portfolio_access");
    return false;
  }
}

function handlePasswordSubmit(event) {
  event.preventDefault();

  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");

  if (!input) return;

  if (input.value === ACCESS_PASSWORD) {
    grantAccess();
    if (error) error.textContent = "";
    input.value = "";
    closeAllModals();
  } else {
    if (error) error.textContent = "비밀번호가 올바르지 않습니다.";
    input.focus();
    input.select();
  }
}

function ensureIndexAccess() {
  const isHome = document.body.dataset.page === "home";
  if (!isHome) return;

  if (!hasAccess()) {
    openModal("accessModal");
  }
}

function ensureProtectedPage() {
  const isProtected = document.body.dataset.protected === "true";
  if (!isProtected) return;

  if (!hasAccess()) {
    window.location.href = "index.html";
  }
}

function logoutPortfolio() {
  localStorage.removeItem("portfolio_access");
  window.location.href = "index.html";
}

function bindGlobalEvents() {
  document.addEventListener("click", (e) => {
    const modalButton = e.target.closest("[data-modal-target]");
    if (modalButton) {
      const targetId = modalButton.getAttribute("data-modal-target");
      openModal(targetId);
      return;
    }

    if (e.target.classList.contains("modal")) {
      handleAccessCancel();
    }

    if (e.key === "Escape") {
      handleAccessCancel();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
}

function initTopbarScroll() {
  const topbar = document.getElementById("topbar");
  if (!topbar) return;

  const onScroll = () => {
    topbar.classList.toggle("is-compact", window.scrollY > 60);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  bindGlobalEvents();
  ensureProtectedPage();
  ensureIndexAccess();
});

function updateProjectHeaderTitle() {
  const headerTitle = document.getElementById("projectHeaderTitle");
  if (!headerTitle) return;

  const title = document.body.dataset.projectTitle || "PROJECT";
  headerTitle.textContent = title;
}
