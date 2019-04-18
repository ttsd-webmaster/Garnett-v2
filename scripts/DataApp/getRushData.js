var fs = require('fs');
const admin = require("firebase-admin");
var NuData = require('./rushData/RushFall15.json');
var XiData = require('./rushData/RushSpring16.json');
var OmicronData = require('./rushData/RushFall16.json');
var PiData = require('./rushData/RushSpring17.json');
var RhoData = require('./rushData/RushFall17.json');
var SigmaData = require('./rushData/RushSpring18.json');
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

var classes = ['Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma'];
var NuMajors = new Map();
var XiMajors = new Map();
var OmicronMajors = new Map();
var PiMajors = new Map();
var RhoMajors = new Map();
var SigmaMajors = new Map();
var NuYears = new Map();
var XiYears = new Map();
var OmicronYears = new Map();
var PiYears = new Map();
var RhoYears = new Map();
var SigmaYears = new Map();
var NuGenders = new Map();
var XiGenders = new Map();
var OmicronGenders = new Map();
var PiGenders = new Map();
var RhoGenders = new Map();
var SigmaGenders = new Map();

classes.forEach((pledgeClass) => {
  eval(pledgeClass + 'Data').forEach((rushee) => {
    var major = rushee.Major.toLowerCase();
    var year = rushee.Year.toLowerCase();

    if (major.includes('mech')) {
      major = 'Mechanical Engineering';
    }
    else if (major.includes('struc')) {
      major = 'Structural Engineering';
    }
    else if (major.includes('nano')) {
      major = 'Nanoengineering';
    }
    else if (major.includes('math')) {
      major = 'Math-CS';
    }
    else if (major.includes('chem')) {
      major = 'Chemical Engineering';
    }
    else if (major.includes('aero')) {
      major = 'Aerospace Engineering';
    }
    else if (major.includes('env')) {
      major = 'Environmental Engineering';
    }
    else if (major.includes('ece') || major == 'ee' || major.includes('electrical')) {
      major = 'Electrical Engineering';
    }
    else if (major.includes('computer science') || major.includes('comp sci') || major.includes('cs')) {
      major = 'Computer Science';
    }
    else if (major.includes('computer engineering') || major.includes('computer engineer') || major.includes('ce')) {
      major = 'Computer Engineering';
    }
    else if (major.includes('bio')) {
      major = 'Bioengineering';
    }
    else {
      major = 'Other';
    }

    if (year.includes('1')) {
      year = '1st Year';
    }
    else if (year.includes('2')) {
      year = '2nd Year';
    }
    else if (year.includes('3')) {
      year = '3rd Year';
    }
    else if (year.includes('4')) {
      year = '4th Year';
    }
    else if (year.includes('5')) {
      year = '5th Year';
    }

    var majorCounter = eval(pledgeClass + 'Majors').get(major) || 0;
    var yearCounter = eval(pledgeClass + 'Years').get(year) || 0;
    var genderCounter = eval(pledgeClass + 'Genders').get(rushee.Gender) || 0;

    eval(pledgeClass + 'Majors').set(major, majorCounter += 1);
    eval(pledgeClass + 'Years').set(year, yearCounter += 1);
    eval(pledgeClass + 'Genders').set(rushee.Gender, genderCounter += 1);
  });
});

NuMajors = [...NuMajors].sort((a,b) => b[1] - a[1]);
XiMajors = [...XiMajors].sort((a,b) => b[1] - a[1]);
OmicronMajors = [...OmicronMajors].sort((a,b) => b[1] - a[1]);
PiMajors = [...PiMajors].sort((a,b) => b[1] - a[1]);
RhoMajors = [...RhoMajors].sort((a,b) => b[1] - a[1]);
SigmaMajors = [...SigmaMajors].sort((a,b) => b[1] - a[1]);
NuYears = [...NuYears].sort((a,b) => b[1] - a[1]);
XiYears = [...XiYears].sort((a,b) => b[1] - a[1]);
OmicronYears = [...OmicronYears].sort((a,b) => b[1] - a[1]);
PiYears = [...PiYears].sort((a,b) => b[1] - a[1]);
RhoYears = [...RhoYears].sort((a,b) => b[1] - a[1]);
SigmaYears = [...SigmaYears].sort((a,b) => b[1] - a[1]);
NuGenders = [...NuGenders].sort((a,b) => b[1] - a[1]);
XiGenders = [...XiGenders].sort((a,b) => b[1] - a[1]);
OmicronGenders = [...OmicronGenders].sort((a,b) => b[1] - a[1]);
PiGenders = [...PiGenders].sort((a,b) => b[1] - a[1]);
RhoGenders = [...RhoGenders].sort((a,b) => b[1] - a[1]);
SigmaGenders = [...SigmaGenders].sort((a,b) => b[1] - a[1]);

