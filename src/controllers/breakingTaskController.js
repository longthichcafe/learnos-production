const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { AzureOpenAI } = require("openai");

class BreakingTaskController {
    constructor() {
        this.apiKey = process.env.AZURE_OPENAI_API_KEY;
        this.apiVersion = "2024-02-01";
        this.azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
        this.chatHistory = [];

        this.client = new AzureOpenAI({
            apiKey: this.apiKey,
            apiVersion: this.apiVersion,
            azureEndpoint: this.azureEndpoint
        });

        this.lastRequestTime = 0;
        this.rateLimit = 1000; // 1 request per second in milliseconds
        this.maxRetries = 3; // Maximum number of retries
    }

    async _rateLimit() {
        const now = Date.now();
        const timeElapsed = now - this.lastRequestTime;
        if (timeElapsed < this.rateLimit) {
            await new Promise(resolve => setTimeout(resolve, this.rateLimit - timeElapsed));
        }
        this.lastRequestTime = Date.now();
    }

    async _extractTextFromFile(fileBuffer, fileName) {
        const fileExtension = path.extname(fileName).toLowerCase();
        let text = '';
    
        try {
            switch (fileExtension) {
                case '.txt':
                    text = fileBuffer.toString('utf-8'); // Decode buffer to text
                    break;
                case '.pdf':
                    const pdfContent = await pdf(fileBuffer); // Process PDF buffer
                    text = pdfContent.text;
                    break;
                case '.docx':
                    const result = await mammoth.extractRawText({ buffer: fileBuffer });
                    text = result.value;
                    break;
                default:
                    throw new Error('Unsupported file format. Please use TXT, PDF, or DOCX files.');
            }
        } catch (error) {
            console.error('Error reading file:', error);
            return null;
        }
        return text;
    }

    async breakDownTask(prompt = null, fileBuffer = null, fileName = '', maxTokens = 500, retryCount = 0) {
        await this._rateLimit();
        this.chatHistory = []; // Reset chat history
    
        let finalPrompt;
        const SYSTEM = `You are a helpful assistant designed to break down student assignments into simple, manageable steps. You must only return the exact JSON format like ${json_format} without any additional text or explanation.`;
    
        if (fileBuffer) {
            const fileContent = await this._extractTextFromFile(fileBuffer, fileName);
            if (!fileContent) {
                return 'Error: Unable to extract text from the file. Please check if the file format is supported.';
            }
            finalPrompt = `Here's the assignment description:\n\n${fileContent}\n\nBreak down this assignment into simple, manageable steps, and return the result in json format. The json should contain the "title" and "description" of each step.`;
        } else if (prompt) {
            finalPrompt = `Here's the assignment description:\n\n${prompt}\n\nBreak down this assignment into simple, manageable steps, and return the result in json format. The json should contain the "title" and "description" of each step.`;
        } else {
            throw new Error('Either prompt or file must be provided.');
        }

        try {
            const response = await this.client.chat.completions.create({
                model: 'gpt-35-turbo', // Or your deployment name
                messages: [
                    { role: 'system', content: SYSTEM },
                    { role: 'user', content: finalPrompt }
                ],
                max_tokens: maxTokens
            });

            // Process the response
            let text = response.choices[0].message.content.trim();

            // Extract JSON from the response text
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}');
        
            if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                const jsonString = text.slice(startIndex, endIndex + 1); // Extract the JSON string
                try {
                    const jsonObject = JSON.parse(jsonString); // Parse the JSON string into an object
                    // console.log('Parsed JSON:', JSON.stringify(jsonObject));
                    // Add the prompt and response to the chat history
                    this.chatHistory.push({ role: 'assistant', content: jsonString });
                    this.chatHistory.push({ role: 'user', content: finalPrompt });
                    return jsonObject;
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    return null;
                }
            } else {
                console.log('No JSON found in the text.');
                
                // Retry logic if no JSON was found
                if (retryCount < this.maxRetries) {
                    console.log(`Retrying... Attempt ${retryCount + 1} of ${this.maxRetries}`);
                    return await this.breakDownTask(prompt, file, maxTokens, retryCount + 1);
                } else {
                    return 'Error: Could not extract valid JSON after multiple attempts.';
                }
            }

        } catch (error) {
            console.error('Error breaking down task:', error);
            throw new Error('Error processing request with Azure OpenAI.');
        }
    }

    async breakSubTask(subtask, maxTokens = 500, retryCount = 2) {
        await this._rateLimit();

        const finalPrompt = `Break this task down into smaller subtasks:\n\n${subtask.title}: ${subtask.description}\n\nReturn the subtasks in JSON format, where each subtask has a "title" and "description".`;
        const json_format = {
            "task": {
                "title": "",
                "description": ""
            }
        };
        try {
            const response = await this.client.chat.completions.create({
                model: 'gpt-35-turbo',
                messages: [
                    ...this.chatHistory, // Include the entire chat history for context
                    { role: 'system', content: `You are a helpful assistant designed to break tasks into subtasks. Return only JSON in this format ${json_format}` },
                    { role: 'user', content: finalPrompt }
                ],
                max_tokens: maxTokens
            });

            let text = response.choices[0].message.content.trim();
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}');

            if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                const jsonString = text.slice(startIndex, endIndex + 1);
                const jsonObject = JSON.parse(jsonString);

                // Add the new message to the chat history
                // this.chatHistory.push({ role: 'assistant', content: text });
                // console.log(jsonObject)
                return jsonObject;
            } else {
                if (retryCount < this.maxRetries) {
                    return await this.breakSubTask(subtask, maxTokens, retryCount + 1);
                } else {
                    return 'Error: Could not extract valid JSON after multiple attempts.';
                }
            }
        } catch (error) {
            throw new Error('Error processing request with Azure OpenAI.');
        }
    }

    // Main method to handle request and response
    async breakdown(req, res) {
        try {
            const fileBuffer = req.file ? req.file.buffer : null;
            const fileName = req.file ? req.file.originalname : '';
            const prompt = req.body.prompt || '';
    
            const result = await this.breakDownTask(prompt, fileBuffer, fileName);
            res.json({ result });
        } catch (error) {
            console.error('Error processing task:', error);
            res.status(500).json({ error: 'Error processing the request.' });
        }
    }

    // Main method to handle subtask breakdown request and response
    async breakdownSubtask(req, res) {
        try {
            const subtask = req.body.step;
            // console.log('Subtask:', subtask);
            const result = await this.breakSubTask(subtask);
            res.json({ result });
        } catch (error) {
            res.status(500).json({ error: 'Error processing the subtask request.' });
        }
    }
}

module.exports = BreakingTaskController;