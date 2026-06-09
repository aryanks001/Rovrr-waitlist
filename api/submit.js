export default async function handler(req, res) {
  // Allow cross-origin requests just in case
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle preflight checks
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ensure it's a POST request
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Read the hidden environment variable securely
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  if (!GOOGLE_SCRIPT_URL) {
    console.error("Missing GOOGLE_SCRIPT_URL environment variable.");
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    // Convert the incoming data safely to URL params
    const params = new URLSearchParams(req.body).toString();

    // Send the data securely to Google from the Vercel backend
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    // Pass the Google response back to the frontend
    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error("Error communicating with database:", error);
    res.status(500).json({ error: 'Failed to communicate with database' });
  }
}
