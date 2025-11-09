import { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
// Assuming AdminLayout, useGetData, and usePostData are correctly defined in your project structure
import AdminLayout from "./layout/AdminLayout";
import useGetData from "../../api/useGetData";
import usePostData from "../../api/usePostData";

// ---
// UserFormModal Component
// ---

const UserFormModal = ({ isOpen, onClose, onSubmit, selectedUser }) => {
  const isEditing = !!selectedUser;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        // Populate form fields for editing, including paymentStatus
        setValue("fullName", selectedUser.fullName || "");
        setValue("email", selectedUser.email || "");
        setValue("accountType", selectedUser.accountType || "");
        // 👇 ADDED: Set value for paymentStatus
        setValue("paymentStatus", selectedUser.paymentStatus || "pending");
      } else {
        // Reset to default for adding a new user
        // Note: paymentStatus is not needed for add since the backend sets it to 'pending' by default.
        reset({ fullName: "", email: "", accountType: "individual" });
      }
    }
  }, [isOpen, isEditing, selectedUser, setValue, reset]);

  const onFormSubmit = (data) => onSubmit(data, selectedUser?._id);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-6">
          {isEditing ? `Edit User: ${selectedUser.fullName}` : "Add New User"}
        </h3>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullName", { required: "Full Name is required" })}
              className={`mt-1 block w-full border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm p-2`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              className={`mt-1 block w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm p-2`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Account Type Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <select
              {...register("accountType", {
                required: "Account Type is required",
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
            {errors.accountType && (
              <p className="mt-1 text-sm text-red-500">
                {errors.accountType.message}
              </p>
            )}
          </div>

          {/* 👇 NEW FIELD: Payment Status */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                {...register("paymentStatus", {
                  required: "Payment Status is required",
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
              {errors.paymentStatus && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.paymentStatus.message}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg ${
                isEditing
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isEditing ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---
// ManageUsersView Component
// ---

const ManageUsersView = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 1. Fetch Users Data
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useGetData({
    queryKey: ["users"],
    url: "/admin/users",
    options: {
      onError: () => toast.error("Failed to fetch users"),
    },
  });

  // 2. Add/Edit User Mutation
  const userMutate = usePostData({
    invalidateQueries: ["users"],
    onSuccess: (data, variables) => {
      const action = variables.method === "POST" ? "added" : "updated";
      toast.success(`User ${action} successfully`);
      setShowModal(false);
      refetch();
    },
    onError: (err, variables) => {
      // Accessing response message for better error feedback if available
      const errorMessage = err?.response?.data?.message || err.message;
      const action = variables.method === "POST" ? "add" : "update";
      toast.error(`Failed to ${action} user: ${errorMessage}`);
    },
  });

  // 3. Delete User Mutation
  const deleteUser = usePostData({
    invalidateQueries: ["users"],
    onSuccess: () => {
      toast.success("User deleted successfully");
      refetch();
    },
    onError: (err) => {
      const errorMessage = err?.response?.data?.message || err.message;
      toast.error(`Failed to delete user: ${errorMessage}`);
    },
  });

  // Handle Form Submission (Add or Edit)
  const handleUserSubmit = (formData, userId) => {
    if (userId) {
      // Edit: Uses PUT method and passes ID via query parameter
      userMutate.mutate({
        url: `/admin/users/edit/?id=${userId}`,
        method: "PUT",
        data: formData,
      });
    } else {
      // Add: Uses POST method
      userMutate.mutate({
        url: "/admin/user/add",
        method: "POST",
        data: formData,
      });
    }
  };

  const openAddModal = () => {
    setSelectedUser(null); // Clear selected user for add operation
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user); // Set selected user for edit operation
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    // Confirmation toast before deleting
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            Are you sure you want to delete this user? This cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => {
                // Delete: Uses DELETE method and passes ID via query parameter
                deleteUser.mutate({
                  url: `/admin/users/delete/?id=${userId}`,
                  method: "DELETE",
                  data: {}, // DELETE requests typically don't have a body, but we pass an empty object here
                });
                toast.dismiss(t.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        icon: "⚠️",
      }
    );
  };

  if (isLoading) return <p className="p-6">Loading users...</p>;
  if (isError) return <p className="p-6 text-red-500">Error fetching users.</p>;

  const users = usersData?.users;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Users</h2>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
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
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.accountType}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-500 hover:text-blue-700 p-2"
                      title="Edit User"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700 p-2 ml-2"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users?.length === 0 && (
            <p className="p-4 text-center text-gray-500">No users found.</p>
          )}
        </div>
      </div>
      <UserFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleUserSubmit}
        selectedUser={selectedUser}
      />
    </AdminLayout>
  );
};

export default ManageUsersView;
