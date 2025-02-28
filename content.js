document.getElementById("scan-btn").addEventListener("click", () => {
    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url) {
        const url = currentTab.url; // Get the current tab's URL
        console.log("Scanning URL:", url);
  
        // Perform the check (directly in popup or via API call)
        checkWithGoogleSafeBrowsing(url).then((result) => {
          // Display result in the popup
          const statusElement = document.getElementById("status");
          if (result.safe) {
            statusElement.textContent = "This website is safe.";
          } else {
            statusElement.textContent = `Warning! This website may be malicious. Threats detected: ${result.threats.join(", ")}`;
          }
        });
      } else {
        console.error("No active tab or URL found.");
      }
    });
  });
  
  // Function to check a URL with Google Safe Browsing API
  async function checkWithGoogleSafeBrowsing(url) {
    try {
      const apiKey = "AIzaSyDlM74BN50M9PuXRPC_VEuaPVdmDypmg88"; // Replace with your API key
      const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
  
      const requestBody = {
        client: {
          clientId: "your-client-id",
          clientVersion: "1.0",
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      };
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      const threats = data.matches ? data.matches.map((match) => match.threatType) : [];
      return { safe: threats.length === 0, threats };
    } catch (error) {
      console.error("Error checking with Google Safe Browsing API:", error);
      return { safe: false, threats: ["API_ERROR"] };
    }
  }
  