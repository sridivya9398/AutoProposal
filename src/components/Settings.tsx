import React from 'react';
import { Settings as SettingsIcon, Shield, Database, Bell } from 'lucide-react';

const Settings = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Configure system preferences and AI agent behaviors.</p>
      </div>

      <div className="card" style={{ padding: '0', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SettingsIcon size={20} color="var(--primary-color)" />
          <h3 style={{ fontWeight: 600 }}>General Preferences</h3>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Auto-Save Drafts</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Automatically save responses during generation</div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Dark Mode</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Toggle system theme</div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={20} color="var(--accent-color)" />
          <h3 style={{ fontWeight: 600 }}>AI & Privacy</h3>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Strict Grounding</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reject answers that cannot be verified by sources</div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Data Retention</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Clear vector cache after 30 days</div>
            </div>
            <input type="checkbox" style={{ width: '1.2rem', height: '1.2rem' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
