const GITHUB_TOKEN = "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";
const USERNAME = "robloxindocom";
const REPO = "cekdeal";
const BRANCH = "main";

document.getElementById('uploadBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const output = document.getElementById('output');
  const preview = document.getElementById('preview');

  if (!fileInput.files.length) {
    return alert("Pilih gambar terlebih dahulu!");
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64data = reader.result.split(',')[1];
    const filePath = `images/${Date.now()}_${file.name}`;

    output.innerHTML = "⏳ Mengunggah ke GitHub...";
    preview.innerHTML = "";
    document.getElementById('uploadBtn').disabled = true;

    try {
      const response = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload ${file.name}`,
          content: base64data,
          branch: BRANCH,
        })
      });

      const result = await response.json();

      if (response.ok) {
        const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/${filePath}`;

        output.innerHTML = `
          ✅ <b>Upload berhasil!</b><br>
          📎 <b>Link Gambar:</b><br>
          <a id="imageLink" href="${rawUrl}" target="_blank">${rawUrl}</a><br>
          <button id="copyBtn">📋 Salin Link</button>
        `;

        preview.innerHTML = `<img src="${rawUrl}" alt="Preview Gambar">`;

        document.getElementById('copyBtn').addEventListener('click', () => {
          navigator.clipboard.writeText(rawUrl);
          const btn = document.getElementById('copyBtn');
          btn.textContent = "✅ Disalin!";
          setTimeout(() => (btn.textContent = "📋 Salin Link"), 2000);
        });

      } else {
        output.innerHTML = `❌ Gagal upload: ${result.message || 'Unknown error'}`;
      }
    } catch (err) {
      output.innerHTML = `⚠️ Terjadi kesalahan: ${err.message}`;
    }

    document.getElementById('uploadBtn').disabled = false;
  };

  reader.readAsDataURL(file);
});
