
import React, { useState, useEffect } from 'react';
import { CodeDisplay } from './components/CodeDisplay';
import { GenerationHistory } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'fullstack' | 'devops' | 'cloudrun'>('fullstack');
  const [prompt, setPrompt] = useState('');
  const [backendUrl, setBackendUrl] = useState('https://YOUR_CLOUD_RUN_URL/ai/generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState('');
  const [history, setHistory] = useState<GenerationHistory[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('ai_generation_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setCurrentResult('');

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: prompt }),
      });
      if (!response.ok) throw new Error('Backend error');
      const data = await response.json();
      const newResult = data.generated_code || "No code generated.";
      setCurrentResult(newResult);
      
      const newHistoryItem: GenerationHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        prompt: prompt,
        code: newResult
      };
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('ai_generation_history', JSON.stringify(updatedHistory));
    } catch (error) {
      alert("Lỗi kết nối Backend. Hãy kiểm tra URL Cloud Run.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-[#0F172A] text-white flex flex-col shadow-2xl shrink-0 overflow-hidden">
        <div className="p-8 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <i className="fas fa-project-diagram text-2xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase leading-tight">Fullstack</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Architect Hub</p>
            </div>
          </div>
        </div>
        
        <nav className="p-6 space-y-2 overflow-y-auto">
          <SidebarItem icon="fas fa-mountain" label="Blueprint Architecture" active={activeTab === 'fullstack'} onClick={() => setActiveTab('fullstack')} />
          <SidebarItem icon="fas fa-infinity" label="CI/CD & DevOps" active={activeTab === 'devops'} onClick={() => setActiveTab('devops')} />
          <SidebarItem icon="fas fa-bolt" label="AI Playground" active={activeTab === 'generator'} onClick={() => setActiveTab('generator')} />
          <SidebarItem icon="fas fa-cloud" label="Cloud Infrastructure" active={activeTab === 'cloudrun'} onClick={() => setActiveTab('cloudrun')} />
        </nav>

        <div className="mt-auto p-8 border-t border-slate-800 bg-slate-900/50">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <i className="fas fa-user-shield text-xs"></i>
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-300">ADMIN CONSOLE</p>
                <p className="text-[9px] text-slate-500 font-medium">v3.1.2 stable</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-10 py-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-indigo-600/20">Production</span>
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              {activeTab === 'fullstack' ? 'System Masterplan' : activeTab === 'devops' ? 'DevOps Pipeline' : activeTab === 'generator' ? 'AI Code Lab' : 'Infrastructure Config'}
            </h2>
          </div>
          <div className="flex items-center gap-8">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <i className="fas fa-globe text-indigo-500"></i>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">GCP Asia-East1</span>
             </div>
          </div>
        </header>

        <div className="p-10 flex-1 max-w-7xl w-full mx-auto space-y-12 pb-24">
          {activeTab === 'fullstack' && <FullStackBlueprintView />}
          {activeTab === 'devops' && <DevOpsView />}
          {activeTab === 'generator' && <GeneratorView prompt={prompt} setPrompt={setPrompt} isGenerating={isGenerating} handleGenerate={handleGenerate} currentResult={currentResult} />}
          {activeTab === 'cloudrun' && <CloudConfigView />}
        </div>
      </main>
    </div>
  );
};

const SidebarItem: React.FC<any> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
    <i className={`${icon} text-lg w-6`}></i>
    <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
  </button>
);

