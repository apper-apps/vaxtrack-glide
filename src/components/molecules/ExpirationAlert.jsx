import { motion } from 'framer-motion';
import { differenceInDays } from 'date-fns';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ExpirationAlert = ({ expirationDate, className = '' }) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const daysUntilExpiration = differenceInDays(expDate, today);

  const getAlertType = () => {
    if (daysUntilExpiration < 0) return 'expired';
    if (daysUntilExpiration <= 30) return 'critical';
    if (daysUntilExpiration <= 60) return 'warning';
    return 'good';
  };

  const getAlertMessage = () => {
    if (daysUntilExpiration < 0) return 'Expired';
    if (daysUntilExpiration === 0) return 'Expires today';
    if (daysUntilExpiration <= 30) return `${daysUntilExpiration}d left`;
    if (daysUntilExpiration <= 60) return `${daysUntilExpiration}d left`;
    return `${daysUntilExpiration}d left`;
  };

  const getVariant = () => {
    const alertType = getAlertType();
    switch (alertType) {
      case 'expired':
        return 'danger';
      case 'critical':
        return 'critical';
      case 'warning':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getIcon = () => {
    const alertType = getAlertType();
    switch (alertType) {
      case 'expired':
        return 'AlertTriangle';
      case 'critical':
        return 'Clock';
      case 'warning':
        return 'Clock';
      default:
        return 'CheckCircle';
    }
  };

  const shouldPulse = getAlertType() === 'critical';

  return (
    <motion.div
      className={`${className} ${shouldPulse ? 'pulse-critical' : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Badge
        variant={getVariant()}
        icon={getIcon()}
        size="sm"
        animate={shouldPulse}
      >
        {getAlertMessage()}
      </Badge>
    </motion.div>
  );
};

export default ExpirationAlert;