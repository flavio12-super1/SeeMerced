const axios = require("axios");
const fs = require("fs");
require("dotenv").config({ path: "../.env" });

const TOKEN = process.env.X_CSRF_TOKEN;
const COOKIE = process.env.COOKIE;

const searchTerm = "Education";

// Load the JSON data
const terms = JSON.parse(fs.readFileSync("terms.json", "utf8"));

// Function to make the API request for each term
async function fetchCoursesForTerm(term) {
  // let config = {
  //   method: "post",
  //   maxBodyLength: Infinity,
  //   url: `https://reg-prod.ec.ucmerced.edu/StudentRegistrationSsb/ssb/courseSearch/get_subject?searchTerm=${searchTerm}&term=${term}&offset=1&max=10`,
  //   headers: {
  //     "x-csrf-token": TOKEN,
  //     Cookie: COOKIE,
  //   },
  // };
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://reg-prod.ec.ucmerced.edu/StudentRegistrationSsb/ssb/courseSearchResults/courseSearchResults?txt_subject=EDUC&txt_courseNumber=110E&txt_term=${term}&pageOffset=0&pageMaxSize=10`,
    headers: {
      Cookie: COOKIE,
    },
  };

  try {
    const response = await axios.request(config);
    console.log(`Results for term ${term}:`, JSON.stringify(response.data));
  } catch (error) {
    console.log(`Error fetching data for term ${term}:`, error);
  }
}

// Loop through each term code and make the API request
(async () => {
  for (const termObj of terms) {
    const term = termObj.code;
    fetchCoursesForTerm(term);
  }
})();
