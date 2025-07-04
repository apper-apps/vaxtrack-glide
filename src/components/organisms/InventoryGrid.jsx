import { motion } from 'framer-motion';
import VaccineCard from '@/components/molecules/VaccineCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const InventoryGrid = ({ 
  vaccines, 
  loading, 
  error, 
  onRetry,
  onViewDetails,
  onAdminister,
  onAdjust,
  className = ''
}) => {
  if (loading) {
    return <Loading type="inventory" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!vaccines || vaccines.length === 0) {
    return (
      <Empty 
        type="inventory"
        action={() => window.location.href = '/receiving'}
      />
    );
  }

  return (
    <div className={`${className}`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {vaccines.map((vaccine, index) => (
          <motion.div
            key={vaccine.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <VaccineCard
              vaccine={vaccine}
              onViewDetails={onViewDetails}
              onAdminister={onAdminister}
              onAdjust={onAdjust}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InventoryGrid;