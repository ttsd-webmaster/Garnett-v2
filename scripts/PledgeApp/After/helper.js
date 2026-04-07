const admin = require("firebase-admin");
// Resolve the path to the root .env file
const path = require("path");
const envPath = path.resolve(__dirname, "../../../.env");

require('dotenv').config({ path: envPath });

// (Keep all your other constants as they are)

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
let usersRef = admin.database().ref('/users/');

const updatePhotoURLsSimple = async () => {
    console.log("🚀 Starting simple URL construction...");
  
    try {
      const snapshot = await usersRef.once('value');
      const users = snapshot.val();
  
      if (!users) return;
  
      const updates = {};
      let count = 0;
  
      Object.keys(users).forEach((uid) => {
        const user = users[uid];
        
        if (user.firstName && user.lastName) {
          const fileName = `${user.firstName}${user.lastName}.jpg`;
          
          // Construct the direct download URL
          const photoURL = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/${fileName}?alt=media`;
          
          updates[`${uid}/photoURL`] = photoURL;
          count++;
        }
      });
  
      if (count > 0) {
        await usersRef.update(updates);
        console.log(`✅ Done! Constructed URLs for ${count} users.`);
      }
  
    } catch (error) {
      console.error("Error:", error);
    } finally {
      process.exit();
    }
  };
  
  updatePhotoURLsSimple();