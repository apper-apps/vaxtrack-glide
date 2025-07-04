import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const [settings, setSettings] = useState({
    facilityName: 'Healthcare Facility',
    contactEmail: 'admin@facility.com',
    lowStockThreshold: '10',
    expirationAlertDays: '30',
    temperatureMonitoring: 'enabled',
    autoBackup: 'daily',
    timezone: 'America/New_York'
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    toast.info('Data export initiated. You will receive an email when complete.');
  };

  const handleImportData = () => {
    toast.info('Data import feature coming soon!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure system preferences and facility information</p>
      </div>

      <div className="space-y-6">
        {/* Facility Information */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Building" className="w-5 h-5 mr-2" />
            Facility Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Facility Name"
              value={settings.facilityName}
              onChange={(e) => handleInputChange('facilityName', e.target.value)}
              placeholder="Enter facility name"
            />
            
            <Input
              label="Contact Email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="Enter contact email"
            />
          </div>
        </Card>

        {/* Alert Settings */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Bell" className="w-5 h-5 mr-2" />
            Alert Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Low Stock Threshold"
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
              placeholder="10"
              min="1"
            />
            
            <Input
              label="Expiration Alert (Days)"
              type="number"
              value={settings.expirationAlertDays}
              onChange={(e) => handleInputChange('expirationAlertDays', e.target.value)}
              placeholder="30"
              min="1"
            />
          </div>
        </Card>

        {/* System Settings */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Settings" className="w-5 h-5 mr-2" />
            System Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Temperature Monitoring"
              value={settings.temperatureMonitoring}
              onChange={(e) => handleInputChange('temperatureMonitoring', e.target.value)}
              options={[
                { value: 'enabled', label: 'Enabled' },
                { value: 'disabled', label: 'Disabled' }
              ]}
            />
            
            <Select
              label="Auto Backup"
              value={settings.autoBackup}
              onChange={(e) => handleInputChange('autoBackup', e.target.value)}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'disabled', label: 'Disabled' }
              ]}
            />
          </div>
        </Card>

        {/* Data Management */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Database" className="w-5 h-5 mr-2" />
            Data Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              icon="Download"
              onClick={handleExportData}
              className="justify-center"
            >
              Export Data
            </Button>
            
            <Button
              variant="secondary"
              icon="Upload"
              onClick={handleImportData}
              className="justify-center"
            >
              Import Data
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Data Backup Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Ensure regular backups of your vaccine inventory data to prevent loss.
                  Contact your system administrator for advanced backup options.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* User Preferences */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="User" className="w-5 h-5 mr-2" />
            User Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Timezone"
              value={settings.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              options={[
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Chicago', label: 'Central Time' },
                { value: 'America/Denver', label: 'Mountain Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' }
              ]}
            />
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            icon="Save"
            onClick={handleSave}
            loading={loading}
            size="lg"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;