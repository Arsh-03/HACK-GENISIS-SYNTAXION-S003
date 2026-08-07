import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { User, UserPlus, Edit } from 'lucide-react';

export function StudentFormModal({
  isOpen,
  onClose,
  studentToEdit,
  onSave
}) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science & AI',
    batchYear: '2026',
    enrollmentNo: '',
    session: 'Unassigned',
    verificationStatus: 'Verified',
    registrationStatus: 'Active'
  });

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        id: studentToEdit.id || '',
        name: studentToEdit.name || '',
        email: studentToEdit.email || '',
        phone: studentToEdit.phone || '',
        department: studentToEdit.department || 'Computer Science & AI',
        batchYear: studentToEdit.batchYear || '2026',
        enrollmentNo: studentToEdit.enrollmentNo || '',
        session: studentToEdit.session || 'Unassigned',
        verificationStatus: studentToEdit.verificationStatus || 'Verified',
        registrationStatus: studentToEdit.registrationStatus || 'Active'
      });
    } else {
      setFormData({
        id: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        email: '',
        phone: '',
        department: 'Computer Science & AI',
        batchYear: '2026',
        enrollmentNo: `CS2026-${Math.floor(100 + Math.random() * 900)}`,
        session: 'Unassigned',
        verificationStatus: 'Pending',
        registrationStatus: 'Active'
      });
    }
  }, [studentToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={studentToEdit ? `Edit Student: ${studentToEdit.name}` : 'Add New Candidate'}
      icon={studentToEdit ? Edit : UserPlus}
      iconBg="bg-primary/10 text-primary"
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {studentToEdit ? 'Save Changes' : 'Register Candidate'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Student ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            required
            disabled={!!studentToEdit}
          />
          <Input
            label="Enrollment No."
            value={formData.enrollmentNo}
            onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
            required
          />
        </div>

        <Input
          label="Full Name"
          placeholder="e.g. Jordan Rivera"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email Address"
            type="email"
            placeholder="jordan@university.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Department / Program"
            options={[
              'Computer Science & AI',
              'Software Engineering',
              'Electrical Engineering',
              'Data Science & AI',
              'Information Technology',
              'Artificial Intelligence'
            ]}
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <Select
            label="Batch Year"
            options={['2025', '2026', '2027', '2028']}
            value={formData.batchYear}
            onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Verification Status"
            options={['Verified', 'Pending', 'Rejected']}
            value={formData.verificationStatus}
            onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
          />
          <Select
            label="Registration Status"
            options={['Active', 'Inactive', 'Deactivated']}
            value={formData.registrationStatus}
            onChange={(e) => setFormData({ ...formData, registrationStatus: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
}
