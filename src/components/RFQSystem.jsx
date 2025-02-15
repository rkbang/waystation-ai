import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import components
import SuppliersTab from './suppliers/SuppliersTab';
import RFQsTab from './rfqs/RFQsTab';
import EmailProcessingTab from './email_parser/EmailProcessingTab';
import ViewQuotesTab from './quotes/ViewQuotesTab';

// Import services
import { fetchSuppliers, addSupplier, updateSupplier } from './suppliers/suppliersService';
import { fetchRFQs, addRFQ, updateRFQ } from './rfqs/rfqsService';

const RFQSystem = () => {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [suppliers, setSuppliers] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Supplier states
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  
  // RFQ states
  const [showAddRFQ, setShowAddRFQ] = useState(false);
  const [editingRFQ, setEditingRFQ] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [suppliersData, rfqsData] = await Promise.all([
          fetchSuppliers(),
          fetchRFQs()
        ]);
        setSuppliers(suppliersData);
        setRfqs(rfqsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Supplier handlers
  const handleAddSupplier = async (supplierData) => {
    try {
      await addSupplier(supplierData);
      const updatedSuppliers = await fetchSuppliers();
      setSuppliers(updatedSuppliers);
      setShowAddSupplier(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
      setError('Failed to add supplier');
    }
  };

  const handleEditSupplier = async (supplierData) => {
    try {
      await updateSupplier(supplierData);
      const updatedSuppliers = await fetchSuppliers();
      setSuppliers(updatedSuppliers);
      setEditingSupplier(null);
    } catch (error) {
      console.error('Error updating supplier:', error);
      setError('Failed to update supplier');
    }
  };

  // RFQ handlers
  const handleAddRFQ = async (rfqData) => {
    try {
      await addRFQ(rfqData);
      const updatedRFQs = await fetchRFQs();
      setRfqs(updatedRFQs);
      setShowAddRFQ(false);
    } catch (error) {
      console.error('Error adding RFQ:', error);
      setError('Failed to add RFQ');
    }
  };

  const handleEditRFQ = async (rfqData) => {
    try {
      await updateRFQ(rfqData);
      const updatedRFQs = await fetchRFQs();
      setRfqs(updatedRFQs);
      setEditingRFQ(null);
    } catch (error) {
      console.error('Error updating RFQ:', error);
      setError('Failed to update RFQ');
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [suppliersData, rfqsData] = await Promise.all([
        fetchSuppliers(),
        fetchRFQs()
      ]);
      setSuppliers(suppliersData);
      setRfqs(rfqsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    refreshData(); // Refresh data when tab changes
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>RFQ Management System</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-500 rounded">
              {error}
            </div>
          )}
          <Tabs defaultValue="suppliers" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="rfqs">RFQs</TabsTrigger>
              <TabsTrigger value="email">Process Email</TabsTrigger>
              <TabsTrigger value="quotes">View Quotes</TabsTrigger>
            </TabsList>
            <TabsContent value="suppliers">
              <SuppliersTab 
                suppliers={suppliers}
                loading={loading}
                showAddSupplier={showAddSupplier}
                editingSupplier={editingSupplier}
                onAddClick={() => setShowAddSupplier(true)}
                onEditClick={setEditingSupplier}
                onAddSubmit={handleAddSupplier}
                onEditSubmit={handleEditSupplier}
                onCancel={() => {
                  setShowAddSupplier(false);
                  setEditingSupplier(null);
                }}
              />
            </TabsContent>
            <TabsContent value="rfqs">
              <RFQsTab 
                rfqs={rfqs}
                loading={loading}
                showAddRFQ={showAddRFQ}
                editingRFQ={editingRFQ}
                onAddClick={() => setShowAddRFQ(true)}
                onEditClick={setEditingRFQ}
                onAddSubmit={handleAddRFQ}
                onEditSubmit={handleEditRFQ}
                onCancel={() => {
                  setShowAddRFQ(false);
                  setEditingRFQ(null);
                }}
              />
            </TabsContent>
            <TabsContent value="email">
              <EmailProcessingTab 
                rfqs={rfqs}
              />
            </TabsContent>
            <TabsContent value="quotes">
              <ViewQuotesTab 
                rfqs={rfqs}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RFQSystem;
