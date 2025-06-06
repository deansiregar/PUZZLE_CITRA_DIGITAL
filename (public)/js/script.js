// Variabel Global untuk State Aplikasi
let currentPageId = 'page-0';
let originalImage = null; // Gambar asli yang diunggah pengguna (objek Image)
let originalImageURL = null; // URL objek gambar asli
let croppedSquareImage = null; // Gambar yang sudah di-crop jadi persegi (objek Image)
let croppedSquareImageURL = null; // URL objek gambar persegi
let imageWidth = 0; // Lebar gambar asli
let imageHeight = 0; // Tinggi gambar asli
let squareDim = 0; // Dimensi sisi gambar persegi
let difficulty = 3; // Default 3x3
let puzzlePieces = [];
let puzzleType = '';
let timerInterval = null;
let secondsElapsed = 0;

// Variabel untuk Quiz
const quizQuestions = [
    {
        question: "Unit terkecil yang membentuk sebuah gambar digital pada layar atau sensor kamera disebut apa?",
        options: ["Vektor", "Pixel", "Megapixel", "Resolusi"],
        answer: "Pixel",
        materi: "Pixel (Picture Element)"
    },
    {
        question: "Resolusi sebuah citra digital mengacu pada apa?",
        options: ["Warna dominan gambar", "Ukuran fisik gambar", "Jumlah total pixel yang menyusun citra", "Kehalusan tekstur gambar"],
        answer: "Jumlah total pixel yang menyusun citra",
        materi: "Resolusi Citra"
    },
    {
        question: "Transformasi geometri yang melibatkan pemindahan setiap titik objek sejauh vektor tertentu disebut...",
        options: ["Rotasi", "Penskalaan", "Translasi", "Geseran"],
        answer: "Translasi",
        materi: "Transformasi Geometri"
    },
    {
        question: "Proses mempartisi sebuah citra digital menjadi beberapa segmen atau objek yang lebih bermakna dan mudah dianalisis disebut...",
        options: ["Kompresi Citra", "Filter Citra", "Segmentasi Citra", "Restorasi Citra"],
        answer: "Segmentasi Citra",
        materi: "Konsep Segmentasi Citra"
    },
    {
        question: "Citra grayscale merepresentasikan informasi apa pada setiap pixelnya?",
        options: ["Warna primer (RGB)", "Intensitas cahaya (luminans) tanpa informasi warna", "Saturasi warna", "Hue warna"],
        answer: "Intensitas cahaya (luminans) tanpa informasi warna",
        materi: "Citra Grayscale (Skala Keabuan)"
    }
];

// Fungsi Navigasi (tetap sama)
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    currentPageId = pageId;
    window.scrollTo(0, 0);
}

// Fungsi Timer (tetap sama)
function startTimer() {
    secondsElapsed = 0;
    const getCurrentTimerElement = () => {
        if (!currentPageId) return null;
        if (currentPageId === 'page-2') return document.getElementById('timerDisplay2');
        if (currentPageId === 'page-3') return document.getElementById('timerDisplay3');
        if (currentPageId === 'page-4') return document.getElementById('timerDisplay4');
        return null;
    };

    let timerDisplayEl = getCurrentTimerElement();
    if (timerDisplayEl) {
        timerDisplayEl.textContent = `Waktu: ${secondsElapsed}s`;
    }

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        secondsElapsed++;
        timerDisplayEl = getCurrentTimerElement();
        if (timerDisplayEl) {
            timerDisplayEl.textContent = `Waktu: ${secondsElapsed}s`;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Inisialisasi (tetap sama)
document.addEventListener('DOMContentLoaded', () => {
    setupPage0();
    setupPage1();
    setupPage2();
    setupPage3();
    setupPage4();
    setupPage5(); // Tambahkan setup untuk Page 5
    showPage('page-0');
});

// --- Halaman 0: Muka ---
function setupPage0() {
    const page0Content = `
        <h1>Selamat Datang di SmartPixel! 🧩</h1>
        <p>Asah pemahamanmu tentang dunia citra digital melalui puzzle interaktif yang seru! Unggah gambarmu sendiri dan mulailah petualangan belajar tentang piksel, resolusi, transformasi, dan model warna.</p>
        <button id="startAdventureBtn">Mulai Petualangan!</button>
    `;
    document.getElementById('page-0').innerHTML = page0Content;
    document.getElementById('startAdventureBtn').addEventListener('click', () => showPage('page-1'));
}

// --- Halaman 1: Unggah & Kesulitan ---
function setupPage1() {
    const page1Content = `
        <h2>Langkah 1: Siapkan Kanvas Digitalmu 🖼️</h2>
        <div>
            <label for="imageUpload">Pilih Gambar (JPG/PNG):</label>
            <input type="file" id="imageUpload" accept="image/jpeg, image/png">
        </div>
        <img id="imagePreview" src="#" alt="Pratinjau Gambar Asli" style="max-width: 300px; max-height: 300px; display: none; margin-top:10px; border: 1px solid #ccc;">
        <p id="imageCropInfo" style="font-style: italic; font-size: 0.9em; display:none;">Gambar ini akan dipotong menjadi persegi untuk puzzle.</p>
        <div>
            <label for="difficultySelect">Pilih Tingkat Kesulitan:</label>
            <select id="difficultySelect">
                <option value="3">Mudah (3x3)</option>
                <option value="4">Sedang (4x4)</option>
                <option value="5">Sulit (5x5)</option>
            </select>
        </div>
        <button id="startPuzzleBtnPage1" disabled>Mulai Puzzle!</button>
    `;
    document.getElementById('page-1').innerHTML = page1Content;

    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const imageCropInfo = document.getElementById('imageCropInfo');
    const startPuzzleBtnPage1 = document.getElementById('startPuzzleBtnPage1');

    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            originalImageURL = URL.createObjectURL(file);
            imagePreview.src = originalImageURL;
            imagePreview.style.display = 'block';
            imageCropInfo.style.display = 'block';

            originalImage = new Image();
            originalImage.onload = () => {
                imageWidth = originalImage.width;
                imageHeight = originalImage.height;
                processAndSquareImage(originalImage, () => {
                    startPuzzleBtnPage1.disabled = false;
                });
            };
            originalImage.src = originalImageURL;
        } else {
            imagePreview.style.display = 'none';
            imageCropInfo.style.display = 'none';
            startPuzzleBtnPage1.disabled = true;
            originalImage = null;
            originalImageURL = null;
            croppedSquareImage = null;
            croppedSquareImageURL = null;
        }
    });

    startPuzzleBtnPage1.addEventListener('click', () => {
        difficulty = parseInt(document.getElementById('difficultySelect').value);
        if (!croppedSquareImage) {
            alert("Silakan unggah dan tunggu gambar diproses!");
            return;
        }
        puzzleType = 'drag';
        generatePuzzlePieces(croppedSquareImageURL, false);
        showPage('page-2');
        startTimer();
    });
}

