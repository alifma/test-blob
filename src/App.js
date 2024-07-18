import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import "./App.css";

function App() {
  const [blobURL, setBlobURL] = useState("");
  const [formData, setFormData] = useState({ username: "" });
  const [cookieStatus, setCookieStatus] = useState(false);
  const [localStorageStatus, setLocalStorageStatus] = useState(false);
  const [sessionStorageStatus, setSessionStorageStatus] = useState(false);
  const [cacheStatus, setCacheStatus] = useState(null); // null indicates loading state

  useEffect(() => {
    const checkLocalStorageStatus = () => {
      const savedFormData = localStorage.getItem("formData");
      const savedLocalStorage = localStorage.getItem("key");
      console.log("localStorage:", savedLocalStorage, savedFormData);
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
      if (savedLocalStorage) {
        setLocalStorageStatus(true);
      }
    };

    const checkCacheStatus = async () => {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        console.log("caches:", caches, cacheNames);
        if (cacheNames.includes("test-cache")) {
          const cache = await caches.open("test-cache");
          const cachedResponse = await cache.match("/test");
          if (cachedResponse) {
            const responseData = await cachedResponse.json(); // Assuming cached response is JSON data
            setCacheStatus(responseData);
          } else {
            setCacheStatus(null); // No cached response found
          }
        } else {
          setCacheStatus(null); // Cache not found
        }
      }
    };

    checkLocalStorageStatus();
    checkCacheStatus();
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

  const setAllData = () => {
    setCookie();
    setLocalStorageItem();
    setSessionStorageItem();
    setCacheData();
  };

  const clearAllData = () => {
    clearCookie();
    clearLocalStorageItem();
    clearSessionStorageItem();
    clearCacheData();
  };

  const setCookie = () => {
    document.cookie =
      "user=testUser; expires=Fri, 31 Dec 2024 12:00:00 UTC; path=/";
    setCookieStatus(true);
  };

  const clearCookie = () => {
    document.cookie =
      "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    setCookieStatus(false);
  };

  const setLocalStorageItem = () => {
    localStorage.setItem("key", "value");
    setLocalStorageStatus(true);
  };

  const clearLocalStorageItem = () => {
    localStorage.removeItem("key");
    localStorage.removeItem("formData");
    setLocalStorageStatus(false);
  };

  const setSessionStorageItem = () => {
    sessionStorage.setItem("sessionKey", "sessionValue");
    setSessionStorageStatus(true);
  };

  const clearSessionStorageItem = () => {
    sessionStorage.removeItem("sessionKey");
    setSessionStorageStatus(false);
  };

  const setCacheData = async () => {
    if ("caches" in window) {
      const cache = await caches.open("test-cache");
      await cache.add(new Request("/test"));
      setCacheStatus({ exampleData: "some value" }); // Set example data to cache
    }
  };

  const clearCacheData = async () => {
    if ("caches" in window) {
      await caches.delete("test-cache");
      setCacheStatus(null);
    }
  };

  const getStatusColor = (status) => (status ? "green" : "red");

  return (
    <div className="App">
      <header className="App-header">
        <h1>React PDF Blob Example</h1>
      </header>
      <div className="content">
        <div className="column">
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
        </div>
        <div className="column">
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
          <h2>Browser Data Management</h2>
          <div>
            <button className="menu-btn" onClick={setAllData}>
              Set All Data
            </button>
            <button className="menu-btn" onClick={clearAllData}>
              Clear All Data
            </button>
          </div>
          <div>
            <p style={{ color: getStatusColor(sessionStorageStatus) }}>
              Session Storage Status: {sessionStorageStatus ? "Set" : "Not Set"}
            </p>
            <p style={{ color: getStatusColor(cookieStatus) }}>
              Cookie Status: {cookieStatus ? "Set" : "Not Set"}
            </p>
            <p style={{ color: getStatusColor(cacheStatus !== null) }}>
              Cache Status: {cacheStatus !== null ? "Stored: " + JSON.stringify(cacheStatus) : "Not Set"}
            </p>
            <p style={{ color: getStatusColor(localStorageStatus) }}>
              Local Storage Status: {localStorageStatus ? "Set" : "Not Set"}
            </p>
          </div>
          <div>
            <button className="menu-btn" onClick={clearCookie}>
              Clear Cookie
            </button>
            <button className="menu-btn" onClick={clearLocalStorageItem}>
              Clear Local Storage
            </button>
            <button className="menu-btn" onClick={clearSessionStorageItem}>
              Clear Session Storage
            </button>
            <button className="menu-btn" onClick={clearCacheData}>
              Clear Cache Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
