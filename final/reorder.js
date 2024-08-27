const fs = require("fs");

// Load the JSON data
const data = JSON.parse(fs.readFileSync("tallied_course_codes.json", "utf8"));

// Sort the array by the values (largest to smallest)
const sortedData = data.sort((a, b) => {
  const valueA = Object.values(a)[0];
  const valueB = Object.values(b)[0];
  return valueB - valueA;
});

// Save the sorted array to a new JSON file
fs.writeFileSync(
  "sorted_course_codes.json",
  JSON.stringify(sortedData, null, 2),
  "utf8"
);

console.log("Sorted JSON array saved to sorted_course_codes.json");
