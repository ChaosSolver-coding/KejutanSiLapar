const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const resultText = document.getElementById("result");
const namaInput = document.getElementById("nama");
const hpInput = document.getElementById("hp");
const siLapar = document.getElementById("siLapar");
const listPemenang = document.getElementById("listPemenang");

const hadiah = [
  "Diskon 10%",
  "Dimsum Gratis 1",
  "Minuman Gratis",
  "Free Saus",
  "Coba Lagi",
  "Voucher Rp5.000",
];

const slice = 360 / hadiah.length;
let angle = 0;
let isSpinning = false;

// Gambar roda
function drawWheel() {
  for (let i = 0; i < hadiah.length; i++) {
    let startAngle = (i * slice) * Math.PI / 180;
    let endAngle = ((i + 1) * slice) * Math.PI / 180;

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, startAngle, endAngle);
    ctx.fillStyle = i % 2 === 0 ? "#FFD54F" : "#FFB74D";
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate((startAngle + endAngle) / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#333";
    ctx.font = "16px sans-serif";
    ctx.fillText(hadiah[i], 180, 10);
    ctx.restore();
  }
}
drawWheel();

// Cek jika sudah pernah spin
if (localStorage.getItem("sudahSpin") === "true") {
  spinBtn.disabled = true;
  resultText.innerText = "Kamu sudah spin sebelumnya!";
}

// Tombol SPIN ditekan
spinBtn.onclick = () => {
  if (isSpinning || spinBtn.disabled) return;

  const nama = namaInput.value.trim();
  const hp = hpInput.value.trim();

  if (nama === "" || hp === "") {
    resultText.innerText = "Isi nama dan nomor HP terlebih dahulu!";
    return;
  }

  isSpinning = true;
  spinBtn.disabled = true;
  localStorage.setItem("sudahSpin", "true");

  // Efek animasi Si Lapar
  siLapar.style.animation = "excited 0.4s ease infinite";

  let randomAngle = Math.floor(Math.random() * 360) + 720;
  let current = 0;

  const interval = setInterval(() => {
    current += 10;
    angle += 10;
    canvas.style.transform = `rotate(${angle}deg)`;

    if (current >= randomAngle) {
      clearInterval(interval);
      isSpinning = false;
      siLapar.style.animation = "idle 1.5s infinite alternate";

      let finalAngle = angle % 360;
      let index = Math.floor(hadiah.length - (finalAngle / slice)) % hadiah.length;
      const hadiahDidapat = hadiah[index];
      resultText.innerText = `${nama}, kamu dapat: ${hadiahDidapat} 🎉`;

      // Simpan ke daftar pemenang (localStorage)
      const pemenang = JSON.parse(localStorage.getItem("pemenangList") || "[]");
      pemenang.push({ nama, hp, hadiah: hadiahDidapat });
      localStorage.setItem("pemenangList", JSON.stringify(pemenang));

      tampilkanPemenang();
    }
  }, 20);
};

// Tampilkan daftar pemenang
function tampilkanPemenang() {
  const pemenang = JSON.parse(localStorage.getItem("pemenangList") || "[]");
  listPemenang.innerHTML = "";
  pemenang.slice(-5).reverse().forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nama} (${item.hp}) - ${item.hadiah}`;
    listPemenang.appendChild(li);
  });
}

// Panggil saat halaman dimuat
tampilkanPemenang();
