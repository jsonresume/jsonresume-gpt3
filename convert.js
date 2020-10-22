const _ = require("lodash");
const fs = require("fs");
const slugify = require("slugify");
const glob = require("glob");

// Load all the local gpt3 outputs for "resumes"
const gpt3Output = glob.sync("./gpt3-output/*.txt");

_.each(gpt3Output, (outputPath) => {
  // Read gpt3 output from file
  const output = fs.readFileSync(outputPath, "utf8");

  // Convert gpt3 output into object
  const outputObject = {};
  _.each(output.split("\n"), (line) => {
    const keyValue = line.split(":");
    outputObject[keyValue[0]] = keyValue[1];
  });
  console.log(outputObject);

  // Load the template resume.json we will inject values into
  const resumeTemplate = JSON.parse(fs.readFileSync("./resume.json"));

  // Replace resume.json template values with gpt3 object values
  resumeTemplate.basics.name = outputObject.Name;
  resumeTemplate.basics.email =
    slugify(outputObject.Name).toLowerCase() + "@gmail.com";
  resumeTemplate.basics.label = outputObject["Job Title"];
  resumeTemplate.basics.summary = outputObject["Summary"];

  resumeTemplate.work[0].company = outputObject["Company #1 Name"];
  resumeTemplate.work[0].summary = outputObject["Company #1 Summary"];
  resumeTemplate.work[0].position = outputObject["Company #1 Role"];
  resumeTemplate.work[0].website =
    "https://" +
    slugify(outputObject["Company #1 Name"].toLowerCase()) +
    ".com";
  resumeTemplate.work[0].highlights[0] = outputObject["Company #1 Highlight 1"];
  resumeTemplate.work[0].highlights[1] = outputObject["Company #1 Highlight 2"];

  resumeTemplate.work[1].company = outputObject["Company #2 Name"];
  resumeTemplate.work[1].summary = outputObject["Company #2 Summary"];
  resumeTemplate.work[1].position = outputObject["Company #2 Role"];
  resumeTemplate.work[1].website =
    "https://" +
    slugify(outputObject["Company #1 Name"].toLowerCase()) +
    ".com";
  resumeTemplate.work[1].highlights[0] = outputObject["Company #2 Highlight 1"];
  resumeTemplate.work[1].highlights[1] = outputObject["Company #2 Highlight 2"];

  resumeTemplate.interests = [];

  // Replace , with . because gpt3 gets a bit creative with grammar
  const outputInterests = outputObject["Interests"]
    .replace(",", ".")
    .split(".");
  _.each(outputInterests, (interest) => {
    resumeTemplate.interests.push({ name: interest });
  });

  // "work": [
  //   {
  //     "highlights": [
  //       "Millions of sites use the CDN in production",
  //       "Millions of sites use the CDN in production"
  //     ],
  //     "summary": "Following Google’s CDN for jQuery, we decided to start a CDN for the less popular Javascript frameworks. The CDN is community moderated and open source on GitHub. We secured a partnership with Cloudflare who now supports the infrastructure.",
  //     "website": "http://www.cdnjs.com",
  //     "company": "Cdnjs",
  //     "position": "Co-Founder",
  //     "startDate": "2018-01-08",
  //     "endDate": "2020-09-08"
  //   },

  resumeTemplate.references[0].reference = outputObject["Personal Reference"];

  fs.writeFileSync(
    "./resumes/" + slugify(outputObject.Name) + ".json",
    JSON.stringify(resumeTemplate, undefined, 4)
  );
});
