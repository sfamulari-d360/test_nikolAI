import React, { useState } from 'react';
import { SEOForm } from './components/SEOForm';
import { BriefDisplay } from './components/BriefDisplay';
import { generateBrief, cleanMarkdown } from './services/n8nService';
import { SEOFormData, Status } from './types';
import { Sparkles, AlertCircle } from 'lucide-react';
import { DEFAULT_WEBHOOK_URL } from './constants';

const Logo: React.FC = () => {
  const [useFallback, setUseFallback] = useState(false);

  // Se l'immagine va in errore (404), mostriamo automaticamente questo logo in CSS/HTML
  // Così l'app sembra sempre perfetta e non mostra mai errori all'utente.
  if (useFallback) {
    return (
      <div className="flex flex-col justify-center h-16 select-none">
        <div className="flex items-baseline leading-none">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">DIGITAL</span>
          <span className="text-3xl font-light ml-1 text-blue-600">360</span>
        </div>
        <span className="text-sm font-bold tracking-[0.3em] text-slate-400 uppercase mt-1 leading-none">
          CONNECT
        </span>
      </div>
    );
  }

  return (
    <img 
      src="/logo_connect.png" 
      alt="Digital 360 Connect" 
      className="h-16 w-auto object-contain"
      onError={() => setUseFallback(true)}
    />
  );
};

const App: React.FC = () => {
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [briefContent, setBriefContent] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [initialData] = useState<SEOFormData>(() => ({
    primaryKeyword: '',
    secondaryKeyword: '',
    highAffinityKeywords: '',
    country: 'Italy',
    language: 'Italian',
    webhookUrl: DEFAULT_WEBHOOK_URL,
    useCorsProxy: false,
  }));

  const handleSubmit = async (data: SEOFormData) => {
    setStatus(Status.LOADING);
    setErrorMsg(null);
    setBriefContent("");
    
    try {
      const rawMarkdown = await generateBrief(data);
      const cleaned = cleanMarkdown(rawMarkdown);
      setBriefContent(cleaned);
      setStatus(Status.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred while communicating with n8n.");
      setStatus(Status.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <Logo />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4 xl:col-span-3">
            <SEOForm 
              onSubmit={handleSubmit} 
              status={status} 
              initialData={initialData}
            />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 xl:col-span-9 h-full min-h-[500px]">
            {status === Status.ERROR && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md animate-pulse">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <h3 className="text-red-800 font-medium">Generation Failed</h3>
                    <p className="text-red-700 text-sm mt-1">{errorMsg}</p>
                  </div>
                </div>
              </div>
            )}

            {status === Status.IDLE && (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-200 text-center p-12">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Sparkles className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Ready to Generate</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                  Fill in the project details on the left and hit "Generate Brief" to receive your AI-optimized content strategy.
                </p>
              </div>
            )}

            {status === Status.LOADING && (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm p-12">
                 <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary-600 animate-pulse" />
                    </div>
                 </div>
                 <h3 className="mt-6 text-lg font-medium text-gray-900">Consulting the Oracle...</h3>
                 <p className="text-gray-500 mt-2">Connecting to n8n and generating your brief.</p>
              </div>
            )}

            {(status === Status.SUCCESS || (status === Status.ERROR && briefContent)) && (
              <BriefDisplay content={briefContent} />
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-sm text-gray-500">© {new Date().getFullYear()} Internal SEO Tools. Powered by React & n8n.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;