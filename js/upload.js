// === Konfigurasi ===
const GITHUB_TOKEN = "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"; // PAT dgn izin "repo"
const USERNAME = "robloxindocom";
const REPO = "cekdeal";
const BRANCH = "main";

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const output = document.getElementById("output");
  const preview = document.getElementById("preview");

  if (!fileInput.files.length) return alert("Pilih gambar terlebih dahulu!");

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64data = reader.result.split(",")[1];

    // === Nama file otomatis ===
    const username = "user123"; // nanti bisa diganti sesuai login
    const tanggal = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${username}_${tanggal}_${file.name}`;

    output.innerHTML = "⏳ Mengunggah...";
    preview.innerHTML = "";

    try {
      const res = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/images/${filename}`, {
        method: "PUT",
        headers: {
          "Authorization": `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload ${filename}`,
          content: base64data,
          branch: BRANCH,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const link = `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/images/${filename}`;
        output.innerHTML = `
          ✅ <b>Upload berhasil!</b><br>
          <a href="${link}" target="_blank">${link}</a><br>
          <button id="copyBtn">📋 Salin Link</button>
        `;
        preview.innerHTML = `<img src="${link}" alt="Preview">`;

        document.getElementById("copyBtn").addEventListener("click", () => {
          navigator.clipboard.writeText(link);
          const btn = document.getElementById("copyBtn");
          btn.textContent = "✅ Disalin!";
          setTimeout(() => (btn.textContent = "📋 Salin Link"), 2000);
        });
      } else {
        output.innerHTML = `❌ Gagal upload: ${data.message}`;
      }
    } catch (err) {
      output.innerHTML = `⚠️ Kesalahan: ${err.message}`;
    }
  };

  reader.readAsDataURL(file);
});
