function doCopy() {
    const codeTextArea = document.getElementById('codeTextArea');
    codeTextArea.select();
    codeTextArea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Kode HTML berhasil disalin!');
};

async function doAction() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const previewDiv = document.getElementById('previewUpload');
                previewDiv.innerHTML = `<img loading="lazy" src="${e.target.result}" alt="Uploaded Image" width="64" height="64" />`;

                const downloadButton = document.getElementById('downloadBtn');
                downloadButton.style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file first.');
    }
}

async function createFaviconICO(img, zip, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sizes = [16, 32, 48];
    const icoImages = [];

    let completedImages = 0;

    sizes.forEach(size => {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(function (blob) {
            icoImages.push(blob);
            completedImages++;

            if (completedImages === sizes.length) {
                createICOFile(icoImages, zip);
                callback();
            }
        }, 'image/png');
    });
}

async function createICOFile(icoImages, zip) {
    const icoBlob = new Blob(icoImages, { type: 'image/x-icon' });
    zip.file('favicon.ico', icoBlob);
}

async function downloadAllFavicon() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const appleIconSize = 180;
    const androidIconSizes = [192, 512];
    const msTileSize = 150;

    const zip = new JSZip();
    const img = document.querySelector('#previewUpload img');
    if (!img) return;

    canvas.width = appleIconSize;
    canvas.height = appleIconSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function (blob) {
        zip.file(`apple-touch-icon.png`, blob);

        androidIconSizes.forEach(androidSize => {
            canvas.width = androidSize;
            canvas.height = androidSize;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function (blob) {
                zip.file(`android-chrome-${androidSize}x${androidSize}.png`, blob);
                if (androidSize === androidIconSizes[androidIconSizes.length - 1]) {
                    canvas.width = msTileSize;
                    canvas.height = msTileSize;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(function (blob) {
                        zip.file(`mstile-150x150.png`, blob);
                        createFaviconICO(img, zip, function () {
                            zip.generateAsync({ type: 'blob' }).then(function (content) {
                                saveAs(content, "favicon-" + generateFileName() + ".zip");
                            });
                        });
                    }, 'image/png');
                }
            }, 'image/png');
        });
    }, 'image/png');
}

function generateFileName() {
    const now = new Date();

    // Format: YYYY-MM-DD_HH-MM-SS
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}