const Jimp = require('jimp');

async function processImage() {
    try {
        const imagePath = './assets/images/nsm_logo_shark.png';
        const image = await Jimp.read(imagePath);
        console.log('Original size:', image.bitmap.width, 'x', image.bitmap.height);
        
        // Find the checkerboard colors from the top-left edge
        let bgColors = new Set();
        // The first 20x20 pixels should definitely contain both checkerboard colors 
        // if it's a standard fake transparent png
        for (let x = 0; x < Math.min(80, image.bitmap.width); x++) {
            for (let y = 0; y < Math.min(80, image.bitmap.height); y++) {
                bgColors.add(image.getPixelColor(x, y));
            }
        }
        
        const colorsArray = Array.from(bgColors);
        console.log("Found edge colors:", colorsArray.map(c => c.toString(16)));
        
        // We will treat these edge colors as the background, and set their alpha to 0
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const hex = image.getPixelColor(x, y);
            if (bgColors.has(hex)) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0
            }
        });
        
        image.autocrop(); // Automatically crop the empty space
        await image.writeAsync('./assets/images/nsm_logo_shark.png');
        console.log('Cleaned and cropped image saved.');
    } catch (error) {
        console.error('Error:', error);
    }
}

processImage();
