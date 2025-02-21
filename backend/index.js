const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000; // Directly set the port

app.use(cors());
app.use(bodyParser.json());

// POST endpoint: /bfhl
app.post("/bfhl", (req, res) => {
  try {
    const user_id = "anisha_kumari_22bcs10853";
    const email = "22bcs10853@gmail.com";
    const roll_number = "22bcs10853";

    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid input. 'data' must be an array.",
      });
    }

    // Separate numbers and alphabets
    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));

    // Find the highest alphabet (case insensitive)
    let highest_alphabet = [];
    if (alphabets.length > 0) {
      highest_alphabet = [
        alphabets.reduce((a, b) => (a.toLowerCase() > b.toLowerCase() ? a : b)),
      ];
    }

    // Prepare the response
    const response = {
      is_success: true,
      user_id,
      email,
      roll_number,
      numbers,
      alphabets,
      highest_alphabet,
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error: "An error occurred while processing the request.",
    });
  }
});

// GET endpoint: /bfhl
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Backend Running" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
