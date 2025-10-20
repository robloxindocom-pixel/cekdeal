<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Upload Image ke GitHub</title>
  <style>
    body { font-family: Arial; max-width: 600px; margin: 50px auto; text-align: center; }
    input[type="file"] { margin: 20px 0; }
    img { max-width: 100%; margin-top: 15px; border-radius: 8px; }
    button { padding: 8px 15px; cursor: pointer; margin-top: 10px; }
    #linkContainer { margin-top: 20px; }
    #linkContainer a { display: block; margin-top: 5px; }
  </style>
</head>
<body>
  <h2>Upload Gambar ke GitHub Repo</h2>
  <input type="text" id="username" placeholder="Masukkan username" /><br>
  <input type="file" id="fileInput" accept="image/*" />
  <button onclick="uploadImage()">Upload</button>

  <div id="linkContainer"></div>

  <script>
    const GITHUB_TOKEN = "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"; // ⚠️ Ganti token kamu
    const USERNAME = "robloxindocom";         // ⚠️ Ganti username GitHub kamu
    const REPO = "cekdeal";                   // ⚠️ Ganti nama repo kamu
    const BRANCH = "main";                    // atau 'master' tergantung repo kamu
    const PATH = "images";                    // folder di repo

    async function uploadImage() {
      const fileInput = document.getElementById("fileInput");
      const username = document.getElementById("username").value.trim();
      if (!fileInput.files.length) return alert("Pilih file dulu!");
      if (!username) return alert("Masukkan username!");

      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        const timestamp = Date.now();
        const safeName = username.replace(/\W+/g, "_");
        const filename = `${safeName}_${timestamp}_${file.name}`;

        const url = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${PATH}/${filename}`;
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Upload ${filename}`,
            content: base64,
            branch: BRANCH
          }),
        });

        const data = await res.json();
        if (res.status === 201 || res.status === 200) {
          const link = `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/${PATH}/${filename}`;
          showLink(link);
        } else {
          alert("Gagal upload: " + (data.message || "Unknown error"));
          console.error(data);
        }
      };
    }

    function showLink(link) {
      const container = document.getElementById("linkContainer");
      container.innerHTML = `
        <p>✅ Upload sukses!</p>
        <a href="${link}" target="_blank">${link}</a>
        <button onclick="copyLink('${link}')">Copy Link</button>
        <img src="${link}" alt="Preview">
      `;
    }

    function copyLink(link) {
      navigator.clipboard.writeText(link);
      alert("Link disalin!");
    }
  </script>
</body>
</html>
