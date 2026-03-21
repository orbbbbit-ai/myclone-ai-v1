import { useState } from "react";
import { ChatPreview } from "./components/chat-preview";
import { ChatModal } from "./components/chat-modal";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ChatPreview onClick={() => setOpen(true)} />
      <ChatModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}