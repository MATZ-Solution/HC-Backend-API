const pushToken = require("../Model/pushToken");
const { sendPushNotification } = require("../utils/push-notifications");

const sendNotificationController = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    await sendPushNotification({ title, body });

    return res.status(200).json({ success: true, message: "Notifications sent!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Failed to send notifications" });
  }
};
const saveNotificationController = async (req, res) => {
    const { expoPushToken } = req.body;
    if (!expoPushToken) return res.status(400).json({ error: "No token provided" });
  
    try {
      await pushToken.findOneAndUpdate(
        { expoPushToken },
        { expoPushToken }, 
        { upsert: true }   
      );
      res.json({ message: "Token saved successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
module.exports = { sendNotificationController, saveNotificationController };
