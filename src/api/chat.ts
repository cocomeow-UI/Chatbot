export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  choices: {
    message: Message;
  }[];
}

export async function sendMessage(messages: Message[]): Promise<Message> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch from API');
  }

  const data: ChatResponse = await response.json();
  return data.choices[0].message;
}
