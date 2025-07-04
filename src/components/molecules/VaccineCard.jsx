import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ExpirationAlert from '@/components/molecules/ExpirationAlert';
import ApperIcon from '@/components/ApperIcon';

const VaccineCard = ({ 
  vaccine, 
  onViewDetails, 
  onAdminister, 
  onAdjust,
  className = '' 
}) => {
  const isLowStock = vaccine.remainingQuantity <= 10;
  const isExpired = new Date(vaccine.expirationDate) < new Date();

  return (
    <Card 
      hover
      className={`relative ${className} ${isExpired ? 'border-red-200 bg-red-50/50' : ''}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {vaccine.commercialName}
            </h3>
            <p className="text-sm text-gray-600">
              {vaccine.genericName} • Lot: {vaccine.lotNumber}
            </p>
          </div>
          <ExpirationAlert expirationDate={vaccine.expirationDate} />
        </div>

        {/* Quantity Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {vaccine.remainingQuantity}
            </p>
            <p className="text-xs text-gray-600">Available</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold text-gray-700">
              {vaccine.quantity - vaccine.remainingQuantity}
            </p>
            <p className="text-xs text-gray-600">Used</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2">
          {isLowStock && (
            <Badge variant="warning" icon="AlertTriangle" size="xs">
              Low Stock
            </Badge>
          )}
          {isExpired && (
            <Badge variant="danger" icon="AlertCircle" size="xs">
              Expired
            </Badge>
          )}
        </div>

        {/* Meta Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Received: {format(new Date(vaccine.receivedDate), 'MMM dd, yyyy')}</p>
          <p>Expires: {format(new Date(vaccine.expirationDate), 'MMM dd, yyyy')}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <Button 
            variant="primary" 
            size="sm" 
            icon="Syringe"
            onClick={() => onAdminister(vaccine)}
            disabled={isExpired || vaccine.remainingQuantity === 0}
            className="flex-1"
          >
            Administer
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            icon="Edit"
            onClick={() => onAdjust(vaccine)}
            className="flex-1"
          >
            Adjust
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VaccineCard;