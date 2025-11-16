import type { LucideIcon } from 'lucide-react';

type ButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'onlyBorder';
  className?: string;
}

  const Button = (props: ButtonProps) => {

  const { icon: Icon, label, onClick, variant = 'default', className = '' } = props;
  const baseClasses = 'flex items-center space-x-2 px-4 py-2 rounded-md';
  
  const variantClasses = {
    default: 'bg-white border border-gray-300 hover:bg-gray-300 text-gray-700',
    primary: 'bg-[#009540] hover:bg-[#007a33] border border-[#377D3F] text-white',
    onlyBorder: 'bg-white border border-[#009540] text-[#009540]',

  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default Button;
