import React from 'react';
import { Search, Globe, Languages, Tag, Settings, Save, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SEOFormData, Status } from '../types';
import { COUNTRIES, LANGUAGES } from '../constants';

interface SEOFormProps {
  onSubmit: (data: SEOFormData) => void;
  status: Status;
  initialData: SEOFormData;
}

export const SEOForm: React.FC<SEOFormProps> = ({ onSubmit, status, initialData }) => {
  const [formData, setFormData] = React.useState<SEOFormData>(initialData);
  const [showSettings, setShowSettings] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isLoading = status === Status.LOADING;
  const isLocalhost = /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(formData.webhookUrl);
  // Invalid config: Using Proxy with Localhost
  const isInvalidConfig = formData.useCorsProxy && isLocalhost;
  
  const isSubmitDisabled = isLoading || !formData.webhookUrl || isInvalidConfig;

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        
        {/* Header Section */}
        <div className="border-b border-gray-100 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary-600" />
            Project Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the keyword parameters to generate the SEO brief.
          </p>
        </div>

        {/* Primary Inputs */}
        <div className="space-y-4">
          <div>
            <label htmlFor="primaryKeyword" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Keyword <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="primaryKeyword"
                name="primaryKeyword"
                required
                value={formData.primaryKeyword}
                onChange={handleChange}
                placeholder="e.g. best running shoes"
                className="w-full pl-4 pr-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="secondaryKeyword" className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                id="secondaryKeyword"
                name="secondaryKeyword"
                value={formData.secondaryKeyword}
                onChange={handleChange}
                placeholder="e.g. cheap sneakers"
                className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="highAffinityKeywords" className="block text-sm font-medium text-gray-700 mb-1">
              High Affinity Keywords (comma separated)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="highAffinityKeywords"
                name="highAffinityKeywords"
                value={formData.highAffinityKeywords}
                onChange={handleChange}
                placeholder="e.g. marathon, jogging, fitness"
                className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Target Country
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  list="countries"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="Select or type..."
                />
                <datalist id="countries">
                  {COUNTRIES.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Languages className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  list="languages"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="Select or type..."
                />
                <datalist id="languages">
                  {LANGUAGES.map(l => <option key={l} value={l} />)}
                </datalist>
              </div>
            </div>
          </div>
        </div>

        {/* Webhook Settings Toggle */}
        <div className="pt-2">
           <button
             type="button"
             onClick={() => setShowSettings(!showSettings)}
             className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1 font-medium focus:outline-none"
           >
             <Settings className="w-3 h-3" />
             {showSettings ? 'Hide API Configuration' : 'Configure API Webhook'}
           </button>
           
           {showSettings && (
             <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200 space-y-3">
                <div>
                  <label htmlFor="webhookUrl" className="block text-xs font-semibold text-gray-600 mb-1">
                    n8n Webhook URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="webhookUrl"
                    name="webhookUrl"
                    required
                    value={formData.webhookUrl}
                    onChange={handleChange}
                    placeholder="https://your-n8n-instance.com/webhook/..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">The endpoint that will process this request.</p>
                </div>
                
                <div className="flex flex-col gap-2 pt-1">
                   <div className="flex items-start gap-2">
                     <div className="flex h-5 items-center">
                       <input
                         id="useCorsProxy"
                         name="useCorsProxy"
                         type="checkbox"
                         checked={formData.useCorsProxy}
                         onChange={handleCheckboxChange}
                         className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                       />
                     </div>
                     <div className="text-xs">
                       <label htmlFor="useCorsProxy" className="font-medium text-gray-700 flex items-center gap-1">
                         Use CORS Proxy <ShieldCheck className="w-3 h-3 text-green-600" />
                       </label>
                       <p className="text-gray-500">Enable this if you encounter "Failed to fetch" or CORS errors.</p>
                     </div>
                   </div>

                   {isInvalidConfig && (
                     <div className="flex items-start gap-2 bg-red-50 text-red-800 p-2 rounded text-xs border border-red-200">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <p>
                          <strong>Configuration Error:</strong> You cannot use the public CORS Proxy with a localhost URL. 
                          Please disable "Use CORS Proxy" or use a public tunnel URL (like ngrok).
                        </p>
                     </div>
                   )}
                </div>
             </div>
           )}
        </div>

        <div className="pt-4 mt-auto">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg
              ${isSubmitDisabled 
                ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 active:scale-[0.99]'
              }`}
          >
            {isLoading ? (
               <>
                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Generating Brief...
               </>
            ) : (
               <>
                 <Save className="w-5 h-5" />
                 <span>Generate Brief</span>
               </>
            )}
          </button>
          
          {!formData.webhookUrl && !showSettings && (
             <p className="text-center text-xs text-red-400 mt-2">Please configure the Webhook URL to proceed.</p>
          )}
        </div>
      </div>
    </form>
  );
};