import React from 'react';
import { Settings as SettingsIcon, Shield, Database, Bell, Cpu, Lock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>System Preferences</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Configure agent orchestration, security protocols, and system behaviors.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ padding: '0', overflow: 'hidden' }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(3, 7, 18, 0.4)' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <Cpu size={20} color="var(--primary-color)" />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Agent Orchestration</h3>
          </div>
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Critic Agent Verification</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Enable mandatory cross-referencing of all AI answers against source documents</div>
              </div>
              <div style={{ position: 'relative', width: '44px', height: '24px', background: 'var(--primary-color)', borderRadius: '12px', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Graph Traversal Depth</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Maximum hops to search for semantic relationships (Recommended: 3)</div>
              </div>
              <select style={{ background: 'var(--surface-color-light)', border: '1px solid var(--border-color)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', outline: 'none', fontWeight: 600 }}>
                <option>1 Hop</option>
                <option>2 Hops</option>
                <option selected>3 Hops</option>
                <option>4 Hops</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card" 
          style={{ padding: '0', overflow: 'hidden' }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(3, 7, 18, 0.4)' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <Lock size={20} color="var(--accent-color)" />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Privacy & Security</h3>
          </div>
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>PII Redaction</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Automatically mask personal data before sending chunks to LLMs</div>
              </div>
              <div style={{ position: 'relative', width: '44px', height: '24px', background: 'var(--primary-color)', borderRadius: '12px', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Data Residency</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Region for vector database and compute</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color-light)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <Globe size={14} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>US-EAST-1</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn btn-secondary">Discard Changes</button>
          <button className="btn btn-primary">Save Configuration</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

