// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [blobURL, setBlobURL] = useState('');

  const generateBlobURL = () => {
    // Create a PDF Blob
    const pdfContent = '<h1>Hello, this is a PDF content!</h1>';
    const blob = new Blob([pdfContent], { type: 'application/pdf' });

    // Generate a Blob URL
    const url = URL.createObjectURL(blob);

    // Update state with the Blob URL
    setBlobURL(url);
  };

  const downloadFile = () => {
    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = blobURL;
    link.download = 'example.pdf'; // The name for the downloaded file
    link.click();
  };

  const openNewTab = () => {
    window.open('http://example.com', '_blank');
  };

  const openAndCloseTab = () => {
    const newTab = window.open('http://example.com', '_blank');
    setTimeout(() => {
      newTab.close();
    }, 3000); // Close the new tab after 3 seconds
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React PDF Blob Example</h1>
      </header>
      <div className="content">
        <button className="menu-btn" onClick={generateBlobURL}>Generate PDF</button>
        <button className="menu-btn" onClick={downloadFile} disabled={!blobURL}>Download PDF</button>
        <button className="menu-btn" onClick={openNewTab}>Open example.com in New Tab</button>
        <button className="menu-btn" onClick={openAndCloseTab}>Open & Close example.com</button>
      </div>
    </div>
  );
}

export default App;
