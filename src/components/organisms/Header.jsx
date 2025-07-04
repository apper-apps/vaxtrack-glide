import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ title, onMenuClick, showMenu = false }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
<div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Shield" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  VaxTrack Pro
                </h1>
              </div>
            </div>
            {showMenu && (
              <Button
                variant="ghost"
                size="sm"
                icon="Menu"
                onClick={onMenuClick}
                className="lg:hidden"
              />
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              className="relative"
            >
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;