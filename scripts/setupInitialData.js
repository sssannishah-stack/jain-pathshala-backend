require('dotenv').config();
const { db } = require('../src/config/firebase');
const { COLLECTIONS } = require('../src/utils/constants');

const sampleGathas = [
  { title: 'णमोकार मंत्र', content: 'णमो अरिहंताणं, णमो सिद्धाणं, णमो आयरियाणं', meaning: 'अरिहंतों को नमस्कार, सिद्धों को नमस्कार, आचार्यों को नमस्कार', language: 'hindi', category: 'mantra', order: 1 },
  { title: 'Namokar Mantra', content: 'Namo Arihantanam, Namo Siddhanam, Namo Ayriyanam', meaning: 'I bow to the Arihants, I bow to the Siddhas, I bow to the Acharyas', language: 'english', category: 'mantra', order: 1 },
  { title: 'णमोकार मंत्र', content: 'णमो अरिहंताणं, णमो सिद्धाणं', meaning: 'અરિહંતોને નમસ્કાર, સિદ્ધોને નમસ્કાર', language: 'gujarati', category: 'mantra', order: 1 }
];

async function setupData() {
  console.log('Setting up initial data...');
  for (const gatha of sampleGathas) {
    const docRef = db.collection(COLLECTIONS.GATHAS).doc();
    await docRef.set({ ...gatha, id: docRef.id, createdAt: new Date().toISOString() });
    console.log(`Created gatha: ${gatha.title}`);
  }
  console.log('Setup complete!');
  process.exit(0);
}

setupData().catch(console.error);
