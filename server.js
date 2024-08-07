const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the same directory

// Initialize Google Generative AI
const apiKey = "AIzaSyDuHh2UBYDBdADvSUT75RDKG4ne96bPAk8"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Endpoint to verify code
app.post('/verify', async (req, res) => {
    const { task, description, code } = req.body;

    try {
        // Create a chat session for code verification
        const chatSession = model.startChat({
          generationConfig,
          history: [
              {
                  role: "user",
                  parts: [
                      {
                          text: `I will provide a coding task and a description. You will receive a file containing the code related to the task. Your task is to verify if the code meets the requirements based on the following criteria:
                          1. Accuracy to test cases
                          2. Code analysis
                          3. Improvements
                          4. Final acceptance/rejection with reasons`
                      }
                  ]
              },
              {
                  role: "model",
                  parts: [
                      {
                          text: `Understood! I'll evaluate the provided code based on the criteria:
                          1. **Accuracy to Test Cases:** Verify if the code meets the task requirements and passes the test cases.
                          2. **Code Analysis:** Analyze the code for quality, structure, and best practices.
                          3. **Improvements:** Provide suggestions for enhancing the code.
                          4. **Final Acceptance/Rejection:** State whether the code is accepted or rejected and explain the reasons.
                          
                          Please provide the code file along with the task and description.`
                      }
                  ]
              },
              {
                  role: "user",
                  parts: [
                      {
                          text: `I have provided a task and a description. The uploaded file contains the application code. Please evaluate it and return:
                          1. **Acceptance Status:** Accepted or Rejected
                          2. **Reasons:** Specific reasons for the decision
                          3. **Improvements:** Suggestions for code enhancement but no code should be there`

                      }
                  ]
              }
          ]
      });
        
    const result = await chatSession.sendMessage(
        `task:${task},description:${description},
   
        code:${code}
        `
          );
       console.log(result.response.text());
       
        res.json(result.response.text());
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).send('Error verifying code');
    }
});

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
