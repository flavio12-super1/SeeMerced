const axios = require("axios");
const fs = require("fs");
require("dotenv").config({ path: "../.env" });

const TOKEN = process.env.X_CSRF_TOKEN;
const COOKIE = process.env.COOKIE;

const terms = JSON.parse(fs.readFileSync("terms.json", "utf8"));
const subjects = JSON.parse(fs.readFileSync("uniqueSubjects.json", "utf8"));

let courseCodes = [];

async function fetchCoursesForSubjectAndTerm(subject, term) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://reg-prod.ec.ucmerced.edu/StudentRegistrationSsb/ssb/courseSearch/get_subject?searchTerm=${subject}&term=${term}&offset=1&max=10`,
    headers: {
      "x-csrf-token": TOKEN,
      Cookie: COOKIE,
    },
  };

  try {
    const response = await axios.request(config);
    if (response.data && response.data.length > 0) {
      console.log(
        `Results for subject ${subject} and term ${term}:`,
        JSON.stringify(response.data)
      );

      // Extract the code and save it in the desired format
      const code = response.data[0].code;
      const formattedSubject = subject
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      courseCodes.push({ [formattedSubject]: code });

      // Save the course codes to a file after each successful request
      fs.writeFileSync(
        "course_codes.json",
        JSON.stringify(courseCodes, null, 2),
        "utf8"
      );
    } else {
      console.log(`No results for subject ${subject} and term ${term}.`);
    }
  } catch (error) {
    console.log(
      `Error fetching data for subject ${subject} and term ${term}:`,
      error
    );
  }
}

(async () => {
  for (const termObj of terms) {
    const term = termObj.code;
    for (const subject of subjects) {
      await fetchCoursesForSubjectAndTerm(subject, term);
    }
  }

  console.log("All subjects and terms processed.");
})();
