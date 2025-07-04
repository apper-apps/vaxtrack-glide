import { differenceInDays } from 'date-fns';

export const generateAlerts = (inventory) => {
  const alerts = [];
  const today = new Date();

  // Check for expired vaccines
  const expiredVaccines = inventory.filter(item => new Date(item.expirationDate) < today);
  if (expiredVaccines.length > 0) {
    alerts.push({
      id: 'expired-vaccines',
      type: 'critical',
      title: 'Expired Vaccines Detected',
      message: `${expiredVaccines.length} vaccine${expiredVaccines.length > 1 ? 's have' : ' has'} expired and should be removed from inventory.`,
      action: () => window.location.href = '/loss-reporting',
      actionLabel: 'Report Loss'
    });
  }

  // Check for vaccines expiring soon
  const expiringSoon = inventory.filter(item => {
    const daysUntilExpiry = differenceInDays(new Date(item.expirationDate), today);
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });
  if (expiringSoon.length > 0) {
    alerts.push({
      id: 'expiring-soon',
      type: 'warning',
      title: 'Vaccines Expiring Soon',
      message: `${expiringSoon.length} vaccine${expiringSoon.length > 1 ? 's expire' : ' expires'} within 30 days. Plan administration accordingly.`,
      action: () => window.location.href = '/administration',
      actionLabel: 'Administer Doses'
    });
  }

  // Check for low stock
  const lowStock = inventory.filter(item => item.remainingQuantity <= 10 && item.remainingQuantity > 0);
  if (lowStock.length > 0) {
    alerts.push({
      id: 'low-stock',
      type: 'warning',
      title: 'Low Stock Alert',
      message: `${lowStock.length} vaccine${lowStock.length > 1 ? 's are' : ' is'} running low on stock. Consider reordering.`,
      action: () => window.location.href = '/receiving',
      actionLabel: 'Receive Shipment'
    });
  }

  // Check for out of stock
  const outOfStock = inventory.filter(item => item.remainingQuantity === 0);
  if (outOfStock.length > 0) {
    alerts.push({
      id: 'out-of-stock',
      type: 'critical',
      title: 'Out of Stock',
      message: `${outOfStock.length} vaccine${outOfStock.length > 1 ? 's are' : ' is'} completely out of stock.`,
      action: () => window.location.href = '/receiving',
      actionLabel: 'Receive Shipment'
    });
  }

  return alerts;
};

export const getExpirationStatus = (expirationDate) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const daysUntilExpiry = differenceInDays(expDate, today);

  if (daysUntilExpiry < 0) return { status: 'expired', color: 'red', message: 'Expired' };
  if (daysUntilExpiry <= 7) return { status: 'critical', color: 'red', message: `${daysUntilExpiry}d left` };
  if (daysUntilExpiry <= 30) return { status: 'warning', color: 'yellow', message: `${daysUntilExpiry}d left` };
  return { status: 'good', color: 'green', message: `${daysUntilExpiry}d left` };
};

export const getStockStatus = (remainingQuantity, minStock = 10) => {
  if (remainingQuantity === 0) return { status: 'out', color: 'red', message: 'Out of Stock' };
  if (remainingQuantity <= minStock) return { status: 'low', color: 'yellow', message: 'Low Stock' };
  return { status: 'good', color: 'green', message: 'In Stock' };
};