import React, { useState } from 'react';
import { Upload, Play, CheckCircle2, Clock, ShieldAlert, Cpu, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "How does your organization encrypt data at rest and in transit?",
    status: 'completed',
    answer: "Our organization enforces AES-256 encryption for all data at rest across our databases and blob storage. For data in transit, we mandate TLS 1.3 for all external communications and API endpoints. Internal service-to-service communication is encrypted using mTLS via our service mesh.",
    sources: ['Q3_Security_Policy.pdf (Page 12)', 'AWS_Architecture_Diagram.png']
  },
  {
    id: 2,
    question: "Describe your incident response plan and average recovery time.",
    status: 'completed',
    answer: "We maintain a formalized Incident Response Plan (IRP) that is reviewed annually. In the event of a critical incident, our MTTR (Mean Time To Recovery) target is < 4 hours. The plan includes immediate containment, eradication, and forensic analysis phases, followed by a mandatory post-mortem report within 48 hours.",
    sources: ['Employee_Handbook_2026.docx (Sec 4.2)', 'SOC2_Compliance_Report_2026.pdf']
  },
  {
    id: 3,
    question: "Do you use multi-factor authentication (MFA) for administrative access?",
    status: 'generating',
    answer: "We mandate...",
    sources: []
  },
  {
    id: 4,
    question: "What is your data retention and deletion policy upon contract termination?",
    status: 'pending',
    answer: "",
    sources: []
  }
];

const RFPWorkspace = () => {
  const [projectState, setProjectState] = useState<'empty' | 'uploaded' | 'generating'>('empty');
  const [questions, setQuestions] = useState<any[]>([]);

  const handleUploadRFP = () => {
    setProjectState('uploaded');
  };

  const handleStartGeneration = () => {
    setProjectState('generating');
    setQuestions(MOCK_QUESTIONS);
    
    setTimeout(() => {
      setQuestions(prev => {
        const newQ = [...prev];
        newQ[2] = {
          ...newQ[2],
          status: 'completed',
          answer: "We mandate Multi-Factor Authentication (MFA) for all administrative and user access. For internal systems, administrators must use hardware security keys (FIDO2/WebAuthn). Standard user access requires time-based OTP or push notifications via approved authenticator apps.",
          sources: ['Q3_Security_Policy.pdf (Page 4)']
        };
        newQ[3] = {
          ...newQ[3],
          status: 'generating',
          answer: "Upon contract..."
        };
        return newQ;
      });
      
      setTimeout(() => {
        setQuestions(prev => {
          const newQ = [...prev];
          newQ[3] = {
            ...newQ[3],
            status: 'completed',
            answer: "Upon contract termination, all customer data is securely purged from our active databases within 30 days. Cryptographic erasure is performed on all backups after our standard 90-day retention period expires, ensuring data cannot be recovered.",
            sources: ['SOC2_Compliance_Report_2026.pdf (Page 45)']
          };
          return newQ;
        });
      }, 3000);
    }, 4000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Active Workspace</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Upload client questionnaires to auto-generate responses.</p>
        </div>
        
        {projectState === 'uploaded' && (
          <button className="btn btn-primary" onClick={handleStartGeneration}>
            <Cpu size={18} />
            Start AI Generation
          </button>
        )}
      </div>

      {projectState === 'empty' && (
        <div className="upload-zone" onClick={handleUploadRFP} style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <Upload size={32} color="var(--accent-color)" />
            </div>
            <div>
              <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Upload RFP / Security Questionnaire</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Excel (.xlsx) files with blank columns supported</p>
            </div>
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }}>Browse Files</button>
          </div>
        </div>
      )}

      {projectState !== 'empty' && (
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                <FileText size={24} color="var(--primary-color)" />
              </div>
              <div>
                <h3 style={{ fontWeight: 600 }}>MegaCorp_Security_Review_Q4.xlsx</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                  <span>104 Questions Detected</span>
                  <span>•</span>
                  <span>Due in 3 days</span>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Progress</div>
              <div style={{ fontWeight: 600, color: 'var(--success-color)' }}>
                {projectState === 'uploaded' ? '0%' : (questions[3]?.status === 'completed' ? '100%' : '75%')}
              </div>
            </div>
          </div>

          {projectState === 'generating' && (
            <div className="card" style={{ padding: '0' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.3)' }}>
                <h3 style={{ fontWeight: 600 }}>Auto-Generated Responses</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="status-badge status-generating" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)' }} />
                    Multi-Agent GraphRAG Active
                  </span>
                </div>
              </div>
              
              <div style={{ padding: '0 1.5rem' }}>
                {questions.map((q) => (
                  <motion.div 
                    key={q.id} 
                    className="question-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ marginTop: '0.25rem' }}>
                        {q.status === 'completed' ? (
                          <CheckCircle2 size={20} color="var(--success-color)" />
                        ) : q.status === 'generating' ? (
                          <Cpu size={20} color="var(--accent-color)" className="animate-pulse" />
                        ) : (
                          <Clock size={20} color="var(--text-secondary)" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, marginBottom: '0.75rem', lineHeight: 1.4 }}>
                          {q.id}. {q.question}
                        </div>
                        
                        {q.status !== 'pending' && (
                          <div style={{ 
                            background: q.status === 'generating' ? 'rgba(139, 92, 246, 0.05)' : 'var(--surface-color-light)', 
                            padding: '1rem', 
                            borderRadius: 'var(--radius-md)',
                            borderLeft: q.status === 'generating' ? '3px solid var(--accent-color)' : '3px solid var(--primary-color)'
                          }}>
                            <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                              {q.answer}
                              {q.status === 'generating' && <span className="typing-cursor" />}
                            </div>
                            
                            {q.status === 'completed' && q.sources.length > 0 && (
                              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                  <ShieldAlert size={14} color="var(--success-color)" />
                                  <span style={{ fontWeight: 600, color: 'var(--success-color)' }}>Verified by Critic Agent</span>
                                </div>
                                <div><span style={{ fontWeight: 500 }}>Sources:</span> {q.sources.join(', ')}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RFPWorkspace;
