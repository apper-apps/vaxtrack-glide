import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { receiptService } from '@/services/api/receiptService';
import { inventoryService } from '@/services/api/inventoryService';
import { vaccineService } from '@/services/api/vaccineService';
import ApperIcon from '@/components/ApperIcon';

const Receiving = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vaccineId: '',
    lotNumber: '',
    quantitySent: '',
    quantityReceived: '',
    passedInspection: '',
    failedInspection: '',
    discrepancyReason: '',
    expirationDate: '',
    receivedDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Current User'
  });

  const discrepancyReasons = [
    { value: 'damaged_packaging', label: 'Damaged Packaging' },
    { value: 'broken_vials', label: 'Broken Vials' },
    { value: 'temperature_excursion', label: 'Temperature Excursion' },
    { value: 'expired_on_arrival', label: 'Expired on Arrival' },
    { value: 'quantity_mismatch', label: 'Quantity Mismatch' },
    { value: 'labeling_error', label: 'Labeling Error' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = async () => {
    try {
      const data = await vaccineService.getAll();
      setVaccines(data);
    } catch (err) {
      console.error('Error loading vaccines:', err);
      toast.error('Failed to load vaccine list');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate passed/failed inspection
    if (field === 'quantityReceived' || field === 'failedInspection') {
      const received = field === 'quantityReceived' ? parseInt(value) || 0 : parseInt(formData.quantityReceived) || 0;
      const failed = field === 'failedInspection' ? parseInt(value) || 0 : parseInt(formData.failedInspection) || 0;
      const passed = Math.max(0, received - failed);
      
      setFormData(prev => ({
        ...prev,
        passedInspection: passed.toString()
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.vaccineId || !formData.lotNumber || !formData.quantityReceived) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create receipt record
      const receiptData = {
        ...formData,
        quantitySent: parseInt(formData.quantitySent) || 0,
        quantityReceived: parseInt(formData.quantityReceived) || 0,
        passedInspection: parseInt(formData.passedInspection) || 0,
        failedInspection: parseInt(formData.failedInspection) || 0
      };
      
      await receiptService.create(receiptData);
      
      // Create inventory record
      const selectedVaccine = vaccines.find(v => v.Id === formData.vaccineId);
      const inventoryData = {
        vaccineId: formData.vaccineId,
        commercialName: selectedVaccine.commercialName,
        genericName: selectedVaccine.genericName,
        lotNumber: formData.lotNumber,
        quantity: parseInt(formData.quantityReceived),
        remainingQuantity: parseInt(formData.passedInspection),
        expirationDate: formData.expirationDate,
        receivedDate: formData.receivedDate,
        status: 'active'
      };
      
      await inventoryService.create(inventoryData);
      
      toast.success('Vaccine shipment received successfully!');
      
      // Reset form
      setFormData({
        vaccineId: '',
        lotNumber: '',
        quantitySent: '',
        quantityReceived: '',
        passedInspection: '',
        failedInspection: '',
        discrepancyReason: '',
        expirationDate: '',
        receivedDate: new Date().toISOString().split('T')[0],
        receivedBy: 'Current User'
      });
      
    } catch (err) {
      console.error('Error receiving shipment:', err);
      toast.error('Failed to process shipment');
    } finally {
      setLoading(false);
    }
  };

  const vaccineOptions = vaccines.map(vaccine => ({
    value: vaccine.Id,
    label: `${vaccine.commercialName} (${vaccine.genericName})`
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Receive Vaccines</h1>
        <p className="text-gray-600">Record new vaccine shipments and inspection results</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vaccine Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Vaccine"
              value={formData.vaccineId}
              onChange={(e) => handleInputChange('vaccineId', e.target.value)}
              options={vaccineOptions}
              placeholder="Select vaccine"
              required
            />
            
            <Input
              label="Lot Number"
              value={formData.lotNumber}
              onChange={(e) => handleInputChange('lotNumber', e.target.value)}
              placeholder="Enter lot number"
              required
            />
          </div>

          {/* Quantity Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Quantity Sent"
              type="number"
              value={formData.quantitySent}
              onChange={(e) => handleInputChange('quantitySent', e.target.value)}
              placeholder="0"
              min="0"
            />
            
            <Input
              label="Quantity Received"
              type="number"
              value={formData.quantityReceived}
              onChange={(e) => handleInputChange('quantityReceived', e.target.value)}
              placeholder="0"
              min="0"
              required
            />
          </div>

          {/* Inspection Results */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="CheckCircle" className="w-5 h-5 mr-2 text-green-600" />
              Inspection Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Doses Failed Inspection"
                type="number"
                value={formData.failedInspection}
                onChange={(e) => handleInputChange('failedInspection', e.target.value)}
                placeholder="0"
                min="0"
              />
              
              <Input
                label="Doses Passed Inspection"
                type="number"
                value={formData.passedInspection}
                onChange={(e) => handleInputChange('passedInspection', e.target.value)}
                placeholder="0"
                min="0"
                disabled
              />
            </div>
            
            {parseInt(formData.failedInspection) > 0 && (
              <div className="mt-4">
                <Select
                  label="Discrepancy Reason"
                  value={formData.discrepancyReason}
                  onChange={(e) => handleInputChange('discrepancyReason', e.target.value)}
                  options={discrepancyReasons}
                  placeholder="Select reason for failed inspection"
                />
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Expiration Date"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => handleInputChange('expirationDate', e.target.value)}
              required
            />
            
            <Input
              label="Received Date"
              type="date"
              value={formData.receivedDate}
              onChange={(e) => handleInputChange('receivedDate', e.target.value)}
              required
            />
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
              variant="primary"
              loading={loading}
              icon="Package"
            >
              Receive Shipment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Receiving;