function processAndSquareImage(imgObj, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let sourceX, sourceY, sourceSize;
    if (imgObj.width > imgObj.height) {
        sourceSize = imgObj.height;
        sourceX = (imgObj.width - imgObj.height) / 2;
        sourceY = 0;
    } else {
        sourceSize = imgObj.width;
        sourceX = 0;
        sourceY = (imgObj.height - imgObj.width) / 2;
    }
    squareDim = sourceSize;

    canvas.width = sourceSize;
    canvas.height = sourceSize;

    ctx.drawImage(imgObj, sourceX, sourceY, sourceSize, sourceSize, 0, 0, sourceSize, sourceSize);
    croppedSquareImageURL = canvas.toDataURL();

    croppedSquareImage = new Image();
    croppedSquareImage.onload = () => {
        if (callback) callback();
    };
    croppedSquareImage.src = croppedSquareImageURL;
}

function generatePuzzlePieces(imageSrcForPuzzle, isGrayscale = false) {
    puzzlePieces = [];
    const img = new Image();
    img.onload = () => {
        const pieceDim = img.width / difficulty;

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        if (isGrayscale) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
            }
            ctx.putImageData(imageData, 0, 0);
        }

        for (let y = 0; y < difficulty; y++) {
            for (let x = 0; x < difficulty; x++) {
                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceDim;
                pieceCanvas.height = pieceDim;
                const pieceCtx = pieceCanvas.getContext('2d');

                pieceCtx.drawImage(canvas, x * pieceDim, y * pieceDim, pieceDim, pieceDim, 0, 0, pieceDim, pieceDim);

                puzzlePieces.push({
                    id: `piece-${y}-${x}`,
                    originalIndex: y * difficulty + x,
                    correctX: x, correctY: y, currentX: x, currentY: y,
                    rotation: 0,
                    element: null,
                    dataUrl: pieceCanvas.toDataURL()
                });
            }
        }
        if (currentPageId === 'page-2') renderPuzzlePage2();
        else if (currentPageId === 'page-3') renderPuzzlePage3();
        else if (currentPageId === 'page-4') renderPuzzlePage4();
    };
    img.src = imageSrcForPuzzle;
}

// --- Halaman 2: Puzzle Dasar & Materi Pixel/Resolusi ---
function setupPage2() {
    const page2Content = `
        <h2>Puzzle #1: Menyusun Dasar Citra 🖱️</h2>
        <div class="puzzle-controls">
             <div id="timerDisplay2">Waktu: 0s</div>
             <button id="autoSolveBtnPage2">Auto Solve</button>
        </div>
        <div id="shuffledPiecesContainerPage2" class="shuffled-pieces-container"></div>
        <div id="dropTargetAreaPage2" class="drop-target-area"></div>
        <div id="materialPage2" class="material-section" style="display:none;">
            <h3>Mengenal Pixel dan Resolusi: Fondasi Citra Digital</h3>
            <p>Selamat! Anda telah berhasil menyusun kepingan-kepingan gambar. Setiap kepingan, dan gambar secara keseluruhan, tersusun dari elemen-elemen dasar yang sangat kecil.</p>
            <h4>Pixel (<em>Picture Element</em>)</h4>
            <p>
                <strong>Pixel</strong> adalah unit terkecil yang membentuk sebuah gambar digital pada layar atau sensor kamera. Bayangkan sebuah mozaik raksasa yang tersusun dari jutaan ubin kecil; setiap ubin tersebut adalah analogi dari pixel. Setiap pixel memiliki nilai warna atau intensitas cahaya tertentu.
            </p>
            <ul>
                <li><strong>Warna dan Intensitas:</strong> Pada gambar berwarna, setiap pixel biasanya merepresentasikan kombinasi dari tiga warna dasar (Merah, Hijau, Biru - RGB) atau pada gambar grayscale, ia merepresentasikan satu tingkat keabuan.</li>
                <li><strong>Kepadatan Pixel:</strong> Semakin banyak pixel yang terkandung dalam suatu area tertentu (kepadatan pixel), semakin detail dan halus gambar yang ditampilkan. Ini sering diukur dalam PPI (Pixels Per Inch) untuk layar.</li>
                <li><strong>Bit Depth:</strong> Jumlah bit yang digunakan untuk merepresentasikan warna setiap pixel menentukan berapa banyak variasi warna yang dapat ditampilkan. Misalnya:
                    <ul>
                        <li>1-bit: Hanya 2 warna (biasanya hitam dan putih).</li>
                        <li>8-bit (grayscale): $2^8$ = 256 tingkat keabuan.</li>
                        <li>24-bit (True Color RGB): 8 bit per channel warna (R, G, B), menghasilkan $2^{24}$ $\approx$ 16.7 juta warna.</li>
                    </ul>
                </li>
            </ul>
            <div id="pixelZoomDemo" style="margin-top:15px; margin-bottom:15px;"></div>
            <h4>Resolusi Citra</h4>
            <p>
                <strong>Resolusi</strong> sebuah citra digital mengacu pada jumlah total pixel yang menyusun citra tersebut. Biasanya, resolusi dinyatakan dalam format <strong>lebar x tinggi</strong> (misalnya, 1920x1080 pixel, yang berarti gambar memiliki lebar 1920 pixel dan tinggi 1080 pixel).
            </p>
            <ul>
                <li><strong>Detail Gambar:</strong> Semakin tinggi resolusi sebuah gambar (semakin banyak jumlah pixelnya), semakin besar potensi detail yang dapat ditangkap dan ditampilkan. Gambar dengan resolusi tinggi akan terlihat lebih tajam dan jelas, terutama saat diperbesar.</li>
                <li><strong>Ukuran File:</strong> Umumnya, gambar dengan resolusi lebih tinggi memiliki ukuran file yang lebih besar karena lebih banyak data informasi pixel yang harus disimpan.</li>
                <li><strong>Standar Umum:</strong> Beberapa standar resolusi yang umum dikenal antara lain:
                    <ul>
                        <li>HD (High Definition): 1280x720 pixel</li>
                        <li>Full HD (FHD): 1920x1080 pixel</li>
                        <li>QHD (Quad HD)/2K: 2560x1440 pixel</li>
                        <li>UHD (Ultra HD)/4K: 3840x2160 pixel</li>
                    </ul>
                </li>
            </ul>
            <p>Gambar persegi yang digunakan untuk puzzle ini memiliki resolusi <strong id="imageResolutionDisplay"></strong> (lebar x tinggi dalam pixel).</p>
            <button id="nextChallengeBtnPage2">Lanjut ke Tantangan Berikutnya</button>
        </div>
    `;
    document.getElementById('page-2').innerHTML = page2Content;
    document.getElementById('nextChallengeBtnPage2').addEventListener('click', () => {
        puzzleType = 'swap-rotate';
        generatePuzzlePieces(croppedSquareImageURL, false);
        showPage('page-3');
        startTimer();
    });
    document.getElementById('autoSolveBtnPage2').addEventListener('click', autoSolvePage2);
}

