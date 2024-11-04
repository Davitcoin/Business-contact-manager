import { create } from 'zustand';
import { Business } from '../types/business';

interface BusinessStore {
  businesses: Business[];
  selectedBusiness: Business | null;
  searchTerm: string;
  categoryFilter: string;
  setBusinesses: (businesses: Business[]) => void;
  addBusiness: (business: Business) => void;
  updateBusiness: (id: string, business: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  setSelectedBusiness: (business: Business | null) => void;
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
}

export const useBusinessStore = create<BusinessStore>((set) => ({
  businesses: [],
  selectedBusiness: null,
  searchTerm: '',
  categoryFilter: '',
  setBusinesses: (businesses) => set({ businesses }),
  addBusiness: (business) =>
    set((state) => ({ businesses: [...state.businesses, business] })),
  updateBusiness: (id, updatedBusiness) =>
    set((state) => ({
      businesses: state.businesses.map((business) =>
        business.id === id ? { ...business, ...updatedBusiness } : business
      ),
    })),
  deleteBusiness: (id) =>
    set((state) => ({
      businesses: state.businesses.filter((business) => business.id !== id),
    })),
  setSelectedBusiness: (business) => set({ selectedBusiness: business }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
}));