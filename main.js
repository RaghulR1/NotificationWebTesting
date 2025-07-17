import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyATWxiI8TKMWKJ_zHnJuUGC_bhDe10a40U",
  authDomain: "push-notification-f-57df8.firebaseapp.com",
  projectId: "push-notification-f-57df8",
  storageBucket: "push-notification-f-57df8.appspot.com",
  messagingSenderId: "771076590862",
  appId: "1:771076590862:web:2a85f94fd7e6e96cd5db5f",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Get Messaging instance
const messaging = getMessaging(app);

// ✅ Register Service Worker
navigator.serviceWorker
  .register("/NotificationWebTesting/firebase-messaging-sw.js")
  .then((registration) => {
        getToken(messaging, { serviceWorkerRegistration: registration, vapidKey: 'BCSCbL1yqUuR0mKE6Oo1bNCnrxwvKKyM5fDALam6drZIG0KQBYD-5atku28OqE-Rvk-DReHtoTrttXFwxRziycY' })
    })
  
  .catch((err) => {
    console.error("❌ Service Worker registration failed:", err);
    alert("❌ Service Worker registration failed: " + err.message);
  });

// ✅ Generate or load user ID
function getOrCreateUserId() {
  let userId = localStorage.getItem("webUserId");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("webUserId", userId);
    console.log("✅ New webUserId:", userId);
  } else {
    console.log("✅ Loaded webUserId:", userId);
  }
  return userId;
}

// ✅ Button click handler
document
  .getElementById("enable-notifications")
  .addEventListener("click", async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("❌ Notification permission denied.");
        return;
      }

      // ✅ Get FCM token
      const token = await getToken(messaging, {
        vapidKey:
          "BCSCbL1yqUuR0mKE6Oo1bNCnrxwvKKyM5fDALam6drZIG0KQBYD-5atku28OqE-Rvk-DReHtoTrttXFwxRziycY",
      });

      if (!token) {
        alert("❌ Failed to get FCM token.");
        console.error("❌ FCM token was empty/null");
        return;
      }

      console.log("✅ FCM Token:", token);

      const userId = getOrCreateUserId();

      // ✅ Send to backend (optional)
      const response = await fetch(
        "https://backendfornotification.onrender.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            token: token,
            platform: "web",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        alert("❌ Backend error: " + errorText);
        console.error("❌ Backend error:", errorText);
        return;
      }

      const result = await response.text();
      alert("✅ Backend response: " + result);
      console.log("✅ Backend response:", result);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ Error: " + err.message);
    }
  });

onMessage(messaging, (payload) => {
  const { title, body, url } = payload.data;
  console.log("Foreground message:", title, body);
  
});

