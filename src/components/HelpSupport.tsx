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
      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              q: "How do I import my own RFP documents?",
              a: "You can upload PDF or DOCX files directly in the RFP Workspace. Our system will automatically parse the requirements and extract key evaluation criteria."
            },
            {
              q: "What AI models are used for proposal generation?",
              a: "AutoProposal leverages advanced LLMs like Gemini 1.5 Pro and GPT-4o, optimized with your organization's specific context and past successful proposals."
            },
            {
              q: "Can I export proposals to PDF or Word?",
              a: "Yes, once a proposal draft is finalized, you can export it using the 'Export' button in the workspace. We support standard professional templates."
            },
            {
              q: "Is my data secure?",
              a: "Absolutely. All uploaded documents are encrypted and processed within your dedicated environment. We do not use your data to train public models."
            }
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{item.q}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
