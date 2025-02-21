import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [inputData, setInputData] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown container

  // Handle input change
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle filter selection
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedFilters([...selectedFilters, value]);
    } else {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
    }
  };

  // Handle filter removal
  const handleRemoveFilter = (filterToRemove) => {
    setSelectedFilters(
      selectedFilters.filter((filter) => filter !== filterToRemove)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate JSON input
    try {
      const parsedData = JSON.parse(inputData);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid input. 'data' must be an array.");
      }
    } catch (err) {
      setError("Invalid JSON input. Please check your input.");
      return;
    }

    // Call the backend API
    try {
      const apiResponse = await fetch(
        "https://bajaj-anisha.onrender.com/bfhl",
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
    } catch (err) {
      setError("An error occurred while processing the request.");
    }
  };

  // Render filtered response
  const renderFilteredResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_alphabet } = response;

    return (
      <div className="response">
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false); // Close the dropdown
      }
    };

    // Add event listener when the dropdown is open
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="App">
      <h1>22BCS10853</h1> {/* Replace with your roll number */}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="json-input">Enter JSON Data:</label>
          <textarea
            id="json-input"
            value={inputData}
            onChange={handleInputChange}
            placeholder='Example: { "data": ["M", "1", "334", "4", "B"] }'
            rows={5}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {response && (
        <div className="filters">
          <h3>Filters</h3>
          <div className="multi-select" ref={dropdownRef}>
            <div
              className="selected-filters"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedFilters.length > 0 ? (
                selectedFilters.map((filter) => (
                  <div key={filter} className="filter-chip">
                    {filter}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent dropdown from opening
                        handleRemoveFilter(filter);
                      }}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <span>Select filters</span>
              )}
            </div>
            {isDropdownOpen && (
              <div className="dropdown">
                <label>
                  <input
                    type="checkbox"
                    value="numbers"
                    checked={selectedFilters.includes("numbers")}
                    onChange={handleFilterChange}
                  />
                  Numbers
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="alphabets"
                    checked={selectedFilters.includes("alphabets")}
                    onChange={handleFilterChange}
                  />
                  Alphabets
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="highest_alphabet"
                    checked={selectedFilters.includes("highest_alphabet")}
                    onChange={handleFilterChange}
                  />
                  Highest Alphabet
                </label>
              </div>
            )}
          </div>
        </div>
      )}
      {response && renderFilteredResponse()}
    </div>
  );
}

export default App;
