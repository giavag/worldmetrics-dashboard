import React, { useState, useEffect } from 'react';
import type {UserReadOnly, UpdateUserRequest} from '../services/userService';

interface EditUserModalProps {
    isOpen: boolean;
    user: UserReadOnly | null;
    onClose: () => void;
    onSave: (uuid: string, data: UpdateUserRequest) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, user, onClose, onSave }) => {
    const [formData, setFormData] = useState<UpdateUserRequest>({
        firstName: '', lastName: '', email: '', role: 'USER'
    });
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            });
            setError(null);
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            setError(null);
            await onSave(user.uuid, formData);
            onClose();
        } catch (err: any) {
            console.error("Failed to update user:", err);
            setError(err.response?.data?.message || "Failed to update user. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit User</h3>

                {error && (
                    <div className="mb-4 bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary"
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 bg-wm-primary text-white rounded hover:bg-wm-secondary font-medium disabled:opacity-70 transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;