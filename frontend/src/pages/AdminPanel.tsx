import React, { useState, useEffect } from 'react';
import { userService, type UserReadOnly, type UpdateUserRequest } from '../services/userService';
import EditUserModal from '../components/EditUserModal';

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<UserReadOnly[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [editingUser, setEditingUser] = useState<UserReadOnly | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (uuid: string, email: string) => {
        if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;
        try {
            await userService.deleteUser(uuid);
            await fetchUsers();
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("Failed to delete user. Please try again.");
        }
    };

    const handleSaveEdit = async (uuid: string, data: UpdateUserRequest) => {
        await userService.updateUser(uuid, data);
        await fetchUsers();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-slate-500 animate-pulse">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-wm-dark mb-1">User Management</h2>
                    <p className="text-sm text-slate-600">View and manage all registered users.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">{error}</div>
            )}

            <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                        {users.map((user) => (
                            <tr key={user.uuid} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button
                                        onClick={() => setEditingUser(user)}
                                        className="text-wm-primary hover:text-wm-secondary font-semibold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.uuid, user.email)}
                                        className="text-red-600 hover:text-red-900 font-semibold"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditUserModal
                isOpen={!!editingUser}
                user={editingUser}
                onClose={() => setEditingUser(null)}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

export default AdminPanel;