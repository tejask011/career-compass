# 🎯 Career Compass AI

An AI-powered career guidance platform that analyzes your resume and provides actionable insights to accelerate your career growth.

## ✨ Features

- **Resume Analysis** — Upload a PDF, image, or paste text to get an AI-powered review
- **Improved Resume** — Receive a professionally rewritten version of your resume in clean markdown format
- **Skill Gap Analysis** — Identify 4–6 missing or weak skills with importance levels, along with curated study resource links (YouTube, freeCodeCamp, Google)
- **Career Path Suggestions** — Get 3–4 role recommendations with match percentages, required skills, and real company hiring links
- **30-Day Growth Roadmap** — A personalized day-by-day action plan split into phases with time estimates
- **PDF Text Extraction** — Uses `pdfjs-dist` to reliably extract text from uploaded PDF resumes
- **Image OCR Support** — Uses `tesseract.js` to extract text from resume images via Optical Character Recognition
- **Drag & Drop Upload** — Simply drag your file onto the upload area

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18, TypeScript, Vite          |
| Styling     | Tailwind CSS, shadcn/ui components  |
| Animations  | Framer Motion                       |
| PDF Parsing | pdfjs-dist (browser-side)           |
| Image OCR   | tesseract.js (browser-side)         |
| Backend     | Supabase Edge Functions (Deno)      |
| AI Model    | OpenAI-compatible chat completions  |

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tejask011/career-compass-ai-000.git
cd career-compass-ai-000
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── results/
│   │   ├── ImprovedResume.tsx    # Displays the AI-rewritten resume
│   │   ├── SkillGaps.tsx         # Shows skill gaps with resource links
│   │   ├── CareerSuggestions.tsx  # Career path recommendations
│   │   └── Roadmap.tsx           # 30-day growth plan
│   ├── ResumeInput.tsx           # File upload & text input component
│   └── ResultsTabs.tsx           # Tab navigation for results
├── utils/
│   ├── pdfTextExtractor.ts       # PDF text extraction utility
│   └── imageTextExtractor.ts     # Image OCR text extraction utility
├── types/
│   └── analysis.ts               # TypeScript interfaces
├── pages/
│   └── Index.tsx                  # Main application page
└── integrations/
    └── supabase/
        └── client.ts             # Supabase client configuration

supabase/
└── functions/
    └── analyze-resume/
        └── index.ts              # AI analysis edge function
```

## 🧪 Usage

1. **Open the app** in your browser
2. **Upload** a PDF or image of your resume, or **paste** the text directly
3. **Click "Analyze My Resume"** to start the AI analysis
4. **Browse the results** across four tabs:
   - 📄 Improved Resume
   - ⚠️ Skill Gaps (with study resource links)
   - 🎯 Career Paths
   - 📅 30-Day Plan

## 📜 License

MIT
