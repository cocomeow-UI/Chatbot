import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import { sendMessage, type Message } from '../api/chat';
import { SYSTEM_PROMPT } from '../constants/prompt';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'assistant', content: '안녕하세요! 저는 여러분의 영어 학습을 도와줄 챗봇입니다. 어떤 주제나 난이도로 공부하고 싶으신가요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessage = await sendMessage(newMessages);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'assistant', content: '안녕하세요! 저는 여러분의 영어 학습을 도와줄 챗봇입니다. 어떤 주제나 난이도로 공부하고 싶으신가요?' }
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-info">
          <Bot className="icon-bot" />
          <h2>영단어 퀴즈 챗봇</h2>
        </div>
        <button onClick={resetChat} className="reset-button" title="대화 초기화">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.filter(m => m.role !== 'system').map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role}`}>
            <div className="avatar">
              {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-content">
              <div className="message-bubble">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper assistant">
            <div className="avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="message-bubble loading">
                <Loader2 className="animate-spin" size={20} />
                <span>답변을 생성 중입니다...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메시지를 입력하세요... (예: 초보자 난이도로 '여행' 주제)"
          rows={1}
        />
        <button 
          onClick={handleSend} 
          disabled={!input.trim() || isLoading}
          className="send-button"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
