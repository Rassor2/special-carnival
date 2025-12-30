import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  FolderOpen, 
  LogOut, 
  Menu, 
  X,
  Leaf,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Articles', path: '/admin/articles', icon: FileText },
    { name: 'Categories', path: '/admin/categories', icon: FolderOpen },
    { name: 'Subscribers', path: '/admin/subscribers', icon: Users },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1C1C1E] text-white p-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-[#7C9A92]" />
          <span className="font-semibold">Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-stone-800"
          data-testid="admin-mobile-menu-toggle"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'translate-x-0' : ''} md:translate-x-0`}
        data-testid="admin-sidebar"
      >
        {/* Logo */}
        <div className="p-6 border-b border-stone-800">
          <Link to="/admin" className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-[#7C9A92]" />
            <div>
              <span className="font-['Playfair_Display'] text-lg font-semibold block">
                RestfulMind
              </span>
              <span className="text-xs text-stone-500">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#7C9A92] text-white'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`}
                data-testid={`admin-nav-${item.name.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {isActive(item.path) && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-[#7C9A92] rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name || 'Admin'}</p>
              <p className="text-xs text-stone-500 truncate">{user.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white w-full"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white mt-1"
          >
            <span className="font-medium text-sm">View Site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="admin-content" data-testid="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
