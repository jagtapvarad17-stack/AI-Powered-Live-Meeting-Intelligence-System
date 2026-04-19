const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Meeting } = require('./db/models');
const { connectDB } = require('./db/connect');

async function fix() {
  await connectDB();
  
  console.log('Finding meetings where tasks is a string...');
  let cursor = await Meeting.collection.find({ tasks: { $type: "string" } });
  let count = 0;
  for await (const doc of cursor) {
    console.log(`Fixing meeting ${doc._id}, old tasks: "${doc.tasks}"`);
    await Meeting.collection.updateOne(
      { _id: doc._id },
      { $set: { tasks: [] } }
    );
    count++;
  }
  console.log(`Fixed ${count} documents for tasks.`);
  
  cursor = await Meeting.collection.find({ openQuestions: { $type: "string" } });
  count = 0;
  for await (const doc of cursor) {
    console.log(`Fixing meeting ${doc._id}, old openQuestions: "${doc.openQuestions}"`);
    await Meeting.collection.updateOne(
      { _id: doc._id },
      { $set: { openQuestions: [] } }
    );
    count++;
  }
  console.log(`Fixed ${count} documents for openQuestions.`);

  cursor = await Meeting.collection.find({ followUps: { $type: "string" } });
  count = 0;
  for await (const doc of cursor) {
    console.log(`Fixing meeting ${doc._id}, old followUps: "${doc.followUps}"`);
    await Meeting.collection.updateOne(
      { _id: doc._id },
      { $set: { followUps: [] } }
    );
    count++;
  }
  console.log(`Fixed ${count} documents for followUps.`);

  process.exit(0);
}

fix().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
