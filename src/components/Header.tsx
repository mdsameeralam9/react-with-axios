// Header.tsx
import React from 'react';

type TabKey = 'local' | 'instance' | 'hook' | 'auto';

const LABELS: Record<TabKey, string> = {
  local: 'Local call',
  instance: 'Axios instance',
  hook: 'Custom hook',
  auto: 'Auto refresh',
};

export function Header({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
}) {
  return (
    <header style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 16 }}>
      <nav style={{ display: 'flex', gap: 12, padding: '12px 0' }}>
        {(Object.keys(LABELS) as TabKey[]).map((key) => {
          const selected = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              style={{
                border: 'none',
                background: 'none',
                padding: '8px 12px',
                borderBottom: selected ? '2px solid #2563eb' : '2px solid transparent',
                color: selected ? '#111827' : '#6b7280',
                fontWeight: selected ? 600 : 500,
                cursor: 'pointer',
              }}
              aria-current={selected ? 'page' : undefined}
            >
              {LABELS[key]}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
