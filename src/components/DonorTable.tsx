import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Donor } from '@/types/donor';
import { DonorForm } from './DonorForm';
import { Edit2, Trash2, Users } from 'lucide-react';

interface DonorTableProps {
  donors: Donor[];
  onUpdate: (id: string, updates: Partial<Omit<Donor, 'id' | 'created_at'>>) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const getBloodGroupColor = (group: string) => {
  const colors: Record<string, string> = {
    'A+': 'bg-red-100 text-red-700 border-red-200',
    'A-': 'bg-red-100 text-red-700 border-red-200',
    'B+': 'bg-blue-100 text-blue-700 border-blue-200',
    'B-': 'bg-blue-100 text-blue-700 border-blue-200',
    'AB+': 'bg-purple-100 text-purple-700 border-purple-200',
    'AB-': 'bg-purple-100 text-purple-700 border-purple-200',
    'O+': 'bg-green-100 text-green-700 border-green-200',
    'O-': 'bg-green-100 text-green-700 border-green-200',
  };
  return colors[group] || 'bg-muted text-muted-foreground';
};

export function DonorTable({ donors, onUpdate, onDelete, loading }: DonorTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editDonor, setEditDonor] = useState<Donor | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleUpdate = (updates: Omit<Donor, 'id' | 'created_at'>) => {
    if (editDonor) {
      onUpdate(editDonor.id, updates);
      setEditDonor(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading donors...</p>
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No donors found</h3>
        <p className="text-muted-foreground mt-1">
          Add your first donor or adjust your search filters
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Age</TableHead>
              <TableHead className="font-semibold">Blood Group</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donors.map((donor, index) => (
              <TableRow 
                key={donor.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  #{donor.id.slice(0, 6).toUpperCase()}
                </TableCell>
                <TableCell className="font-medium">{donor.name}</TableCell>
                <TableCell>{donor.age} yrs</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`font-semibold ${getBloodGroupColor(donor.blood_group)}`}
                  >
                    {donor.blood_group}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{donor.phone}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditDonor(donor)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(donor.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Donor Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this donor? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDonor} onOpenChange={() => setEditDonor(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Donor Information</DialogTitle>
          </DialogHeader>
          {editDonor && (
            <DonorForm
              initialData={editDonor}
              mode="edit"
              onSubmit={handleUpdate}
              onCancel={() => setEditDonor(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
