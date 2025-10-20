document.getElementById('uploadBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const output = document.getElementById('output');
  const preview = document.getElementById('preview');

  if (!fileInput.files.length) return alert("Pilih gambar terlebih dahulu!");

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64data = reader.result.split(',')[1];
    const filename = `${Date.now()}_${file.name}`;

    output.innerHTML = "⏳ Mengunggah...";
    preview.innerHTML = "";
    document.getElementById('uploadBtn').disabled = true;

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, content: base64data })
      });

      const data = await res.json();
      if (res.ok) {
        const link = data.url;
        output.innerHTML = `
          ✅ <b>Upload berhasil!</b><br>
          📎 <a id="imageLink" href="${link}" target="_blank">${link}</a><br>
          <button id="copyBtn">📋 Salin Link</button>
        `;
        preview.innerHTML = `<img src="${link}" alt="Preview Gambar">`;

        document.getElementById('copyBtn').addEventListener('click', () => {
          navigator.clipboard.writeText(link);
          const btn = document.getElementById('copyBtn');
          btn.textContent = "✅ Disalin!";
          setTimeout(() => (btn.textContent = "📋 Salin Link"), 2000);
        });
      } else {
        output.innerHTML = `❌ Gagal upload: ${data.error}`;
      }
    } catch (err) {
      output.innerHTML = `⚠️ Terjadi kesalahan: ${err.message}`;
    }

    document.getElementById('uploadBtn').disabled = false;
  };

  reader.readAsDataURL(file);
});
