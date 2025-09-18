const express = require("express");
const app = express();
app.use(express.json());

// import or define these functions
// const { saveSubscriptionInDB, getAllSubscriptionsFromDB, sendPushNotification } = require('./subscriptions');

app.post("/api/save-subscription", async (req, res) => {
  const subscription = req.body;
  await saveSubscriptionInDB(subscription);
  res.status(201).json({});
});

app.post("/api/send-push", async (req, res) => {
  const { title, body, url } = req.body;
  const subscriptions = await getAllSubscriptionsFromDB();
  subscriptions.forEach((sub) =>
    sendPushNotification(sub, JSON.stringify({ title, body, url }))
  );
  res.status(200).json({});
});

app.listen(3000, () => console.log("Server running on port 3000"));
