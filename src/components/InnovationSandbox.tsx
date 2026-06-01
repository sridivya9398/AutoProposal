import React, { useState, useEffect, useRef } from 'react';
import { Network, Cpu, Zap, Wifi, WifiOff, RefreshCw, Send, Play, Terminal, Code, Sparkles, ArrowRight, ShieldCheck, Database, Layers, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechProject {
  id: string;
  date: string;
  title: string;
  tagline: string;
  impactScore: number;
  techStack: string[];
  impactDescription: string;
  problemSolved: string;
  architecture: string[];
  metrics: { [key: string]: string };
}

const PROJECTS: TechProject[] = [
  {
    id: 'synaptic-crdt',
    date: 'June 01, 2026 (Today)',
    title: 'Synaptic-CRDT',
    tagline: 'Local-First Collaborative Document Editor with Browser-Embedded LLMs',
    impactScore: 9.8,
    techStack: ['Y.js CRDTs', 'WebLLM (Llama-3-8B)', 'WebGPU Shaders', 'WebRTC Gossip', 'IndexedDB'],
    problemSolved: 'Collaborative productivity tools (like Notion/Docs) rely on central cloud servers, risking user privacy, latency, and offline outages. Synaptic-CRDT moves both real-time syncing and AI assistance completely to the client side.',
    impactDescription: 'Reduces server API costs to $0, ensures 100% data sovereignty, and guarantees sub-millisecond local latency. AI assistance is fully functional offline, enabling safe editing of sensitive corporate documents without third-party exposure.',
    architecture: [
      'User Input (Rich Editor) ──> Y.js CRDT Op Log',
      'Y.js Op Log ──> WebRTC P2P Sync Router & IndexedDB Persistence',
      'Local Context Analyzer ──> WebGPU-bound WebLLM Engine (In-Browser)',
      'Local LLM ──> Peer-to-Peer Agent Node (Injects edits directly into the document structure)'
    ],
    metrics: {
      'Sync Latency': '1.2 ms (Local-First)',
      'WebGPU AI Inference': '45 tokens/sec (Local Llama-3)',
      'Server Cost Savings': '100% ($0 Infrastructure)',
      'Data Privacy Rating': 'Military Grade (Zero Egress)'
    }
  },
  {
    id: 'neuroflow-nca',
    date: 'May 31, 2026',
    title: 'NeuroFlow NCA',
    tagline: 'WebGPU-powered Neural Cellular Automata Generative UI Engine',
    impactScore: 9.2,
    techStack: ['WebGPU WGSL', 'Neural Networks', 'Morphogenetic Algorithms', 'React 19 Canvas'],
    problemSolved: 'Traditional UI animations are hand-coded, static, and cannot self-heal or adapt to custom viewport contexts. NeuroFlow uses Neural Cellular Automata to grow, texture, and adapt user interface layouts organically.',
    impactDescription: 'Pioneers biological self-healing software concepts. If parts of the UI layout are destroyed or corrupted by runtime errors, the NCA rules automatically regenerate the visual components within 60 frames.',
    architecture: [
      'React UI View ──> Canvas WebGPU Context',
      'Compute Shader (WGSL) ──> Run 16-channel Cellular Update Rules',
      'Target Grid State ──> Self-Healing / Texture Generation Output'
    ],
    metrics: {
      'Compute Performance': '60 FPS @ 1024x1024 grid',
      'Memory Overhead': '8.4 MB VRAM',
      'Resiliency Rate': '99.8% Recovery from visual corruption',
      'Shader Operations': '3.2 Gigaflops/sec'
    }
  },
  {
    id: 'zkp-verify',
    date: 'May 30, 2026',
    title: 'VeriTrust ZKP',
    tagline: 'Zero-Knowledge Proof Identity and Financial Solvency Verifier',
    impactScore: 9.5,
    techStack: ['Circom 2.1', 'SnarkJS', 'WebAssembly (Wasm)', 'Zero-Knowledge Proofs'],
    problemSolved: 'Users must expose sensitive PII (passwords, income files, SSN) to third parties just to prove credentials, leading to massive data breaches and identity theft.',
    impactDescription: 'Enables "Proof of Solvency" and "Proof of Identity" client-side. A user can prove their salary is above $80k or age is over 21 without revealing the actual numbers or their name, securing client-server trust.',
    architecture: [
      'Private Input Credentials ──> Wasm Witness Generator',
      'Witness File ──> SnarkJS Client-Side Prover (Groth16)',
      'ZKP Proof (JSON) ──> Server-Side Light Verifier (Cryptographic check)'
    ],
    metrics: {
      'Client Proof Generation Time': '1.8 seconds (WebAssembly)',
      'Verification Latency': '12 ms',
      'Proof Size': '800 bytes',
      'Cryptographic Security': '256-bit Curve (BN254)'
    }
  }
];

const InnovationSandbox = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('synaptic-crdt');
  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];

  // Editor and simulation states
  const [isOnline, setIsOnline] = useState(true);
  const [docText, setDocText] = useState(
    `# Project Proposal: Client-Side RFP Analyzer

We are designing a lightweight, offline-first RFP answering system.
Key Goals:
1. Ensure full data confidentiality.
2. Allow rapid document parsing.
3. Provide local agent assistance.

We will leverage decentralized technologies to scale our application without adding server burden.`
  );
  const [pendingOps, setPendingOps] = useState<string[]>([]);
  const [syncedPeers, setSyncedPeers] = useState<string[]>(['Alice', 'Bob', 'AI Agent']);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'analyzing' | 'generating'>('idle');
  const [agentSuggestions, setAgentSuggestions] = useState<string[]>([]);
  const [peerActivity, setPeerActivity] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Stats logs
  const [inferenceSpeed, setInferenceSpeed] = useState(0);
  const [syncLatency, setSyncLatency] = useState(1.2);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  // Trigger peer edit simulation every 15 seconds
  useEffect(() => {
    const peerEdits = [
      { author: 'Alice', text: '\n\n- [Alice] Added security standard SOC2 Compliance notes.', tag: ' (SOC2 Section)' },
      { author: 'Bob', text: '\n- [Bob] Verified the client-side vector database index sizing.', tag: ' (Vector DB Sizing)' }
    ];

    let editIndex = 0;

    const interval = setInterval(() => {
      if (selectedProjectId !== 'synaptic-crdt') return;

      const edit = peerEdits[editIndex];
      editIndex = (editIndex + 1) % peerEdits.length;

      if (isOnline) {
        setPeerActivity(`${edit.author} is typing...`);
        setTimeout(() => {
          setDocText(prev => prev + edit.text);
          setPeerActivity(null);
          triggerFlash(`Merged edit from ${edit.author} via CRDT!`);
        }, 2000);
      } else {
        // Queue offline change
        setPendingOps(prev => [...prev, `${edit.author}: ${edit.tag}`]);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isOnline, selectedProjectId]);

  const triggerFlash = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocText(e.target.value);
    setIsTyping(true);

    if (typingTimer.current) clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    if (!isOnline) {
      setPendingOps(prev => [...prev, `Self: Edit operational offset`]);
    }
  };

  const toggleConnection = () => {
    if (isOnline) {
      setIsOnline(false);
      setSyncedPeers([]);
      triggerFlash('Offline Mode enabled. Operations queued locally.');
    } else {
      setIsOnline(true);
      setSyncedPeers(['Alice', 'Bob', 'AI Agent']);
      triggerFlash('Back Online. Resolving conflict logs via Yjs CRDT State Vector...');
      
      // Simulate merging
      if (pendingOps.length > 0) {
        setTimeout(() => {
          let mergedText = docText;
          pendingOps.forEach(op => {
            if (op.startsWith('Alice:')) {
              mergedText += '\n- [Alice] Synced offline edits regarding compliance.';
            } else if (op.startsWith('Bob:')) {
              mergedText += '\n- [Bob] Synced offline vector indexes.';
            }
          });
          setDocText(mergedText);
          setPendingOps([]);
          triggerFlash('All local and peer offline operations synchronized successfully!');
        }, 1500);
      }
    }
  };

  const runLocalAI = () => {
    if (agentStatus !== 'idle') return;
    setAgentStatus('analyzing');
    setInferenceSpeed(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progress >= 3) {
        clearInterval(interval);
        setAgentStatus('generating');
        
        // Simulating WebLLM generation speed ramping up
        let count = 0;
        const typingInterval = setInterval(() => {
          count += 5;
          setInferenceSpeed(Math.floor(Math.random() * 8) + 42); // 42-50 t/s
          if (count >= 100) {
            clearInterval(typingInterval);
            const suggestion = `\n\n- [Local AI Agent] Suggested Security Architecture:\n  - WebGPU-based hardware isolated encryption\n  - Zero Server Round-Trips for security validation\n  - Cryptographic verification via client-side signatures`;
            setDocText(prev => prev + suggestion);
            setAgentStatus('idle');
            setInferenceSpeed(0);
            triggerFlash('Local Agent injected code/text suggestions via CRDT sync.');
          }
        }, 100);
      }
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }} className="gradient-text">
            Daily Tech Innovation Sandbox
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Researching the impact and brainstorming projects across emerging technologies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="glass-panel" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <Sparkles size={16} color="var(--accent-color)" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Next Brainstorm in 14h 33m</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Innovation Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.2)' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', marginLeft: '0.25rem' }}>
              Emerging Ideas Registry
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {PROJECTS.map((project) => {
                const isSelected = project.id === selectedProjectId;
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    className={isSelected ? '' : 'card-item'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{project.date}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        color: project.impactScore >= 9.5 ? 'var(--success-color)' : 'var(--primary-color)',
                        background: project.impactScore >= 9.5 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '6px'
                      }}>
                        {project.impactScore} Score
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? 'var(--primary-color)' : 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {project.tagline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Research Context */}
          <div className="card" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={15} color="var(--primary-color)" /> Project Impact Research
            </h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem' }}>Problem Statement:</strong>
                {selectedProject.problemSolved}
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem' }}>Open-Source Potential:</strong>
                {selectedProject.impactDescription}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Tech Stack & Description */}
          <div className="card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  {selectedProject.title} : <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>{selectedProject.tagline}</span>
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
                  {selectedProject.techStack.map((tech, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        background: 'rgba(255,255,255,0.04)', 
                        border: '1px solid var(--border-color)', 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '6px', 
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture diagram mapping */}
            <div style={{ background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                System Architecture Flow
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {selectedProject.architecture.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      border: '1px solid var(--primary-color)',
                      color: 'var(--primary-color)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Lab / Simulator */}
          <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            
            {/* Lab Header */}
            <div style={{ 
              padding: '1.25rem 1.5rem', 
              borderBottom: '1px solid var(--border-color)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.05) 0%, rgba(3, 7, 18, 0) 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Terminal size={18} color="var(--accent-color)" />
                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.01em' }}>Interactive Lab & Sandbox Simulation</h3>
              </div>
              
              {/* Notification Overlay */}
              <AnimatePresence>
                {notification && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      position: 'absolute', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: 'rgba(16, 185, 129, 0.9)', 
                      color: 'white',
                      padding: '0.4rem 1rem', 
                      borderRadius: '8px', 
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      zIndex: 100,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Check size={14} /> {notification}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Connected State Buttons */}
              {selectedProjectId === 'synaptic-crdt' && (
                <button 
                  onClick={toggleConnection}
                  style={{
                    background: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    color: isOnline ? 'var(--success-color)' : 'var(--error-color)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                  {isOnline ? 'P2P Online' : 'P2P Offline (Local)'}
                </button>
              )}
            </div>

            {/* Sandbox Playground Area */}
            {selectedProjectId === 'synaptic-crdt' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: '420px' }}>
                
                {/* Editor Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(3, 7, 18, 0.4)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Code size={13} /> markdown_crdt_doc.md
                    </div>
                    {isTyping && <div style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700 }}>Broadcasting Yjs changes...</div>}
                  </div>
                  <textarea
                    value={docText}
                    onChange={handleTextChange}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      padding: '1.25rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      lineHeight: '1.6',
                      resize: 'none',
                      outline: 'none',
                      width: '100%',
                      minHeight: '300px'
                    }}
                  />
                  
                  {/* Local LLM triggers */}
                  <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(3, 7, 18, 0.4)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                      onClick={runLocalAI}
                      disabled={agentStatus !== 'idle'}
                      className="btn btn-primary"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        fontSize: '0.8rem',
                        boxShadow: 'none',
                        background: agentStatus !== 'idle' ? 'var(--surface-color-light)' : undefined,
                        cursor: agentStatus !== 'idle' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Sparkles size={14} />
                      {agentStatus === 'idle' && 'Trigger In-Browser Agent (WebLLM)'}
                      {agentStatus === 'analyzing' && 'Analyzing Workspace...'}
                      {agentStatus === 'generating' && 'WebGPU Generation...'}
                    </button>
                    {agentStatus !== 'idle' && (
                      <div style={{ width: '40px', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden', flex: 1 }}>
                        <motion.div 
                          style={{ height: '100%', background: 'var(--accent-color)' }}
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Peer Network Visualizer & Diagnostics */}
                <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Peer Sync State */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                      Collaborative Topology
                    </h4>
                    
                    {/* Ring Connection Map */}
                    <div style={{ height: '150px', background: 'rgba(3, 7, 18, 0.5)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      
                      {/* Topology Lines */}
                      {isOnline && (
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                          <line x1="50%" y1="25%" x2="25%" y2="70%" stroke="var(--border-color)" strokeWidth="1.5" />
                          <line x1="50%" y1="25%" x2="75%" y2="70%" stroke="var(--border-color)" strokeWidth="1.5" />
                          <line x1="25%" y1="70%" x2="75%" y2="70%" stroke="var(--border-color)" strokeWidth="1.5" />
                          <line x1="50%" y1="25%" x2="50%" y2="60%" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3" />
                          
                          {/* Sync Flow animations when typing */}
                          {(isTyping || peerActivity || agentStatus === 'generating') && (
                            <motion.circle 
                              r="3" 
                              fill="var(--accent-color)" 
                              initial={{ x: 80, y: 105 }}
                              animate={{ x: [80, 160, 240, 80], y: [105, 37, 105, 105] }}
                              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                            />
                          )}
                        </svg>
                      )}

                      {/* Nodes */}
                      <div style={{ position: 'absolute', top: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: isOnline ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.1)', 
                          border: `2px solid ${isOnline ? 'var(--primary-color)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOnline ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>U</div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>You</span>
                      </div>

                      <div style={{ position: 'absolute', bottom: '15%', left: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)', 
                          border: `2px solid ${isOnline ? 'var(--success-color)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOnline ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>A</div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Alice</span>
                      </div>

                      <div style={{ position: 'absolute', bottom: '15%', right: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: isOnline ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.1)', 
                          border: `2px solid ${isOnline ? 'var(--warning-color)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOnline ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>B</div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Bob</span>
                      </div>

                      {/* AI Agent Node in the Center */}
                      <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-20%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          background: agentStatus !== 'idle' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(15, 23, 42, 0.6)', 
                          border: `1.5px solid ${agentStatus !== 'idle' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-color)',
                          boxShadow: agentStatus !== 'idle' ? '0 0 10px var(--accent-glow)' : 'none'
                        }}>
                          <Sparkles size={14} className={agentStatus !== 'idle' ? 'animate-glow' : ''} />
                        </div>
                      </div>

                      {peerActivity && (
                        <div style={{ position: 'absolute', bottom: '2%', background: 'rgba(3, 7, 18, 0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                          {peerActivity}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Local Metrics Dashboard */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      Diagnostic Telemetry
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(3, 7, 18, 0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Sync Engine Status:</span>
                        <span style={{ fontWeight: 700, color: isOnline ? 'var(--success-color)' : 'var(--error-color)' }}>
                          {isOnline ? 'Active Syncing' : 'Disconnected'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>CRDT Vector state:</span>
                        <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                          Yjs-SV[{isOnline ? syncedPeers.length + 1 : 1}]
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Offline queue size:</span>
                        <span style={{ fontWeight: 700, color: pendingOps.length > 0 ? 'var(--warning-color)' : 'var(--text-secondary)' }}>
                          {pendingOps.length} operations
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>WebGPU Inference:</span>
                        <span style={{ fontWeight: 700, color: inferenceSpeed > 0 ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                          {inferenceSpeed > 0 ? `${inferenceSpeed} tok/sec` : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pending Ops Queue List */}
                  {pendingOps.length > 0 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '80px' }}>
                      <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Queued State Vector Diff
                      </h5>
                      <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '100px' }}>
                        {pendingOps.map((op, idx) => (
                          <div key={idx} style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ display: 'inline-block', width: '4px', height: '4px', background: 'var(--error-color)', borderRadius: '50%' }} />
                            {op}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', minHeight: '420px', background: 'rgba(3, 7, 18, 0.3)' }}>
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Cpu size={36} color="var(--accent-color)" />
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Simulation Offline for this project</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  The fully interactive visual simulator is currently active on the main daily experiment: <strong>Synaptic-CRDT</strong>. Load that experiment to play with the network syncing.
                </p>
                <button className="btn btn-secondary" onClick={() => setSelectedProjectId('synaptic-crdt')}>
                  Switch to Active Experiment
                </button>
              </div>
            )}
            
          </div>

          {/* Research & Brainstorm Registry Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--success-color)" /> Value Proposition & Market Impact
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Moving computation to client WebGPU/WebAssembly leverages end-user hardware, turning scale from a liability into an asset. High-value data remains localized, addressing compliance requirements (such as GDPR, HIPAA, and SOC2) seamlessly.
              </p>
            </div>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={16} color="var(--primary-color)" /> Architecture Specs
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <tbody>
                  {Object.entries(selectedProject.metrics).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.4rem 0', color: 'var(--text-secondary)', fontWeight: 500 }}>{key}</td>
                      <td style={{ padding: '0.4rem 0', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InnovationSandbox;
