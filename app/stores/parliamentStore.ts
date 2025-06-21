import { create } from 'zustand';
import { ParliamentMember } from '../hooks/useParliamentData';

interface ParliamentStore {
  // Raw data
  allMembers: ParliamentMember[];
  
  // Filter state
  searchTerm: string;
  debouncedSearchTerm: string;
  selectedParty: string;
  
  // Computed data
  filteredMembers: ParliamentMember[];
  partyStats: { [key: string]: number };
  
  // Actions
  setAllMembers: (members: ParliamentMember[]) => void;
  setSearchTerm: (term: string) => void;
  setDebouncedSearchTerm: (term: string) => void;
  setSelectedParty: (party: string) => void;
  clearAllFilters: () => void;
  
  // Computed getters
  getFilteredMembers: () => ParliamentMember[];
  getPartyStats: () => { [key: string]: number };
}

// Debounce utility
let searchDebounceTimer: NodeJS.Timeout;

export const useParliamentStore = create<ParliamentStore>((set, get) => ({
  // Initial state
  allMembers: [],
  searchTerm: '',
  debouncedSearchTerm: '',
  selectedParty: 'all',
  filteredMembers: [],
  partyStats: {},
  
  // Actions
  setAllMembers: (members) => {
    set({ allMembers: members });
    // Recalculate filtered data when raw data changes
    get().getFilteredMembers();
    get().getPartyStats();
  },
  
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    
    // Debounce the search term
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      set({ debouncedSearchTerm: term });
      // Recalculate filtered data after debounce
      get().getFilteredMembers();
    }, 300); // 300ms debounce
  },
  
  setDebouncedSearchTerm: (term) => {
    set({ debouncedSearchTerm: term });
  },
  
  setSelectedParty: (party) => {
    set({ selectedParty: party });
    // Recalculate filtered data immediately for party filter
    get().getFilteredMembers();
  },
  
  clearAllFilters: () => {
    clearTimeout(searchDebounceTimer);
    set({ 
      searchTerm: '', 
      debouncedSearchTerm: '', 
      selectedParty: 'all' 
    });
    // Recalculate filtered data
    get().getFilteredMembers();
  },
  
  // Computed getters
  getFilteredMembers: () => {
    const { allMembers, debouncedSearchTerm, selectedParty } = get();
    
    const filtered = allMembers.filter((member) => {
      // Search filter
      if (debouncedSearchTerm) {
        const searchableText = `${member.full_name} ${member.electoral_district.name} ${member.state.name}`.toLowerCase();
        if (!searchableText.includes(debouncedSearchTerm.toLowerCase())) {
          return false;
        }
      }
      
      // Party filter
      if (selectedParty !== 'all') {
        if (member.party.short_name !== selectedParty) {
          return false;
        }
      }
      
      return true;
    });
    
    set({ filteredMembers: filtered });
    return filtered;
  },
  
  getPartyStats: () => {
    const { allMembers } = get();
    const stats: { [key: string]: number } = {};
    
    allMembers.forEach((member) => {
      const partyName = member.party.short_name;
      stats[partyName] = (stats[partyName] || 0) + 1;
    });
    
    set({ partyStats: stats });
    return stats;
  },
})); 