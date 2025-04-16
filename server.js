const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Load the script index (you might have this in a separate file, like a JSON file)
const scriptIndex = require('./script_index.json');

// Serve static files (for HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Search endpoint
app.get('/search', (req, res) => {
  const query = req.query.query?.toLowerCase() || ''; // Get the search query

  if (!query) {
    return res.json([]);  // If no query, return empty array
  }

  // Filter scripts by game name or script name (case-insensitive)
  const filteredScripts = scriptIndex.filter(script =>
    script.name.toLowerCase().includes(query) ||  // Check the name for the query
    (script.snippet && script.snippet.toLowerCase().includes(query)) // Check the snippet if exists
  );

  // Format the filtered scripts and include the full snippet with 'loadstring'
  const result = filteredScripts.map(script => ({
    name: script.name,
    snippet: script.snippet // Display the full snippet, including loadstring
  }));

  return res.json(result); // Return filtered and formatted scripts
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
