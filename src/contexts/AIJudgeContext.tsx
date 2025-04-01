import * as React from "react";
import { createContext, useContext, useState } from "react";

interface DebateArgument {
  content: string;
  type: "argument" | "rebuttal";
  position: "pro" | "con";
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

interface AIJudgeContextType {
  isAnalyzing: boolean;
  currentScores: JudgementResponse | null;
  analyzeDebate: (topic: string, debateArgs: DebateArgument[]) => Promise<void>;
}

const AIJudgeContext = createContext<AIJudgeContextType>({
  isAnalyzing: false,
  currentScores: null,
  analyzeDebate: async () => {},
});

export const useAIJudge = () => useContext(AIJudgeContext);

export const AIJudgeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentScores, setCurrentScores] = useState<JudgementResponse | null>(
    null
  );

  const analyzeDebate = async (topic: string, debateArgs: DebateArgument[]) => {
    try {
      setIsAnalyzing(true);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-judge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ topic, arguments: debateArgs }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze debate");
      }

      const result = await response.json();
      setCurrentScores(result);
    } catch (error) {
      console.error("AI Judge error:", error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AIJudgeContext.Provider
      value={{ isAnalyzing, currentScores, analyzeDebate }}
    >
      {children}
    </AIJudgeContext.Provider>
  );
};
