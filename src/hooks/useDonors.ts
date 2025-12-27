import { useState, useCallback } from 'react';
import { Donor } from '@/types/donor';

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export function useDonors() {
  const [donors, setDonors] = useState<Donor[]>([
    {
      id: generateId(),
      name: 'John Smith',
      age: 28,
      bloodGroup: 'O+',
      phone: '555-0101',
      createdAt: new Date(),
    },
    {
      id: generateId(),
      name: 'Sarah Johnson',
      age: 34,
      bloodGroup: 'A-',
      phone: '555-0102',
      createdAt: new Date(),
    },
    {
      id: generateId(),
      name: 'Michael Chen',
      age: 45,
      bloodGroup: 'B+',
      phone: '555-0103',
      createdAt: new Date(),
    },
  ]);

  const addDonor = useCallback((donor: Omit<Donor, 'id' | 'createdAt'>) => {
    const newDonor: Donor = {
      ...donor,
      id: generateId(),
      createdAt: new Date(),
    };
    setDonors((prev) => [...prev, newDonor]);
    return newDonor;
  }, []);

  const updateDonor = useCallback((id: string, updates: Partial<Omit<Donor, 'id' | 'createdAt'>>) => {
    setDonors((prev) =>
      prev.map((donor) =>
        donor.id === id ? { ...donor, ...updates } : donor
      )
    );
  }, []);

  const deleteDonor = useCallback((id: string) => {
    setDonors((prev) => prev.filter((donor) => donor.id !== id));
  }, []);

  const searchByBloodGroup = useCallback((bloodGroup: string) => {
    if (!bloodGroup || bloodGroup === 'all') return donors;
    return donors.filter((donor) => donor.bloodGroup === bloodGroup);
  }, [donors]);

  return {
    donors,
    addDonor,
    updateDonor,
    deleteDonor,
    searchByBloodGroup,
  };
}
