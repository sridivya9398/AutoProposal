import React, { useState } from 'react';
import { Terminal, Activity, GitCommit, Search } from 'lucide-react';
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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Agent Traces</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor real-time GraphRAG agent interactions and reasoning.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Activity size={18} color="var(--accent-color)" />
          <span style={{ fontWeight: 500 }}>System Healthy</span>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Terminal size={18} color="var(--primary-color)" />
            <h3 style={{ fontWeight: 600 }}>Execution Logs</h3>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Filter logs..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ 
                background: 'var(--surface-color-light)', 
                border: '1px solid var(--border-color)', 
                padding: '0.4rem 1rem 0.4rem 2rem', 
                borderRadius: 'var(--radius-md)',
                color: 'white',
                outline: 'none',
                fontSize: '0.85rem'
              }} 
            />
          </div>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {TRACES.filter(t => t.agent.toLowerCase().includes(filter.toLowerCase()) || t.action.toLowerCase().includes(filter.toLowerCase())).map((trace, idx) => (
              <motion.div 
                key={trace.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{ display: 'flex', gap: '1rem' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.25rem' }}>
                  <GitCommit size={16} color={trace.status === 'warning' ? '#f59e0b' : 'var(--success-color)'} />
                  {idx !== TRACES.length - 1 && <div style={{ width: '2px', height: '100%', background: 'var(--border-color)', margin: '0.25rem 0' }} />}
                </div>
                <div style={{ flex: 1, background: 'var(--surface-color-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{trace.agent}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{trace.action}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{trace.time}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {trace.details}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentTraces;
