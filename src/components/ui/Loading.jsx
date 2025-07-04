import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'inventory') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="shimmer h-4 bg-gray-200 rounded mb-3"></div>
            <div className="shimmer h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="shimmer h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="flex justify-between items-center mt-4">
              <div className="shimmer h-6 bg-gray-200 rounded w-16"></div>
              <div className="shimmer h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="shimmer h-6 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="space-y-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="shimmer h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="shimmer h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="shimmer h-4 bg-gray-200 rounded w-1/8"></div>
                <div className="shimmer h-4 bg-gray-200 rounded w-1/12"></div>
                <div className="shimmer h-4 bg-gray-200 rounded w-1/8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
        />
        <div className="shimmer h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
        <div className="shimmer h-3 bg-gray-200 rounded w-24 mx-auto"></div>
      </div>
    </div>
  );
};

export default Loading;