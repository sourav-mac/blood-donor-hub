import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BLOOD_GROUPS, Donor } from '@/types/donor';
import { UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';

interface DonorFormProps {
  onSubmit: (donor: Omit<Donor, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  initialData?: Donor;
  mode?: 'add' | 'edit';
}

export function DonorForm({ onSubmit, onCancel, initialData, mode = 'add' }: DonorFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [age, setAge] = useState(initialData?.age?.toString() || '');
  const [bloodGroup, setBloodGroup] = useState(initialData?.bloodGroup || '');
  const [phone, setPhone] = useState(initialData?.phone || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error('Please enter donor name');
      return;
    }
    if (!age || parseInt(age) < 18 || parseInt(age) > 65) {
      toast.error('Age must be between 18 and 65');
      return;
    }
    if (!bloodGroup) {
      toast.error('Please select a blood group');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    onSubmit({
      name: name.trim(),
      age: parseInt(age),
      bloodGroup,
      phone: phone.trim(),
    });

    // Clear form after successful add
    if (mode === 'add') {
      setName('');
      setAge('');
      setBloodGroup('');
      setPhone('');
    }
  };

  const handleClear = () => {
    setName('');
    setAge('');
    setBloodGroup('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Donor Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">
            Age
          </Label>
          <Input
            id="age"
            type="number"
            min="18"
            max="65"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="18-65"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bloodGroup" className="text-sm font-medium">
            Blood Group
          </Label>
          <Select value={bloodGroup} onValueChange={setBloodGroup}>
            <SelectTrigger id="bloodGroup">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUPS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" variant="blood" className="gap-2">
          <UserPlus className="h-4 w-4" />
          {mode === 'add' ? 'Add Donor' : 'Update Donor'}
        </Button>
        
        <Button type="button" variant="outline" onClick={handleClear} className="gap-2">
          <X className="h-4 w-4" />
          Clear Fields
        </Button>
        
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
