import React, { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useBusinessStore } from './store/businessStore';
import { BusinessCard } from './components/BusinessCard';
import { BusinessForm } from './components/BusinessForm';
import { SearchBar } from './components/SearchBar';
import { CsvImport } from './components/CsvImport';
import { Business, BusinessFormData } from './types/business';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  
  const {
    businesses,
    searchTerm,
    categoryFilter,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    setSearchTerm,
    setCategoryFilter,
  } = useBusinessStore();

  const handleSubmit = (data: BusinessFormData) => {
    if (editingBusiness) {
      updateBusiness(editingBusiness.id, {
        ...data,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      addBusiness({
        ...data,
        id: crypto.randomUUID(),
        lastUpdated: new Date().toISOString(),
      });
    }
    setIsFormOpen(false);
    setEditingBusiness(null);
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      deleteBusiness(id);
    }
  };

  const categories = Array.from(
    new Set(businesses.map((business) => business.category))
  );

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || business.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Business Contact Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <CsvImport />
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Business
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isFormOpen ? (
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingBusiness ? 'Edit Business' : 'Add New Business'}
            </h2>
            <BusinessForm
              business={editingBusiness || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingBusiness(null);
              }}
            />
          </div>
        ) : (
          <>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              categories={categories}
            />

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No businesses found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new business or importing from CSV.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;