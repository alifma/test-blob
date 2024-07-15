import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import "./App.css";

function App() {
  const [blobURL, setBlobURL] = useState("");
  const [formData, setFormData] = useState({ username: "" });

  useEffect(() => {
    document.cookie =
      "user=testUser; expires=Fri, 31 Dec 2024 12:00:00 UTC; path=/";
    localStorage.setItem("key", "value");
    sessionStorage.setItem("sessionKey", "sessionValue");
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const generateBlobURL = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText("Hello, this is a PDF content!", {
      x: 50,
      y: 350,
      size: 20,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    setBlobURL(url);
  };

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = "example.pdf";
    link.click();
  };

  const openNewTab = () => {
    const newTab = window.open(blobURL, "_blank");
    if (newTab) {
      newTab.focus();
    } else {
      alert("Please allow popups for this website");
    }
  };

  const openAndCloseTab = () => {
    const newTab = window.open(window.location.href, "_blank");
    setTimeout(() => {
      newTab.close();
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("formData", JSON.stringify(formData));
    alert("Form data saved!");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React PDF Blob Example</h1>
      </header>
      <div className="content">
        <button className="menu-btn" onClick={generateBlobURL}>
          Generate PDF
        </button>
        <button className="menu-btn" onClick={downloadFile} disabled={!blobURL}>
          Download PDF
        </button>
        <button className="menu-btn" onClick={openNewTab} disabled={!blobURL}>
          Open PDF in New Tab
        </button>
        <button className="menu-btn" onClick={openAndCloseTab}>
          Open & Close Current Tab
        </button>
        <button
          className="menu-btn"
          onClick={() => window.open(window.location.href, "_blank")}
        >
          Open Current Page in New Tab
        </button>
        {blobURL && (
          <div>
            <h2>Embedded PDF</h2>
            <iframe
              src={blobURL}
              title="PDF Content"
              width="600"
              height="400"
            />
          </div>
        )}
        <div>
          <h2>Sample Form</h2>
          <form onSubmit={handleFormSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                autoComplete="username"
              />
            </label>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
