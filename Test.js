// In a React component or utility file

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const authUrl = import.meta.env.VITE_AUTHENTICATOR_URL;

// Example usage:
const authenticator = async () => {
  const response = await fetch(authUrl); 
  // ... rest of the logic
};
