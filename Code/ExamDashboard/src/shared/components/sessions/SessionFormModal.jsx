import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { MOCK_CENTERS, MOCK_ROOMS, MOCK_INVIGILATORS } from '../../../services/mockSessions';
import { Calendar, Plus, Edit } from 'lucide-react';

export function SessionFormModal({
  isOpen,
  onClose,
  sessionToEdit,
  onSave
}) {
  const [formData, setFormData] = useState({
    code: '',
    examName: '',
    center: MOCK_CENTERS[0],
    room: MOCK_ROOMS[0],
    date: '2026-08-16',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    capacity: 120,
    assignedInvigilator: MOCK_INVIGILATORS[0].name,
    status: 'Scheduled'
  });

  useEffect(() => {
    if (sessionToEdit) {
      setFormData({
        code: sessionToEdit.code || '',
        examName: sessionToEdit.examName || '',
        center: sessionToEdit.center || MOCK_CENTERS[0],
        room: sessionToEdit.room || MOCK_ROOMS[0],
        date: sessionToEdit.date || '2026-08-16',
        startTime: sessionToEdit.startTime || '09:00 AM',
        endTime: sessionToEdit.endTime || '12:00 PM',
        capacity: sessionToEdit.capacity || 120,
        assignedInvigilator: sessionToEdit.assignedInvigilator || MOCK_INVIGILATORS[0].name,
        status: sessionToEdit.status || 'Scheduled'
      });
    } else {
      setFormData({
        code: `SES-2026-0${Math.floor(6 + Math.random() * 9)}`,
        examName: '',
        center: MOCK_CENTERS[0],
        room: MOCK_ROOMS[0],
        date: '2026-08-18',
        startTime: '09:00 AM',
        endTime: '12:00 PM',
        capacity: 120,
        assignedInvigilator: MOCK_INVIGILATORS[0].name,
        status: 'Scheduled'
      });
    }
  }, [sessionToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sessionToEdit ? `Edit Session: ${sessionToEdit.code}` : 'Create New Assessment Session'}
      icon={sessionToEdit ? Edit : Plus}
      iconBg="bg-primary/10 text-primary"
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {sessionToEdit ? 'Save Session Changes' : 'Schedule Session'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Session Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
            disabled={!!sessionToEdit}
          />
          <Select
            label="Session Status"
            options={['Scheduled', 'Active', 'Completed', 'Cancelled']}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </div>

        <Input
          label="Examination Title"
          placeholder="e.g. CS-101 Midterm Examination"
          value={formData.examName}
          onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Assessment Center"
            options={MOCK_CENTERS}
            value={formData.center}
            onChange={(e) => setFormData({ ...formData, center: e.target.value })}
          />
          <Select
            label="Room / Hall"
            options={MOCK_ROOMS}
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Exam Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            label="Start Time"
            placeholder="09:00 AM"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
          <Input
            label="End Time"
            placeholder="12:00 PM"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Room Capacity (Max Seats)"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 100 })}
            required
          />
          <Select
            label="Assigned Invigilator"
            options={MOCK_INVIGILATORS.map(inv => inv.name)}
            value={formData.assignedInvigilator}
            onChange={(e) => setFormData({ ...formData, assignedInvigilator: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
}
