import React, { useState } from 'react';
import { UploadCloud, File, Search, Server, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Q3_Security_Policy.pdf', type: 'Policy', size: '2.4 MB', date: '2 days ago', status: 'Indexed' },
    { id: 2, name: 'AWS_Architecture_Diagram.png', type: 'Architecture', size: '4.1 MB', date: '5 days ago', status: 'Indexed' },
    { id: 3, name: 'Employee_Handbook_2026.docx', type: 'HR', size: '1.2 MB', date: '1 week ago', status: 'Indexed' },
    { id: 4, name: 'Past_RFP_AcmeCorp.xlsx', type: 'Past Q&A', size: '5.5 MB', date: '2 weeks ago', status: 'Indexed' }
  ]);

  const [isUploading, setIsUploading] = useState(false);

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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Corporate Brain</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage the documents that power the GraphRAG agents.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Server size={18} color="var(--primary-color)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vector DB</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>4,281 Chunks</div>
            </div>
          </div>
          <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Network size={18} color="var(--accent-color)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Knowledge Graph</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>1,502 Entities</div>
            </div>
          </div>
        </div>
      </div>

      <div className="upload-zone" onClick={handleUpload}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {isUploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p>Uploading and vectorizing document...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <UploadCloud size={32} color="var(--primary-color)" />
              </div>
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Click or drag to upload new documents</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Supports PDF, DOCX, XLSX, and PNG (OCR enabled)</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Indexed Documents</h3>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search knowledge base..." 
              style={{ 
                background: 'var(--surface-color)', 
                border: '1px solid var(--border-color)', 
                padding: '0.5rem 1rem 0.5rem 2.2rem', 
                borderRadius: 'var(--radius-md)',
                color: 'white',
                outline: 'none',
                width: '250px'
              }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {documents.map((doc, idx) => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card" 
              style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'var(--surface-color-light)', padding: '0.75rem', borderRadius: '8px' }}>
                  <File size={20} color="var(--text-secondary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                  </div>
                </div>
              </div>
              <div>
                <span className={`status-badge ${doc.status === 'Indexed' ? 'status-completed' : 'status-generating'}`}>
                  {doc.status === 'Indexing...' && <span className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', display: 'inline-block' }}></span>}
                  {doc.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeBase;
