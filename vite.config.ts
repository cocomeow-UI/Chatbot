import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { OpenAI } from 'openai'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      {
        name: 'api-chat-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/chat' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const { messages } = JSON.parse(body);
                  const apiKey = env.OPENAI_API_KEY;

                  if (!apiKey) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'OPENAI_API_KEY가 설정되지 않았습니다.' }));
                    return;
                  }

                  const openai = new OpenAI({ apiKey });
                  const response = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: messages,
                    temperature: 0.7,
                  });

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(response));
                } catch (error: any) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: error.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
  }
})
