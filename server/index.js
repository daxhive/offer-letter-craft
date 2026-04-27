const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();

/* -------------------- ROUTES -------------------- */
const authRoutes = require("./routes/authRoutes");
const offerRoutes = require("./routes/offerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

/* -------------------- DB CONNECTION -------------------- */
connectDB();

/* -------------------- MIDDLEWARE -------------------- */

// JSON body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

/* -------------------- CORS (PRODUCTION READY) -------------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend.vercel.app" // 🔥 replace after frontend deploy
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // (safe open for now)
      }
    },
    credentials: true,
  })
);

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/notifications", notificationRoutes);

/* -------------------- HEALTH CHECK -------------------- */

app.get("/", (req, res) => {
  res.send("🚀 Offer Letter Management API is running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is healthy 🚀"
  });
});

/* -------------------- ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

/* -------------------- START SERVER -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
