import { motion } from "motion/react";

interface Message {
  type: "ai" | "user";
  text: string;
}

interface ChatPreviewProps {
  onClick: () => void;
}

export function ChatPreview({ onClick }: ChatPreviewProps) {
  const messages= []
 const messages = [
  { type: "ai", text: "Hey! What are you looking to build?" },
  { type: "user", text: "A fintech mobile app" },
  { type: "ai", text: "Nice! Let me understand a bit more..." }
];  


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <div className="p-6 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.type === "ai" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.2 }}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                message.type === "ai"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </motion.div>
        ))}
        <div className="flex items-center justify-center pt-2">
          <p className="text-sm text-gray-500">Click to continue chatting →</p>
        </div>
      </div>
    </motion.div>
  );
}
