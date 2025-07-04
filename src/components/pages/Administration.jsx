import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { administrationService } from '@/services/api/administrationService';
import { inventoryService } from '@/services/api/inventoryService';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';

const Administration = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    inventoryId: '',
    ageGroup: '',
    dosesAdministered: '',
    administeredDate: new Date().toISOString().split('T')[0],
    administeredBy: 'Current User'
  });

  const ageGroups = [
    { value: 'infants', label: 'Infants (0-12 months)' },
    { value: 'toddlers', label: 'Toddlers (1-3 years)' },
    { value: 'children', label: 'Children (4-11 years)' },
    { value: 'adolescents', label: 'Adolescents (12-17 years)' },
    { value: 'adults', label: 'Adults (18-64 years)' },
    { value: 'seniors', label: 'Seniors (65+ years)' }
  ];

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      // Filter out expired vaccines and those with no remaining quantity
      const availableVaccines = data.filter(item => 
        item.remainingQuantity > 0 && 
        new Date(item.expirationDate) > new Date()
      );
      setInventory(availableVaccines);
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
    
    if (!formData.inventoryId || !formData.ageGroup || !formData.dosesAdministered) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedVaccine = inventory.find(v => v.Id === formData.inventoryId);
    const dosesToAdminister = parseInt(formData.dosesAdministered);
    
    if (dosesToAdminister > selectedVaccine.remainingQuantity) {
      toast.error('Cannot administer more doses than available');
      return;
    }

    try {
      setLoading(true);
      
      // Create administration record
      const administrationData = {
        ...formData,
        dosesAdministered: dosesToAdminister
      };
      
      await administrationService.create(administrationData);
      
      // Update inventory
      const updatedInventory = {
        ...selectedVaccine,
        remainingQuantity: selectedVaccine.remainingQuantity - dosesToAdminister
      };
      
      await inventoryService.update(selectedVaccine.Id, updatedInventory);
      
      toast.success(`Successfully administered ${dosesToAdminister} doses of ${selectedVaccine.commercialName}`);
      
      // Reset form and reload inventory
      setFormData({
        inventoryId: '',
        ageGroup: '',
        dosesAdministered: '',
        administeredDate: new Date().toISOString().split('T')[0],
        administeredBy: 'Current User'
      });
      
      await loadInventory();
      
    } catch (err) {
      console.error('Error administering doses:', err);
      toast.error('Failed to record administration');
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Record Administration</h1>
        <p className="text-gray-600">Document administered vaccine doses by age group</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Administration Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vaccine Selection */}
              <Select
                label="Vaccine"
                value={formData.inventoryId}
                onChange={(e) => handleInputChange('inventoryId', e.target.value)}
                options={inventoryOptions}
                placeholder="Select vaccine to administer"
                required
              />

              {/* Selected Vaccine Info */}
              {selectedVaccine && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Vaccine</h3>
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
                      <p className="text-blue-700">Available Doses:</p>
                      <p className="font-medium text-green-600">{selectedVaccine.remainingQuantity}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Administration Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Age Group"
                  value={formData.ageGroup}
                  onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                  options={ageGroups}
                  placeholder="Select age group"
                  required
                />
                
                <Input
                  label="Doses Administered"
                  type="number"
                  value={formData.dosesAdministered}
                  onChange={(e) => handleInputChange('dosesAdministered', e.target.value)}
                  placeholder="0"
                  min="1"
                  max={selectedVaccine?.remainingQuantity || 0}
                  required
                />
              </div>

              <Input
                label="Administration Date"
                type="date"
                value={formData.administeredDate}
                onChange={(e) => handleInputChange('administeredDate', e.target.value)}
                required
              />

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
                  variant="primary"
                  loading={loading}
                  icon="Syringe"
                  disabled={!selectedVaccine || loading}
                >
                  Record Administration
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Available Vaccines Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Package" className="w-5 h-5 mr-2" />
              Available Vaccines
            </h3>
            
            <div className="space-y-3">
              {inventory.length === 0 ? (
                <p className="text-gray-500 text-sm">No vaccines available for administration</p>
              ) : (
                inventory.map(vaccine => (
                  <div
                    key={vaccine.Id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">
                      {vaccine.commercialName}
                    </div>
                    <div className="text-xs text-gray-600">
                      Lot: {vaccine.lotNumber}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {vaccine.remainingQuantity} doses available
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Administration;