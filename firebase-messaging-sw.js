importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

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
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
    data: {
      url: payload.data?.url || "/",
    },
    tag: "fcm-broadcast-message", // Consistent tag for these notifications
    renotify: true, // Ensures new notifications with the same tag trigger alerts
  };

  self.registration
    .showNotification(notificationTitle, notificationOptions)
    .then(() => {
      console.log(
        "[firebase-messaging-sw.js] Notification shown successfully."
      );
    })
    .catch((error) => {
      console.error(
        "[firebase-messaging-sw.js] Error showing notification:",
        error
      );
    });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(urlToOpen));
});

console.log("firebase-messaging-sw.js loaded and initialized with compat API.");
