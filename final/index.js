const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");

// Function to generate random colors
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to generate an array of random colors, ensuring adjacent colors are distinct
function generateDistinctColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    let color;
    do {
      color = getRandomColor();
    } while (i > 0 && colors[i - 1] === color); // Ensure the color is not the same as the previous one
    colors.push(color);
  }
  return colors;
}

// Read JSON data from a file
const jsonData = JSON.parse(
  fs.readFileSync("sorted_course_codes.json", "utf8")
);

// Extract labels and values from the JSON data
const labels = jsonData.map((item) => Object.keys(item)[0]);
const values = jsonData.map((item) => Object.values(item)[0]);

console.log(labels);

// Generate random colors for the bars
const backgroundColors = generateDistinctColors(labels.length);

// Create the ChartJSNodeCanvas instance
const width = 1600; // width of the canvas
const height = 600; // height of the canvas
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: "white",
});

// Chart configuration
const chartConfig = {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Subject Data",
        data: values,
        backgroundColor: backgroundColors,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Subjects",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
        beginAtZero: true,
      },
    },
  },
};

// Render the chart and save it as an image
chartJSNodeCanvas
  .renderToBuffer(chartConfig)
  .then((buffer) => {
    fs.writeFileSync("subject_bar_graph.png", buffer);
    console.log("Bar graph saved as subject_bar_graph.png");
  })
  .catch((err) => {
    console.error("Error creating the chart:", err);
  });
