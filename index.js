const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");

const app = express();
const port = 8000;

// Middleware to parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the router
app.use('/', urlRoute);

// Connect to MongoDB
connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(port, () => console.log(`Server started at port ${port}`));
