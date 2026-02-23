async function doGenerate() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';

    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.src = '';

    const url = getRandomImage();
    uploadedImage.src = url;
    generateColorPaletteUrl(url);
}

doGenerate();

function getRandomImage() {
    const urlArray = [
        "1560487765-67095b892dd1",
        "1579205149708-f5b24c5a04e5",
        "1517924030062-84f2c8f0784e",
        "1482849297070-f4fae2173efe",
        "1487376480913-24046456a727",
        "1481456384069-0effc539ab7e",
        "1524678714210-9917a6c619c2",
        "1484755560615-a4c64e778a6c",
        "1515442304705-de3793c6cce0",
        "1432139555190-58524dae6a55",
        
    ];
    const randomIndex = Math.floor(Math.random() * urlArray.length);
    return "/assets/img/photo-" + urlArray[randomIndex] + ".jpeg";
}

function getRandomImageDirect() {
    const urlArray = [
        "1560487765-67095b892dd1",
        "1579205149708-f5b24c5a04e5",
        "1517924030062-84f2c8f0784e",
        "1482849297070-f4fae2173efe",
        "1487376480913-24046456a727",
        "1481456384069-0effc539ab7e",
        "1524678714210-9917a6c619c2",
        "1484755560615-a4c64e778a6c",
        "1515442304705-de3793c6cce0",
        "1432139555190-58524dae6a55",
        
    ];
    const randomIndex = Math.floor(Math.random() * urlArray.length);
    return "https://images.unsplash.com/photo-" + urlArray[randomIndex] + "?w=800&h=550&fm=jpg&fit=crop&q=60";
}

async function doUpload() {
    const fileInput = document.getElementById('imageInput');
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        const uploadedImage = document.getElementById('uploadedImage');
        uploadedImage.style.opacity = '0';

        const colorPalette = document.getElementById('colorPalette');
        colorPalette.style.opacity = '0';
        colorPalette.innerHTML = '';

        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage.src = e.target.result;
            uploadedImage.onload = function () {
                generateColorPalette(uploadedImage);
            };
        }
        reader.readAsDataURL(selectedFile);
    } else {
        alert('Please select an image file first.');
    }
}

async function generateColorPalette(image) {
    const vibrant = new Vibrant(image);
    var swatches = vibrant.swatches();
    for (var swatch in swatches) {
        if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
            var color = swatches[swatch].getHex();
            generateColorBox(color);
        }
    }

    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.style.opacity = '1';

    const colorPalette = document.getElementById('colorPalette');
    colorPalette.style.opacity = '1';

    const loader = document.getElementById('loader');
    loader.style.display = 'none';
}

async function generateColorPaletteUrl(url) {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.style.opacity = '0';

    const colorPalette = document.getElementById('colorPalette');
    colorPalette.style.opacity = '0';
    colorPalette.innerHTML = '';

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = function () {
        const vibrant = new Vibrant(img);
        const swatches = vibrant.swatches();
        for (var swatch in swatches) {
            if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
            var color = swatches[swatch].getHex();
            generateColorBox(color);
            }
        }

        uploadedImage.src = url;
        uploadedImage.style.opacity = '1';
        colorPalette.style.opacity = '1';
        loader.style.display = 'none';

        img.remove();
    };
}

async function generateColorBox(color) {
    var colorBox = document.createElement('div');
    colorBox.className = 'color-box flex-1 flex items-center justify-center text-white text-xs';
    colorBox.style.backgroundColor = color;
    colorBox.textContent = color;
    colorPalette.appendChild(colorBox);
}