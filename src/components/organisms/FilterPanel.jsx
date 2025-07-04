import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  isVisible,
  onToggleVisibility,
  className = '' 
}) => {
  // Vaccine family categories based on generic names in inventory
  const vaccineFamilies = [
    { value: 'DTaP', label: 'DTaP (Diphtheria, Tetanus, Pertussis)' },
    { value: 'DTaP-IPV', label: 'DTaP-IPV (Diphtheria, Tetanus, Pertussis, Polio)' },
    { value: 'DTaP-IPV-Hib', label: 'DTaP-IPV-Hib (5-in-1 Combo)' },
    { value: 'DTaP-IPV-Hib-Hep B', label: 'DTaP-IPV-Hib-Hep B (6-in-1 Combo)' },
    { value: 'IPV', label: 'IPV (Polio)' },
    { value: 'Hep B', label: 'Hepatitis B' },
    { value: 'Hep A', label: 'Hepatitis A' },
    { value: 'RSV', label: 'RSV (Respiratory Syncytial Virus)' },
    { value: 'MMR', label: 'MMR (Measles, Mumps, Rubella)' },
    { value: 'MMRV', label: 'MMRV (Measles, Mumps, Rubella, Varicella)' },
    { value: 'Hib', label: 'Hib (Haemophilus influenzae type b)' },
    { value: 'Tdap', label: 'Tdap (Tetanus, Diphtheria, Pertussis)' },
    { value: 'Varicella', label: 'Varicella (Chickenpox)' },
    { value: 'MCV4', label: 'MCV4 (Meningococcal)' },
    { value: 'MenB', label: 'MenB (Meningococcal B)' },
    { value: 'HPV', label: 'HPV (Human Papillomavirus)' },
    { value: 'RV (Rotavirus)', label: 'RV (Rotavirus)' },
    { value: 'PCV15', label: 'PCV15 (Pneumococcal)' }
  ];

  const expirationOptions = [
    { value: 'expired', label: 'Expired' },
    { value: 'expires_30', label: 'Expires within 30 days' },
    { value: 'expires_90', label: 'Expires within 90 days' },
    { value: 'expires_180', label: 'Expires within 6 months' },
    { value: 'expires_365', label: 'Expires within 1 year' }
  ];

  const quantityOptions = [
    { value: 'low', label: 'Low stock (1-5 doses)' },
    { value: 'medium', label: 'Medium stock (6-15 doses)' },
    { value: 'high', label: 'High stock (16+ doses)' },
    { value: 'empty', label: 'Out of stock (0 doses)' }
  ];

  const sortOptions = [
    { value: 'commercialName_asc', label: 'Vaccine Name (A-Z)' },
    { value: 'commercialName_desc', label: 'Vaccine Name (Z-A)' },
    { value: 'genericName_asc', label: 'Family (A-Z)' },
    { value: 'genericName_desc', label: 'Family (Z-A)' },
    { value: 'expirationDate_asc', label: 'Expiration Date (Earliest)' },
    { value: 'expirationDate_desc', label: 'Expiration Date (Latest)' },
    { value: 'lotNumber_asc', label: 'Lot Number (A-Z)' },
    { value: 'lotNumber_desc', label: 'Lot Number (Z-A)' },
    { value: 'remainingQuantity_asc', label: 'Quantity (Low to High)' },
    { value: 'remainingQuantity_desc', label: 'Quantity (High to Low)' }
  ];

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== '').length;

  return (
    <div className={`${className}`}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="secondary"
          icon={isVisible ? "ChevronUp" : "ChevronDown"}
          onClick={onToggleVisibility}
          className="flex items-center gap-2"
        >
          Filters & Sort
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            icon="X"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Vaccine Family Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ApperIcon name="Stethoscope" size={16} className="inline mr-2" />
                    Vaccine Family
                  </label>
                  <Select
                    value={filters.vaccineFamily || ''}
                    onChange={(e) => onFilterChange('vaccineFamily', e.target.value)}
                    className="w-full"
                  >
                    <option value="">All Families</option>
                    {vaccineFamilies.map(family => (
                      <option key={family.value} value={family.value}>
                        {family.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Expiration Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ApperIcon name="Calendar" size={16} className="inline mr-2" />
                    Expiration Status
                  </label>
                  <Select
                    value={filters.expirationStatus || ''}
                    onChange={(e) => onFilterChange('expirationStatus', e.target.value)}
                    className="w-full"
                  >
                    <option value="">All Statuses</option>
                    {expirationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Quantity Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ApperIcon name="Package" size={16} className="inline mr-2" />
                    Stock Level
                  </label>
                  <Select
                    value={filters.quantityRange || ''}
                    onChange={(e) => onFilterChange('quantityRange', e.target.value)}
                    className="w-full"
                  >
                    <option value="">All Levels</option>
                    {quantityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Lot Number Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ApperIcon name="Hash" size={16} className="inline mr-2" />
                    Lot Number
                  </label>
                  <input
                    type="text"
                    value={filters.lotNumber || ''}
                    onChange={(e) => onFilterChange('lotNumber', e.target.value)}
                    placeholder="Enter lot number..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ApperIcon name="ArrowUpDown" size={16} className="inline mr-2" />
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy || ''}
                    onChange={(e) => onFilterChange('sortBy', e.target.value)}
                    className="w-full"
                  >
                    <option value="">Default Order</option>
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {filters.vaccineFamily && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        Family: {vaccineFamilies.find(f => f.value === filters.vaccineFamily)?.label}
                        <button
                          onClick={() => onFilterChange('vaccineFamily', '')}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <ApperIcon name="X" size={12} />
                        </button>
                      </span>
                    )}
                    {filters.expirationStatus && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        Expiration: {expirationOptions.find(o => o.value === filters.expirationStatus)?.label}
                        <button
                          onClick={() => onFilterChange('expirationStatus', '')}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <ApperIcon name="X" size={12} />
                        </button>
                      </span>
                    )}
                    {filters.quantityRange && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        Stock: {quantityOptions.find(o => o.value === filters.quantityRange)?.label}
                        <button
                          onClick={() => onFilterChange('quantityRange', '')}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <ApperIcon name="X" size={12} />
                        </button>
                      </span>
                    )}
                    {filters.lotNumber && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        Lot: {filters.lotNumber}
                        <button
                          onClick={() => onFilterChange('lotNumber', '')}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <ApperIcon name="X" size={12} />
                        </button>
                      </span>
                    )}
                    {filters.sortBy && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        Sort: {sortOptions.find(s => s.value === filters.sortBy)?.label}
                        <button
                          onClick={() => onFilterChange('sortBy', '')}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <ApperIcon name="X" size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;