const form = document.getElementById("kontenForm");

// Ambil konten dari backend lalu tampilkan ke form
async function loadKonten() {
  const res = await fetch("https://obyshop-backend-production-4831.up.railway.app/api/content", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (!res.ok) {
    alert("Gagal mengambil data: " + res.statusText);
    return;
  }

  const data = await res.json();

  // Hero
  if (form.heroTitle) form.heroTitle.value = data.heroTitle || "";
  if (form.heroSubtitle) form.heroSubtitle.value = data.heroSubtitle || "";
  if (form.heroTitleColor) form.heroTitleColor.value = data.heroTitleColor || "#000000";
  if (form.heroSubtitleColor) form.heroSubtitleColor.value = data.heroSubtitleColor || "#000000";
  if (form.heroBackgroundImage) form.heroBackgroundImage.value = data.heroBackgroundImage || "";
  if (data.heroBackgroundImage) {
    const heroPreview = document.getElementById("heroPreview");
    if (heroPreview) heroPreview.src = `https://obyshop-backend-production-4831.up.railway.app${data.heroBackgroundImage}`;
  }

  // Tentang Kami
  if (form.aboutText) form.aboutText.value = data.aboutText || "";

  // Video
  if (Array.isArray(data.aboutVideos)) {
    const v = data.aboutVideos;

    if (v[0]) {
      if (form.aboutVideoUrl1) form.aboutVideoUrl1.value = v[0].videoUrl || "";
      if (form.aboutVideoDesc1) form.aboutVideoDesc1.value = v[0].desc || "";
      const prev1 = document.getElementById("aboutVideoPreview1");
      if (prev1) prev1.src = v[0].videoUrl ? `https://obyshop-backend-production-4831.up.railway.app${v[0].videoUrl}` : "";
    }
    if (v[1]) {
      if (form.aboutVideoUrl2) form.aboutVideoUrl2.value = v[1].videoUrl || "";
      if (form.aboutVideoDesc2) form.aboutVideoDesc2.value = v[1].desc || "";
      const prev2 = document.getElementById("aboutVideoPreview2");
      if (prev2) prev2.src = v[1].videoUrl ? `https://obyshop-backend-production-4831.up.railway.app${v[1].videoUrl}` : "";
    }
    if (v[2]) {
      if (form.aboutVideoUrl3) form.aboutVideoUrl3.value = v[2].videoUrl || "";
      if (form.aboutVideoDesc3) form.aboutVideoDesc3.value = v[2].desc || "";
      const prev3 = document.getElementById("aboutVideoPreview3");
      if (prev3) prev3.src = v[2].videoUrl ? `https://obyshop-backend-production-4831.up.railway.app${v[2].videoUrl}` : "";
    }
  }
}

// Kirim data ke backend
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    heroTitle: form.heroTitle?.value || "",
    heroSubtitle: form.heroSubtitle?.value || "",
    heroTitleColor: form.heroTitleColor?.value || "#000000",
    heroSubtitleColor: form.heroSubtitleColor?.value || "#000000",
    heroBackgroundImage: form.heroBackgroundImage?.value || "",
    aboutText: form.aboutText?.value || "",

    aboutVideo1: form.aboutVideoUrl1?.value || "",
    aboutVideo2: form.aboutVideoUrl2?.value || "",
    aboutVideo3: form.aboutVideoUrl3?.value || "",

    aboutVideo1Desc: form.aboutVideoDesc1?.value || "",
    aboutVideo2Desc: form.aboutVideoDesc2?.value || "",
    aboutVideo3Desc: form.aboutVideoDesc3?.value || "",

    contactInfo: {
      phone: form.contactPhone?.value || "",
      email: form.contactEmail?.value || "",
      address: form.contactAddress?.value || "",
    },

    whatsapp: {
      contactButton: form.waContact?.value || "",
      bubbleButton: form.waBubble?.value || "",
    },

    socialMedia: {
      instagram: form.instagramLink?.value || "",
      facebook: form.facebookLink?.value || "",
      tiktok: form.tiktokLink?.value || "",
    },

    theme: {
      primaryColor: form.primaryColor?.value || "#000000",
      backgroundColor: form.backgroundColor?.value || "#ffffff",
    },
  };

  const res = await fetch("https://obyshop-backend-production-4831.up.railway.app/api/content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert("Konten berhasil diperbarui!");
    loadKonten();
  } else {
    alert("Gagal menyimpan konten");
  }
});

// === Upload video ===
const videoInputs = [
  { file: 'aboutVideoUpload1', url: 'aboutVideoUrl1', preview: 'aboutVideoPreview1' },
  { file: 'aboutVideoUpload2', url: 'aboutVideoUrl2', preview: 'aboutVideoPreview2' },
  { file: 'aboutVideoUpload3', url: 'aboutVideoUrl3', preview: 'aboutVideoPreview3' }
];

videoInputs.forEach((v, index) => {
  document.getElementById(v.file)?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/3gpp", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      alert("❌ Format video tidak didukung.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("slot", `video${index + 1}`);

    try {
      const res = await fetch("https://obyshop-backend-production-4831.up.railway.app/api/upload/video", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      });

      const data = await res.json();

      if (data.videoUrl) {
        const inputUrl = document.getElementById(v.url);
        const preview = document.getElementById(v.preview);
        if (inputUrl) inputUrl.value = data.videoUrl;
        if (preview) preview.src = `https://obyshop-backend-production-4831.up.railway.app${data.videoUrl}`;
      } else {
        alert("Gagal upload: " + (data.error || "Tidak diketahui"));
      }
    } catch (err) {
      console.error("❌ Upload gagal:", err);
      alert("Upload gagal. Periksa koneksi atau server.");
    }
  });
});

loadKonten();
