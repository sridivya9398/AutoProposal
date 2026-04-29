import React from 'react';
import { HelpCircle, Mail, BookOpen, MessageSquare } from 'lucide-react';

const HelpSupport = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Help & Support</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Get assistance with AutoProposal platform.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
            <BookOpen size={24} color="var(--primary-color)" />
          </div>
          <div>
            <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Documentation</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Learn how to upload RFPs and configure agents.</p>
          </div>
          <button className="btn btn-secondary" style={{ marginTop: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View Docs</button>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
            <Mail size={24} color="var(--accent-color)" />
          </div>
          <div>
            <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Contact Support</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Create a ticket for our technical team.</p>
          </div>
          <button className="btn btn-secondary" style={{ marginTop: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Email Us</button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
