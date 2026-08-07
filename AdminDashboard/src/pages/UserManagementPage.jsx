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
  UserCog,
  Users,
  UserCheck,
  Shield,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Mail,
  Lock,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react';
import { mockUsersList } from '../services/mockData';

export function UserManagementPage() {
  const [users, setUsers] = useState(mockUsersList);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Invigilator');
  const [newUserDept, setNewUserDept] = useState('Computer Science');

  const filteredUsers = users.filter(u => {
    const matchesCategory = selectedCategory === 'ALL' || u.category === selectedCategory || u.role === selectedCategory;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) return;
    const newUser = {
      id: `u-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      category: `${newUserRole}s`,
      status: "ACTIVE",
      lastLogin: "Just now",
      phone: "+1 (555) 000-0000",
      department: newUserDept
    };
    setUsers([newUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    setIsAddUserModalOpen(false);
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    } : u));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">User Management Center</h1>
            <Badge variant="mono" size="sm">RBAC STAFF PROVISIONING</Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage platform administrators, invigilators, operators, and candidate support accounts.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddUserModalOpen(true)}
          className="font-bold text-xs"
        >
          Provision New Staff User
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Staff Users" value={users.length.toString()} subtitle="Provisioned accounts" icon={UserCog} />
        <StatCard title="Administrators" value={users.filter(u => u.role === 'Administrator').length.toString()} subtitle="Full system access" icon={Shield} />
        <StatCard title="Active Invigilators" value={users.filter(u => u.role === 'Invigilator').length.toString()} subtitle="Duty proctors" icon={UserCheck} />
        <StatCard title="Operators & Support" value={users.filter(u => u.role === 'Operator' || u.role === 'Support Staff').length.toString()} subtitle="Kiosk & Helpdesk" icon={Users} />
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant w-full sm:w-80">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-on-surface focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['ALL', 'Administrators', 'Invigilators', 'Operators', 'Support Staff'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-variant'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <Card title="System User Accounts & Status Ledger" subtitle="Manage account status, role assignments, and last active sessions">
        <Table headers={["Name", "Email Address", "Assigned Role", "Department", "Status", "Last Active", "Actions"]}>
          {filteredUsers.map((u) => (
            <tr key={u.id} className="hover:bg-surface-bright text-xs transition-colors">
              <td className="px-4 py-3 font-bold text-on-surface flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {u.name.charAt(0)}
                </div>
                <span>{u.name}</span>
              </td>
              <td className="px-4 py-3 font-mono text-on-surface-variant">{u.email}</td>
              <td className="px-4 py-3">
                <Badge variant={u.role === 'Administrator' ? 'danger' : u.role === 'Invigilator' ? 'mono' : 'default'} size="sm">
                  {u.role}
                </Badge>
              </td>
              <td className="px-4 py-3 font-medium text-on-surface-variant">{u.department}</td>
              <td className="px-4 py-3">
                <Badge variant={u.status === 'ACTIVE' ? 'success' : 'secondary'} size="sm">
                  {u.status}
                </Badge>
              </td>
              <td className="px-4 py-3 font-mono text-on-surface-variant">{u.lastLogin}</td>
              <td className="px-4 py-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleUserStatus(u.id)}
                  className="text-xs"
                >
                  {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Provision User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Provision New Staff Account"
        icon={UserCog}
        iconBg="bg-primary/20 text-primary"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUser}>
              Provision Account
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Full Name"
            placeholder="e.g. Dr. Sarah Connor"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. sarah.c@nexiscbt.org"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <Select
            label="Role Assignment"
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
          >
            <option value="Administrator">Administrator</option>
            <option value="Invigilator">Invigilator</option>
            <option value="Operator">Operator</option>
            <option value="Support Staff">Support Staff</option>
          </Select>
          <Input
            label="Department / Unit"
            placeholder="e.g. Exam Operations"
            value={newUserDept}
            onChange={(e) => setNewUserDept(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
