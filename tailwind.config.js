/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxHeight: {
        120: "60vh",
        "100%": "100%",
        "30vh": "30vh",
      },
      minHeight: {
        "10vh": "12vh",
      },
      height: {
        "85%": "85%",
        "15%": "15%",
      },
      width: {
        "50vw": "50vw",
        "10vw": "10vw",
        "79.71%": "79.71%",
        "20.29%": "20.29%",
      },
      backgroundColor: {
        "gray-800": "rgba(52,53,65,1)",
        "vert-light-gradient": "linear-gradient(180deg,hsla(0,0%,100%,0) 13.94%,#fff 54.73%)",
      },
      backgroundImage:{
        "vert-light-gradient": "linear-gradient(180deg,hsla(0,0%,100%,0) 13.94%,#fff 54.73%)",
      }
    },
  },
  plugins: [],
};
