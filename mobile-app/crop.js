const Jimp = require('jimp');

async function cropImage() {
    try {
        const imagePath = './assets/images/nsm_logo_shark.png';
        const image = await Jimp.read(imagePath);
        
        console.log('Original size:', image.bitmap.width, 'x', image.bitmap.height);
        
        // autocrop removes borders of a single color (or transparent)
        image.autocrop();
        
        console.log('Cropped size:', image.bitmap.width, 'x', image.bitmap.height);
        
        await image.writeAsync(imagePath);
        console.log('Image cropped successfully.');
    } catch (error) {
        console.error('Error cropping image:', error);
    }
}

cropImage();
