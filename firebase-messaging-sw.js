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
  console.log("[SW] Background message received:", payload);
  
  const { title, body, url } = payload.data;
  const notificationOptions = {
    body: body,
    icon: "/firebase-logo.png",
    data: { url },
    tag: "fcm-update",
    renotify: false
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const redirectUrl = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(redirectUrl));
});

console.log("✅ firebase-messaging-sw.js loaded and ready.");
