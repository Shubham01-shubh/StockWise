
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing from server/.env");
  }

  // Avoid printing credentials if the URI changes later.
  console.log(
    "MongoDB retryable writes:",
    new URL(uri).searchParams.get("retryWrites") ?? "(not specified)"
  );

  await mongoose.connect(uri, {
    retryWrites: false,
  });

  console.log("MongoDB connected successfully");
};

module.exports = connectDB;
