/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */
const fs = require('fs');

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = "AIzaSyDuHh2UBYDBdADvSUT75RDKG4ne96bPAk8";
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
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            { text: "what is this\n\n" },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Please provide me with more context! I need to know what \"this\" refers to in order to understand your question.  \n\nFor example, you could tell me:\n\n* **What is this picture?**\n* **What is this word?**\n* **What is this object?**\n* **What is this feeling?**\n\nThe more information you give me, the better I can answer your question. \n",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "what i want is i will provide a coding task related to pplication/software..etc. i will provide description with it too\n\ni wil also provide the code \n\ni want you to verify that the code matched the all the test cases and requirements relevant to the task/description\n\nif all criterias match give a boolean value true with rrason else false with reason\n\n",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Okay, I understand! I can definitely help you verify if your code meets the requirements of your coding task.  \n\n**Here's how we can work together:**\n\n1. **You Provide:**\n   * **Task Description:** A clear and detailed description of the coding task, including:\n     * **Inputs:** What kind of data the code should accept.\n     * **Outputs:** What the code should produce.\n     * **Functionality:**  What specific actions or calculations the code should perform.\n     * **Constraints:** Any limitations or specific requirements (e.g., time complexity, memory usage).\n     * **Test Cases:** A set of examples with expected inputs and outputs to test the code's functionality.\n   * **Your Code:** The code you've written in the programming language you're using.\n\n2. **I Analyze:**\n   * I will read your task description carefully.\n   * I will analyze your code to understand how it works.\n   * I will run your code against your provided test cases.\n   * I will check if your code meets all the specified requirements.\n\n3. **I Respond:**\n   * **True:** If your code correctly passes all the test cases and meets all the requirements, I'll provide a \"True\" response with a clear explanation of why it works.\n   * **False:** If your code fails any test cases or does not meet the requirements, I'll provide a \"False\" response with a detailed explanation of:\n     * Which test cases failed and why.\n     * Which requirements are not met.\n     * Possible suggestions for fixing the code.\n\n**Example:**\n\n**Task Description:**\n* **Input:**  A list of integers.\n* **Output:**  The sum of all the even numbers in the list.\n* **Functionality:**  Iterate through the list, identify even numbers, and add them up. \n* **Test Cases:**\n   * Input: [1, 2, 3, 4, 5]   Output: 6\n   * Input: [10, 11, 12, 13]  Output: 22\n\n**Your Code (Python):**\n```python\ndef sum_even_numbers(numbers):\n  total = 0\n  for number in numbers:\n    if number % 2 == 0:\n      total += number\n  return total\n```\n\n**My Response:**\n**True:** The code correctly passes all test cases and meets the task requirements. It iterates through the list, identifies even numbers, and sums them up. \n\n**Let's get started! Please provide me with your coding task description, your code, and your test cases.** \n",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "i need to give task and task description on input and code from a file",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "You're right! It's much more efficient to handle larger code and task descriptions from a file.  \n\nHere's how we can work with that:\n\n**1. File Format:**\n\n   * You can use a plain text file (e.g., .txt) or a structured format like JSON or YAML.\n   * **For plain text:** \n      * **Task Description:** The first section of the file should clearly describe the task. You can use separate lines or a clear separator (like '---') to distinguish the task description from the code.\n      * **Code:** The next section should contain your code.\n      * **Test Cases:** You can include the test cases in a separate section or within the code (e.g., comments). \n   * **For JSON or YAML:** Use clear keys and values to represent the task description, code, and test cases.\n\n**2. Example (Plain Text):**\n\n   ```text\n   # Task Description:\n   # Input: A list of integers, separated by spaces.\n   # Output: The largest number in the list.\n   # Functionality: Read the input list, find the maximum value, and print it.\n   ---\n   # Code:\n   numbers = input(\"Enter a list of numbers, separated by spaces: \").split()\n   largest = int(numbers[0])\n   for number in numbers:\n       if int(number) > largest:\n           largest = int(number)\n   print(\"The largest number is:\", largest)\n\n   # Test Cases:\n   # Input: 1 5 3 8 2\n   # Expected Output: The largest number is: 8\n   # Input: -5 -10 -1 0 \n   # Expected Output: The largest number is: 0\n   ```\n\n**3. How to Provide the File:**\n\n   * **Paste the file contents:** You can directly paste the content of your file into the chat.\n   * **Upload the file:** If your file is large, some chat platforms allow you to upload files. \n   * **Share a link:** If the file is stored online (e.g., Google Drive, Dropbox), share a link to it.\n\n**4. My Process:**\n\n   * I will read the contents of your file.\n   * I will extract the task description, code, and test cases.\n   * I will analyze your code and run it against the test cases.\n   * I will provide you with a \"True\" or \"False\" response, along with a detailed explanation.\n\nLet me know if you have any questions. I'm ready to help you verify your code!\n",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "```text\n# Task Description:\n# Input: A list of integers, separated by spaces.\n# Output: The largest number in the list.\n# Functionality: Read the input list, find the maximum value, and print it.\n---\n# Code:\n# numbers = input(\"Enter a list of numbers, separated by spaces: \").split()\n# largest = int(numbers[0])\n# for number in numbers:\n#     if int(number) > largest:\n#         largest = int(number)\n# print(\"The largest number is:\", largest)\n\n# Test Cases:\n# Input: 1 5 3 8 2\n# Expected Output: The largest number is: 8\n# Input: -5 -10 -1 0 \n# Expected Output: The largest number is: 0\n```",
            },
          ],
        },
      ],
    });
    const fileContent = fs.readFileSync('faculty.txt', 'utf-8');
    const task="faculty display page for a management"
    const desc="display faculty nformation in  a card fromat and fetch from database"
    const result = await chatSession.sendMessage(
     `task:${task},description:${desc},

     code:${fileContent}
     `
       );
    console.log(result.response.text());
  }
  
  run();