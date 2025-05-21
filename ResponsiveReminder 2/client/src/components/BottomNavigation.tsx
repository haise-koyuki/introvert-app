import { Link, useLocation } from "wouter";

type BottomNavigationProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const [location, navigate] = useLocation();

  const handleTabClick = (tab: string, path: string) => {
    onTabChange(tab);
    navigate(path);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center h-16">
      <button 
        className={`flex flex-col items-center justify-center py-2 px-4 ${activeTab === 'dashboard' ? 'text-primary' : 'text-gray-500'}`}
        onClick={() => handleTabClick('dashboard', '/')}
      >
        <span className="material-icons">dashboard</span>
        <span className="text-xs mt-1">Dashboard</span>
      </button>
      <button 
        className={`flex flex-col items-center justify-center py-2 px-4 ${activeTab === 'contacts' ? 'text-primary' : 'text-gray-500'}`}
        onClick={() => handleTabClick('contacts', '/contacts')}
      >
        <span className="material-icons">people</span>
        <span className="text-xs mt-1">Contacts</span>
      </button>
      <button 
        className={`flex flex-col items-center justify-center py-2 px-4 ${activeTab === 'connections' ? 'text-primary' : 'text-gray-500'}`}
        onClick={() => handleTabClick('connections', '/connections')}
      >
        <span className="material-icons">link</span>
        <span className="text-xs mt-1">Connect</span>
      </button>
      <button 
        className={`flex flex-col items-center justify-center py-2 px-4 ${activeTab === 'settings' ? 'text-primary' : 'text-gray-500'}`}
        onClick={() => handleTabClick('settings', '/settings')}
      >
        <span className="material-icons">settings</span>
        <span className="text-xs mt-1">Settings</span>
      </button>
    </nav>
  );
}
