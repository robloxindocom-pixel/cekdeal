export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filename, content } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ error: "Missing filename or content" });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // simpan di Environment Variable
  const USERNAME = "robloxindocom";
  const REPO = "cekdeal";
  const BRANCH = "main";

  try {
    const response = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/images/${filename}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload ${filename}`,
        content,
        branch: BRANCH,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const url = `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/images/${filename}`;
      return res.status(200).json({ url });
    } else {
      return res.status(response.status).json({ error: data.message });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
