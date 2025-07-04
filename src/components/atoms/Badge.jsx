import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  icon,
  className = '',
  animate = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    expired: 'bg-red-100 text-red-800',
    expiring: 'bg-yellow-100 text-yellow-800',
    good: 'bg-green-100 text-green-800',
    critical: 'bg-red-500 text-white animate-pulse'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const BadgeComponent = animate ? motion.span : 'span';
  const motionProps = animate ? {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    whileHover: { scale: 1.05 }
  } : {};

  return (
    <BadgeComponent
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="w-3 h-3 mr-1" />}
      {children}
    </BadgeComponent>
  );
};

export default Badge;