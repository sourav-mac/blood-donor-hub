import { useState, useMemo } from 'react';
import { BloodDropIcon } from '@/components/BloodDropIcon';
import { DonorForm } from '@/components/DonorForm';
import { DonorTable } from '@/components/DonorTable';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDonors } from '@/hooks/useDonors';
import { BLOOD_GROUPS, Donor } from '@/types/donor';
import { toast } from 'sonner';
import { Users, Droplets, Heart, Search, RefreshCw } from 'lucide-react';

const Index = () => {
  const { donors, addDonor, updateDonor, deleteDonor } = useDonors();
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('all');

  const filteredDonors = useMemo(() => {
    if (filterBloodGroup === 'all') return donors;
    return donors.filter((d) => d.bloodGroup === filterBloodGroup);
  }, [donors, filterBloodGroup]);

  const bloodGroupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    BLOOD_GROUPS.forEach((group) => {
      counts[group] = donors.filter((d) => d.bloodGroup === group).length;
    });
    return counts;
  }, [donors]);

  const handleAddDonor = (donor: Omit<Donor, 'id' | 'createdAt'>) => {
    addDonor(donor);
    toast.success('Donor added successfully!');
  };

  const handleResetFilter = () => {
    setFilterBloodGroup('all');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl blood-gradient shadow-lg">
              <BloodDropIcon className="h-8 w-8 text-primary-foreground" animated />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Blood Bank Donor Management
              </h1>
              <p className="text-muted-foreground">
                Manage and track blood donors efficiently
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Donors"
            value={donors.length}
            icon={<Users className="h-5 w-5" />}
          />
          <StatsCard
            title="Blood Types"
            value={Object.values(bloodGroupCounts).filter((c) => c > 0).length}
            icon={<Droplets className="h-5 w-5" />}
          />
          <StatsCard
            title="Most Common"
            value={
              Object.entries(bloodGroupCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
            }
            icon={<Heart className="h-5 w-5" />}
          />
          <StatsCard
            title="Available Now"
            value={donors.length}
            icon={<BloodDropIcon className="h-5 w-5" />}
          />
        </section>

        {/* Add Donor Form */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Heart className="h-4 w-4 text-accent-foreground" />
              </div>
              Register New Donor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonorForm onSubmit={handleAddDonor} />
          </CardContent>
        </Card>

        {/* Donor Records Section */}
        <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <Users className="h-4 w-4 text-accent-foreground" />
                </div>
                Donor Records
                <span className="ml-2 rounded-full bg-muted px-2.5 py-0.5 text-sm font-normal text-muted-foreground">
                  {filteredDonors.length}
                </span>
              </CardTitle>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by blood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blood Groups</SelectItem>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group} ({bloodGroupCounts[group]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {filterBloodGroup !== 'all' && (
                  <Button variant="ghost" size="sm" onClick={handleResetFilter} className="gap-1">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DonorTable
              donors={filteredDonors}
              onUpdate={updateDonor}
              onDelete={deleteDonor}
            />
          </CardContent>
        </Card>

        {/* Blood Group Summary */}
        <section className="mt-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Blood Group Distribution</h2>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setFilterBloodGroup(group)}
                className={`flex flex-col items-center rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                  filterBloodGroup === group
                    ? 'border-primary bg-accent shadow-md'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <span className="text-lg font-bold text-foreground">{group}</span>
                <span className="text-2xl font-bold text-primary">
                  {bloodGroupCounts[group]}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Blood Bank Donor Management System &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Saving lives, one donation at a time</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