function renderPuzzlePage2() {
    const shuffledContainer = document.getElementById('shuffledPiecesContainerPage2');
    const targetArea = document.getElementById('dropTargetAreaPage2');
    shuffledContainer.innerHTML = '';
    targetArea.innerHTML = '';

    const puzzleAreaDimension = Math.min(500, squareDim);
    targetArea.style.width = `${puzzleAreaDimension}px`;
    targetArea.style.height = `${puzzleAreaDimension}px`;
    targetArea.style.gridTemplateColumns = `repeat(${difficulty}, 1fr)`;
    targetArea.style.gridTemplateRows = `repeat(${difficulty}, 1fr)`;

    const pieceDOMSize = puzzleAreaDimension / difficulty;

    for (let i = 0; i < difficulty * difficulty; i++) {
        const slot = document.createElement('div');
        slot.classList.add('drop-slot');
        slot.dataset.index = i;
        slot.style.width = `${pieceDOMSize -2}px`;
        slot.style.height = `${pieceDOMSize -2}px`;
        slot.addEventListener('dragover', (e) => e.preventDefault());
        slot.addEventListener('drop', handleDropPage2);
        targetArea.appendChild(slot);
    }

    let shuffledForDisplay = [...puzzlePieces].sort(() => Math.random() - 0.5);
    shuffledForDisplay.forEach(pieceData => {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('puzzle-piece');
        pieceElement.style.backgroundImage = `url(${pieceData.dataUrl})`;
        pieceElement.style.width = `${pieceDOMSize -2}px`;
        pieceElement.style.height = `${pieceDOMSize -2}px`;
        pieceElement.draggable = true;
        pieceElement.id = pieceData.id;
        pieceElement.dataset.originalIndex = pieceData.originalIndex;
        pieceElement.addEventListener('dragstart', handleDragStartPage2);
        shuffledContainer.appendChild(pieceElement);
        pieceData.element = pieceElement;
    });
    const timerDisp2 = document.getElementById('timerDisplay2');
    if(timerDisp2) timerDisp2.textContent = `Waktu: ${secondsElapsed}s`;
}

let draggedItem = null;
function handleDragStartPage2(e) {
    draggedItem = e.target;
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
}
function handleDropPage2(e) {
    e.preventDefault();
    const slot = e.target.closest('.drop-slot');
    if (slot && !slot.firstChild && draggedItem) {
        draggedItem.style.opacity = '1';
        slot.appendChild(draggedItem);
        draggedItem = null;
        checkPuzzleCompletionPage2();
    } else if (draggedItem) {
        draggedItem.style.opacity = '1';
        draggedItem = null;
    }
}

function checkPuzzleCompletionPage2() {
    const slots = document.querySelectorAll('#dropTargetAreaPage2 .drop-slot');
    let allCorrect = true;
    for (let i = 0; i < slots.length; i++) {
        const pieceInSlot = slots[i].querySelector('.puzzle-piece');
        if (!pieceInSlot || parseInt(pieceInSlot.dataset.originalIndex) !== i) {
            allCorrect = false; break;
        }
    }

    if (allCorrect) {
        stopTimer();
        alert(`Selamat! Puzzle Selesai dalam ${secondsElapsed} detik!`);
        document.getElementById('materialPage2').style.display = 'block';
        document.getElementById('imageResolutionDisplay').textContent = `${squareDim}x${squareDim} pixel`;

        const zoomDemo = document.getElementById('pixelZoomDemo');
        zoomDemo.innerHTML = '<h3>Contoh Pixel dari Gambar Puzzle:</h3>';
        const zoomCanvas = document.createElement('canvas');
        zoomCanvas.width = 100; zoomCanvas.height = 100;
        const zoomCtx = zoomCanvas.getContext('2d');
        const sx = Math.floor(squareDim / 2) - 5;
        const sy = Math.floor(squareDim / 2) - 5;
        zoomCtx.imageSmoothingEnabled = false;
        zoomCtx.drawImage(croppedSquareImage, sx, sy, 10, 10, 0, 0, 100, 100);
        zoomDemo.appendChild(zoomCanvas);
        document.getElementById('autoSolveBtnPage2').disabled = true;
        if (typeof MathJax !== 'undefined') { MathJax.typesetPromise(); } // Panggil MathJax setelah konten dimuat
    }
}

