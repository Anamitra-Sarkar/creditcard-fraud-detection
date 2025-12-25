import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  RotateCcw, 
  ChevronRight, 
  Activity,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Configure Axios
const api = axios.create({
  baseURL: 'http://localhost:8000'
});

const App = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    Time: 0,
    Amount: 2500.00,
    V4: 0.0,
    V10: 0.0,
    V11: 0.0,
    V12: 0.0,
    V14: 0.0,
    V17: 0.0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const generateRandom = () => {
    setFormData({
      Time: Math.floor(Math.random() * 100000),
      Amount: parseFloat((Math.random() * 1000).toFixed(2)),
      V4: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      V10: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      V11: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      V12: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      V14: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      V17: parseFloat((Math.random() * 2 - 1).toFixed(2)),
    });
    setResult(null);
  };

  const generateFraud = () => {
    setFormData({
      Time: Math.floor(Math.random() * 100000),
      Amount: 0.00,
      V4: 6.5,    
      V10: -5.2,  
      V11: 4.1,   
      V12: -8.5,  
      V14: -9.1,  
      V17: -10.5, 
    });
    setResult(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/predict', formData);
      await new Promise(r => setTimeout(r, 600)); // UX delay
      setResult(response.data);
    } catch (err) {
      setError("Unable to reach the risk engine. Is Backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1016] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* Background Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">FraudGuard</h1>
              <p className="text-slate-400 text-xs font-medium tracking-wide">ENTERPRISE RISK ENGINE</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium text-slate-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Engine Active</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: Transaction Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-medium text-white">Transaction Details</h2>
                <div className="flex gap-2">
                  <button onClick={generateRandom} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Populate Legitimate">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={generateFraud} className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all" title="Populate Anomalous">
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2 tracking-wide">TRANSACTION AMOUNT</label>
                  <div className="relative group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input 
                      type="number" 
                      name="Amount"
                      value={formData.Amount}
                      onChange={handleChange}
                      className="w-full bg-[#0a0b10]/60 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2 tracking-wide flex items-center justify-between">
                    <span>PRINCIPAL COMPONENTS (V-FEATURES)</span>
                    <span className="text-[10px] opacity-50">NORMALIZED</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['V4', 'V10', 'V11', 'V12', 'V14', 'V17'].map((v) => (
                      <div key={v} className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600">{v}</span>
                        <input 
                          type="number"
                          name={v}
                          value={formData[v]}
                          onChange={handleChange}
                          step="0.1"
                          className="w-full bg-[#0a0b10]/60 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all text-right"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handlePredict}
                    disabled={loading}
                    className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Analyze Risk</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                  {error && <p className="text-center text-rose-400 text-xs mt-3">{error}</p>}
                </div>
              </div>
            </div>
            
            <div className="px-4 text-center">
               <p className="text-xs text-slate-500 leading-relaxed">
                 Features processed via ResNet-4096.<br/>
                 Data is protected end-to-end.
               </p>
            </div>
          </div>

          {/* RIGHT PANEL: Analysis Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02]"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Activity className="text-slate-600 w-8 h-8" />
                  </div>
                  <p className="text-slate-500 font-medium">Ready for analysis</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="h-full space-y-6"
                >
                  {/* Primary Score Card */}
                  <div className="relative p-10 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-2xl">
                    <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[150px] rounded-full pointer-events-none opacity-40 mix-blend-screen
                      ${result.is_fraud ? 'bg-rose-600' : 'bg-emerald-600'}
                    `} />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      
                      {/* Left: Verdict */}
                      <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 border
                          ${result.is_fraud 
                            ? 'bg-rose-500/10 text-rose-200 border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20'}
                        `}>
                          {result.is_fraud ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          {result.risk_level} Risk
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-semibold text-white mb-2 tracking-tight">
                          {result.is_fraud ? "Flagged" : "Approved"}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {result.is_fraud 
                            ? "This transaction exhibits strong statistical anomalies consistent with known fraud patterns." 
                            : "This transaction falls within normal behavioral parameters."}
                        </p>
                      </div>

                      {/* Right: Score */}
                      <div className="flex flex-col items-center md:items-end">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" />
                            <motion.circle 
                              initial={{ strokeDashoffset: 440 }}
                              animate={{ strokeDashoffset: 440 - (440 * result.fraud_probability) }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              cx="80" cy="80" r="70" 
                              className={result.is_fraud ? "text-rose-500" : "text-emerald-500"} 
                              strokeWidth="8" 
                              strokeLinecap="round" 
                              stroke="currentColor" 
                              fill="transparent" 
                              strokeDasharray="440" 
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-3xl font-bold text-white">{(result.fraud_probability * 100).toFixed(1)}</span>
                             <span className="text-[10px] text-slate-400 uppercase tracking-widest">Score</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:bg-white/[0.07] transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                            <TrendingUp className="w-4 h-4" />
                         </div>
                         <h3 className="text-sm font-medium text-slate-200">Pattern Match</h3>
                      </div>
                      <div className="text-2xl font-semibold text-white mb-1">
                        {(result.details.classifier_score * 100).toFixed(2)}%
                      </div>
                      <p className="text-xs text-slate-500">
                        Similarity to known fraud vectors (Supervised).
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:bg-white/[0.07] transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300">
                            <Activity className="w-4 h-4" />
                         </div>
                         <h3 className="text-sm font-medium text-slate-200">Outlier Index</h3>
                      </div>
                      <div className="text-2xl font-semibold text-white mb-1">
                        {result.details.anomaly_score.toFixed(4)}
                      </div>
                      <p className="text-xs text-slate-500">
                        Deviation from standard transaction manifold.
                      </p>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;