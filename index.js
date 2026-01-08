const express = require("express");
const openai = require("./src/lib/openai");
const { logToFile } = require("./src/utils/logger");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = 5100;

app.get("/detect", async (req, res) => {
    try {
        const {prompt, settings} = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [{role: "user", content: `I will give you a prompt and settings object
                which includes optional topics, return me an array of the detected topics in the text. 
                If there are no topics detected, return an empty array.
                only topics with true next to them should be included in the detected topics array.
                Do not include any other text, only return the detected topics array.
                
                Here is the prompt: ${prompt}
                Here are the settings: ${JSON.stringify(settings)}`}],
        });

        logToFile(JSON.stringify({kind: "detect", prompt, result: completion.choices[0].message.content }))

        res.json({detected_topics: completion.choices[0].message.content});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "We have a problem detecting the topics" });
    }
});

app.get("/protect", async (req, res) => {
        try {
        const {prompt, settings} = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [{role: "user", content: `I will give you a prompt and settings object
                which includes optional topics, return me as fast as possible an array of the first detected topic you find in the text. 
                If there are no topics detected, return an empty array.
                only topics with true next to them should be included in the detected topics array.
                Do not include any other text, only return the detected topic in an array.
                
                Here is the prompt: ${prompt}
                Here are the settings: ${JSON.stringify(settings)}`}],
        });

        res.json({detected_topics: completion.choices[0].message.content});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "We have a problem detecting the topics" });
    }

});

const logFilePath = path.join(__dirname, "logs/ai-usage.log");

app.get("/logs", (_, res) => {
    fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read log file" });
    }

    return res.json(data);
    });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