function autoSolvePage2() {
    stopTimer();
    const shuffledContainer = document.getElementById('shuffledPiecesContainerPage2');
    const targetArea = document.getElementById('dropTargetAreaPage2');
    const slots = targetArea.querySelectorAll('.drop-slot');
    slots.forEach(slot => slot.innerHTML = '');
    shuffledContainer.innerHTML = '';

    const pieceDOMSize = (targetArea.offsetWidth / difficulty);

    puzzlePieces.sort((a, b) => a.originalIndex - b.originalIndex);
    puzzlePieces.forEach((pieceData, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('puzzle-piece');
        pieceElement.style.backgroundImage = `url(${pieceData.dataUrl})`;
        pieceElement.style.width = `${pieceDOMSize -2}px`;
        pieceElement.style.height = `${pieceDOMSize -2}px`;
        pieceElement.id = pieceData.id;
        pieceElement.dataset.originalIndex = pieceData.originalIndex;
        slots[index].appendChild(pieceElement);
    });
    checkPuzzleCompletionPage2();
    alert("Puzzle diselesaikan secara otomatis!");
}

// --- Halaman 3: Puzzle Tukar/Putar & Materi Transformasi/Segmentasi ---
function setupPage3() {
    const page3Content = `
        <h2>Puzzle #2: Transformasi dan Pengenalan Objek 🔄</h2>
        <div class="puzzle-controls">
             <div id="timerDisplay3">Waktu: 0s</div>
             <button id="autoSolveBtnPage3">Auto Solve</button>
        </div>
        <div id="puzzleAreaPage3" class="puzzle-area"></div>
        <p style="text-align:center; font-style:italic;">Klik 1x untuk memilih, klik kepingan lain untuk menukar. Klik kiri 2x untuk memutar.</p>
        <div id="materialPage3" class="material-section" style="display:none;">
            <h3>Transformasi Geometri dan Konsep Segmentasi Citra</h3>
            <p>Anda baru saja menyelesaikan puzzle dengan cara menukar dan memutar kepingan. Proses ini secara langsung berkaitan dengan konsep penting dalam pengolahan citra, yaitu <strong>transformasi geometri</strong> dan <strong>segmentasi citra</strong>.</p>
            <h4>Transformasi Geometri</h4>
            <p>
                Transformasi geometri adalah operasi yang mengubah posisi, orientasi, atau ukuran objek (dalam hal ini, kepingan puzzle) dalam sebuah citra. Beberapa transformasi dasar yang relevan dengan apa yang baru saja Anda lakukan meliputi:
            </p>
            <ul>
                <li>
                    <strong>Translasi (Pergeseran):</strong> Ini terjadi ketika Anda menukar posisi dua kepingan puzzle. Secara matematis, translasi adalah pemindahan setiap titik objek sejauh vektor tertentu $(t_x, t_y)$. Jika sebuah titik awal adalah $(x, y)$, maka setelah translasi menjadi $(x', y')$ dimana:
                    <p>$$x' = x + t_x$$</p>
                    <p>$$y' = y + t_y$$</p>
                </li>
                <li>
                    <strong>Rotasi (Perputaran):</strong> Ini terjadi ketika Anda memutar sebuah kepingan puzzle. Rotasi dilakukan terhadap suatu titik pivot (biasanya pusat kepingan) dengan sudut tertentu $(\theta)$. Untuk rotasi terhadap titik asal (0,0), koordinat baru $(x', y')$ dari titik $(x, y)$ adalah:
                    <p>$$x' = x \cos\theta - y \sin\theta$$</p>
                    <p>$$y' = x \sin\theta + y \cos\theta$$</p>
                </li>
                <li>
                    <strong>Penskalaan (Scaling):</strong> Meskipun tidak secara langsung Anda lakukan, penskalaan adalah transformasi untuk mengubah ukuran objek. Ini bisa uniform (semua sumbu diskalakan sama) atau non-uniform.
                </li>
                <li>
                    <strong>Geseran (Shearing):</strong> Transformasi yang memiringkan objek, seolah-olah lapisan-lapisan objek digeser satu sama lain.
                </li>
            </ul>
            <p>Transformasi-transformasi ini seringkali direpresentasikan menggunakan matriks dan merupakan dasar dari banyak operasi grafis komputer dan pengolahan citra.</p>

            <h4>Konsep Segmentasi Citra</h4>
            <p>
                <strong>Segmentasi citra</strong> adalah proses mempartisi atau membagi sebuah citra digital menjadi beberapa segmen (kumpulan pixel) atau objek yang lebih bermakna dan mudah dianalisis. Tujuannya adalah untuk menyederhanakan representasi citra atau untuk melokalisasi objek dan batas-batasnya.
            </p>
            <ul>
                <li><strong>Analogi dengan Puzzle:</strong> Memecah gambar menjadi kepingan-kepingan puzzle adalah bentuk sederhana dari segmentasi. Setiap kepingan adalah sebuah "segmen" dari gambar utuh.</li>
                <li><strong>Tujuan Utama:</strong> Dalam aplikasi nyata, segmentasi membantu dalam:
                    <ul>
                        <li><strong>Pengenalan Objek:</strong> Mengidentifikasi dan memisahkan objek dari latar belakang atau objek lain.</li>
                        <li><strong>Analisis Citra Medis:</strong> Mendeteksi tumor, organ, atau anomali lain dalam citra medis seperti MRI atau CT scan.</li>
                        <li><strong>Computer Vision:</strong> Memungkinkan mesin untuk "memahami" konten visual, misalnya pada mobil otonom untuk mendeteksi jalan, pejalan kaki, atau kendaraan lain.</li>
                    </ul>
                </li>
                <li><strong>Pendekatan Dasar (Konseptual):</strong>
                    <ul>
                        <li><strong>Thresholding (Pengambangan):</strong> Memisahkan pixel berdasarkan nilai intensitasnya. Pixel di atas ambang batas tertentu masuk ke satu segmen, yang di bawahnya ke segmen lain.</li>
                        <li><strong>Deteksi Tepi (Edge Detection):</strong> Menemukan batas antar wilayah dengan mencari perubahan intensitas yang tajam.</li>
                        <li><strong>Region Growing (Pertumbuhan Wilayah):</strong> Memulai dari pixel "benih" dan menambahkan pixel tetangga yang memiliki karakteristik serupa (misalnya, warna atau intensitas) ke dalam segmen.</li>
                    </ul>
                </li>
            </ul>
            <p>Dengan memahami bagaimana gambar dapat dipecah dan dimanipulasi, kita membuka jalan untuk analisis citra yang lebih canggih.</p>
            <button id="nextChallengeBtnPage3">Lanjut ke Puzzle Grayscale</button>
        </div>
    `;
    document.getElementById('page-3').innerHTML = page3Content;
    document.getElementById('nextChallengeBtnPage3').addEventListener('click', () => {
        puzzleType = 'swap-rotate-gray';
        generatePuzzlePieces(croppedSquareImageURL, true);
        showPage('page-4');
        startTimer();
    });
    document.getElementById('autoSolveBtnPage3').addEventListener('click', () => autoSolvePage3Or4('puzzleAreaPage3', false));
    if (typeof MathJax !== 'undefined') { MathJax.typesetPromise(); } // Panggil MathJax untuk materi statis
}

