import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { inventoryService } from '@/services/api/inventoryService';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';

const Reconciliation = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [physicalCount, setPhysicalCount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const adjustmentReasons = [
    { value: 'physical_count_error', label: 'Physical Count Error' },
    { value: 'doses_expired', label: 'Doses Expired' },
    { value: 'doses_damaged', label: 'Doses Damaged' },
    { value: 'doses_wasted', label: 'Doses Wasted' },
    { value: 'system_error', label: 'System Error' },
    { value: 'temperature_excursion', label: 'Temperature Excursion' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (err) {
      console.error('Error loading inventory:', err);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleVaccineSelect = (vaccineId) => {
    const vaccine = inventory.find(v => v.Id === vaccineId);
    setSelectedVaccine(vaccine);
    setPhysicalCount('');
    setAdjustmentReason('');
  };

  const handleReconcile = async () => {
    if (!selectedVaccine || physicalCount === '') {
      toast.error('Please select a vaccine and enter physical count');
      return;
    }

    const physicalCountNum = parseInt(physicalCount);
    const systemCount = selectedVaccine.remainingQuantity;
    const difference = physicalCountNum - systemCount;

    if (difference === 0) {
      toast.success('No adjustment needed - counts match!');
      return;
    }

    if (Math.abs(difference) > 0 && !adjustmentReason) {
      toast.error('Please provide a reason for the adjustment');
      return;
    }

    try {
      setLoading(true);
      
      // Update inventory with new quantity
      const updatedInventory = {
        ...selectedVaccine,
        remainingQuantity: physicalCountNum
      };
      
      await inventoryService.update(selectedVaccine.Id, updatedInventory);
      
      toast.success(
        `Inventory adjusted successfully! ${difference > 0 ? 'Added' : 'Removed'} ${Math.abs(difference)} doses`
      );
      
      // Reset form and reload data
      setSelectedVaccine(null);
      setPhysicalCount('');
      setAdjustmentReason('');
      await loadInventory();
      
    } catch (err) {
      console.error('Error reconciling inventory:', err);
      toast.error('Failed to reconcile inventory');
    } finally {
      setLoading(false);
    }
  };

  const inventoryOptions = inventory.map(item => ({
    value: item.Id,
    label: `${item.commercialName} (${item.lotNumber}) - System: ${item.remainingQuantity} doses`
  }));

  if (loading && inventory.length === 0) {
    return <Loading />;
  }

  const difference = selectedVaccine && physicalCount !== '' 
    ? parseInt(physicalCount) - selectedVaccine.remainingQuantity 
    : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventory Reconciliation</h1>
        <p className="text-gray-600">Compare physical counts with system records and make adjustments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reconciliation Form */}
        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-6">
              <Select
                label="Select Vaccine to Reconcile"
                value={selectedVaccine?.Id || ''}
                onChange={(e) => handleVaccineSelect(e.target.value)}
                options={inventoryOptions}
                placeholder="Choose vaccine for reconciliation"
              />

              {selectedVaccine && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Vaccine Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3">Vaccine Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700">Commercial Name:</p>
                        <p className="font-medium">{selectedVaccine.commercialName}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">Generic Name:</p>
                        <p className="font-medium">{selectedVaccine.genericName}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">Lot Number:</p>
                        <p className="font-medium">{selectedVaccine.lotNumber}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">Expiration Date:</p>
                        <p className="font-medium">{new Date(selectedVaccine.expirationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Count Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">System Count</p>
                      <p className="text-3xl font-bold text-gray-900">{selectedVaccine.remainingQuantity}</p>
                      <p className="text-sm text-gray-600">doses in system</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Input
                        label="Physical Count"
                        type="number"
                        value={physicalCount}
                        onChange={(e) => setPhysicalCount(e.target.value)}
                        placeholder="Enter actual count"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Difference Display */}
                  {physicalCount !== '' && (
                    <div className={`p-4 rounded-lg ${
                      difference === 0 ? 'bg-green-50' : 'bg-yellow-50'
                    }`}>
                      <div className="flex items-center">
                        <ApperIcon 
                          name={difference === 0 ? 'CheckCircle' : 'AlertTriangle'} 
                          className={`w-5 h-5 mr-2 ${
                            difference === 0 ? 'text-green-600' : 'text-yellow-600'
                          }`} 
                        />
                        <div>
                          <p className={`font-medium ${
                            difference === 0 ? 'text-green-800' : 'text-yellow-800'
                          }`}>
                            {difference === 0 ? 'Counts Match!' : `Difference: ${difference} doses`}
                          </p>
                          <p className={`text-sm ${
                            difference === 0 ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {difference === 0 
                              ? 'No adjustment needed' 
                              : difference > 0 
                                ? 'Physical count is higher than system'
                                : 'Physical count is lower than system'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Adjustment Reason */}
                  {difference !== 0 && physicalCount !== '' && (
                    <Select
                      label="Reason for Adjustment"
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      options={adjustmentReasons}
                      placeholder="Select reason for discrepancy"
                      required
                    />
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedVaccine(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleReconcile}
                      loading={loading}
                      icon="Calculator"
                      disabled={physicalCount === '' || (difference !== 0 && !adjustmentReason)}
                    >
                      Reconcile Inventory
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="BarChart3" className="w-5 h-5 mr-2" />
              Inventory Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Vaccines</span>
                <span className="font-semibold">{inventory.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Doses</span>
                <span className="font-semibold">
                  {inventory.reduce((sum, item) => sum + item.remainingQuantity, 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expired</span>
                <span className="font-semibold text-red-600">
                  {inventory.filter(item => new Date(item.expirationDate) < new Date()).length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expiring Soon</span>
                <span className="font-semibold text-yellow-600">
                  {inventory.filter(item => {
                    const daysUntilExpiry = Math.ceil((new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                  }).length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reconciliation;