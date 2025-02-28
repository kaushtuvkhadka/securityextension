document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("scan-btn").addEventListener("click", scanWebsite);
    document.getElementById("close-btn").addEventListener("click", () => window.close());
});

async function scanWebsite() {
    const statusElement = document.getElementById("status");
    statusElement.textContent = "Scanning...";
    console.log("Scanning website...");
    // Ensure we query the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs.length === 0) {
            console.error("No active tab found.");
            statusElement.textContent = "Error: No active tab.";
            return;
        }

        const currentTab = tabs[0];
        if (!currentTab.url) {
            console.error("No URL found for the active tab.");
            statusElement.textContent = "Error: No URL detected.";
            return;
        }

        const url = currentTab.url;
        console.log("Scanning URL:", url);

        try {
            const result = await checkWithGoogleSafeBrowsing(url);
            if (result.safe) {
                statusElement.textContent = "✅ This website is safe.";
            } else {
                statusElement.textContent = `⚠️ Warning! This site may be malicious.\nThreats: ${result.threats.join(", ")}`;
            }
        } catch (error) {
            console.error("Error during site scanning:", error);
            statusElement.textContent = "Error checking site safety.";
        }
    });
}

async function checkWithGoogleSafeBrowsing(url) {
    try {
        const apiKey = "AIzaSyDlM74BN50M9PuXRPC_VEuaPVdmDypmg88";  // Replace with a valid key
        const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

        const requestBody = {
            client: {
                clientId: "your-client-id",
                clientVersion: "1.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url }]
            }
        };

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const threats = data.matches ? data.matches.map(match => match.threatType) : [];

        return { safe: threats.length === 0, threats };
    } catch (error) {
        console.error("Error checking with Google Safe Browsing API:", error);
        return { safe: false, threats: ["API_ERROR"] };
    }
}
