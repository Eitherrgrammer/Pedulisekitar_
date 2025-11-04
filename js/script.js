document.addEventListener("DOMContentLoaded", () => {
  const sampahItems = document.querySelectorAll(".sampah");
  const dropzones = document.querySelectorAll(".dropzone");
  const penjelasanBox = document.getElementById("penjelasan");
  const totalSampah = sampahItems.length;
  let benarCount = 0;
  let draggedItem = null;

  // === Drag start ===
  sampahItems.forEach(item => {
    item.addEventListener("dragstart", () => {
      draggedItem = item;
      setTimeout(() => (item.style.opacity = "0.5"), 0);
    });

    item.addEventListener("dragend", () => {
      draggedItem.style.opacity = "1";
      draggedItem = null;
    });
  });

  // === Dropzones ===
  dropzones.forEach(zone => {
    // Highlight saat di-drag di atas
    zone.addEventListener("dragover", e => {
      e.preventDefault();
      zone.classList.add("dragover");
    });

    zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));

    // Saat drop
    zone.addEventListener("drop", e => {
      e.preventDefault();
      zone.classList.remove("dragover");

      if (!draggedItem) return;
      const jenisDrop = zone.dataset.jenis;
      const jenisItem = draggedItem.dataset.jenis;

      if (jenisDrop === jenisItem) {
        // Jika benar: clone thumbnail ke tong
        const imgSrc = draggedItem.querySelector("img").src;
        const nama = draggedItem.dataset.nama;
        const alasan = draggedItem.dataset.penjelasan;

        const thumb = document.createElement("img");
        thumb.src = imgSrc;
        thumb.className = "mini-sampah";
        if (!zone.querySelector(".drop-thumb")) {
          const div = document.createElement("div");
          div.classList.add("drop-thumb");
          zone.appendChild(div);
        }
        zone.querySelector(".drop-thumb").appendChild(thumb);

        // Hilangkan item asli
        draggedItem.style.display = "none";

        // Tampilkan penjelasan
        penjelasanBox.style.display = "block";
        penjelasanBox.innerHTML += `
          <div class="alert alert-success py-2 mb-2">
            <b>${nama}</b> → ${alasan}
          </div>
        `;

        benarCount++;
        if (benarCount === totalSampah) {
          setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById("selesaiModal"));
            modal.show();
          }, 400);
        }
      } else {
        // Jika salah
        draggedItem.classList.add("shake");
        setTimeout(() => draggedItem.classList.remove("shake"), 400);
        penjelasanBox.style.display = "block";
        penjelasanBox.innerHTML += `
          <div class="alert alert-danger py-2 mb-2">
            <b>${draggedItem.dataset.nama}</b> bukan sampah ${jenisDrop.toUpperCase()}!
          </div>
        `;
      }
    });
  });

  // Tombol ulang permainan
  const ulangBtn = document.getElementById("ulangBtn");
  ulangBtn.addEventListener("click", () => {
    document.querySelectorAll(".sampah").forEach(s => {
      s.style.display = "block";
    });
    document.querySelectorAll(".drop-thumb").forEach(d => d.remove());
    penjelasanBox.innerHTML = "";
    penjelasanBox.style.display = "none";
    benarCount = 0;
    const modal = bootstrap.Modal.getInstance(document.getElementById("selesaiModal"));
    if (modal) modal.hide();
  });
});
