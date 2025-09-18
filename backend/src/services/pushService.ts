// pushService.ts
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export const sendPushNotification = async (subscription: any, payload: string) => {
  try {
    await webpush.sendNotification(subscription, payload);
  } catch (err) {
    console.error("Error sending push notification", err);
  }
};
