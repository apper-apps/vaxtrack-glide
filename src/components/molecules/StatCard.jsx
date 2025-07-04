import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color = 'primary',
  className = '',
  onClick
}) => {
  const colors = {
    primary: 'from-primary to-secondary',
    success: 'from-green-500 to-accent',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-secondary'
  };

  const iconColors = {
    primary: 'text-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600'
  };

  return (
    <Card 
      hover={!!onClick}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className={`ml-2 flex items-center text-sm ${
                trend.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                <ApperIcon 
                  name={trend.type === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                  className="w-4 h-4 mr-1" 
                />
                {trend.value}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]}/10`}>
            <ApperIcon name={icon} className={`w-6 h-6 ${iconColors[color]}`} />
          </div>
        )}
      </div>
      
      {/* Gradient accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[color]}`} />
    </Card>
  );
};

export default StatCard;