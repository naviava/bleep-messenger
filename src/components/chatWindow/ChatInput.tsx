"use client";

// React and Next.
import { useCallback, useRef, useState } from "react";

// External packages.
import axios from "axios";
import { toast } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

// Components.
import ClientOnly from "../ClientOnly";
import Button from "../ui/Button";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!input) return;

    setIsLoading(true);
    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textareaRef.current?.focus();
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [chatId, input]);

  return (
    <ClientOnly>
      <div className="mb-2 border-t border-gray-200 px-4 pt-4 sm:mb-0">
        <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-primary-1">
          <TextareaAutosize
            ref={textareaRef}
            onKeyDown={(evt) => {
              if (evt.key === "Enter" && !evt.shiftKey) {
                evt.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            value={input}
            onChange={(evt) => setInput(evt.target.value)}
            placeholder={`Message ${chatPartner.name}`}
            className="block w-full resize-none border-0 bg-transparent text-gray-200 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
          />
          <div
            onClick={() => textareaRef.current?.focus()}
            aria-hidden="true"
            className="py-2"
          >
            <div className="py-px">
              <div className="h-9" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex-shrink-0">
              <Button isLoading={isLoading} onClick={sendMessage} type="submit">
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};

export default ChatInput;
