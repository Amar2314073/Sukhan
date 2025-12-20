import { NavLink } from 'react-router';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-amber-900 text-white p-6">
      <h2 className="font-serif text-2xl mb-8">Admin Panel</h2>

      <nav className="space-y-4">
        <NavLink to="/admin" end>📊 Dashboard</NavLink>
        <NavLink to="/admin/poets">✍️ Poets</NavLink>
        <NavLink to="/admin/poems">📜 Poems</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
