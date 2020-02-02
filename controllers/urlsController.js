const admin = require("firebase-admin");
const equal = require('deep-equal');

// Create url
exports.create_url = function(req, res) {
  const { urlToShorten, newUrl } = req.body;
  const payload = {shortUrl: newUrl, origUrl: urlToShorten}
  const urlRef = admin.database().ref('/urls');
  urlRef.orderByChild('shortUrl').equalTo(newUrl).once('value', (urls) => {
    if (!urls.exists()) {
      urlRef.push(payload);
      res.send('Success!');
    } else {
      res.send(newUrl + ' is already taken!')
    }
  })
};

// Update url
exports.update_url = function(req, res) {
  const { urlToUpdate, newUrl } = req.body;
  const payload = {shortUrl: newUrl, origUrl: urlToUpdate}
  const urlRef = admin.database().ref('/urls');
  urlRef.orderByChild('shortUrl').equalTo(newUrl).once('value', (urls) => {
    if (urls.exists()) {
      urls.forEach((url) =>{
        if (!equal(url.val(), payload)) {
          url.ref.update({origUrl: urlToUpdate})
          res.send('Success!');
        } else {
          res.send(newUrl + ' is already linked to that URL!')
        }
      })
    } else {
      res.send('URL Not Found')
    }
  })
};