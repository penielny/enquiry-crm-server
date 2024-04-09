var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Fetch user documents based on an array of client IDs.
 *
 * @param {Array} clientIds Array of client/user document IDs to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
async function getUsers(clientIds = []) {
  try {
    // Validate clientIds input
    if (!Array.isArray(clientIds) || clientIds.length === 0) {
      console.log("No client IDs provided or invalid input.");
      return [];
    }

    // Firestore can only process up to 10 elements in an 'in' query at a time.
    // If you have more than 10 client IDs, you'll need to batch the queries.
    const batchSize = 10;
    const userSnapshots = [];

    for (let i = 0; i < clientIds.length; i += batchSize) {
      const batchIds = clientIds.slice(i, i + batchSize);
      const querySnapshot = await db
        .collection("users")
        .where(admin.firestore.FieldPath.documentId(), "in", batchIds)
        .get();
      querySnapshot.forEach((doc) => userSnapshots.push(doc));
    }

    // Map the documents to their data
    const users = userSnapshots.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(users);
    return users;
  } catch (error) {
    console.error("Error getting user documents:", error);
    return []; // Or throw the error, depending on your error handling strategy
  }
}

module.exports = { db, getUsers };
