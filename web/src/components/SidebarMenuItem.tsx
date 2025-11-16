import type { LucideIcon } from 'lucide-react';

type SidebarMenuItemProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive: boolean;
  activeColor?: string;
  inactiveTextColor?: string;
  inactiveIconColor?: string;
}


const SidebarMenuItem = (props: SidebarMenuItemProps) => {

  const { icon: Icon, label, onClick, isActive, activeColor = '#009540', inactiveTextColor = 'text-gray-700', inactiveIconColor = 'text-gray-600' } = props;

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 py-2 mr-8 rounded-lg transition-colors text-left whitespace-nowrap md:w-full ${isActive ? `text-[${activeColor}]` : inactiveTextColor
        }`}
      style={isActive ? { color: activeColor } : undefined}
    >
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${isActive ? `text-[${activeColor}]` : inactiveIconColor
          }`}
        style={isActive ? { color: activeColor } : undefined}
      />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default SidebarMenuItem;
