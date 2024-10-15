const folder = "./images";
const fs = require("fs");
const admin = require("firebase-admin");
require("dotenv").config({
  path: `${process.env.HOME}/Projects/React/Garnett/.env`,
});

const ACTIVE_AUTHORIZATION_CODE = "garnett";
const FIREBASE_API_KEY = "AIzaSyBH389MDOmNgFGokEIaeiLe0FzMpmTtwuY";
const FIREBASE_AUTH_DOMAIN = "garnett-230209.firebaseapp.com";
const FIREBASE_AUTH_PROVIDER_X509_CERT_URL =
  "https://www.googleapis.com/oauth2/v1/certs";
const FIREBASE_AUTH_URI = "https://accounts.google.com/o/oauth2/auth";
const FIREBASE_CLIENT_EMAIL =
  "firebase-adminsdk-3lhy7@garnett-230209.iam.gserviceaccount.com";
const FIREBASE_CLIENT_ID = "100275998956866457615";
const FIREBASE_CLIENT_X509_CERT_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3lhy7%40garnett-230209.iam.gserviceaccount.com";
const FIREBASE_DATABASE_URL = "https://garnett-230209.firebaseio.com";
const FIREBASE_MESSAGING_SENDER_ID = "881082882960";
const FIREBASE_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeEtDHHDfhBwEn\nMoz7/LcLKkxdOG+xPD7mTmeI37B/oj6uGC9gFbgSV7VJVqtBSkDIiiFoYP6XIt0/\nGJcQ3C189UW9OpQ+BOqGWuTn7zTbxjIzQ4kSh4ysbi8Ue+lPtKvdiUUJp+iuJsUu\nK9nozKBohIBTK8Lcs/ZAsIJuzOnovnEXSpV1H4UlvwCrJE+TX9jt5vDZY+UcqTWa\nzS7AcbNjYJINGpgKo5gNgl83FkB1lpFMWOwpubCaTP6YDS3XhpuYub/eIVCJur3P\nqv+KVI2Eu9eWUdbHRRvMryGI9hPYGSMD7AZp8DauPClmk0yll+5B9o7gk9qbPwd/\nc6sLq9/RAgMBAAECggEAC4MBxtpYfHAS5qyhBVHqb6r5LDnJso3ZY9LWaeqmcykY\n6PtUaeozAUz3ZBumdacHcENU+wHDULTmiWuMRttOCcFf/o+nT5vyi23PqU9rmUzG\nB6M1to5+EWmlzpdWjqow8P2H9FPQ12v15K6nXDOYw/vQT55KfuGxP5VLLnAIYd1t\nWH4QbEQl0BmiS3rDtZpWSL4AG65islUNjesH8Gj9ZHIIzi48aqvXkfcyYKm1E4z9\ni44wOITwzK1VUHMVh6zjWVitpVKWwFe6ZAoOBY5uJLcynLUjXEyFCDHCJx+l2x3E\n8Bjt7i/IsCsOlDQ+qh1vAdwjzG9hm23ok4afZRnUFQKBgQDKlv8v2kWet485ktf3\n2bQ3yCXRP2KIfKZuOejtdrlyP3Q8mldbvsJ80jDRfbaQWG51ZX/mWspuqUoNjjsB\ng0RgAwBArB2cFI4nPUoBaOEqPrFU8R7Z6Kl8F/p7X7kL0no/OgJLd2V77VtAjJo+\nLnBes5bJq7Fccf4qAM62hUVspQKBgQDHv10yHyUmVwt1Bd7UtWPr98/NKfTKUO9v\nX64g8o/joFAxqQq6xBg7rfSDhuw/GTlgD0BXVxJ7BOrbzza0eZF3y06tcc3ZOulC\nmc+GCwGBAglrhOHiOnSqP2XE+Ay+tjCROG1vva8JHvI4qfn5s6OsE2NXl/iTcE8s\nPRMoiq3ivQKBgBUr/JVCqV3x7vzkVL+pN8VQnGsmxaRf6oDAepA+hRjkesBOnOyQ\nngCvcryh969UHo8UQW6QdHFmLcAG6jG5Ry8FgURA+IM0PrrpE8/b5xQkIyIuZLv/\nLZ8zXlEAavVKVM5AwLakTq3J22x+hSwUbFfpSsverpVrsFUxamj2uo+lAoGAaU2z\nXhcZSKse+SSNIuo1sVLFlE2IJZihgb+ZVvlJbiE35dZON8PlWqEMhMJ+jY1IuCGS\nM/lNXtlqz1Lgbiigzdy6r6mNcfYivt/DjdEDi/V87dfyFYfntVES39I9NdVqqURs\nPTpsqoxL+h9yD3fq026tMqKFg4Tz2Eiibv8dSKkCgYEAtEW6mxQumLN7G2ybgP/+\nax1Q6+3oD2DCxdfN15AjPiheqFslTaH0GzW4GAO79070n8tlQlDNj6m/DpBCmJzp\nagcwQyoFYnNIu7NCcSLB2KgwTQZEOuhdjlqWt4dqfWeYVs/o+wr9tE28f+aH5+yE\ngDOQV82Hll/wqFXinKhZk2I=\n-----END PRIVATE KEY-----\n";
const FIREBASE_PRIVATE_KEY_ID = "33075f583165729d2c6e81af611cc20c5caee92d";
const FIREBASE_PROJECT_ID = "garnett-230209";
const FIREBASE_STORAGE_BUCKET = "garnett-230209.appspot.com";
const FIREBASE_TOKEN_URI = "https://accounts.google.com/o/oauth2/token";
const FIREBASE_TYPE = "service_account";
const NODE_PATH = "src/";
const PLEDGE_AUTHORIZATION_CODE = "phipledge!";

