const mongoose = require("mongoose");
const dns = require("dns");

// Configure public DNS resolvers to prevent ECONNREFUSED on SRV record lookups
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (err) {
  console.warn("Could not set custom DNS servers:", err.message);
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🍃 Connected successfully to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;