let selectedPiecePage3 = null;

function renderPuzzlePage3() {
    const puzzleArea = document.getElementById('puzzleAreaPage3');
    const timerDisp3 = document.getElementById('timerDisplay3');
    if(timerDisp3) timerDisp3.textContent = `Waktu: ${secondsElapsed}s`;

    puzzleArea.innerHTML = '';
    const puzzleAreaDimension = Math.min(500, squareDim);
    puzzleArea.style.width = `${puzzleAreaDimension}px`;
    puzzleArea.style.height = `${puzzleAreaDimension}px`;
    puzzleArea.style.gridTemplateColumns = `repeat(${difficulty}, 1fr)`;
    puzzleArea.style.gridTemplateRows = `repeat(${difficulty}, 1fr)`;

    const pieceDOMSize = puzzleAreaDimension / difficulty;

    let tempPieces = [...puzzlePieces];
    for (let i = tempPieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempPieces[i], tempPieces[j]] = [tempPieces[j], tempPieces[i]];
    }
    tempPieces.forEach(p => { p.rotation = Math.floor(Math.random() * 4) * 90; });

    tempPieces.forEach((pieceData, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('puzzle-piece');
        pieceElement.style.backgroundImage = `url(${pieceData.dataUrl})`;
        pieceElement.style.width = `${pieceDOMSize}px`;
        pieceElement.style.height = `${pieceDOMSize}px`;
        pieceData.currentX = index % difficulty;
        pieceData.currentY = Math.floor(index / difficulty);
        pieceData.element = pieceElement;
        pieceElement.id = pieceData.id;
        pieceElement.dataset.originalIndex = pieceData.originalIndex;
        pieceElement.dataset.currentIndex = index;
        pieceElement.style.transform = `rotate(${pieceData.rotation}deg)`;
        pieceElement.addEventListener('click', () => handlePieceClickPage3(pieceData));
        pieceElement.addEventListener('dblclick', () => handlePieceDoubleClickPage3(pieceData));
        puzzleArea.appendChild(pieceElement);
    });
    puzzlePieces = tempPieces;
}

function handlePieceClickPage3(clickedPieceData) {
    const clickedElement = clickedPieceData.element;
    if (!selectedPiecePage3) {
        selectedPiecePage3 = clickedPieceData;
        clickedElement.style.border = '2px solid blue';
    } else {
        if (selectedPiecePage3.id === clickedPieceData.id) {
            selectedPiecePage3.element.style.border = '1px solid #eee';
            selectedPiecePage3 = null;
            return;
        }
        const puzzleArea = document.getElementById('puzzleAreaPage3');
        const allPiecesInDOM = Array.from(puzzleArea.children);
        const index1 = allPiecesInDOM.indexOf(selectedPiecePage3.element);
        const index2 = allPiecesInDOM.indexOf(clickedPieceData.element);

        if (index1 < index2) {
            puzzleArea.insertBefore(clickedPieceData.element, allPiecesInDOM[index1]);
            puzzleArea.insertBefore(selectedPiecePage3.element, allPiecesInDOM[index2+1]);
        } else {
            puzzleArea.insertBefore(selectedPiecePage3.element, allPiecesInDOM[index2]);
            puzzleArea.insertBefore(clickedPieceData.element, allPiecesInDOM[index1+1]);
        }

        const idx1InArray = puzzlePieces.findIndex(p => p.id === selectedPiecePage3.id);
        const idx2InArray = puzzlePieces.findIndex(p => p.id === clickedPieceData.id);
        [puzzlePieces[idx1InArray], puzzlePieces[idx2InArray]] = [puzzlePieces[idx2InArray], puzzlePieces[idx1InArray]];

        selectedPiecePage3.element.style.border = '1px solid #eee';
        selectedPiecePage3 = null;
        checkPuzzleCompletionPage3();
    }
}
function handlePieceDoubleClickPage3(pieceData) {
    pieceData.rotation = (pieceData.rotation + 90) % 360;
    pieceData.element.style.transform = `rotate(${pieceData.rotation}deg)`;
    if (selectedPiecePage3 && selectedPiecePage3.id === pieceData.id) {
      selectedPiecePage3.element.style.border = '1px solid #eee';
      selectedPiecePage3 = null;
    }
    checkPuzzleCompletionPage3();
}
function checkPuzzleCompletionPage3() {
    let allCorrect = true;
    const piecesInGrid = document.getElementById('puzzleAreaPage3').children;
    for (let i = 0; i < piecesInGrid.length; i++) {
        const domElement = piecesInGrid[i];
        const pieceData = puzzlePieces.find(p => p.element === domElement);
        if (!pieceData || parseInt(domElement.dataset.originalIndex) !== i || pieceData.rotation !== 0) {
            allCorrect = false; break;
        }
    }
    if (allCorrect) {
        stopTimer();
        alert(`Luar Biasa! Puzzle Kedua Selesai dalam ${secondsElapsed} detik!`);
        document.getElementById('materialPage3').style.display = 'block';
        document.getElementById('autoSolveBtnPage3').disabled = true;
        if (typeof MathJax !== 'undefined') { MathJax.typesetPromise(); }
    }
}