const FullStackBlueprintView = () => {
  const [subTab, setSubTab] = useState<'diagram' | 'frontend' | 'backend'>('diagram');

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner">
        <SubTabBtn label="Fullstack Diagram" active={subTab === 'diagram'} onClick={() => setSubTab('diagram')} />
        <SubTabBtn label="Frontend Template" active={subTab === 'frontend'} onClick={() => setSubTab('frontend')} />
        <SubTabBtn label="Backend Template" active={subTab === 'backend'} onClick={() => setSubTab('backend')} />
      </div>

      {subTab === 'diagram' && (
        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-10 flex items-center gap-4">
              <i className="fas fa-project-diagram text-indigo-600"></i>
              1. Full-Stack Architecture Diagram
            </h3>
            <div className="bg-[#0F172A] p-10 rounded-3xl font-mono text-sm text-indigo-400 leading-loose border border-slate-800 shadow-2xl overflow-x-auto whitespace-pre">
{`[ USER BROWSER ]
      |
      | (HTTP/JSON over SSL)
      v
+-----------------------------------------------------------+
|               FRONTEND LAYER (Static Assets)               |
|  - Framework: React 18+                                   |
|  - Styling: TailwindCSS                                   |
|  - State: Zustand / Redux Toolkit                         |
|  - Service: Axios with Interceptors                       |
+-----------------------------+-----------------------------+
                              |
                              | (API Request)
                              v
+-----------------------------------------------------------+
|               BACKEND LAYER (Cloud Run)                    |
|  - Framework: FastAPI (Python 3.10)                       |
|  - Server: Uvicorn                                        |
|  - Docs: Swagger / OpenAPI                                 |
+---------+-------------------+-------------------+---------+
          |                   |                   |
          v                   v                   v
+-------------------+ +-------------------+ +-------------------+
|  AI ENGINE        | |   DATABASE        | |   CI/CD PIPELINE  |
|  Google Gemini    | |   Cloud SQL       | |   Cloud Build     |
|  (Flash/Pro)      | |   (PostgreSQL)    | |   Artifact Reg    |
+-------------------+ +-------------------+ +-------------------+`}
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard icon="fas fa-exchange-alt" title="Unidirectional" desc="Dữ liệu luân chuyển một chiều từ UI tới AI Service." />
              <FeatureCard icon="fas fa-shield-alt" title="Secure" desc="JWT Authentication & Environment Secrets." />
              <FeatureCard icon="fas fa-expand-arrows-alt" title="Scalable" desc="Triển khai serverless tự động co giãn theo tải." />
            </div>
          </div>

          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-3">
              <i className="fas fa-wave-square text-emerald-500"></i>
              Data Lifecycle Flow
            </h3>
            <div className="bg-slate-900 p-8 rounded-2xl font-mono text-xs text-emerald-500 leading-relaxed overflow-x-auto whitespace-pre">
{`React UI (User Input) 
  --> Zustand Store (Update Local State)
    --> Axios Service (POST /ai/generate)
      --> FastAPI Controller (Validate Schema)
        --> AI Engine (Prompt Engineering + Gemini API)
          --> Repository (Save Transaction to Cloud SQL)
            --> FastAPI (JSON Response)
              --> React UI (Render Code Results)`}
            </div>
          </div>
        </div>
      )}

      {subTab === 'frontend' && (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Frontend Directory (Standard)</h3>
            <div className="bg-slate-900 rounded-3xl p-8 font-mono text-xs text-slate-400">
              <TreeItem label="src/" open>
                <TreeItem label="features/" open>
                  <TreeItem label="ai/" open>
                    <TreeItem label="api.js" desc="Axios calls" color="text-emerald-400" />
                    <TreeItem label="store.js" desc="Zustand store" color="text-amber-400" />
                    <TreeItem label="hooks.js" desc="Custom interaction hooks" />
                    <TreeItem label="components/" desc="Module-specific UI" />
                  </TreeItem>
                </TreeItem>
                <TreeItem label="services/" desc="httpClient.js (Axios wrapper)" />
                <TreeItem label="App.jsx" icon="fab fa-react" color="text-blue-400" />
              </TreeItem>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CodeBox title="services/httpClient.js" code={`import axios from "axios";\n\nconst http = axios.create({\n  baseURL: import.meta.env.VITE_API_URL,\n  headers: { "Content-Type": "application/json" }\n});\n\nexport default http;`} />
            <CodeBox title="features/ai/store.js (Zustand)" code={`import { create } from "zustand";\nimport { generateAI } from "./api";\n\nexport const useAIStore = create((set) => ({\n  code: "",\n  loading: false,\n  generate: async (prompt) => {\n    set({ loading: true });\n    const data = await generateAI(prompt);\n    set({ code: data.generated_code, loading: false });\n  }\n}));`} />
          </div>
        </div>
      )}

      {subTab === 'backend' && (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Backend Directory (FastAPI/Python)</h3>
            <div className="bg-slate-900 rounded-3xl p-8 font-mono text-xs text-slate-400">
              <TreeItem label="app/" open>
                <TreeItem label="ai_engine/" desc="Gemini Wrapper" color="text-indigo-400" />
                <TreeItem label="controllers/" desc="API Routers" />
                <TreeItem label="repositories/" desc="DB Logic (SQLAlchemy)" />
                <TreeItem label="models/" desc="Database Entities" />
                <TreeItem label="schemas/" desc="Pydantic DTOs" />
              </TreeItem>
              <TreeItem label="main.py" icon="fas fa-file-code" color="text-yellow-400" />
              <TreeItem label="Dockerfile" icon="fab fa-docker" color="text-blue-400" />
            </div>
          </div>

          <div className="space-y-8">
            <CodeBox title="app/ai_engine/gemini.py" code={`import google.generativeai as genai\nimport os\n\ngenai.configure(api_key=os.getenv("GOOGLE_API_KEY"))\n\ndef get_ai_response(prompt: str):\n    model = genai.GenerativeModel('gemini-1.5-flash')\n    response = model.generate_content(prompt)\n    return response.text`} />
            <CodeBox title="app/controllers/ai_controller.py" code={`from fastapi import APIRouter\nfrom app.ai_engine.gemini import get_ai_response\nfrom app.schemas.ai_schema import PromptRequest\n\nrouter = APIRouter()\n\n@router.post("/generate")\nasync def generate_code(req: PromptRequest):\n    code = get_ai_response(req.user_input)\n    return {"generated_code": code}`} />
          </div>
        </div>
      )}
    </div>
  );
};

