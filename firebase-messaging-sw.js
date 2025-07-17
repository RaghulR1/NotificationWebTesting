importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyATWxiI8TKMWKJ_zHnJuUGC_bhDe10a40U",
  authDomain: "push-notification-f-57df8.firebaseapp.com",
  projectId: "push-notification-f-57df8",
  storageBucket: "push-notification-f-57df8.appspot.com",
  messagingSenderId: "771076590862",
  appId: "1:771076590862:web:2a85f94fd7e6e96cd5db5f",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const title = payload.data?.title || "New Notification";
  const body = payload.data?.body || "You have a new message!";
  const url = payload.data?.url || "/";
  const icon = "/firebase-logo.png"; // Optional: use your own icon

  const notificationOptions = {
    body,
    icon,
    data: {
      url,
    },
    tag: "fcm-broadcast-message",
    renotify: true,
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const redirectUrl = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(redirectUrl));
});

console.log("✅ firebase-messaging-sw.js loaded and ready.");
