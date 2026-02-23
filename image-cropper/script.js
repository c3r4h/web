let cropper;

function onImageUpload() {
    const imageDefault = document.getElementById('imageDefault');
    imageDefault.style.display = 'none';
    
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    const fileInput = document.getElementById('uploadImage');
    const file = fileInput.files[0];

    const result = document.getElementById('result');
    const imageElement = document.getElementById('image');

    if (!file) {
        alert('Please select an image file first.');
        imageDefault.style.display = 'block';
        loader.style.display = 'none';
    }

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            result.style.display = 'block';
            loader.style.display = 'none';
            
            imageElement.src = e.target.result;
            imageElement.onload = function () {
                initializeCropper();
            };
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file first.');
        imageDefault.style.display = 'block';
        loader.style.display = 'none';
    }
}

function initializeCropper() {
    const imageElement = document.getElementById('image');

    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(imageElement, {
        viewMode: 1,
        movable: true,
        scalable: true,
        zoomable: true,
        cropBoxResizable: true,
        aspectRatio: null // Default free
    });
}

function setSquareCrop() {
    if (cropper) {
        cropper.setAspectRatio(1);
    }
}

function setFreeCrop() {
    if (cropper) {
        cropper.setAspectRatio(NaN);
    }
}

function downloadCroppedImage() {
    const canvas = cropper.getCroppedCanvas();
    const croppedImage = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = croppedImage;
    link.download = "cropped-image." + generateFileName() + ".png";
    link.click();
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