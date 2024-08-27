const fs = require("fs");
const iconv = require("iconv-lite");
const csv = require("csv-parser");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

// Path to your CSV file
const csvFilePath = "sample.csv";

// Object to store records by subject
// Create an array to hold the JSON objects
const jsonArray = [];
const subjectMap = new Map([]);
const uniqueSubjects = new Set([]);
const uniqueClasses = new Set([]);
// // Function to clean and normalize subject names
function cleanSubjectName(subject) {
  return subject
    .split(" ")
    .slice(0, -1)
    .join(" ")
    .replace(/[\r\n\u200B]/g, "")
    .trim();
}

function cleanClassName(className) {
  return className.replace(/[\r\n\u200B]/g, "").trim();
}

// Create the read stream
(async () => {
  fs.createReadStream(csvFilePath)
    .pipe(iconv.decodeStream("utf8")) // Decode the UTF-16 LE stream to UTF-8
    .pipe(csv())
    .on("data", (row) => {
      Object.keys(row).forEach((key) => {
        row[key] = row[key].replace(/"/g, ""); // Remove quotation marks
      });

      //const courseName = row["course_name"].split(" ")[0];
      // const courseName = cleanSubjectName(row["course_name"].split(" ")[0]);
      // const courseName = cleanSubjectName(
      //   row["course_name"].replace(/\s\d+$/, "")
      // );
      // const courseName = cleanSubjectName(
      //   row["course_name"].split(" ").slice(0, -1).join(" ")
      // );
      const courseName = cleanSubjectName(row["course_name"]);

      const description = row["description"];

      if (!uniqueClasses.has(cleanClassName(row["course_name"]))) {
        uniqueClasses.add(cleanClassName(row["course_name"]));
      }

      if (description === "Number of Records") {
        for (let grade in row) {
          const value = parseInt(row[grade], 10);
          if (!isNaN(value)) {
            //console.log(value);
            if (!subjectMap.has(courseName)) {
              //console.log(`${courseName} is not in the set.`);

              subjectMap.set(courseName, value);
              uniqueSubjects.add(courseName);
              //console.log(subjectMap);
            } else {
              count = subjectMap.get(courseName);
              subjectMap.set(courseName, count + value);
              //console.log(`${courseName} is in the set.`);
              //console.log(subjectMap);
            }
          }
        }
      }
    })
    .on("end", () => {
      console.log("CSV processing completed.");
      //   console.log("Subjects and their total records:", subjects);

      // Create a pie chart with the results
      console.log(subjectMap);

      // Loop through the subjectMap and create the JSON objects
      subjectMap.forEach((value, key) => {
        const obj = {};
        obj[key] = value;
        jsonArray.push(obj);
      });

      // Convert the array to a JSON string
      const jsonString = JSON.stringify(jsonArray, null, 2); // 'null, 2' is for pretty-printing

      // Save the JSON string to a file
      fs.writeFileSync("subjectMap.json", jsonString);

      console.log("subjectMap saved as JSON in subjectMap.json");

      createPieChart(subjectMap);
      // console.log("Unique Classes: ", uniqueClasses);
      // console.log("Unique Classes Count: ", uniqueClasses.size);

      // console.log("unique subjects: ", uniqueSubjects);
      // console.log(
      //   "unique subjects: ",
      //   JSON.stringify([...uniqueSubjects], null, 2)
      // );

      // Convert Set to Array
      const uniqueSubjectsArray = [...uniqueSubjects];

      // Stringify the array with pretty-printing
      const jsonContent = JSON.stringify(uniqueSubjectsArray, null, 2);

      // Write JSON to file
      fs.writeFile("uniqueSubjects.json", jsonContent, "utf8", (err) => {
        if (err) {
          console.error(
            "An error occurred while writing JSON Object to File.",
            err
          );
          return;
        }
        console.log("uniqueSubjects.json has been saved.");
      });
    })
    .on("error", (error) => {
      console.error("An error occurred during CSV parsing:", error);
    });
})();

// Function to create a pie chart
async function createPieChart(subjectMap) {
  const width = 800; // width of the chart
  const height = 800; // height of the chart
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: "white", // Set the background color to white
  });

  // Extract labels and values from the Map
  const labels = Array.from(subjectMap.keys());
  const values = Array.from(subjectMap.values());

  const chartConfig = {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map(
            () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
          ), // Random colors for each slice
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);
  fs.writeFileSync("subject_records_pie_chart.png", imageBuffer);
  console.log("Pie chart created: subject_records_pie_chart.png");
}
