// server/authenticator.js
import express from 'express';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
//const ImageKit = require('imagekit');
//const dotenv = require('dotenv');

// Load environment variables from the parent project's .env file
dotenv.config({ path: '../.env' }); 

const app = express();
const port = 3001; 
const originUrl = 'http://localhost:5173'; // Default Vite port (adjust if yours is different)

// ----------------------------------------------------------------------
// Accessing the private key (NO VITE_ prefix)
// ----------------------------------------------------------------------
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const publicKey = process.env.VITE_IMAGEKIT_PUBLIC_KEY; 
const urlEndpoint = process.env.VITE_IMAGEKIT_URL_ENDPOINT; 

if (!privateKey) {
    console.error("FATAL: IMAGEKIT_PRIVATE_KEY is missing. Check your .env file.");
    process.exit(1);
}

const imagekit = new ImageKit({
  urlEndpoint: urlEndpoint, 
  publicKey: publicKey,
  privateKey: privateKey, // Only accessible here
});

// Configure CORS to allow requests from your local Vite dev server
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", originUrl); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// The ImageKit authenticator endpoint
app.get('/auth', (req, res) => {
    try {
        // Generate the authentication parameters
        const result = imagekit.getAuthenticationParameters();
        res.status(200).send(result);
    } catch (error) {
        console.error("ImageKit authentication error:", error);
        res.status(500).send({ message: "Could not generate authentication parameters." });
    }
});

app.listen(port, () => {
    console.log(`ImageKit Authenticator Server running securely on http://localhost:${port}`);
});
