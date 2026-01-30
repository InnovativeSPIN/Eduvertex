import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user } = useAuth();
  const [notifications] = useState(3);
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="input-field pl-10 py-2"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => navigate('/student/notifications')}
          aria-label="Open notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

