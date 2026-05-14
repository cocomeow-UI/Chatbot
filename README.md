# 영단어 퀴즈 챗봇

사용자가 원하는 주제와 난이도에 맞춰 영어 단어를 학습하고 퀴즈를 풀 수 있는 챗봇입니다.

## 기술 스택
- **Frontend**: React, TypeScript, Vite, Lucide React
- **Backend**: Vercel Serverless Functions (Edge Runtime)
- **AI**: OpenAI API (gpt-4o-mini)

## 로컬 설정

1. 저장소를 클론합니다.
2. `.env.local` 파일을 생성하고 OpenAI API 키를 입력합니다.
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```
3. 의존성을 설치합니다.
   ```bash
   npm install
   ```
4. 개발 서버를 실행합니다.
   ```bash
   npm run dev
   ```

## Vercel 배포 시 설정 방법

1. [Vercel 대시보드](https://vercel.com)에서 프로젝트를 생성합니다.
2. **Project Settings > Environment Variables**로 이동합니다.
3. 다음 변수를 추가합니다.
   - `OPENAI_API_KEY`: 발급받은 OpenAI API 키
4. 프로젝트를 다시 배포(Redeploy)합니다.

## 주의 사항
- API Key는 절대로 Git에 커밋하지 마세요. `.gitignore`에 `.env.local`이 포함되어 있는지 확인하세요.
- 답변이 "죄송합니다"로 시작하는 에러가 발생하면, 화면에 표시되는 상세 원인을 확인해주세요.
