import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TestTube2, Database, Cpu, ArrowRight,
  Fingerprint, FlaskConical, Dna, PlayCircle, Network, BookOpen
} from 'lucide-react';

const LandingPage: React.FC = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050B14] text-slate-200 overflow-hidden font-sans relative">
      
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050B14]/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center p-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all">
                <Dna className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Wallah<span className="text-cyan-400">GPT</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-12">
              {['Products', 'Research', 'Solutions', 'Publications', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-base font-semibold text-slate-400 hover:text-cyan-400 transition-colors tracking-wide"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors tracking-wider">
              SIGN IN
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-3 rounded-full bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 text-base font-bold hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(8,145,178,0.1)]"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10 w-full">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6">
            Wallah<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">GPT</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 font-medium mb-4">
            Universal Multi-Omics, Multi-Species, Multi-Tissue Transformer-based Model
          </p>
          
          <p className="text-lg text-cyan-400/80 font-semibold tracking-wide mb-10">
            Aging Research, Disease Modelling, Synthetic Data Generation, Drug Discovery, and Other Tasks
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              to="/login"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300"
            >
              ADMINISTRATIVE PREVIEW
            </Link>
            <a 
              href="#demo"
              className="px-8 py-4 rounded-full border border-cyan-500/50 text-cyan-400 font-bold text-lg hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2"
            >
              <PlayCircle size={20} />
              VIEW DEMO AND BENCHMARKS
            </a>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 font-medium pb-8 border-b border-white/10 w-full">
            <div className="flex items-center gap-2">
              <Database size={20} className="text-cyan-500" />
              <span>1 Looping Data</span>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical size={20} className="text-blue-500" />
              <span>1 Clinical</span>
            </div>
            <div className="flex items-center gap-2">
              <Dna size={20} className="text-purple-500" />
              <span>3 Multi-omics</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Intro Description */}
      <section className="py-16 px-4 z-10 relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            WallahGPT is ZeroKost's lineup of AI models aimed at enabling digital <span className="text-cyan-400">-omics</span> experiments
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Wallah models empower scientists to swiftly test their hypotheses using realistic synthesized data, pushing the boundaries of what is computationally possible.
          </p>
        </motion.div>
      </section>

      {/* Cards Section */}
      <section className="py-12 px-4 z-10 relative max-w-7xl mx-auto w-full">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div 
            variants={fadeIn}
            className="group relative bg-[#0A1221] border border-cyan-900/30 rounded-[2rem] p-10 hover:border-cyan-500/50 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center overflow-hidden hover:shadow-[0_10px_40px_-15px_rgba(34,211,238,0.2)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-24 h-24 mb-6 mt-4 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all duration-500" />
              <Fingerprint size={56} strokeWidth={1.5} className="text-cyan-400 relative z-10" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Wallah1GPT</h3>
            <p className="text-cyan-400 font-medium mb-6 uppercase tracking-wider text-sm">Age prediction</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
              A transformer-based model with aging research potentials, incorporating multi-head self-attention, for human multi-omics data analysis and longevity simulation.
            </p>
            <Link to="/experiment/p1/new" className="text-cyan-400 hover:text-cyan-300 font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto">
              Explore Wallah1GPT <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={fadeIn}
            className="group relative bg-[#0A1221] border border-blue-900/30 rounded-[2rem] p-10 hover:border-blue-500/50 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center overflow-hidden md:translate-y-8 hover:shadow-[0_10px_40px_-15px_rgba(59,130,246,0.2)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-24 h-24 mb-6 mt-4 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />
              <Network size={56} strokeWidth={1.5} className="text-blue-400 relative z-10" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Wallah2GPT</h3>
            <p className="text-blue-400 font-medium mb-6 uppercase tracking-wider text-sm">Omics profile synthesis</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
              A conditional neural transformer framework with continuous and controllable synthetic data generation capabilities to accelerate in-silico trials.
            </p>
            <Link to="/experiment/p2/new" className="text-blue-400 hover:text-blue-300 font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto">
              Explore Wallah2GPT <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={fadeIn}
            className="group relative bg-[#0A1221] border border-purple-900/30 rounded-[2rem] p-10 hover:border-purple-500/50 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center overflow-hidden hover:shadow-[0_10px_40px_-15px_rgba(168,85,247,0.2)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-24 h-24 mb-6 mt-4 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all duration-500" />
              <Cpu size={56} strokeWidth={1.5} className="text-purple-400 relative z-10" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Wallah3GPT</h3>
            <p className="text-purple-400 font-medium mb-6 uppercase tracking-wider text-sm">Small molecule simulation</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
              A proprietary multimodal model trained to simulate responses of living systems, with an emphasis on observing molecular perturbation behavior across complex arrays.
            </p>
            <Link to="/experiment/p3/new" className="text-purple-400 hover:text-purple-300 font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto">
              Explore Wallah3GPT <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Advanced Model Section */}
      <section className="py-32 px-4 mt-20 relative z-10 bg-[#060F1E] border-y border-cyan-900/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-6">
              <TestTube2 size={16} /> Latest Breakthrough
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Wallah3GPT is our most recent and most advanced Large Language of Life Model (LLLM)
            </h2>
            <p className="text-slate-400 text-lg mb-6 leading-relaxed">
              This universal model is capable of synthesizing and interpreting multi-modal data from different machines and tissues. It represents multiple data aspects and supports a variety of experimental settings. 
            </p>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed border-l-2 border-cyan-500/30 pl-6">
              Thanks to its intent-recognition shift, it is a smart, easy-to-use tool to evaluate different conditions to support complex biological research pipelines and accelerate time-to-discovery.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full relative"
          >
            <div className="aspect-video bg-[#0A1221] border border-cyan-500/20 rounded-[2rem] overflow-hidden relative group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 mix-blend-overlay" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532053229867-27b61f85fb0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060F1E] via-[#060F1E]/60 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 cursor-pointer group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_50px_rgba(34,211,238,0.3)]">
                  <PlayCircle size={48} strokeWidth={1.5} className="text-white group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
              
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div>
                  <h4 className="text-white font-bold text-xl mb-1 flex items-center gap-2">
                    <Database size={20} className="text-cyan-400" /> System Architecture
                  </h4>
                  <p className="text-slate-400 text-sm">Watch the technical breakdown</p>
                </div>
                <div className="hidden sm:flex space-x-2">
                  <div className="w-1.5 h-6 bg-cyan-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
                  <div className="w-1.5 h-4 bg-cyan-500/70 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
                  <div className="w-1.5 h-8 bg-cyan-500/40 rounded-full animate-[pulse_1.2s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
            
            <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 blur-3xl -z-10 rounded-full opacity-50 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Scientific Publications
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Independently verified methodologies and proven results across leading life science journals.</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { tag: "Nature", title: "An attention network for DNA and aging research accelerates drug timeline with omni-modal agility", date: "July 2026" },
            { tag: "Aging", title: "LLLM and LLoLM Models for Traditional Medicine-derived Geroprotector Permutation", date: "April 2025" },
            { tag: "BioRxiv", title: "Wallah2GPT: The combination of conditional continuous transformer for sample generation", date: "June 2024" },
            { tag: "Cell Reports", title: "Wallah1GPT: multimodal Multi-species Multi-Tissue Transformer for Drug Discovery", date: "Jan 2024" }
          ].map((pub, i) => (
            <motion.div 
              key={i}
              variants={fadeIn}
              className="bg-[#0B1221] border border-cyan-900/20 rounded-2xl p-6 hover:bg-[#0C1628] hover:border-cyan-500/40 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full shadow-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold px-3 py-1 bg-white/5 text-cyan-400 rounded-full group-hover:bg-cyan-500/10 transition-colors border border-cyan-900/30">
                  {pub.tag}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors mb-4 line-clamp-4 leading-relaxed flex-grow">
                {pub.title}
              </h4>
              <div className="flex items-center justify-between text-slate-500 text-sm mt-4 pt-4 border-t border-white/5">
                <span>{pub.date}</span>
                <span className="text-cyan-500/0 group-hover:text-cyan-400 transition-colors"><ArrowRight size={16} /></span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Premium Multi-Column Footer */}
      <footer className="pt-24 pb-12 border-t border-white/5 bg-[#03060C] z-10 px-4 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center p-1.5 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <Dna className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Wallah<span className="text-cyan-400">GPT</span></span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8">
              Revolutionizing life sciences through universal multi-omics transformer models. Digital simulation for the next generation of drug discovery.
            </p>
            <div className="flex gap-4">
              {/* Placeholder social icons */}
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all cursor-pointer">
                <Network size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all cursor-pointer">
                <Cpu size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all cursor-pointer">
                <BookOpen size={18} />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Systems</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/experiment/p1/new" className="hover:text-cyan-400 transition-colors">Wallah1GPT</Link></li>
              <li><Link to="/experiment/p2/new" className="hover:text-cyan-400 transition-colors">Wallah2GPT</Link></li>
              <li><Link to="/experiment/p3/new" className="hover:text-cyan-400 transition-colors">Wallah3GPT</Link></li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Omni-Tissue AI</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">About ZeroKost</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Newsroom</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">API Reference</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Benchmarking</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Open Source</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Cookie Policy</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Use</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Security</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-xs">
          <p>© 2026 ZeroKost Life Sciences. All rights reserved.</p>
          <p className="flex items-center gap-2 italic">
            "Accelerating Biological Discovery through Transformer Intelligence"
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
