import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';
const app = express();
dotenv.config();

app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
app.use(express.json());

const conversationContext = [
  { role: 'system', content: 'You are a helpful assistant that answers dermatology questions.' },
];

app.post('/SkinScan-Chatbot', async (req, res) => {
  try {
    const userMessage = req.body.message;
    conversationContext.push({ role: 'user', content: userMessage });
    const response = await openai.chat.completions.create({
      messages: conversationContext,
      model: 'gpt-3.5-turbo',
    });
    const assistantReply = response.choices[0].message.content;
    res.json({ response: assistantReply });
    conversationContext.push({ role: 'assistant', content: assistantReply });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Dermatology Chatbot API is running at http://localhost:${port}`);
});
