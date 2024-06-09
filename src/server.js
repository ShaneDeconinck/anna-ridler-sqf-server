const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Define the start and end dates
const startDate = new Date('2024-06-09');
const endDate = new Date('2032-06-09');

// Function to calculate opacity values based on the current date
const calculateOpacity = () => {
    const currentDate = new Date();
    const totalDuration = endDate - startDate;
    const elapsedDuration = currentDate - startDate;

    // Calculate progress ensuring it is between 0 and 1
    let progress = elapsedDuration / totalDuration;
    progress = Math.max(0, Math.min(1, progress));

    const opacityFade = (1 - progress).toFixed(2);
    const opacityImage = progress.toFixed(2);

    return { opacityFade, opacityImage };
};

// Route handler for SVG files
app.get('/:file.svg', (req, res) => {
    const { file } = req.params;
    const validFiles = ['i', 'ii', 'iii'];

    if (!validFiles.includes(file)) {
        return res.status(404).send('File not found.');
    }

    const svgPath = path.join(__dirname, '../images', `${file}.svg`);

    fs.readFile(svgPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading SVG file.');
        }

        const { opacityFade, opacityImage } = calculateOpacity();

        // Create new style definitions
        const modifiedSvg = data
            .replace(/\.cls-8\s*\{[^\}]*\}/g, `.cls-8 { opacity: ${opacityImage}; }`)
            .replace(/\.cls-9\s*\{[^\}]*\}/g, `.cls-9 { opacity: ${opacityFade}; }`);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(modifiedSvg);
    });
});

// Route handler for the quote
app.get('/', (req, res) => {
    const quote = "Amid the digital realm, where pixels shift and images fade, lies the paradox of eternity. One image dims, losing its clarity, while another brightens, ascending into focus. In this dance of opposites, we find a reflection of our own existence—an endless interplay of becoming and unbecoming, forever etched in the binary flow.";
    res.send(quote);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