console.log('Nu Majors', NuMajors);
console.log('Xi Majors', XiMajors);
console.log('Omicron Majors', OmicronMajors);
console.log('Pi Majors', PiMajors);
console.log('Rho Majors', RhoMajors);
console.log('Sigma Majors', SigmaMajors);
console.log('Nu Years', NuYears);
console.log('Xi Years', XiYears);
console.log('Omicron Years', OmicronYears);
console.log('Pi Years', PiYears);
console.log('Rho Years', RhoYears);
console.log('Sigma Years', SigmaYears);
console.log('Nu Genders', NuGenders);
console.log('Xi Genders', XiGenders);
console.log('Omicron Genders', OmicronGenders);
console.log('Pi Genders', PiGenders);
console.log('Rho Genders', RhoGenders);
console.log('Sigma Genders', SigmaGenders);

var usersRef = admin.database().ref('/users');
var NuClassMajors = new Map();
var XiClassMajors = new Map();
var OmicronClassMajors = new Map();
var PiClassMajors = new Map();
var RhoClassMajors = new Map();
var SigmaClassMajors = new Map();

usersRef.once('value', (users) => {
  users.forEach((user) => {
    var userClass = user.val().class;
    var major = user.val().major;

    if (classes.includes(userClass)) {
      var counter = eval(userClass + 'ClassMajors').get(major) || 0;

      eval(userClass + 'ClassMajors').set(major, counter += 1);
    }
  });

  NuClassMajors = [...NuClassMajors].sort((a,b) => b[1] - a[1]);
  XiClassMajors = [...XiClassMajors].sort((a,b) => b[1] - a[1]);
  OmicronClassMajors = [...OmicronClassMajors].sort((a,b) => b[1] - a[1]);
  PiClassMajors = [...PiClassMajors].sort((a,b) => b[1] - a[1]);
  RhoClassMajors = [...RhoClassMajors].sort((a,b) => b[1] - a[1]);
  SigmaClassMajors = [...SigmaClassMajors].sort((a,b) => b[1] - a[1]);

  console.log('Nu Class Majors', NuClassMajors);
  console.log('Xi Class Majors', XiClassMajors);
  console.log('Omicron Class Majors', OmicronClassMajors);
  console.log('Pi Class Majors', PiClassMajors);
  console.log('Rho Class Majors', RhoClassMajors);
  console.log('Sigma Class Majors', SigmaClassMajors);

  let jsonData = [
    ['Nu Majors', NuMajors],
    ['Xi Majors', XiMajors],
    ['Omicron Majors', OmicronMajors],
    ['Pi Majors', PiMajors],
    ['Rho Majors', RhoMajors],
    ['Sigma Majors', SigmaMajors],
    ['Nu Years', NuYears],
    ['Xi Years', XiYears],
    ['Omicron Years', OmicronYears],
    ['Pi Years', PiYears],
    ['Rho Years', RhoYears],
    ['Sigma Years', SigmaYears],
    ['Nu Genders', NuGenders],
    ['Xi Genders', XiGenders],
    ['Omicron Genders', OmicronGenders],
    ['Pi Genders', PiGenders],
    ['Rho Genders', RhoGenders],
    ['Sigma Genders', SigmaGenders],
    ['Nu Class Majors', NuClassMajors],
    ['Xi Class Majors', XiClassMajors],
    ['Omicron Class Majors', OmicronClassMajors],
    ['Pi Class Majors', PiClassMajors],
    ['Rho Class Majors', RhoClassMajors],
    ['Sigma Class Majors', SigmaClassMajors]
  ];

  fs.writeFile("rushData.json", JSON.stringify(jsonData), function(err) {
    if (err) {
      console.log(err);
    }
  });
});