const DevOpsView = () => (
  <div className="space-y-12 animate-fadeIn">
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-10 flex items-center gap-4">
        <i className="fas fa-infinity text-indigo-500"></i>
        CI/CD & Deployment Pipeline
      </h3>
      <div className="bg-[#0F172A] p-10 rounded-3xl font-mono text-sm text-indigo-400 leading-loose border border-slate-800 shadow-inner overflow-x-auto whitespace-pre">
{`+----------------+      +----------------+      +-------------------+
| Developer Push | ---> | Cloud Build    | ---> | Artifact Registry |
| (GitHub/Local) |      | (Build & Test) |      | (Docker Image)    |
+----------------+      +----------------+      +---------+---------+
                                                          |
                                                          | (Trigger Deploy)
                                                          v
                                                +-------------------+
                                                | Google Cloud Run  |
                                                | (Scale-to-Zero)   |
                                                +-------------------+`}
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <StepCard icon="fas fa-code-branch" title="Step 1: Code Push" desc="Mã nguồn được đẩy lên repository chính. Một webhook kích hoạt pipeline." />
        <StepCard icon="fas fa-hammer" title="Step 2: Automated Build" desc="Cloud Build khởi tạo container, cài đặt dependencies và chạy Unit Test." />
        <StepCard icon="fas fa-archive" title="Step 3: Image Versioning" desc="Docker image đã build được đánh tag version và đẩy lên Artifact Registry." />
        <StepCard icon="fas fa-rocket" title="Step 4: Blue-Green Deploy" desc="Cloud Run cập nhật revision mới, chuyển dần traffic qua instance mới." />
      </div>
    </div>
  </div>
);

