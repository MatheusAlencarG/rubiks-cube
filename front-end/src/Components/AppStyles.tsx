import React from 'react';

// Document-wide styles also cover content rendered outside the main page layout.
const documentStyles = `
  :root {
    --black: #151513;
    --white: #242420;
    --ink: #f5f5f5;
    --on-canvas: #f5f5f5;
    --on-accent: #151513;
    --primary-color: #d7fa19;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
      'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--black);
    color: var(--ink);
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) var(--white);
  }

  *::-webkit-scrollbar {
    width: 10px;
  }

  *::-webkit-scrollbar-track {
    border-radius: 5px;
    background-color: #c2c2ae;
  }

  *::-webkit-scrollbar-track:hover,
  *::-webkit-scrollbar-track:active {
    background-color: #747468;
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: var(--primary-color);
  }
`;

export default function AppStyles() {
  return <style>{documentStyles}</style>;
}
