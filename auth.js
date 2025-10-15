// This file will be automatically deployed as a Vercel Serverless Function (API Route)
import ImageKit from 'imagekit';

// Initialize ImageKit using the private key from Vercel's environment variables
// This code only runs on the secure serverless function, not the client.
const imagekit = new ImageKit({
    //publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC,
    publicKey: "public_ng3KPDlpDwc+nbbnghHu9vvWx9g=",
   // privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // The secret key
    privateKey: "private_t6b9WavQDk+jfEijL1dFQTyywAM=", // The secret key
    urlEndpoint: "https://ik.imagekit.io/Saya1train",
    //urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export default function handler(req, res) {
    // Only allow GET requests for security
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Generate the signature, token, and expiry required for client-side upload
        const authenticationParameters = imagekit.getAuthenticationParameters();

        // Send the parameters back to the client
        res.status(200).json(authenticationParameters);
    } catch (error) {
        console.error('ImageKit Authentication Error:', error);
        res.status(500).json({ error: 'Failed to generate authentication parameters' });
    }
}
