import React, { useState } from 'react';
import { Card } from '../shared/components/ui/Card';
import { StatCard } from '../shared/components/ui/StatCard';
import { Badge } from '../shared/components/ui/Badge';
import { Button } from '../shared/components/ui/Button';
import { Table } from '../shared/components/ui/Table';
import { Modal } from '../shared/components/ui/Modal';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import {
  Building,
  Plus,
  Search,
  Grid,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  Edit,
  Trash2,
  UserCheck
} from 'lucide-react';
import { mockExamCenters } from '../services/mockData';

export function ExamCentersPage() {
  const [centers, setCenters] = useState(mockExamCenters);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCenterModalOpen, setIsAddCenterModalOpen] = useState(false);

  // New center form state
  const [centerName, setCenterName] = useState('');
  const [centerCode, setCenterCode] = useState('');
  const [centerLocation, setCenterLocation] = useState('');
  const [centerCapacity, setCenterCapacity] = useState(300);
  const [centerRooms, setCenterRooms] = useState(6);
  const [invigilatorName, setInvigilatorName] = useState('Dr. Harold Vance');

  const filteredCenters = centers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCenter = () => {
    if (!centerName || !centerCode) return;
    const newCenter = {
      id: `cnt-${Date.now()}`,
      name: centerName,
      code: centerCode,
      location: centerLocation || "Main Block",
      capacity: parseInt(centerCapacity),
      rooms: parseInt(centerRooms),
      terminals: parseInt(centerCapacity),
      status: "ACTIVE",
      invigilatorInCharge: invigilatorName
    };
    setCenters([newCenter, ...centers]);
    setCenterName('');
    setCenterCode('');
    setIsAddCenterModalOpen(false);
  };

  const handleDeleteCenter = (id) => {
    if (confirm("Are you sure you want to remove this examination center?")) {
      setCenters(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">Examination Centers & Kiosk Labs</h1>
            <Badge variant="mono" size="sm">INFRASTRUCTURE MANAGEMENT</Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage test centers, hall capacities, room counts, and active workstation terminal mappings.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddCenterModalOpen(true)}
          className="font-bold text-xs"
        >
          Add Examination Center
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Test Centers" value={centers.length.toString()} subtitle="Accredited centers" icon={Building} />
        <StatCard title="Total Capacity" value={centers.reduce((acc, c) => acc + c.capacity, 0).toLocaleString()} subtitle="Simultaneous seats" icon={Grid} />
        <StatCard title="Active Terminals" value={centers.reduce((acc, c) => acc + c.terminals, 0).toLocaleString()} subtitle="Verified PCs" icon={Monitor} />
        <StatCard title="Total Examination Rooms" value={centers.reduce((acc, c) => acc + c.rooms, 0).toString()} subtitle="Supervised halls" icon={UserCheck} />
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant w-80">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Search center name, code, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-on-surface focus:outline-none"
          />
        </div>
      </div>

      {/* Centers Table */}
      <Card title="Accredited Examination Centers Ledger" subtitle="Manage center capacities, assigned invigilator in charge, and operational status">
        <Table headers={["Center Name", "Center Code", "Location & Building", "Capacity", "Rooms", "Invigilator In-Charge", "Status", "Actions"]}>
          {filteredCenters.map((c) => (
            <tr key={c.id} className="hover:bg-surface-bright text-xs transition-colors">
              <td className="px-4 py-3 font-bold text-on-surface">{c.name}</td>
              <td className="px-4 py-3 font-mono text-primary font-bold">{c.code}</td>
              <td className="px-4 py-3 text-on-surface-variant font-medium">{c.location}</td>
              <td className="px-4 py-3 font-mono font-bold text-emerald-600">{c.capacity} Seats</td>
              <td className="px-4 py-3 font-mono font-bold">{c.rooms} Rooms</td>
              <td className="px-4 py-3 font-semibold text-on-surface">{c.invigilatorInCharge}</td>
              <td className="px-4 py-3">
                <Badge variant={c.status === 'ACTIVE' ? 'success' : 'warning'} size="sm">
                  {c.status}
                </Badge>
              </td>
              <td className="px-4 py-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDeleteCenter(c.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Add Center Modal */}
      <Modal
        isOpen={isAddCenterModalOpen}
        onClose={() => setIsAddCenterModalOpen(false)}
        title="Add New Examination Center"
        icon={Building}
        iconBg="bg-primary/20 text-primary"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddCenterModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCenter}>
              Create Center
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Center Full Name"
            placeholder="e.g. East Zone Examination Complex - Hall D"
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
          />
          <Input
            label="Center Code"
            placeholder="e.g. CTR-DEL-04"
            value={centerCode}
            onChange={(e) => setCenterCode(e.target.value)}
          />
          <Input
            label="Location & Address"
            placeholder="e.g. Academic Block 3, Floor 4"
            value={centerLocation}
            onChange={(e) => setCenterLocation(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Seat Capacity"
              type="number"
              value={centerCapacity}
              onChange={(e) => setCenterCapacity(e.target.value)}
            />
            <Input
              label="Room Count"
              type="number"
              value={centerRooms}
              onChange={(e) => setCenterRooms(e.target.value)}
            />
          </div>
          <Select
            label="Invigilator in Charge"
            value={invigilatorName}
            onChange={(e) => setInvigilatorName(e.target.value)}
          >
            <option value="Dr. Harold Vance">Dr. Harold Vance</option>
            <option value="Prof. S. Gupta">Prof. S. Gupta</option>
            <option value="Ms. Maya Jenkins">Ms. Maya Jenkins</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
