import React, { useState } from 'react';
import { Terminal, Activity, GitCommit, Search, ArrowRight, Brain, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const TRACES = [
  { id: 1, agent: 'RouterAgent', action: 'Received Query', details: 'Routing question: "Describe incident response plan..."', status: 'success', time: '10:01:23 AM' },
  { id: 2, agent: 'RetrievalAgent', action: 'Vector Search', details: 'Found 4 chunks in Vector DB', status: 'success', time: '10:01:24 AM' },
  { id: 3, agent: 'GraphAgent', action: 'Entity Traversal', details: 'Traversing nodes: [Incident Response] -> [MTTR]', status: 'success', time: '10:01:25 AM' },
  { id: 4, agent: 'SynthesizerAgent', action: 'Draft Answer', details: 'Combining sources to generate response', status: 'success', time: '10:01:27 AM' },
  { id: 5, agent: 'CriticAgent', action: 'Verify Grounding', details: 'Checking citations against original documents', status: 'warning', time: '10:01:28 AM' },
  { id: 6, agent: 'SynthesizerAgent', action: 'Revise Answer', details: 'Adding missing citation to SOC2 report', status: 'success', time: '10:01:29 AM' }
];

const AgentTraces = () => {
  const [filter, setFilter] = useState('');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Agentic Traces</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Observe the multi-agent chain-of-thought and GraphRAG reasoning process.</p>
        </div>
        <div className="glass-panel" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--success-color)' }}>
          <Activity size={18} color="var(--success-color)" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--success-color)' }}>Agents Operational</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(3, 7, 18, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Terminal size={18} color="var(--primary-color)" />
              <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>Execution Logs</h3>
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Filter traces..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-color)', 
                  padding: '0.4rem 1rem 0.4rem 2.2rem', 
                  borderRadius: '10px',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.8rem',
                  width: '200px'
                }} 
              />
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {TRACES.filter(t => t.agent.toLowerCase().includes(filter.toLowerCase()) || t.action.toLowerCase().includes(filter.toLowerCase())).map((trace, idx) => (
                <motion.div 
                  key={trace.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ display: 'flex', gap: '1.25rem' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.25rem' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      background: trace.status === 'warning' ? 'var(--warning-color)' : 'var(--success-color)',
                      boxShadow: `0 0 10px ${trace.status === 'warning' ? 'var(--warning-color)' : 'var(--success-color)'}80`
                    }} />
                    {idx !== TRACES.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--border-color)', margin: '0.5rem 0' }} />}
                  </div>
                  <div style={{ 
                    flex: 1, 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '1.25rem', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '0.9rem' }}>{trace.agent}</span>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-color)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{trace.action}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{trace.time}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {trace.details}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={18} color="var(--primary-color)" /> Reasoning Graph
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              {[
                { label: 'Query Input', icon: <Zap size={14} />, color: 'var(--primary-color)' },
                { label: 'Vector Search', icon: <Search size={14} />, color: 'var(--primary-color)' },
                { label: 'Graph Traversal', icon: <Network size={14} />, color: 'var(--accent-color)' },
                { label: 'Critic Review', icon: <ShieldCheck size={14} />, color: 'var(--success-color)' },
                { label: 'Final Synthesis', icon: <Brain size={14} />, color: 'var(--primary-color)' }
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      zIndex: 2
                    }}
                  >
                    <div style={{ background: `${step.color}20`, padding: '0.5rem', borderRadius: '8px', color: step.color }}>
                      {step.icon}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{step.label}</span>
                  </motion.div>
                  {i < 4 && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
                      <ArrowRight size={16} color="var(--border-color)" style={{ transform: 'rotate(90deg)' }} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>Active Agents</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Router', 'Retriever', 'Graph', 'Synthesizer', 'Critic'].map((agent) => (
                <div key={agent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{agent}Agent</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success-color)' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--success-color)', fontWeight: 700 }}>IDLE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentTraces;

