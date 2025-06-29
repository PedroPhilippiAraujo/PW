// index.js (or app.js)
require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const app = express();

const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
const port = process.env.PORT || 3000;

console.log(`API Key: ${huggingFaceApiKey}`); // This will log your key
console.log(`Server running on port ${port}`);

// Your server-side logic using the variables
// ...

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});