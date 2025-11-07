import React from "react";
import AdminLayout from "./layout/AdminLayout";
import { Trash2, Edit3 } from "lucide-react";

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Client" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Business" },
];

const ManageUsers = () => {
  const handleEdit = (user) => console.log("Edit user:", user);
  const handleDelete = (id) => console.log("Delete user with ID:", id);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
