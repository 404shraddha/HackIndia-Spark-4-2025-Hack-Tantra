import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface DebateArgument {
  content: string;
  type: "argument" | "rebuttal";
  position: "pro" | "con";
}

interface JudgementRequest {
  topic: string;
  arguments: DebateArgument[];
}

interface JudgementResponse {
  scores: {
    pro: number;
    con: number;
  };
  feedback: {
    pro: string[];
    con: string[];
  };
  fallacies: {
    pro: string[];
    con: string[];
  };
  summary: string;
}

const PROMPT_TEMPLATE = `You are an expert debate judge evaluating a formal debate. Analyze the following debate on the topic: "{topic}"

Pro Arguments:
{proArguments}

Con Arguments:
{conArguments}

Evaluate based on:
1. Logical consistency (30%)
2. Evidence quality (25%)
3. Rhetorical effectiveness (25%)
4. Argument structure (20%)

Provide a structured analysis in the following JSON format:
{
  "scores": {
    "pro": <0-100 score>,
    "con": <0-100 score>
  },
  "feedback": {
    "pro": ["<specific feedback point>", ...],
    "con": ["<specific feedback point>", ...]
  },
  "fallacies": {
    "pro": ["<identified fallacy>", ...],
    "con": ["<identified fallacy>", ...]
  },
  "summary": "<brief overall analysis>"
}`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post("/api/judge", async (req: Request, res: Response): Promise<void> => {
  try {
    const { arguments: debateArgs, topic }: JudgementRequest = req.body;

    const proArgs = debateArgs
      .filter((arg) => arg.position === "pro")
      .map((arg) => arg.content)
      .join("\n");

    const conArgs = debateArgs
      .filter((arg) => arg.position === "con")
      .map((arg) => arg.content)
      .join("\n");

    const prompt = PROMPT_TEMPLATE.replace("{topic}", topic)
      .replace("{proArguments}", proArgs)
      .replace("{conArguments}", conArgs);

    const result = await model.generateContent(prompt);
    const response: JudgementResponse = JSON.parse(result.response.text());

    res.status(200).json(response);
  } catch (error) {
    console.error("AI Judge error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
