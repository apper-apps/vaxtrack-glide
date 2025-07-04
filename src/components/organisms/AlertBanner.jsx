import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AlertBanner = ({ alerts = [], onDismiss }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  if (visibleAlerts.length === 0) return null;

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  return (
    <div className="space-y-2">
      {visibleAlerts.map((alert) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            border-l-4 p-4 rounded-lg flex items-start justify-between
            ${getAlertStyles(alert.type)}
          `}
        >
          <div className="flex items-start">
            <ApperIcon 
              name={getAlertIcon(alert.type)} 
              className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" 
            />
            <div>
              <h4 className="font-semibold text-sm">{alert.title}</h4>
              <p className="text-sm mt-1">{alert.message}</p>
              {alert.action && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={alert.action}
                  className="mt-2 p-0 h-auto text-current underline"
                >
                  {alert.actionLabel}
                </Button>
              )}
            </div>
          </div>
          
          <button
            onClick={() => handleDismiss(alert.id)}
            className="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default AlertBanner;