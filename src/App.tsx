import { useState } from 'react';
import { Header } from './components/Header';
import PostsLocal from './components/PostsLocal';
import PostsWithInstance from './components/PostsWithInstance';
import PostsWithHook from './components/PostsWithHook';
import ProfileAutoRefresh from './components/ProfileAutoRefresh';

// Import the components built earlier
type TabKey = 'local' | 'instance' | 'hook' | 'auto';

export default function App() {
  const [tab, setTab] = useState<TabKey>('local');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <Header active={tab} onChange={setTab} />
      <main style={{ paddingTop: 8 }}>
        {tab === 'local' && <PostsLocal />}
        {tab === 'instance' && <PostsWithInstance />}
        {tab === 'hook' && <PostsWithHook />}
        {tab === 'auto' && <ProfileAutoRefresh />}
      </main>
    </div>
  );
}
