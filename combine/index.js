const fs = require("fs");

// Load the JSON files
const subjectMap = JSON.parse(fs.readFileSync("subjectMap.json", "utf8"));
const uniqueCourseCodes = JSON.parse(
  fs.readFileSync("unique_course_codes.json", "utf8")
);

// Create a Map to tally the counts by course code
const courseCodeMap = new Map();

// Function to normalize subject names (to lowercase and trim spaces)
const normalize = (str) => str.toLowerCase().trim();

// Loop through the subjectMap and match against unique_course_codes
subjectMap.forEach((subjectObj) => {
  const subjectName = Object.keys(subjectObj)[0];
  const subjectCount = subjectObj[subjectName];

  // Find the matching course code
  uniqueCourseCodes.forEach((codeObj) => {
    const normalizedKey = normalize(Object.keys(codeObj)[0]);

    if (normalize(subjectName) === normalizedKey) {
      const courseCode = codeObj[normalizedKey];

      // Tally the count in courseCodeMap
      if (courseCodeMap.has(courseCode)) {
        courseCodeMap.set(
          courseCode,
          courseCodeMap.get(courseCode) + subjectCount
        );
      } else {
        courseCodeMap.set(courseCode, subjectCount);
      }
    }
  });
});

// Convert the courseCodeMap to an array of objects
const resultArray = Array.from(courseCodeMap, ([courseCode, total]) => ({
  [courseCode]: total,
}));

// Save the result to a new JSON file
fs.writeFileSync(
  "tallied_course_codes.json",
  JSON.stringify(resultArray, null, 2)
);

console.log("Tallied course codes saved to tallied_course_codes.json");
