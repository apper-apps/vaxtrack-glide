import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import InventoryGrid from '@/components/organisms/InventoryGrid';
import AlertBanner from '@/components/organisms/AlertBanner';
import SearchBar from '@/components/molecules/SearchBar';
import { inventoryService } from '@/services/api/inventoryService';
import { generateAlerts } from '@/utils/alertUtils';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getAll();
      setInventory(data);
      setAlerts(generateAlerts(data));
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError('Failed to load inventory data');
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAdminister = (vaccine) => {
    toast.info(`Administering ${vaccine.commercialName}...`);
    // Navigate to administration page with pre-selected vaccine
  };

  const handleAdjust = (vaccine) => {
    toast.info(`Adjusting inventory for ${vaccine.commercialName}...`);
    // Navigate to reconciliation page with pre-selected vaccine
  };

  const filteredInventory = inventory.filter(item => {
    if (!searchTerm) return true;
    return (
      item.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate statistics
  const stats = {
    totalVaccines: inventory.length,
    totalDoses: inventory.reduce((sum, item) => sum + item.remainingQuantity, 0),
    expiringSoon: inventory.filter(item => {
      const daysUntilExpiry = Math.ceil((new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length,
    expired: inventory.filter(item => new Date(item.expirationDate) < new Date()).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Alert Banner */}
      {alerts.length > 0 && (
        <AlertBanner 
          alerts={alerts} 
          onDismiss={(alertId) => setAlerts(prev => prev.filter(alert => alert.id !== alertId))}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor vaccine inventory and expiration alerts</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vaccines"
          value={stats.totalVaccines}
          icon="Package"
          color="primary"
        />
        <StatCard
          title="Available Doses"
          value={stats.totalDoses}
          icon="Syringe"
          color="success"
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          subtitle="Within 30 days"
          icon="Clock"
          color="warning"
        />
        <StatCard
          title="Expired"
          value={stats.expired}
          icon="AlertTriangle"
          color="danger"
        />
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search by vaccine name, lot number..."
        className="max-w-md"
      />

      {/* Inventory Grid */}
      <InventoryGrid
        vaccines={filteredInventory}
        loading={loading}
        error={error}
        onRetry={loadInventory}
        onAdminister={handleAdminister}
        onAdjust={handleAdjust}
      />
    </div>
  );
};

export default Dashboard;