// src/App.js
import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import './App.css';

function App() {
  const [blobURL, setBlobURL] = useState('');

  const generateBlobURL = async () => {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    // Draw text on the page
    page.drawText('Hello, this is a PDF content!', {
      x: 50,
      y: 350,
      size: 20,
      color: rgb(0, 0, 0),
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Create a Blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

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
        {blobURL && (
          <div>
            <h2>Embedded PDF</h2>
            <iframe src={blobURL} title="PDF Content" width="600" height="400" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
