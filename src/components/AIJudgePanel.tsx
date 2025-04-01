import * as React from "react";
import { Brain, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useAIJudge } from "../contexts/AIJudgeContext";

interface AIJudgePanelProps {
  position: "pro" | "con";
}

const AIJudgePanel: React.FC<AIJudgePanelProps> = ({
  position,
}: AIJudgePanelProps) => {
  const { isAnalyzing, currentScores } = useAIJudge();

  if (!currentScores) {
    return (
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-press-start">AI Judge</span>
        </div>
        {isAnalyzing ? (
          <div className="space-y-2">
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
            <p className="text-xs text-gray-400">Analyzing arguments...</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Waiting for debate to progress...
          </p>
        )}
      </div>
    );
  }

  const score =
    position === "pro" ? currentScores.scores.pro : currentScores.scores.con;
  const feedback =
    position === "pro"
      ? currentScores.feedback.pro
      : currentScores.feedback.con;
  const fallacies =
    position === "pro"
      ? currentScores.fallacies.pro
      : currentScores.fallacies.con;

  return (
    <div className="glass-panel p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-press-start">AI Analysis</span>
        </div>
        <div className="text-xl font-press-start text-emerald-400">
          {score}/100
        </div>
      </div>

      {feedback && feedback.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-press-start">Feedback</span>
          </div>
          <ul className="space-y-1">
            {feedback.map((point, index) => (
              <li key={index} className="text-sm text-gray-300 flex gap-2">
                <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fallacies && fallacies.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-press-start">Logical Fallacies</span>
          </div>
          <ul className="space-y-1">
            {fallacies.map((fallacy, index) => (
              <li key={index} className="text-sm text-yellow-400 flex gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{fallacy}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIJudgePanel;