// --- Halaman 4: Puzzle Grayscale & Materi Grayscale/RGB ---
function setupPage4() {
    const page4Content = `
        <h2>Puzzle #3: Pesona Skala Keabuan (Grayscale) 🎨</h2>
        <div class="puzzle-controls">
             <div id="timerDisplay4">Waktu: 0s</div>
             <button id="autoSolveBtnPage4">Auto Solve</button>
        </div>
        <div id="puzzleAreaPage4" class="puzzle-area"></div>
         <p style="text-align:center; font-style:italic;">Klik 1x untuk memilih, klik kepingan lain untuk menukar. Klik kiri 2x untuk memutar.</p>
       <div id="materialPage4" class="material-section" style="display:none;">
            <h3>Memahami Grayscale dan Model Warna RGB</h3>
            <p>Puzzle terakhir ini Anda selesaikan menggunakan versi gambar dalam skala keabuan (grayscale). Ini adalah salah satu cara representasi citra yang umum, berbeda dengan gambar berwarna yang biasanya menggunakan model RGB.</p>

            <h4>Citra Grayscale (Skala Keabuan)</h4>
            <p>
                Citra <strong>grayscale</strong> adalah gambar digital di mana nilai setiap pixel hanya merepresentasikan informasi intensitas cahaya (luminans), tanpa informasi warna. Ini berarti setiap pixel adalah sebuah bayangan abu-abu, mulai dari hitam pekat (intensitas terendah) hingga putih bersih (intensitas tertinggi).
            </p>
            <ul>
                <li><strong>Satu Channel:</strong> Berbeda dengan gambar berwarna yang mungkin memiliki beberapa channel (misalnya, 3 channel untuk RGB), gambar grayscale hanya memiliki satu channel data per pixel.</li>
                <li><strong>Representasi Intensitas:</strong> Jika menggunakan 8-bit per pixel (yang umum), gambar grayscale dapat menampilkan $2^8$ = 256 tingkat keabuan yang berbeda (nilai dari 0 hingga 255).</li>
                <li><strong>Konversi dari RGB ke Grayscale:</strong> Untuk mengubah gambar berwarna (RGB) menjadi grayscale, salah satu metode yang paling umum adalah dengan menghitung rata-rata berbobot dari komponen Merah (R), Hijau (G), dan Biru (B). Formula yang sering digunakan adalah:
                    <p>$$Luminance = 0.299 \times R + 0.587 \times G + 0.114 \times B$$</p>
                    Pembobotan ini dilakukan karena mata manusia lebih sensitif terhadap warna hijau dibandingkan warna lainnya. Ada juga metode lain seperti mengambil rata-rata sederhana ($ (R+G+B)/3 $) atau hanya menggunakan channel hijau.
                </li>
                <li><strong>Aplikasi:</strong>
                    <ul>
                        <li>Mengurangi kompleksitas data untuk analisis citra.</li>
                        <li>Beberapa teknik pencetakan atau tampilan monokromatik.</li>
                        <li>Efek artistik dalam fotografi.</li>
                        <li>Tahap pra-pemrosesan dalam beberapa algoritma computer vision.</li>
                    </ul>
                </li>
            </ul>

            <h4>Model Warna RGB (Red, Green, Blue)</h4>
            <p>
                Model warna <strong>RGB</strong> adalah model warna aditif di mana cahaya Merah, Hijau, dan Biru dicampurkan dalam berbagai proporsi untuk menghasilkan spektrum warna yang luas. Ini adalah model warna utama yang digunakan dalam perangkat elektronik yang memancarkan cahaya, seperti monitor komputer, layar TV, dan smartphone.
            </p>
            <ul>
                <li><strong>Warna Aditif:</strong> Disebut aditif karena dimulai dari hitam (tidak ada cahaya), dan warna ditambahkan untuk menghasilkan warna yang lebih terang. Jika ketiga komponen (R, G, B) dicampur dengan intensitas maksimum, hasilnya adalah putih. Sebaliknya, jika intensitas ketiganya minimum (nol), hasilnya adalah hitam.</li>
                <li><strong>Channel Warna:</strong> Setiap pixel dalam model RGB memiliki tiga nilai numerik yang merepresentasikan intensitas dari komponen Merah, Hijau, dan Biru.</li>
                <li><strong>True Color (24-bit):</strong> Umumnya, setiap channel warna (R, G, B) direpresentasikan oleh 8 bit data. Ini berarti ada $2^8$ = 256 tingkat intensitas untuk setiap warna primer. Kombinasi ketiganya (8 bit R + 8 bit G + 8 bit B = 24 bit) dapat menghasilkan sekitar $2^{24}$ $\approx$ 16.7 juta warna berbeda, yang dikenal sebagai "True Color".</li>
                <li><strong>Contoh Kombinasi RGB (untuk 8-bit per channel):</strong>
                    <ul>
                        <li>Merah murni: (255, 0, 0)</li>
                        <li>Hijau murni: (0, 255, 0)</li>
                        <li>Biru murni: (0, 0, 255)</li>
                        <li>Kuning: (255, 255, 0) (Merah + Hijau)</li>
                        <li>Hitam: (0, 0, 0)</li>
                        <li>Putih: (255, 255, 255)</li>
                    </ul>
                </li>
            </ul>
            <p>Berikut adalah perbandingan visual antara versi grayscale dan RGB dari gambar (persegi) yang Anda gunakan:</p>
            <div class="image-comparison">
                <figure>
                    <img id="grayscaleImageDisplayPage4" src="#" alt="Gambar Grayscale Persegi Penuh" style="max-width:200px; max-height:200px;">
                    <figcaption>Versi Grayscale</figcaption>
                </figure>
                <figure>
                    <img id="originalRGBImageDisplayPage4" src="#" alt="Gambar RGB Persegi Penuh" style="max-width:200px; max-height:200px;">
                    <figcaption>Versi RGB (Asli Persegi)</figcaption>
                </figure>
            </div>
            <p>Model warna lain yang juga umum adalah CMYK (Cyan, Magenta, Yellow, Key/Black) yang bersifat subtraktif dan digunakan dalam pencetakan, serta HSV/HSL (Hue, Saturation, Value/Lightness) yang lebih intuitif bagi persepsi manusia terhadap warna.</p>
            <div style="display:flex; justify-content:space-around; margin-top: 30px;">
                <button id="finishBtnPage4">Selesai Belajar & Ulangi?</button>
                <button id="startQuizBtnPage4">Ikuti Kuis!</button> </div>
        </div>
    `;
    document.getElementById('page-4').innerHTML = page4Content;
    document.getElementById('autoSolveBtnPage4').addEventListener('click', () => autoSolvePage3Or4('puzzleAreaPage4', true));
    document.getElementById('finishBtnPage4').addEventListener('click', () => {
        location.reload();
    });
    // Event listener untuk tombol kuis
    document.getElementById('startQuizBtnPage4').addEventListener('click', () => {
        showPage('page-5');
        renderQuizPage5();
    });
    if (typeof MathJax !== 'undefined') { MathJax.typesetPromise(); } // Panggil MathJax untuk materi statis
}

