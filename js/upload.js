const GITHUB_TOKEN = "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"; // token kamu
const USERNAME = "robloxindocom"; // username GitHub kamu
const REPO = "cekdeal"; // nama repo
const BRANCH = "main"; // biasanya 'main' atau 'master'

document.getElementById('uploadBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const output = document.getElementById('output');

  if (!fileInput.files.length) {
    return alert("Pilih gambar terlebih dahulu!");
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64data = reader.result.split(',')[1];
    const filePath = `images/${Date.now()}_${file.name}`;

    output.innerHTML = "⏳ Mengunggah ke GitHub...";
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
          ✅ Upload berhasil!<br>
          📎 <b>Link Gambar:</b><br>
          <a href="${rawUrl}" target="_blank">${rawUrl}</a>
        `;
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
