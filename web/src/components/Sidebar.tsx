import {
  GitBranch,
  FileText,
  Users,
  Database,
  Key,
  Shield,
} from 'lucide-react';
import SidebarMenuItem from './SidebarMenuItem';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const Sidebar = (props: SidebarProps) => {
  const { activeMenu, onMenuChange } = props;
  
  const menuItems = [
    { id: 'data-mapping', icon: GitBranch, label: 'Data Mapping' },
    { id: 'governance', icon: FileText, label: 'Governance Document' },
    { id: 'employee', icon: Users, label: 'Employee Awareness' },
    { id: 'processors', icon: Database, label: 'Data Processors' },
    { id: 'access-request', icon: Key, label: 'Subject Access Request' },
    { id: 'breach', icon: Shield, label: 'Data breach register' },
  ];

  return (
    <aside className="h-16 mb-4 md:h-full lg:border-none md:border-none border-b border-gray-200 overflow-x-auto md:overflow-x-visible overflow-y-hidden md:overflow-y-auto">
      <nav className="flex md:flex-col items-center md:items-start md:space-y-1 space-x-2 md:space-x-0 px-6 py-4 md:py-8 min-w-max md:min-w-0">
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => onMenuChange(item.id)}
            isActive={activeMenu === item.id}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