let selectedPiecePage4 = null;

function renderPuzzlePage4() {
    const puzzleArea = document.getElementById('puzzleAreaPage4');
    const timerDisp4 = document.getElementById('timerDisplay4');
    if(timerDisp4) timerDisp4.textContent = `Waktu: ${secondsElapsed}s`;

    puzzleArea.innerHTML = '';
    const puzzleAreaDimension = Math.min(500, squareDim);
    puzzleArea.style.width = `${puzzleAreaDimension}px`;
    puzzleArea.style.height = `${puzzleAreaDimension}px`;
    puzzleArea.style.gridTemplateColumns = `repeat(${difficulty}, 1fr)`;
    puzzleArea.style.gridTemplateRows = `repeat(${difficulty}, 1fr)`;

    const pieceDOMSize = puzzleAreaDimension / difficulty;

    let tempPieces = [...puzzlePieces];
    for (let i = tempPieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempPieces[i], tempPieces[j]] = [tempPieces[j], tempPieces[i]];
    }
    tempPieces.forEach(p => { p.rotation = Math.floor(Math.random() * 4) * 90; });

    tempPieces.forEach((pieceData, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('puzzle-piece');
        pieceElement.style.backgroundImage = `url(${pieceData.dataUrl})`;
        pieceElement.style.width = `${pieceDOMSize}px`;
        pieceElement.style.height = `${pieceDOMSize}px`;
        pieceData.currentX = index % difficulty;
        pieceData.currentY = Math.floor(index / difficulty);
        pieceData.element = pieceElement;
        pieceElement.id = pieceData.id;
        pieceElement.dataset.originalIndex = pieceData.originalIndex;
        pieceElement.dataset.currentIndex = index;
        pieceElement.style.transform = `rotate(${pieceData.rotation}deg)`;
        pieceElement.addEventListener('click', () => handlePieceClickPage4(pieceData));
        pieceElement.addEventListener('dblclick', () => handlePieceDoubleClickPage4(pieceData));
        puzzleArea.appendChild(pieceElement);
    });
    puzzlePieces = tempPieces;
}

function handlePieceClickPage4(clickedPieceData) {
    const clickedElement = clickedPieceData.element;
    if (!selectedPiecePage4) {
        selectedPiecePage4 = clickedPieceData;
        clickedElement.style.border = '2px solid darkorchid';
    } else {
        if (selectedPiecePage4.id === clickedPieceData.id) {
            selectedPiecePage4.element.style.border = '1px solid #eee';
            selectedPiecePage4 = null; return;
        }
        const puzzleArea = document.getElementById('puzzleAreaPage4');
        const allPiecesInDOM = Array.from(puzzleArea.children);
        const index1 = allPiecesInDOM.indexOf(selectedPiecePage4.element);
        const index2 = allPiecesInDOM.indexOf(clickedPieceData.element);
        if (index1 < index2) {
            puzzleArea.insertBefore(clickedPieceData.element, allPiecesInDOM[index1]);
            puzzleArea.insertBefore(selectedPiecePage4.element, allPiecesInDOM[index2+1]);
        } else {
            puzzleArea.insertBefore(selectedPiecePage4.element, allPiecesInDOM[index2]);
            puzzleArea.insertBefore(clickedPieceData.element, allPiecesInDOM[index1+1]);
        }
        const idx1InArray = puzzlePieces.findIndex(p => p.id === selectedPiecePage4.id);
        const idx2InArray = puzzlePieces.findIndex(p => p.id === clickedPieceData.id);
        [puzzlePieces[idx1InArray], puzzlePieces[idx2InArray]] = [puzzlePieces[idx2InArray], puzzlePieces[idx1InArray]];
        selectedPiecePage4.element.style.border = '1px solid #eee';
        selectedPiecePage4 = null;
        checkPuzzleCompletionPage4();
    }
}
function handlePieceDoubleClickPage4(pieceData) {
    pieceData.rotation = (pieceData.rotation + 90) % 360;
    pieceData.element.style.transform = `rotate(${pieceData.rotation}deg)`;
    if (selectedPiecePage4 && selectedPiecePage4.id === pieceData.id) {
      selectedPiecePage4.element.style.border = '1px solid #eee';
      selectedPiecePage4 = null;
    }
    checkPuzzleCompletionPage4();
}

function checkPuzzleCompletionPage4() {
    let allCorrect = true;
    const piecesInGrid = document.getElementById('puzzleAreaPage4').children;
    for (let i = 0; i < piecesInGrid.length; i++) {
        const domElement = piecesInGrid[i];
        const pieceData = puzzlePieces.find(p => p.element === domElement);
        if (!pieceData || parseInt(domElement.dataset.originalIndex) !== i || pieceData.rotation !== 0) {
            allCorrect = false; break;
        }
    }

    if (allCorrect) {
        stopTimer();
        alert(`Hebat! Puzzle Grayscale Selesai dalam ${secondsElapsed} detik!`);
        document.getElementById('materialPage4').style.display = 'block';

        document.getElementById('originalRGBImageDisplayPage4').src = croppedSquareImageURL;

        const grayscaleCanvas = document.createElement('canvas');
        grayscaleCanvas.width = squareDim;
        grayscaleCanvas.height = squareDim;
        const gsCtx = grayscaleCanvas.getContext('2d');
        gsCtx.drawImage(croppedSquareImage, 0, 0, squareDim, squareDim);
        const imageData = gsCtx.getImageData(0, 0, squareDim, squareDim);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
        }
        gsCtx.putImageData(imageData, 0, 0);
        document.getElementById('grayscaleImageDisplayPage4').src = grayscaleCanvas.toDataURL();

        document.getElementById('autoSolveBtnPage4').disabled = true;
        document.getElementById('startQuizBtnPage4').style.display = 'inline-block'; // Tampilkan tombol kuis
        if (typeof MathJax !== 'undefined') { MathJax.typesetPromise(); }
    }
}

