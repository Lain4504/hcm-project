import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    page?: number;
    text: string;
    similarity?: number;
  }>;
  timestamp: Date;
}

interface ChatbotProps {
  apiUrl?: string;
  className?: string;
}

export default function Chatbot({ apiUrl, className }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI cho môn học Tư tưởng Hồ Chí Minh (HCM202). Tôi có thể giúp bạn trả lời các câu hỏi về giáo trình. Hãy đặt câu hỏi của bạn!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Gọi API endpoint server-side thay vì gọi Gemini trực tiếp từ client
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể kết nối đến server');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'Xin lỗi, tôi chưa thể tạo được câu trả lời phù hợp cho câu hỏi này. Bạn hãy thử diễn đạt lại câu hỏi rõ hơn trong phạm vi môn HCM202 của Trường Đại học FPT (Tư tưởng Hồ Chí Minh).',
        sources: data.sources || [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card
      className={`flex flex-col h-[75vh] max-h-[720px] w-full sm:w-[400px] lg:w-[460px] ${className || ''}`}
    >
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-[color:var(--vn-red-soft)]" />
          <span>Chatbot HCM202</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages area - dùng div thuần với overflow-y-auto */}
        <div className="flex-1 px-4 py-4 pr-3 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[color:var(--vn-red-soft)]/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-[color:var(--vn-red-soft)]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-[color:var(--vn-red-soft)] text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">
                        Nguồn tham khảo:
                      </p>
                      {message.sources.slice(0, 3).map((source, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                          {source.page && (
                            <span className="font-semibold">Trang {source.page}</span>
                          )}
                          {source.similarity && (
                            <span className="ml-2">
                              ({Math.round(source.similarity * 100)}% liên quan)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[color:var(--vn-yellow-soft)]/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-[color:var(--vn-yellow-soft)]" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[color:var(--vn-red-soft)]/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-[color:var(--vn-red-soft)]" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm border-t">
            {error}
          </div>
        )}

        {/* Input area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

