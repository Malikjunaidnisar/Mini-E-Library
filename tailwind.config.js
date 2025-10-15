/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode:'class',
  // 1. THIS IS THE ARRAY YOU NEED TO UPDATE
  content: [
  
    "./index.html",             // Scan the main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all files in the src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
