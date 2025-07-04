import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { lossService } from '@/services/api/lossService';
import { inventoryService } from '@/services/api/inventoryService';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';

const LossReporting = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    inventoryId: '',
    quantity: '',
    reason: '',
    details: '',
    reportedDate: new Date().toISOString().split('T')[0],
    reportedBy: 'Current User'
  });

  const lossReasons = [
    { value: 'expired', label: 'Expired' },
    { value: 'damaged', label: 'Damaged/Broken' },
    { value: 'temperature_excursion', label: 'Temperature Excursion' },
    { value: 'contamination', label: 'Contamination' },
    { value: 'spilled', label: 'Spilled' },
    { value: 'power_outage', label: 'Power Outage' },
    { value: 'equipment_failure', label: 'Equipment Failure' },
    { value: 'human_error', label: 'Human Error' },
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.inventoryId || !formData.quantity || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedVaccine = inventory.find(v => v.Id === formData.inventoryId);
    const lossQuantity = parseInt(formData.quantity);
    
    if (lossQuantity > selectedVaccine.remainingQuantity) {
      toast.error('Cannot report loss greater than available quantity');
      return;
    }

    try {
      setLoading(true);
      
      // Create loss record
      const lossData = {
        ...formData,
        quantity: lossQuantity
      };
      
      await lossService.create(lossData);
      
      // Update inventory
      const updatedInventory = {
        ...selectedVaccine,
        remainingQuantity: selectedVaccine.remainingQuantity - lossQuantity
      };
      
      await inventoryService.update(selectedVaccine.Id, updatedInventory);
      
      toast.success(`Loss reported successfully for ${selectedVaccine.commercialName}`);
      
      // Reset form and reload inventory
      setFormData({
        inventoryId: '',
        quantity: '',
        reason: '',
        details: '',
        reportedDate: new Date().toISOString().split('T')[0],
        reportedBy: 'Current User'
      });
      
      await loadInventory();
      
    } catch (err) {
      console.error('Error reporting loss:', err);
      toast.error('Failed to report loss');
    } finally {
      setLoading(false);
    }
  };

  const selectedVaccine = inventory.find(v => v.Id === formData.inventoryId);
  const inventoryOptions = inventory.map(item => ({
    value: item.Id,
    label: `${item.commercialName} (${item.lotNumber}) - ${item.remainingQuantity} doses`
  }));

  if (loading && inventory.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loss Reporting</h1>
        <p className="text-gray-600">Report vaccine losses due to expiration, damage, or other causes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loss Report Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vaccine Selection */}
              <Select
                label="Vaccine"
                value={formData.inventoryId}
                onChange={(e) => handleInputChange('inventoryId', e.target.value)}
                options={inventoryOptions}
                placeholder="Select vaccine with loss"
                required
              />

              {/* Selected Vaccine Info */}
              {selectedVaccine && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Selected Vaccine</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-red-700">Commercial Name:</p>
                      <p className="font-medium">{selectedVaccine.commercialName}</p>
                    </div>
                    <div>
                      <p className="text-red-700">Generic Name:</p>
                      <p className="font-medium">{selectedVaccine.genericName}</p>
                    </div>
                    <div>
                      <p className="text-red-700">Lot Number:</p>
                      <p className="font-medium">{selectedVaccine.lotNumber}</p>
                    </div>
                    <div>
                      <p className="text-red-700">Available Doses:</p>
                      <p className="font-medium">{selectedVaccine.remainingQuantity}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Loss Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Quantity Lost"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="0"
                  min="1"
                  max={selectedVaccine?.remainingQuantity || 0}
                  required
                />
                
                <Select
                  label="Reason for Loss"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  options={lossReasons}
                  placeholder="Select reason"
                  required
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Details
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  placeholder="Provide additional details about the loss..."
                />
              </div>

              <Input
                label="Report Date"
                type="date"
                value={formData.reportedDate}
                onChange={(e) => handleInputChange('reportedDate', e.target.value)}
                required
              />

              {/* Prevention Checklist */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <ApperIcon name="Shield" className="w-5 h-5 mr-2" />
                  Prevention Checklist
                </h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Temperature monitoring protocols reviewed</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Storage equipment maintenance checked</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Staff training on handling procedures updated</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Inventory rotation procedures reviewed</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  loading={loading}
                  icon="AlertTriangle"
                  disabled={!selectedVaccine || loading}
                >
                  Report Loss
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Loss Summary */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 mr-2" />
              Loss Prevention Tips
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Temperature Control</h4>
                <p className="text-blue-700">Monitor refrigeration units continuously and maintain backup power systems.</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">FIFO Rotation</h4>
                <p className="text-green-700">Use First-In-First-Out rotation to prevent expiration losses.</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900">Staff Training</h4>
                <p className="text-yellow-700">Regular training on proper handling and storage procedures.</p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Regular Audits</h4>
                <p className="text-purple-700">Conduct regular inventory audits and equipment checks.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LossReporting;