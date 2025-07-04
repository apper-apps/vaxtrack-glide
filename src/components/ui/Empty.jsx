import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No data available",
  description = "Get started by adding your first item",
  icon = "Package",
  action,
  actionLabel = "Add Item",
  type = 'default' 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'inventory':
        return {
          title: "No vaccines in inventory",
          description: "Start by receiving your first vaccine shipment to begin tracking your inventory.",
          icon: "Package",
          actionLabel: "Receive Vaccines"
        };
      case 'administration':
        return {
          title: "No doses administered",
          description: "Record administered doses to track vaccine usage and maintain accurate records.",
          icon: "Syringe",
          actionLabel: "Record Dose"
        };
      case 'reports':
        return {
          title: "No reports available",
          description: "Generate reports to analyze your vaccine inventory and administration patterns.",
          icon: "FileText",
          actionLabel: "Generate Report"
        };
      case 'search':
        return {
          title: "No results found",
          description: "Try adjusting your search criteria or filters to find what you're looking for.",
          icon: "Search",
          actionLabel: "Clear Filters"
        };
      default:
        return { title, description, icon, actionLabel };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center p-12"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name={content.icon} className="w-10 h-10 text-primary" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {content.title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {content.description}
        </p>
        
        {action && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {content.actionLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;