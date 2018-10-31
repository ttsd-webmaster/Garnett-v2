import API from 'api/API.js';

// Used to get tab color for Pledge App
export function getTabStyle(isActive) {
  return {color: isActive ? 'var(--primary-color)' : 'var(--secondary-light)'};
}

export function isMobileDevice() {
  return (navigator.userAgent.match(/Android/i) || 
          navigator.userAgent.match(/webOS/i) || 
          navigator.userAgent.match(/iPhone/i) || 
          navigator.userAgent.match(/iPad/i) || 
          navigator.userAgent.match(/iPod/i) || 
          navigator.userAgent.match(/BlackBerry/i) || 
          navigator.userAgent.match(/Windows Phone/i))
};

export function initializeFirebase() {
  loadFirebase('app')
  .then(() => {
    const { firebase } = window;
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
      });
    }
  });
}

export function loadFirebase(module) {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = `https://www.gstatic.com/firebasejs/4.6.2/firebase-${module}.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { throw new Error(); };
    document.head.appendChild(script);
  });
}

export function registerNotificationToken(user, callback) {
  const displayName = user.firstName + user.lastName;
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

  navigator.serviceWorker.getRegistration(swUrl)
  .then((registration) => {
    loadFirebase('messaging')
    .then(() => {
      const { firebase } = window;
      const messaging = firebase.messaging();
      messaging.useServiceWorker(registration);

      messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        // Get Instance ID token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        messaging.getToken()
        .then((currentToken) => {
          if (currentToken) {
            localStorage.setItem('registrationToken', currentToken);

            API.saveMessagingToken(displayName, currentToken)
            .then(messageRes => {
              console.log(messageRes)
            })
            .catch(error => console.log(`Error: ${error}`));
          } 
          else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
          }
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
    });
  });
}

export function loginCheck() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  return (!isSafari || iOSversion()[0] > 11 ||
          !document.documentMode ||
          !/Edge/.test(navigator.userAgent) ||
          process.env.NODE_ENV === 'production')
}

export function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function getDate() {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;

  if (day < 10) {
    day = '0' + day;
  } 

  if (month < 10) { 
    month = '0' + month;
  }

  today = month + '/' + day;

  return today;
}

export function mapsSelector(location) {
  /* if we're on iOS, open in Apple Maps */
  if ((navigator.platform.indexOf("iPhone") !== -1) || 
      (navigator.platform.indexOf("iPad") !== -1) || 
      (navigator.platform.indexOf("iPod") !== -1)) {
    window.open(`maps://maps.google.com/maps?daddr=${location}&amp;ll=`);
  }
  /* else use Google */
  else {
    window.open(`https://maps.google.com/maps?daddr=${location}&amp;ll=`);
  }
}

export function invalidSafariVersion() {
  const nAgt = navigator.userAgent;
  let versionOffset = nAgt.indexOf('Safari');

  if (versionOffset !== -1) {
    let version = nAgt.substring(versionOffset + 7);
    versionOffset = nAgt.indexOf('Version');

    if (versionOffset !== -1) {
      version = nAgt.substring(versionOffset + 8);
    }

    version = version.split(".")[0];

    if (version > 9) {
      return false;
    }
    else {
      return true;
    }
  }
  else {
    return false;
  }
}

export function iOSversion() {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
  else {
    return false;
  }
}

// Handles android back button on dialog open
export function androidBackOpen(callback) {
  if (/android/i.test(navigator.userAgent)) {
    let path = 'https://garnett-app.herokuapp.com';
    if (process.env.NODE_ENV === 'development') {
      path = 'http://localhost:3000';
    }

    window.history.pushState(null, null, path + window.location.pathname);
    window.onpopstate = () => {
      callback();
    }
  }
}

// Handles android back button on dialog close
export function androidBackClose() {
  if (/android/i.test(navigator.userAgent)) {
    window.onpopstate = () => {};
  }
}
