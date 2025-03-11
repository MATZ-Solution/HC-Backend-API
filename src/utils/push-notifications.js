const { Expo } = require("expo-server-sdk");
const pushToken = require("../Model/pushToken");

let expo = new Expo();

async function sendPushNotification(message) {
  let messages = [];
  
  // Get all stored Expo push tokens from the database
  const tokens = await pushToken.find();
  console.log(tokens,"tokens")
  const expoPushTokens = tokens.map((token) => token.expoPushToken);
  // const expoPushTokens=["ExponentPushToken[iJELPrGcp1TKDiQqAoU-Gx]"]

  for (let pushToken of expoPushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Invalid Expo Push Token: ${pushToken}`);
      continue;
    }

    messages.push({
      to: pushToken,
      title: message.title,
      body: message.body,
      _displayInForeground: true,
      android: { channelId: "default", priority: "high" },
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  return tickets;
}

module.exports = { sendPushNotification };
