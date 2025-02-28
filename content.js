document.getElementById("scan-btn").addEventListener("click", () => {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url) {
        const url = currentTab.url; // Get the URL of the active tab
        console.log("Scanning URL:", url);
        
        // Call the Safe Browsing API
        const result = await checkWithGoogleSafeBrowsing(url);
  
        // Update the popup UI with the result
        const statusElement = document.getElementById("status");
        if (result.safe) {
          statusElement.textContent = "This website is safe.";
        } else {
          statusElement.textContent = `Warning! This website may be malicious. Threats detected: ${result.threats.join(", ")}`;
        }
      } else {
        console.error("No active tab or URL found.");
      }
    });
  });
  
  // Function to check a URL with Google Safe Browsing API
  async function checkWithGoogleSafeBrowsing(url) {
    try {
      // Replace with your Google API key
      const apiKey = "AIzaSyDlM74BN50M9PuXRPC_VEuaPVdmDypmg88";
      const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
  
      // Request payload as per API specs
      const requestBody = {
        client: {
          clientId: "your-client-id", // Optional client ID
          clientVersion: "1.0"
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }]
        }
      };
  
      // Send the request to Google Safe Browsing API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
  
      const data = await response.json();
  
      // Determine if any threats were detected
      const threats = data.matches ? data.matches.map(match => match.threatType) : [];
      return { safe: threats.length === 0, threats };
    } catch (error) {
      console.error("Error checking with Google Safe Browsing API:", error);
      return { safe: false, threats: ["API_ERROR"] };
    }
  }
  