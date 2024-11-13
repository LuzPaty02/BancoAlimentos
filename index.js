const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server is running and accessible through the certified domain!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});





// const express = require('express');
// const bodyParser = require('body-parser');
// const admin = require('firebase-admin');
// const { body, param, validationResult } = require('express-validator');
// const rateLimit = require('express-rate-limit');

// const app = express();

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

// const db = admin.firestore();

// app.use(bodyParser.json());

// // Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
// });

// app.use(limiter);

// // GET Endpoint
// app.get('/data/:collection', async (req, res) => {
//   try {
//     const collection = req.params.collection;
//     const snapshot = await db.collection(collection).get();
//     const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // POST Endpoint with Validation
// app.post(
//   '/data/:collection',
//   [
//     param('collection').isAlphanumeric().withMessage('Collection name must be alphanumeric'),
//     body().not().isEmpty().withMessage('Request body cannot be empty'),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const collection = req.params.collection;
//       const data = req.body;
//       await db.collection(collection).add(data);
//       res.status(201).json({ message: 'Document added successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// );

// app.listen(3000, () => console.log('Server running on port 3000'));
