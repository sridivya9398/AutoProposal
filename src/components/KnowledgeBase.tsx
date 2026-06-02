import { useState } from 'react';
import { UploadCloud, File, Search, Server, Network, Eye, MoreVertical, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Q3_Security_Policy.pdf', type: 'Policy', size: '2.4 MB', date: '2 days ago', status: 'Indexed' },
    { id: 2, name: 'AWS_Architecture_Diagram.png', type: 'Architecture', size: '4.1 MB', date: '5 days ago', status: 'Indexed' },
    { id: 3, name: 'Employee_Handbook_2026.docx', type: 'HR', size: '1.2 MB', date: '1 week ago', status: 'Indexed' },
    { id: 4, name: 'Past_RFP_AcmeCorp.xlsx', type: 'Past Q&A', size: '5.5 MB', date: '2 weeks ago', status: 'Indexed' }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [activeView, setActiveView] = useState<'docs' | 'graph'>('docs');

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setDocuments([{
        id: 5, 
        name: 'SOC2_Compliance_Report_2026.pdf', 
        type: 'Compliance', 
        size: '8.2 MB', 
        date: 'Just now', 
        status: 'Indexing...'
      }, ...documents]);
      setIsUploading(false);
      
      setTimeout(() => {
        setDocuments(prev => {
          const newDocs = [...prev];
          newDocs[0].status = 'Indexed';
          return newDocs;
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Corporate Brain</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage and explore the semantic knowledge base powering your agents.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(30, 41, 59, 0.4)' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <Server size={18} color="var(--primary-color)" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Vector Storage</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>4,281 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Chunks</span></div>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(30, 41, 59, 0.4)' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <Network size={18} color="var(--accent-color)" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Knowledge Graph</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>1,502 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Entities</span></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveView('docs')}
          style={{ 
            border: 'none', 
            color: activeView === 'docs' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: activeView === 'docs' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          Document Library
        </button>
        <button 
          onClick={() => setActiveView('graph')}
          style={{ 
            border: 'none', 
            color: activeView === 'graph' ? 'var(--accent-color)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: activeView === 'graph' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          Graph Explorer
        </button>
      </div>

      {activeView === 'docs' ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="upload-zone" onClick={handleUpload}>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              {isUploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                  <div className="animate-glow" style={{ width: '50px', height: '50px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Processing Document...</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Extracting entities and generating vector embeddings</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))', 
                    padding: '1.5rem', 
                    borderRadius: '24px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                  }}>
                    <UploadCloud size={40} color="var(--primary-color)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ingest Knowledge Source</p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Drag and drop PDF, DOCX, or XLSX to expand the corporate brain</p>
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Select Files</button>
                </div>
              )}
            </motion.div>
          </div>

          <div style={{ marginTop: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Indexed Knowledge <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem', marginLeft: '0.5rem' }}>({documents.length})</span></h3>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Filter documents..." 
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--border-color)', 
                    padding: '0.7rem 1rem 0.7rem 2.8rem', 
                    borderRadius: '12px',
                    color: 'white',
                    outline: 'none',
                    width: '300px',
                    fontSize: '0.9rem'
                  }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {documents.map((doc, idx) => (
                <motion.div 
                  key={doc.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card" 
                  style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ 
                      background: 'var(--surface-color-light)', 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)'
                    }}>
                      <File size={22} color={doc.status === 'Indexed' ? 'var(--primary-color)' : 'var(--text-secondary)'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', fontWeight: 500 }}>
                        <span style={{ color: 'var(--text-primary)' }}>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span className={`status-badge ${doc.status === 'Indexed' ? 'status-completed' : 'status-generating'}`}>
                      {doc.status === 'Indexing...' && <div className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)' }} />}
                      {doc.status}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px' }} title="View Details"><Eye size={18} /></button>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px' }} title="More Actions"><MoreVertical size={18} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="card" 
          style={{ height: '600px', position: 'relative', overflow: 'hidden', background: 'rgba(3, 7, 18, 0.4)', padding: 0 }}
        >
          {/* Animated Graph Simulation */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Animated Lines */}
              <motion.line x1="20%" y1="30%" x2="50%" y2="50%" stroke="url(#edgeGradient)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }} />
              <motion.line x1="50%" y1="50%" x2="80%" y2="40%" stroke="url(#edgeGradient)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }} />
              <motion.line x1="50%" y1="50%" x2="40%" y2="80%" stroke="url(#edgeGradient)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, delay: 1, repeat: Infinity }} />
              <motion.line x1="50%" y1="50%" x2="60%" y2="20%" stroke="url(#edgeGradient)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.2, repeat: Infinity }} />
            </svg>

            {/* Entity Nodes */}
            <motion.div 
              className="graph-node" 
              style={{ position: 'absolute', top: '30%', left: '20%', border: '2px solid var(--primary-color)', background: 'rgba(59, 130, 246, 0.2)' }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Network size={20} color="var(--primary-color)" />
              <div style={{ position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 700 }}>Data Encryption</div>
            </motion.div>

            <motion.div 
              className="graph-node" 
              style={{ position: 'absolute', top: '50%', left: '50%', border: '3px solid var(--accent-color)', width: '60px', height: '60px', background: 'rgba(139, 92, 246, 0.2)' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Server size={28} color="var(--accent-color)" />
              <div style={{ position: 'absolute', top: '115%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 800 }}>Security Protocol</div>
            </motion.div>

            <motion.div 
              className="graph-node" 
              style={{ position: 'absolute', top: '40%', left: '80%', border: '2px solid #10b981', background: 'rgba(16, 185, 129, 0.2)' }}
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <File size={20} color="#10b981" />
              <div style={{ position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 700 }}>SOC2 Report</div>
            </motion.div>

            <motion.div 
              className="graph-node" 
              style={{ position: 'absolute', top: '80%', left: '40%', border: '2px solid #f59e0b', background: 'rgba(245, 158, 11, 0.2)' }}
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Network size={20} color="#f59e0b" />
              <div style={{ position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 700 }}>MFA Policy</div>
            </motion.div>
          </div>

          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.6)', maxWidth: '300px' }}>
              <h4 style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Graph Insights</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Semantic relationships are automatically extracted during ingestion. "Security Protocol" is currently the most connected hub node.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary"><Download size={16} /> Export Graph</button>
              <button className="btn btn-primary">Recalculate Embeddings</button>
            </div>
          </div>

          <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
            <div className="glass-panel" style={{ padding: '0.5rem 1rem', background: 'rgba(3, 7, 18, 0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Live Graph Visualization</span>
            </div>
          </div>
        </motion.div>
      )}
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeBase;

