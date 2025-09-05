// App.tsx
import React, { useState } from 'react';
import { Header } from './components/Header';

// Import the components built earlier
import PostsLocal from './PostsLocal';                 // local axios.get in useEffect
import PostsWithInstance from './PostsWithInstance';   // uses shared axios instance
import PostsWithHook from './PostsWithHook';           // uses useAxios custom hook
import ProfileAutoRefresh from './ProfileAutoRefresh'; // uses authApi with 401 refresh


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
