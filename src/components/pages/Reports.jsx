import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { inventoryService } from '@/services/api/inventoryService';
import { administrationService } from '@/services/api/administrationService';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';

const Reports = () => {
  const [inventory, setInventory] = useState([]);
  const [administrations, setAdministrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const reportTypes = [
    { value: 'inventory', label: 'Current Inventory Report' },
    { value: 'administration', label: 'Administration Report' },
    { value: 'expiration', label: 'Expiration Alert Report' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inventoryData, administrationData] = await Promise.all([
        inventoryService.getAll(),
        administrationService.getAll()
      ]);
      setInventory(inventoryData);
      setAdministrations(administrationData);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    switch (reportType) {
      case 'inventory':
        return generateInventoryReport();
      case 'administration':
        return generateAdministrationReport();
      case 'expiration':
        return generateExpirationReport();
      default:
        return [];
    }
  };

  const generateInventoryReport = () => {
    return inventory.map(item => ({
      vaccine: item.commercialName,
      genericName: item.genericName,
      lotNumber: item.lotNumber,
      expirationDate: format(new Date(item.expirationDate), 'MMM dd, yyyy'),
      quantityOnHand: item.remainingQuantity,
      status: getInventoryStatus(item)
    }));
  };

  const generateAdministrationReport = () => {
    let filtered = administrations;
    
    if (dateRange.startDate && dateRange.endDate) {
      filtered = administrations.filter(admin => {
        const adminDate = new Date(admin.administeredDate);
        return adminDate >= new Date(dateRange.startDate) && 
               adminDate <= new Date(dateRange.endDate);
      });
    }

    return filtered.map(admin => {
      const inventoryItem = inventory.find(item => item.Id === admin.inventoryId);
      return {
        vaccine: inventoryItem?.commercialName || 'Unknown',
        lotNumber: inventoryItem?.lotNumber || 'Unknown',
        ageGroup: admin.ageGroup,
        dosesAdministered: admin.dosesAdministered,
        administeredDate: format(new Date(admin.administeredDate), 'MMM dd, yyyy'),
        administeredBy: admin.administeredBy
      };
    });
  };

  const generateExpirationReport = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return inventory
      .filter(item => new Date(item.expirationDate) <= thirtyDaysFromNow)
      .map(item => ({
        vaccine: item.commercialName,
        genericName: item.genericName,
        lotNumber: item.lotNumber,
        expirationDate: format(new Date(item.expirationDate), 'MMM dd, yyyy'),
        quantityOnHand: item.remainingQuantity,
        daysUntilExpiry: Math.ceil((new Date(item.expirationDate) - today) / (1000 * 60 * 60 * 24)),
        status: getExpirationStatus(item)
      }))
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  };

  const getInventoryStatus = (item) => {
    const today = new Date();
    const expirationDate = new Date(item.expirationDate);
    const daysUntilExpiry = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 30) return 'Expiring Soon';
    if (item.remainingQuantity <= 10) return 'Low Stock';
    return 'Good';
  };

  const getExpirationStatus = (item) => {
    const today = new Date();
    const expirationDate = new Date(item.expirationDate);
    const daysUntilExpiry = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 7) return 'Critical';
    if (daysUntilExpiry <= 30) return 'Warning';
    return 'Good';
  };

  const exportToCSV = () => {
    const data = generateReport();
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully!');
  };

  const reportData = generateReport();

  if (loading) {
    return <Loading type="table" />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and export inventory reports</p>
        </div>
        <Button
          variant="primary"
          icon="Download"
          onClick={exportToCSV}
          disabled={reportData.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Report Controls */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={reportTypes}
          />
          
          {reportType === 'administration' && (
            <>
              <Input
                label="Start Date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <Input
                label="End Date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </>
          )}
        </div>
      </Card>

      {/* Report Data */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ApperIcon name="FileText" className="w-5 h-5 mr-2" />
            {reportTypes.find(type => type.value === reportType)?.label}
          </h2>
          <p className="text-sm text-gray-600">
            Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>

        {reportData.length === 0 ? (
          <Empty 
            type="reports"
            title="No data available"
            description="No data matches the selected criteria"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(reportData[0]).map(header => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    {Object.values(row).map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {typeof value === 'string' && 
                         ['Expired', 'Critical', 'Warning', 'Good', 'Low Stock', 'Expiring Soon'].includes(value) ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            value === 'Expired' || value === 'Critical' ? 'bg-red-100 text-red-800' :
                            value === 'Warning' || value === 'Expiring Soon' || value === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;