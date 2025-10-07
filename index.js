require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Function: kono category theke random video nibe
function getRandomVideo(category) {
    const dirPath = path.join(__dirname, 'videos', category);
    if (!fs.existsSync(dirPath)) return null;

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mp4'));
    if (!files.length) return null;

    const randomFile = files[Math.floor(Math.random() * files.length)];
    return `/videos/${category}/${randomFile}`;
}

// Static video serve kora
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// API route: /api/:category
app.get('/api/:category', (req, res) => {
    const { category } = req.params;
    const validCategories = ['sad', 'crush', 'hot', 'islamik'];

    if (!validCategories.includes(category.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid category' });
    }

    const videoPath = getRandomVideo(category.toLowerCase());
    if (!videoPath) return res.status(404).json({ error: 'Ei category te kono video nai' });

    // Video er full URL return kora
    return res.json({ video: `${req.protocol}://${req.get('host')}${videoPath}` });
});

app.listen(PORT, () => {
    console.log(`Server cholche http://localhost:${PORT}`);
});
