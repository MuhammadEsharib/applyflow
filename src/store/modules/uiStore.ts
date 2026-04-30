import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  searchQuery: string;
  selectedCompany: string | null;
  selectedStatus: string | null;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCompany: (company: string | null) => void;
  setSelectedStatus: (status: string | null) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIState>((set) => {
  return {
    sidebarOpen: true,
    searchQuery: '',
    selectedCompany: null,
    selectedStatus: null,

    toggleSidebar: () => {
      set((state) => ({ sidebarOpen: !state.sidebarOpen }));
    },

    setSearchQuery: (query) => {
      set({ searchQuery: query });
    },

    setSelectedCompany: (company) => {
      set({ selectedCompany: company });
    },

    setSelectedStatus: (status) => {
      set({ selectedStatus: status });
    },

    clearFilters: () => {
      set({
        searchQuery: '',
        selectedCompany: null,
        selectedStatus: null,
      });
    },
  };
});