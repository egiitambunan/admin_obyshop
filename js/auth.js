console.log("✅ auth.js berhasil dijalankan");

// Ganti BASE_URL dengan backend Railway kamu (sudah benar di bawah ini)
const BASE_URL = "https://obyshop-backend-production-4831.up.railway.app";

// Tangkap form login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  // Reset pesan error
  errorMsg.textContent = "";

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Simpan token login ke localStorage
      localStorage.setItem("token", data.token);

      // Redirect ke dashboard admin
      window.location.href = "dashboard.html";
    } else {
      // Tampilkan pesan error dari backend
      errorMsg.textContent = data.message || "Email atau password salah.";
    }

  } catch (error) {
    console.error("❌ Error koneksi:", error);
    errorMsg.textContent = "Koneksi gagal. Periksa jaringan atau server.";
  }
});
