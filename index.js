

async function fetchData() {
    
    const url = 'https://web-security-guard.p.rapidapi.com/api/v1/WebsiteSecurity?url=https%3A%2F%2Fwww.google.com';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '6560efcc75msh0e341e776b6b802p17a304jsn31d3a31eac34',
            'x-rapidapi-host': 'web-security-guard.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

fetchData();  