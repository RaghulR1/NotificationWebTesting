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

// ✅ Background Message Handler
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/firebase-logo.png", // ✅ Customize if needed
    data: {
      url: payload.data?.url || "/", // ✅ redirect URL
    },
    tag: "fcm-notification", // ✅ Unified tag
    renotify: false, // Avoid repeat noise
  };

  // ✅ Show notification only in background
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ Handle click on notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification?.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

console.log("✅ firebase-messaging-sw.js loaded and ready.");
