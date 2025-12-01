import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
// Assuming AdminLayout, useGetData, and usePostData are correctly imported from your project structure
import AdminLayout from "./layout/AdminLayout";
import useGetData from "../../api/useGetData";
import usePostData from "../../api/usePostData";

// ---
// UserFormModal Component (Unchanged, included for completeness)
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
        // Set value for paymentStatus
        setValue("paymentStatus", selectedUser.paymentStatus || "pending");
      } else {
        // Reset to default for adding a new user
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

          {/* NEW FIELD: Payment Status (Only in Edit Mode) */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                {...register("paymentStatus", {
                  required: "Payment Status is required",
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 capitalize"
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
// ManageUsersView Component (UPDATED with Search, Sort, and Responsiveness)
// ---

const ManageUsersView = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [sortConfig, setSortConfig] = useState({
    key: "fullName", // Default sort key
    direction: "ascending", // Default sort direction
  });

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
    // Determine the data to send (remove 'paymentStatus' if adding, as the backend sets it)
    const dataToSend =
      !userId && formData.paymentStatus
        ? (({ paymentStatus, ...rest }) => rest)(formData)
        : formData;

    if (userId) {
      // Edit: Uses PUT method
      userMutate.mutate({
        url: `/admin/users/edit/?id=${userId}`,
        method: "PUT",
        data: dataToSend,
      });
    } else {
      // Add: Uses POST method
      userMutate.mutate({
        url: "/admin/user/add",
        method: "POST",
        data: dataToSend,
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
    // Confirmation toast before deleting (implementation remains the same)
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
                // Delete: Uses DELETE method
                deleteUser.mutate({
                  url: `/admin/users/delete/?id=${userId}`,
                  method: "DELETE",
                  data: {}, // Pass an empty object
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

  // --- Sort Handler ---
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // --- Filter and Sort Logic ---
  const users = usersData?.users;

  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return [];

    // 1. Filter
    const filteredUsers = users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.accountType.toLowerCase().includes(searchLower)
      );
    });

    // 2. Sort
    const sortedUsers = [...filteredUsers];
    if (sortConfig !== null) {
      sortedUsers.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedUsers;
  }, [users, searchTerm, sortConfig]);

  // --- Helper for rendering sort icon ---
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp size={16} className="inline ml-1" />
    ) : (
      <ChevronDown size={16} className="inline ml-1" />
    );
  };

  if (isLoading) return <p className="p-6">Loading users...</p>;
  if (isError) return <p className="p-6 text-red-500">Error fetching users.</p>;

  const getUserLink = (user) => {
    const base = import.meta.env.VITE_APP_DOMAIN_NAME;

    if (user.accountType === "individual") {
      return `${base}/profile/${user._id}`;
    }

    return `${base}/${user.accountType}/${user._id}`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy!");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

        {/* Header and Search/Add Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Add User Button */}
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add User
          </button>
        </div>

        {/* --- Responsive Table Container --- */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header with Sort */}
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {/* Full Name Column */}
                <th
                  className="p-3 text-left cursor-pointer select-none whitespace-nowrap"
                  onClick={() => requestSort("fullName")}
                >
                  Full Name <SortIcon columnKey="fullName" />
                </th>

                {/* Email Column (hidden on smallest screens for responsiveness) */}
                <th
                  className="p-3 text-left cursor-pointer select-none hidden sm:table-cell whitespace-nowrap"
                  onClick={() => requestSort("email")}
                >
                  Email <SortIcon columnKey="email" />
                </th>

                {/* Account Type Column */}
                <th
                  className="p-3 text-left cursor-pointer select-none whitespace-nowrap"
                  onClick={() => requestSort("accountType")}
                >
                  Account Type <SortIcon columnKey="accountType" />
                </th>

                {/* Payment Status Column */}
                <th className="p-3 text-left">Payment Status</th>

                {/* User ID Column */}
                <th className="p-3 text-left">User ID</th>

                {/* Actions Column (no sorting) */}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  {/* Full Name + Avatar */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      {user.profilePhoto?.url ? (
                        <img
                          src={user.profilePhoto?.url}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                                     flex items-center justify-center text-white font-semibold flex-shrink-0"
                        >
                          {user.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                      )}

                      {/* Name + Email (Email is shown here on small screens) */}
                      <div>
                        <span className="block font-medium">
                          {user.fullName}
                        </span>
                        <span className="block text-sm text-gray-500 sm:hidden">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email (hidden on smallest screens) */}
                  <td className="p-3 hidden sm:table-cell">{user.email}</td>

                  {/* Account Type */}
                  <td className="p-3 capitalize">{user.accountType}</td>

                  <td>{user.paymentStatus}</td>
                  <td className="p-3">
                    <button
                      onClick={() => copyToClipboard(getUserLink(user))}
                      className="text-blue-600 underline hover:text-blue-800 break-all"
                      title="Click to copy link"
                    >
                      {getUserLink(user)}
                    </button>
                  </td>

                  {/* Actions */}
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

          {filteredAndSortedUsers.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              {searchTerm
                ? "No users found matching your search."
                : "No users found."}
            </p>
          )}
        </div>
      </div>

      {/* User Form Modal */}
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
