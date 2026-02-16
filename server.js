const express = require("express");
const app = express();

const { readEmployees } = require("./modules/filehandler");

const PORT = 3000;

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
})