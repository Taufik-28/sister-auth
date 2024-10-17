const admin = require('firebase-admin');

// Inisialisasi Firebase Admin SDK dengan serviceAccount.json
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-key.json')),
});

const db = admin.firestore(); // Ekspor instance Firestore
module.exports = db;
