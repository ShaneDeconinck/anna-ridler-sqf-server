const express = require('express');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');

const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache TTL set to 1 hour

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

    // Check if the SVG is in the cache
    const cachedSvg = cache.get(file);
    if (cachedSvg) {
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.send(cachedSvg);
    }

    const svgPath = path.join(__dirname, '../images', `${file}.svg`);

    const { opacityFade, opacityImage } = calculateOpacity();

    let buffer = '';
    let stylesModified = false;

    const readStream = fs.createReadStream(svgPath, { encoding: 'utf8' });

    readStream.on('data', (chunk) => {
        if (!stylesModified) {
            buffer += chunk;
            const styleEndIndex = buffer.indexOf('</style>');

            if (styleEndIndex !== -1) {
                const styleSection = buffer.substring(0, styleEndIndex + 8);
                const restOfFile = buffer.substring(styleEndIndex + 8);

                const modifiedStyleSection = styleSection
                    .replace(/\.cls-8\s*\{[^\}]*\}/, `.cls-8 { opacity: ${opacityFade}; }`)
                    .replace(/\.cls-9\s*\{[^\}]*\}/, `.cls-9 { opacity: ${opacityImage}; }`);

                buffer = modifiedStyleSection + restOfFile;
                stylesModified = true;
            }
        } else {
            buffer += chunk;
        }
    });

    readStream.on('end', () => {
        if (!stylesModified) {
            // If styles were not found and modified
            buffer = buffer
                .replace(/\.cls-8\s*\{[^\}]*\}/, `.cls-8 { opacity: ${opacityImage}; }`)
                .replace(/\.cls-9\s*\{[^\}]*\}/, `.cls-9 { opacity: ${opacityFade}; }`);
        }

        // Cache the modified SVG content
        cache.set(file, buffer);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(buffer);
    });

    readStream.on('error', (err) => {
        res.status(500).send('Error reading SVG file.');
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