const GeneratorView: React.FC<any> = ({ prompt, setPrompt, isGenerating, handleGenerate, currentResult }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full min-h-[650px] animate-fadeIn">
    <div className="space-y-6 flex flex-col">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex-1 flex flex-col">
        <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-widest">
          <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></span>
          Input Engineering Lab
        </h3>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Create a scalable auth module with Refresh Token logic using FastAPI and Pydantic V2..."
          className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none font-medium text-slate-700"
        />
        <div className="mt-8">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl ${isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200'}`}
          >
            {isGenerating ? <><i className="fas fa-circle-notch fa-spin"></i> Engine Running...</> : <><i className="fas fa-magic"></i> Generate Module</>}
          </button>
        </div>
      </div>
    </div>

    <div className="bg-[#0F172A] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-800">
      <div className="px-10 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
        <div className="flex gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80"></div>
        </div>
        <button 
          onClick={() => {navigator.clipboard.writeText(currentResult); alert("Copied!");}}
          className="text-[10px] text-slate-500 hover:text-white font-black uppercase tracking-widest flex items-center gap-2"
        >
          <i className="far fa-copy text-lg"></i>
        </button>
      </div>
      <div className="flex-1 overflow-auto p-10 font-mono text-sm leading-relaxed text-emerald-400">
        {currentResult ? (
          <pre className="selection:bg-emerald-500/20"><code>{currentResult}</code></pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-8 opacity-40">
            <i className="fas fa-terminal text-8xl"></i>
            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Command Execution</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CloudConfigView = () => (
  <div className="space-y-12 animate-fadeIn">
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8">Production Dockerfile</h3>
      <CodeDisplay content={`FROM python:3.10-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nENV PORT=8080\nEXPOSE 8080\nCMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port \${PORT}"]`} />
    </div>

    <div className="bg-[#0F172A] p-12 rounded-[3rem] shadow-2xl">
      <h3 className="text-white text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-widest">
        <i className="fas fa-terminal text-emerald-400"></i> Deployment Sequence
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CommandBlock title="1. Artifact Registry Build" cmd={`gcloud builds submit --tag asia-east1-docker.pkg.dev/[PROJECT_ID]/ai-backend/ai-service`} />
        <CommandBlock title="2. Cloud Run Service Deploy" cmd={`gcloud run deploy ai-service --image asia-east1-docker.pkg.dev/[PROJECT_ID]/ai-backend/ai-service --region asia-east1 --set-env-vars GOOGLE_API_KEY="AIza..."`} />
      </div>
    </div>
  </div>
);

const SubTabBtn: React.FC<any> = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
    {label}
  </button>
);

const FeatureCard: React.FC<any> = ({ icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500 mb-4 text-xl">
      <i className={icon}></i>
    </div>
    <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-2">{title}</h4>
    <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{desc}</p>
  </div>
);

const StepCard: React.FC<any> = ({ icon, title, desc }) => (
  <div className="flex gap-6 p-6 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
      <i className={icon}></i>
    </div>
    <div>
      <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm mb-1">{title}</h4>
      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TreeItem: React.FC<any> = ({ label, children, open, icon = "fas fa-folder", color = "text-indigo-400", desc }) => (
  <div className="ml-4 border-l border-slate-800/50 pl-4 py-1.5">
    <div className="flex items-center gap-3 group">
      <i className={`${icon} ${color} group-hover:scale-110 transition-transform`}></i>
      <span className="text-slate-300 font-bold group-hover:text-white transition-colors cursor-default">{label}</span>
      {desc && <span className="text-[10px] text-slate-600 font-normal italic opacity-0 group-hover:opacity-100 transition-opacity"> // {desc}</span>}
    </div>
    {open && <div className="mt-1">{children}</div>}
  </div>
);

const CodeBox: React.FC<any> = ({ title, code }) => (
  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
    <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
      </div>
    </div>
    <div className="p-6 bg-[#0F172A] font-mono text-xs leading-relaxed overflow-x-auto">
      <pre className="text-indigo-300"><code>{code}</code></pre>
    </div>
  </div>
);

const CommandBlock: React.FC<any> = ({ title, cmd }) => (
  <div className="space-y-4">
    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</div>
    <div className="bg-slate-900/80 p-8 rounded-3xl font-mono text-sm text-emerald-400 border border-slate-800 shadow-inner group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <pre className="whitespace-pre-wrap leading-relaxed"><code>{cmd}</code></pre>
    </div>
  </div>
);

export default App;