admin.initializeApp({
  credential: admin.credential.cert({
    type: FIREBASE_TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
  }),
  databaseURL: FIREBASE_DATABASE_URL,
});

const bucket = admin.storage().bucket("garnett-230209.appspot.com");
const usersRef = admin.database().ref("/users");

function uploadFile(file) {
  const userName = file.slice(0, -4); // Remove file extension (e.g., '.jpg')

  // Regular expression to match capitalized words (First and Last names)
  const names = userName.match(/([A-Z][a-z]+)/g) || []; // Matches capital letter followed by lowercase letters

  const userRef = usersRef.child(userName);
  console.log(`Extracted names:`, names);

  // Define first and last names, defaulting to empty strings if not found
  const firstName = names[0] || "Unknown"; // Use "Unknown" if first name is not found
  const lastName = names[1] || ""; // Use empty string if last name is not found

  bucket
    .upload(`images/${file}`, {
      destination: file,
      gzip: true,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    })
    .then(() => {
      const uploadedFile = bucket.file(file);
      uploadedFile
        .getSignedUrl({ action: "read", expires: "03-17-2027" })
        .then((signedUrls) => {
          console.log(`Updated ${userName}'s photo`);
          userRef.update({
            firstName: firstName,
            lastName: lastName,
            class: "Alpha Zeta",
            email: "alphazeta@thetatau.org",
            year: "1st Year",
            status: "pledge",
            phone: "1234567890",
            major: "Computer Science",
            photoURL: signedUrls[0],
          });
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
}

fs.readdir(folder, (err, files) => {
  // Check if an error occurred while reading the directory
  if (err) {
    console.error("Error reading directory:", err);
    return; // Exit the function if there's an error
  }

  // Ensure 'files' is defined before proceeding
  if (!files || files.length === 0) {
    console.log("No files found in the directory.");
    return; // Exit if there are no files
  }

  // Process each file
  files.forEach((file) => {
    const userName = file.slice(0, -4);
    const jpg = `${userName}.jpg`;
    const JPG = `${userName}.JPG`;
    bucket
      .file(jpg)
      .delete()
      .then(() => {
        uploadFile(file);
      })
      .catch((error) => {
        bucket
          .file(JPG)
          .delete()
          .then(() => {
            uploadFile(file);
          })
          .catch((error) => {
            uploadFile(file);
          });
      });
  });
});
