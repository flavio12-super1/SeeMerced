const fs = require("fs");

// Load the JSON data
const data = JSON.parse(fs.readFileSync("course_codes.json", "utf8"));

// Create a set to track unique subjects
const uniqueSubjects = new Set();

// Array to hold the unique items
const uniqueArray = [];

// Iterate through the JSON array
data.forEach((item) => {
  const key = Object.keys(item)[0]; // Get the subject name (e.g., "anthropology")
  const value = item[key]; // Get the code (e.g., "ANTH")

  // Create a unique identifier string
  const uniqueIdentifier = `${key}:${value}`;

  // Check if the unique identifier is already in the set
  if (!uniqueSubjects.has(uniqueIdentifier)) {
    uniqueSubjects.add(uniqueIdentifier); // Add to the set
    uniqueArray.push(item); // Add to the unique array
  }
});

// Save the unique array to a new JSON file
fs.writeFileSync(
  "unique_course_codes.json",
  JSON.stringify(uniqueArray, null, 2),
  "utf8"
);

console.log("Unique JSON array saved to unique_course_codes.json");
