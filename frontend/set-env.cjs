const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const targetPath = './src/environments/environment.ts';
const envConfigFile = `
  export const environment = {
    production: false,
    apiUrl: '${process.env["API_URL"]}',
    apiKey: '${process.env["API_KEY"]}',
    projectId: '${process.env["PROJECT_ID"]}'
  };
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Environment file generated at ${targetPath}`);
  }
});
