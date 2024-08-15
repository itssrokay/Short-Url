const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require('./model/url');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the router for URL-related routes
app.use('/url', urlRoute);

// Add a test route to fetch all URLs
app.use('/all-urls', async (req, res) => {
  try {
    const urls = await URL.find({});
    res.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).send('Error fetching URLs');
  }
});

// Redirect handling (keep this last)
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    console.log(`Attempting to redirect shortId: ${shortId}`);

    try {
        const entry = await URL.findOne({ shortId });

        if (!entry) {
            console.log(`URL not found for shortId: ${shortId}`);
            return res.status(404).send("URL not found");
        }

        console.log(`Redirecting to: ${entry.redirectURL}`);
        await URL.updateOne(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } }
        );
        
        // Ensure the redirectURL has a proper schema
        let redirectURL = entry.redirectURL;
        if (!redirectURL.startsWith("http://") && !redirectURL.startsWith("https://")) {
            redirectURL = "https://" + redirectURL;
        }
        
        return res.redirect(redirectURL);
    } catch (error) {
        console.error(`Error during redirect: ${error}`);
        return res.status(500).send("Internal Server Error");
    }
});

// Connect to MongoDB
connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(port, () => console.log(`Server started at port ${port}`));