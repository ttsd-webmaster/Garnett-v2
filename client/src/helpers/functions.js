const tabStyle = {
  default: {
    color: 'var(--secondary-light)'
  },
  active: {
    color: 'var(--primary-color)'
  }
};

function getTabStyle(isActive) {
  return isActive ? tabStyle.active : tabStyle.default
}

function initializeFirebase(data) {
  loadFirebase('app')
  .then(() => {
    let firebase = window.firebase;
    let firebaseData = localStorage.getItem('firebaseData');

    if (!firebase.apps.length) {
      firebase.initializeApp(data);

      if (!firebaseData) {
        localStorage.setItem('firebaseData', JSON.stringify(data));
      }
    }
  });
}

function loadFirebase(module) {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = `https://www.gstatic.com/firebasejs/4.6.2/firebase-${module}.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { throw new Error(); };
    document.head.appendChild(script);
  });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function getDate(date) {
  let today = date ? date : new Date();
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

export {initializeFirebase, loadFirebase, validateEmail, getDate, getTabStyle};
