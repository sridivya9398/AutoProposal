import React, { useState } from 'react';
import { Layers, FileText, Database, Settings as SettingsIcon, HelpCircle, Bot, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--primary-color)', padding: '0.5rem', borderRadius: '8px' }}>
            <Bot size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }} className="gradient-text">AutoProposal</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Agentic GraphRAG</p>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <div 
            className={`nav-item ${activeTab === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveTab('workspace')}
          >
            <FileText size={20} />
            <span>RFP Workspace</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'knowledge' ? 'active' : ''}`}
            onClick={() => setActiveTab('knowledge')}
          >
            <Database size={20} />
            <span>Knowledge Base</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'traces' ? 'active' : ''}`}
            onClick={() => setActiveTab('traces')}
          >
            <Layers size={20} />
            <span>Agent Traces</span>
          </div>
        </nav>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </div>
          <div className="nav-item" style={{ color: '#ef4444' }}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>

        <header style={{ 
          padding: '1.5rem 2rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {activeTab === 'workspace' && 'Active Projects'}
              {activeTab === 'knowledge' && 'Corporate Brain'}
              {activeTab === 'traces' && 'System Traces'}
              {activeTab === 'settings' && 'System Preferences'}
              {activeTab === 'help' && 'Support Center'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--success-color)', fontWeight: 500 }}>Agents Online</span>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              SD
            </div>
          </div>
        </header>

        <div className="page-container">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
          >
            {activeTab === 'workspace' && <RFPWorkspace />}
            {activeTab === 'knowledge' && <KnowledgeBase />}
            {activeTab === 'traces' && <AgentTraces />}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'help' && <HelpSupport />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;
