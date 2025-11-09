import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

import AdminLayout from "./layout/AdminLayout";
import useGetData from "../../api/useGetData";
import usePostData from "../../api/usePostData";

const ManageUsersView = () => {
  const [showModal, setShowModal] = useState(false);

  // --- Get Users ---
  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useGetData({
    queryKey: ["users"],
    url: "/api/admin/users",
    options: {
      onError: (err) => toast.error("Failed to fetch users"),
    },
  });

  // --- Add User ---
  const addUser = usePostData({
    invalidateQueries: ["users"], // auto refetch users after success
    onSuccess: () => {
      toast.success("User added successfully");
      setShowModal(false);
    },
    onError: () => toast.error("Failed to add user"),
  });

  // --- Delete User ---
  const deleteUser = usePostData({
    invalidateQueries: ["users"],
    onSuccess: () => toast.success("User deleted successfully"),
  });

  // --- Edit User ---
  const editUser = usePostData({
    invalidateQueries: ["users"],
    onSuccess: () => toast.success("User updated successfully"),
  });

  // Example action
  const handleDelete = (userId) => {
    deleteUser.mutate({
      url: `/api/admin/users/${userId}/delete`,
      data: {},
    });
  };

  const handleAddUser = (newUserData) => {
    addUser.mutate({
      url: "/api/admin/users",
      data: newUserData,
    });
  };

  if (isLoading) return <p className="p-4">Loading users...</p>;
  if (isError) return <p className="p-4 text-red-500">Error fetching users.</p>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Users</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Add User
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Account Type</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.accountType}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => console.log("Edit user")}
                      className="text-blue-500 hover:text-blue-700 p-2"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsersView;
