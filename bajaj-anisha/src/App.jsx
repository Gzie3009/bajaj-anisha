import React, { useState } from "react";
import "./App.css"; // For updated styling

function App() {
  const [inputData, setInputData] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle filter selection
  const handleFilterChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedFilters(selected);
  };

  // Handle filter removal
  const handleDeleteFilter = (filterToDelete) => () => {
    setSelectedFilters((filters) =>
      filters.filter((filter) => filter !== filterToDelete)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedData = JSON.parse(inputData);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid input. 'data' must be an array.");
      }
    } catch (err) {
      setError("Invalid JSON input. Please check your input.");
      alert("Invalid JSON input. Please check your input.");
      return;
    }

    try {
      const apiResponse = await fetch(
        "https://bajaj-backend-bram.onrender.com/bfhl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: inputData,
        }
      );

      if (!apiResponse.ok) {
        throw new Error("Failed to fetch data from the API.");
      }

      const data = await apiResponse.json();
      setResponse(data);
      setError("");
      alert("Data processed successfully!");
    } catch (err) {
      setError("An error occurred while processing the request.");
      alert("An error occurred while processing the request.");
    }
  };

  // Render filtered response
  const renderFilteredResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_alphabet } = response;

    return (
      <div className="response-container">
        {selectedFilters.includes("numbers") && (
          <p>
            <strong>Numbers:</strong> {numbers.join(", ")}
          </p>
        )}
        {selectedFilters.includes("alphabets") && (
          <p>
            <strong>Alphabets:</strong> {alphabets.join(", ")}
          </p>
        )}
        {selectedFilters.includes("highest_alphabet") && (
          <p>
            <strong>Highest Alphabet:</strong> {highest_alphabet.join(", ")}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <h1 className="title">22bcs10998</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="json-input" className="label">
          Enter JSON Data:
        </label>
        <input
          id="json-input"
          value={inputData}
          onChange={handleInputChange}
          placeholder='Example: { "data": ["M", "1", "334", "4", "B"] }'
          className="input"
        />
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {response && (
        <div className="filters">
          <h3 className="filters-title">Select Filters:</h3>
          <select
            multiple
            value={selectedFilters}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="numbers">Numbers</option>
            <option value="alphabets">Alphabets</option>
            <option value="highest_alphabet">Highest Alphabet</option>
          </select>

          <div className="selected-filters">
            {selectedFilters.map((filter) => (
              <span key={filter} className="filter-chip">
                {filter}
                <button onClick={handleDeleteFilter(filter)}>x</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {response && renderFilteredResponse()}
    </div>
  );
}

export default App;
