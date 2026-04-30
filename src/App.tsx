import React, { useState } from 'react';
import { Layers, FileText, Database, Settings as SettingsIcon, HelpCircle, Bot, LogOut, ChevronRight, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import KnowledgeBase from './components/KnowledgeBase';
import RFPWorkspace from './components/RFPWorkspace';
import AgentTraces from './components/AgentTraces';
import Settings from './components/Settings';
import HelpSupport from './components/HelpSupport';

function App() {
  const [activeTab, setActiveTab] = useState('workspace');

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', 
            padding: '0.6rem', 
            borderRadius: '12px',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}>
            <Bot size={28} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">AutoProposal</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Agentic GraphRAG</p>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', marginLeft: '0.5rem' }}>Main Menu</p>
          <div 
            className={`nav-item ${activeTab === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveTab('workspace')}
          >
            <FileText size={20} />
            <span style={{ fontWeight: 600 }}>RFP Workspace</span>
            {activeTab === 'workspace' && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </div>
          <div 
            className={`nav-item ${activeTab === 'knowledge' ? 'active' : ''}`}
            onClick={() => setActiveTab('knowledge')}
          >
            <Database size={20} />
            <span style={{ fontWeight: 600 }}>Knowledge Base</span>
            {activeTab === 'knowledge' && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </div>
          <div 
            className={`nav-item ${activeTab === 'traces' ? 'active' : ''}`}
            onClick={() => setActiveTab('traces')}
          >
            <Layers size={20} />
            <span style={{ fontWeight: 600 }}>Agent Traces</span>
            {activeTab === 'traces' && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </div>
        </nav>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', marginLeft: '0.5rem' }}>Preferences</p>
          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon size={20} />
            <span style={{ fontWeight: 600 }}>Settings</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            <HelpCircle size={20} />
            <span style={{ fontWeight: 600 }}>Support</span>
          </div>
          <div className="nav-item" style={{ color: 'var(--error-color)', marginTop: '1rem' }}>
            <LogOut size={20} />
            <span style={{ fontWeight: 600 }}>Sign Out</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>

        <header style={{ 
          padding: '1.25rem 2.5rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(3, 7, 18, 0.4)',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          zIndex: 40
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              {activeTab === 'workspace' && 'RFP Workspace'}
              {activeTab === 'knowledge' && 'Corporate Brain'}
              {activeTab === 'traces' && 'System Traces'}
              {activeTab === 'settings' && 'System Preferences'}
              {activeTab === 'help' && 'Support Center'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-color)',
                  padding: '0.6rem 1rem 0.6rem 2.5rem',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem',
                  width: '240px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-secondary)" />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--error-color)', borderRadius: '50%', border: '2px solid var(--bg-color)' }}></div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Sri Divya</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Admin Account</p>
              </div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800,
                color: 'white',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                SD
              </div>
            </div>
          </div>
        </header>

        <div className="page-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ height: '100%' }}
            >
              {activeTab === 'workspace' && <RFPWorkspace />}
              {activeTab === 'knowledge' && <KnowledgeBase />}
              {activeTab === 'traces' && <AgentTraces />}
              {activeTab === 'settings' && <Settings />}
              {activeTab === 'help' && <HelpSupport />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;

