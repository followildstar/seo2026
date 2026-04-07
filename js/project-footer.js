function buildProjectFooter() {
  const mount = document.getElementById("project-footer-include");
  if (!mount) return;

  const prev = document.body.dataset.prev || "index.html";
  const next = document.body.dataset.next || "";
  const pageNumber = document.body.dataset.pageNumber || "";
  const totalPages = document.body.dataset.totalPages || "20";

  const nextButton = next
    ? `<a class="btn btn-primary" href="${next}">Next →</a>`
    : "";

  mount.innerHTML = `
    <div class="project-footer-block">
      <div class="page-nav" style="margin-top:2.4rem;">
        <a class="btn" href="${prev}">← Prev</a>
        ${nextButton}
      </div>
    </div>

    <div class="modal" id="contactModal">
      <div class="modal-card">
        <h2 class="modal-title">Contact</h2>
        <p class="modal-copy">
          Email: yourname@email.com<br />
          Phone: 010-0000-0000<br />
          Location: Seoul, Korea
        </p>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary" onclick="closeModal(this)">Close</button>
        </div>
      </div>
    </div>

    <div class="modal" id="snsModal">
      <div class="modal-card">
        <h2 class="modal-title">SNS</h2>
        <p class="modal-copy">
          Behance: your-link<br />
          Instagram: your-link<br />
          Blog / Notion: your-link
        </p>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary" onclick="closeModal(this)">Close</button>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", buildProjectFooter);