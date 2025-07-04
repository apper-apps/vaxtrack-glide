import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { generateAlerts } from "@/utils/alertUtils";
import InventoryGrid from "@/components/organisms/InventoryGrid";
import AlertBanner from "@/components/organisms/AlertBanner";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import FilterPanel from "@/components/organisms/FilterPanel";
import { inventoryService } from "@/services/api/inventoryService";
const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

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

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAdminister = (vaccine) => {
    toast.info(`Administering ${vaccine.commercialName}...`);
    // Navigate to administration page with pre-selected vaccine
  };
const handleAdjust = (vaccine) => {
    toast.info(`Adjusting inventory for ${vaccine.commercialName}...`);
    // Navigate to adjustment page with pre-selected vaccine
  };

  const filteredInventory = inventory.filter(item => {
    // Search term filter
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        item.commercialName.toLowerCase().includes(searchLower) ||
        item.genericName.toLowerCase().includes(searchLower) ||
        item.lotNumber.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // Vaccine family filter
    if (filters.vaccineFamily && item.genericName !== filters.vaccineFamily) {
      return false;
    }

    // Lot number filter
    if (filters.lotNumber && !item.lotNumber.toLowerCase().includes(filters.lotNumber.toLowerCase())) {
      return false;
    }

    // Expiration status filter
    if (filters.expirationStatus) {
      const today = new Date();
      const expirationDate = new Date(item.expirationDate);
      const daysUntilExpiry = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
      
      switch (filters.expirationStatus) {
        case 'expired':
          if (daysUntilExpiry >= 0) return false;
          break;
        case 'expires_30':
          if (daysUntilExpiry > 30 || daysUntilExpiry < 0) return false;
          break;
        case 'expires_90':
          if (daysUntilExpiry > 90 || daysUntilExpiry < 0) return false;
          break;
        case 'expires_180':
          if (daysUntilExpiry > 180 || daysUntilExpiry < 0) return false;
          break;
        case 'expires_365':
          if (daysUntilExpiry > 365 || daysUntilExpiry < 0) return false;
          break;
      }
    }

    // Quantity range filter
    if (filters.quantityRange) {
      const qty = item.remainingQuantity;
      switch (filters.quantityRange) {
        case 'empty':
          if (qty > 0) return false;
          break;
        case 'low':
          if (qty < 1 || qty > 5) return false;
          break;
        case 'medium':
          if (qty < 6 || qty > 15) return false;
          break;
        case 'high':
          if (qty < 16) return false;
          break;
      }
    }

    return true;
  });

  // Apply sorting
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (!filters.sortBy) return 0;
    
    const [field, direction] = filters.sortBy.split('_');
    const aValue = a[field];
    const bValue = b[field];
    
    let comparison = 0;
    if (field === 'expirationDate') {
      comparison = new Date(aValue) - new Date(bValue);
    } else if (field === 'remainingQuantity') {
      comparison = aValue - bValue;
    } else {
      comparison = aValue.toString().localeCompare(bValue.toString());
    }
    
    return direction === 'desc' ? -comparison : comparison;
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
        searchTerm={searchTerm}
        hasActiveFilters={Object.values(filters).some(v => v && v !== '')}
        onToggleFilters={handleToggleFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        isVisible={showFilters}
        onToggleVisibility={handleToggleFilters}
      />

      {/* Inventory Grid */}
      <InventoryGrid
        vaccines={sortedInventory}
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