// // const fs = require("fs");
// // const iconv = require("iconv-lite");
// // const csv = require("csv-parser");

// // // Path to your CSV file
// // const csvFilePath = "grades_orders.csv";

// // // Variable to store the first row
// // let firstRowData = null;

// // // Create the read stream
// // const stream = fs
// //   .createReadStream(csvFilePath)
// //   .on("error", (error) => {
// //     console.error("Error reading file:", error);
// //   })
// //   .pipe(iconv.decodeStream("utf16-le"))
// //   .on("error", (error) => {
// //     console.error("Error decoding file:", error);
// //   })
// //   .pipe(csv())
// //   .on("data", (row) => {
// //     if (!firstRowData) {
// //       console.log("First row data found:");
// //       // Store the first row data in JSON format
// //       firstRowData = row;
// //       console.log(JSON.stringify(firstRowData, null, 2));

// //       // Stop further processing after the first row
// //       stream.destroy();
// //     }
// //   })
// //   .on("end", () => {
// //     console.log("Processing completed.");
// //     if (!firstRowData) {
// //       console.log("No data found in the CSV file.");
// //     }
// //   })
// //   .on("error", (error) => {
// //     console.error("An error occurred during CSV parsing:", error);
// //   });

// const fs = require("fs");
// const iconv = require("iconv-lite");
// const csv = require("csv-parser");
// const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

// // Path to your CSV file
// const csvFilePath = "grades_orders.csv";

// // Object to store records by subject
// const subjects = {};

// // Function to clean and normalize subject names
// function cleanSubjectName(subject) {
//   return subject.replace(/[^\w\s&]/g, "").trim(); // Remove unwanted characters
// }

// // Function to sum records by subject
// function addRecords(subject, records) {
//   const cleanSubject = cleanSubjectName(subject);
//   if (!subjects[cleanSubject]) {
//     subjects[cleanSubject] = 0;
//   }
//   subjects[cleanSubject] += records;
// }

// // Create the read stream
// fs.createReadStream(csvFilePath)
//   .pipe(iconv.decodeStream("utf16-le")) // Decode the UTF-16 LE stream to UTF-8
//   .pipe(csv())
//   .on("data", (row) => {
//     const courseName = row["course_name"];
//     const grade = row["letter_grade"];
//     const description = row["description"];
//     let records = 0;

//     // Clean up broken characters
//     const cleanCourseName = cleanSubjectName(courseName);

//     // Extract the number of records
//     if (description.includes("Number of Records")) {
//       records = parseInt(row["A+"], 10) || parseInt(row["A"], 10) || 0;
//     }

//     // Add records to the subject
//     if (records > 0) {
//       const subjectName = cleanCourseName.split(" ")[0]; // Assume first part of the course name is the subject
//       addRecords(subjectName, records);
//     }
//   })
//   .on("end", () => {
//     console.log("CSV processing completed.");
//     console.log("Subjects and their total records:", subjects);

//     // Create a pie chart with the results
//     createPieChart(subjects);
//   })
//   .on("error", (error) => {
//     console.error("An error occurred during CSV parsing:", error);
//   });

// // Function to create a pie chart
// async function createPieChart(data) {
//   const width = 800; // width of the chart
//   const height = 800; // height of the chart
//   const chartJSNodeCanvas = new ChartJSNodeCanvas({
//     width,
//     height,
//     backgroundColour: "white", // Set the background color to white
//   });

//   const labels = Object.keys(data);
//   const values = Object.values(data);

//   const chartConfig = {
//     type: "pie",
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           data: values,
//           backgroundColor: labels.map(
//             () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
//           ), // Random colors
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: "top",
//         },
//       },
//     },
//   };

//   const imageBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);
//   fs.writeFileSync("subject_records_pie_chart.png", imageBuffer);
//   console.log("Pie chart created: subject_records_pie_chart.png");
// }

const fs = require("fs");
const iconv = require("iconv-lite");
const csv = require("csv-parser");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

// Path to your CSV file
const csvFilePath = "grades_orders.csv";

// Object to store records by subject
const subjects = {};

// Function to clean and normalize subject names
function cleanSubjectName(subject) {
  return subject.replace(/[^\w\s&]/g, "").trim(); // Remove unwanted characters
}

// Function to sum records by subject
function addRecords(subject, records) {
  const cleanSubject = cleanSubjectName(subject);
  if (!subjects[cleanSubject]) {
    subjects[cleanSubject] = 0;
  }
  subjects[cleanSubject] += records;
}

// Create the read stream
fs.createReadStream(csvFilePath)
  .pipe(iconv.decodeStream("utf16-le")) // Decode the UTF-16 LE stream to UTF-8
  .pipe(csv())
  .on("data", (row) => {
    const courseName = row["course_name"];
    const description = row["description"];
    let records = 0;

    // Clean up broken characters
    const cleanCourseName = cleanSubjectName(courseName);

    // Only consider rows where the description is "Number of Records"
    if (description.includes("Number of Records")) {
      // Sum all grade records for this row
      for (let grade in row) {
        if (
          grade !== "course_name" &&
          grade !== "letter_grade" &&
          grade !== "description"
        ) {
          const value = parseInt(row[grade], 10);
          if (!isNaN(value)) {
            records += value;
          }
        }
      }
    }

    // Add records to the subject
    if (records > 0) {
      const subjectName = cleanCourseName.split(" ")[0]; // Assume first part of the course name is the subject
      addRecords(subjectName, records);
    }
  })
  .on("end", () => {
    console.log("CSV processing completed.");
    console.log("Subjects and their total records:", subjects);

    // Create a pie chart with the results
    createPieChart(subjects);
  })
  .on("error", (error) => {
    console.error("An error occurred during CSV parsing:", error);
  });

// Function to create a pie chart
async function createPieChart(data) {
  const width = 800; // width of the chart
  const height = 800; // height of the chart
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: "white", // Set the background color to white
  });

  const labels = Object.keys(data);
  const values = Object.values(data);

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