function autoSolvePage3Or4(puzzleAreaId, isGrayscale = false) {
    stopTimer();
    const puzzleArea = document.getElementById(puzzleAreaId);
    puzzleArea.innerHTML = '';

    const sourceImageForSolve = croppedSquareImage;
    if (!sourceImageForSolve) {
        alert("Gambar sumber tidak ditemukan untuk auto-solve.");
        return;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceImageForSolve.width;
    tempCanvas.height = sourceImageForSolve.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(sourceImageForSolve, 0, 0);

    if (isGrayscale) {
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
        }
        tempCtx.putImageData(imageData, 0, 0);
    }

    const pieceDim = tempCanvas.width / difficulty;

    puzzlePieces.sort((a,b) => a.originalIndex - b.originalIndex);

    for (let i = 0; i < puzzlePieces.length; i++) {
        const pieceData = puzzlePieces[i];
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = pieceDim; pieceCanvas.height = pieceDim;
        const pieceCtx = pieceCanvas.getContext('2d');
        pieceCtx.drawImage(tempCanvas, pieceData.correctX * pieceDim, pieceData.correctY * pieceDim, pieceDim, pieceDim, 0, 0, pieceDim, pieceDim);

        const pieceElement = document.createElement('div');
        pieceElement.classList.add('puzzle-piece');
        pieceElement.style.backgroundImage = `url(${pieceCanvas.toDataURL()})`;
        pieceElement.style.width = `${puzzleArea.offsetWidth / difficulty}px`;
        pieceElement.style.height = `${puzzleArea.offsetHeight / difficulty}px`;
        pieceElement.style.transform = 'rotate(0deg)';
        pieceElement.id = pieceData.id;
        pieceElement.dataset.originalIndex = pieceData.originalIndex;

        puzzleArea.appendChild(pieceElement);
        pieceData.rotation = 0;
        pieceData.element = pieceElement;
    }

    if (puzzleAreaId === 'puzzleAreaPage3') checkPuzzleCompletionPage3();
    else checkPuzzleCompletionPage4();
    alert("Puzzle diselesaikan secara otomatis!");
}

// --- Halaman 5: Quiz ---
function setupPage5() {
    const page5Content = `
        <h2>Uji Pemahamanmu: Kuis Citra Digital! 📝</h2>
        <div id="quizContainer"></div>
        <div id="quizFeedback" style="margin-top: 20px; font-weight: bold;"></div>
        <div style="display:flex; justify-content:space-around; margin-top: 30px;">
            <button id="checkQuizBtn">Periksa Jawaban</button>
            <button id="retakeQuizBtn" style="display:none;">Ulangi Kuis</button>
            <button id="backToStartBtn" style="display:none;">Selesai & Kembali ke Awal</button>
        </div>
    `;
    document.getElementById('page-5').innerHTML = page5Content;

    document.getElementById('checkQuizBtn').addEventListener('click', checkQuizAnswers);
    document.getElementById('retakeQuizBtn').addEventListener('click', renderQuizPage5);
    document.getElementById('backToStartBtn').addEventListener('click', () => {
        location.reload(); // Kembali ke page 0 dengan reload
    });
}

function renderQuizPage5() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = ''; // Kosongkan container sebelumnya
    document.getElementById('quizFeedback').innerHTML = ''; // Kosongkan feedback
    document.getElementById('checkQuizBtn').style.display = 'inline-block';
    document.getElementById('retakeQuizBtn').style.display = 'none';
    document.getElementById('backToStartBtn').style.display = 'none';

    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');
        questionDiv.innerHTML = `
            <p><strong>${index + 1}. ${q.question}</strong></p>
            <div class="options-container">
                ${q.options.map((option, optIndex) => `
                    <label>
                        <input type="radio" name="question${index}" value="${option}">
                        ${option}
                    </label><br>
                `).join('')}
            </div>
        `;
        quizContainer.appendChild(questionDiv);
    });
}

function checkQuizAnswers() {
    let score = 0;
    const quizFeedback = document.getElementById('quizFeedback');
    quizFeedback.innerHTML = ''; // Bersihkan feedback lama

    quizQuestions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        const questionDiv = document.querySelectorAll('.quiz-question')[index];
        const optionsContainer = questionDiv.querySelector('.options-container');

        // Reset gaya sebelumnya
        optionsContainer.querySelectorAll('label').forEach(label => {
            label.style.backgroundColor = '';
            label.style.color = '';
        });

        if (selectedOption) {
            if (selectedOption.value === q.answer) {
                score++;
                selectedOption.closest('label').style.backgroundColor = '#d4edda'; // Hijau untuk benar
                selectedOption.closest('label').style.color = '#155724';
            } else {
                selectedOption.closest('label').style.backgroundColor = '#f8d7da'; // Merah untuk salah
                selectedOption.closest('label').style.color = '#721c24';
                // Tampilkan jawaban yang benar
                optionsContainer.querySelectorAll('input').forEach(input => {
                    if (input.value === q.answer) {
                        input.closest('label').style.backgroundColor = '#d4edda'; // Hijau untuk jawaban benar
                        input.closest('label').style.color = '#155724';
                        input.closest('label').style.fontWeight = 'bold'; // Tebalkan jawaban benar
                    }
                });
            }
        } else {
            // Jika tidak ada jawaban dipilih, tandai sebagai salah dan tampilkan jawaban benar
            quizFeedback.innerHTML += `<p>Soal nomor ${index + 1} belum dijawab.</p>`;
            optionsContainer.querySelectorAll('input').forEach(input => {
                if (input.value === q.answer) {
                    input.closest('label').style.backgroundColor = '#d4edda';
                    input.closest('label').style.color = '#155724';
                    input.closest('label').style.fontWeight = 'bold';
                }
            });
        }
    });

    quizFeedback.innerHTML += `<p>Skor Anda: ${score} dari ${quizQuestions.length}</p>`;

    // Sembunyikan tombol "Periksa Jawaban" dan tampilkan tombol "Ulangi Kuis" dan "Selesai"
    document.getElementById('checkQuizBtn').style.display = 'none';
    document.getElementById('retakeQuizBtn').style.display = 'inline-block';
    document.getElementById('backToStartBtn').style.display = 'inline-block';
}