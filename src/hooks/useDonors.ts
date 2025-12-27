import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Donor, BloodGroup } from '@/types/donor';
import { toast } from 'sonner';

export function useDonors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonors((data || []) as Donor[]);
    } catch (error: any) {
      console.error('Error fetching donors:', error);
      toast.error('Failed to load donors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  const addDonor = useCallback(async (donor: Omit<Donor, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('donors')
        .insert([donor])
        .select()
        .single();

      if (error) throw error;
      
      setDonors((prev) => [data as Donor, ...prev]);
      toast.success('Donor added successfully');
      return data as Donor;
    } catch (error: any) {
      console.error('Error adding donor:', error);
      toast.error('Failed to add donor');
      throw error;
    }
  }, []);

  const updateDonor = useCallback(async (id: string, updates: Partial<Omit<Donor, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('donors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setDonors((prev) =>
        prev.map((donor) => (donor.id === id ? (data as Donor) : donor))
      );
      toast.success('Donor updated successfully');
    } catch (error: any) {
      console.error('Error updating donor:', error);
      toast.error('Failed to update donor');
      throw error;
    }
  }, []);

  const deleteDonor = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDonors((prev) => prev.filter((donor) => donor.id !== id));
      toast.success('Donor deleted successfully');
    } catch (error: any) {
      console.error('Error deleting donor:', error);
      toast.error('Failed to delete donor');
      throw error;
    }
  }, []);

  const searchByBloodGroup = useCallback((bloodGroup: string) => {
    if (!bloodGroup || bloodGroup === 'all') return donors;
    return donors.filter((donor) => donor.blood_group === bloodGroup);
  }, [donors]);

  return {
    donors,
    loading,
    addDonor,
    updateDonor,
    deleteDonor,
    searchByBloodGroup,
    refetch: fetchDonors,
  };
}
