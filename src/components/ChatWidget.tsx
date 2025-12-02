import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Chatbot from './Chatbot';
import { Button } from './ui/button';

interface ChatWidgetProps {
  apiUrl?: string;
}

export default function ChatWidget({ apiUrl }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6">
        <Button
          size="icon-lg"
          className="rounded-full shadow-lg bg-[color:var(--vn-red-soft)] text-[color:var(--vn-yellow-soft)] hover:bg-[color-mix(in_srgb,var(--vn-red-soft) 88%,var(--vn-yellow) 12%)]"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Đóng chatbot HCM202' : 'Mở chatbot HCM202'}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed inset-x-2 bottom-20 z-40 w-[calc(100%-1rem)] max-w-md mx-auto
                     md:bottom-24 md:right-6 md:left-auto md:w-[90vw]"
        >
          <Chatbot
            apiUrl={apiUrl}
            className="shadow-2xl border border-[color:var(--vn-red-soft)]/40 bg-[color:var(--card)]/98 backdrop-blur-md"
          />
        </div>
      )}
    </>
  );
}


