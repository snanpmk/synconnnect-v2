import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Edit, Plus, Trash2 } from "lucide-react";
import AdminLayout from "./layout/AdminLayout";
import toast, { Toaster } from "react-hot-toast";

// --- Mock Data ---
const initialUsersData = [
  {
    id: 1,
    fullName: "Alex Johnson",
    email: "alex.j@biz.com",
    accountType: "business",
    cardStatus: "Delivered",
    paymentStatus: "active",
    jobTitle: "CEO, Tech Corp",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane.s@indie.net",
    accountType: "individual",
    cardStatus: "Designed",
    paymentStatus: "expired",
    jobTitle: "Freelance Designer",
  },
  {
    id: 3,
    fullName: "Mike Chen",
    email: "mike.c@dev.com",
    accountType: "individual",
    cardStatus: "Draft",
    paymentStatus: "pending",
    jobTitle: "Software Engineer",
  },
];

// -----------------------------------------------------------------------------
// 🧱 AddUserModal (with React Hook Form)
// -----------------------------------------------------------------------------
const AddUserModal = ({ isOpen, onClose, onAdd }) => {
  const modalRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      accountType: "individual",
    },
  });

  const accountType = watch("accountType");

  console.log(accountType);

  // Reset form each time modal opens
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  // Close modal when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!isOpen) return;
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  const onSubmit = (data) => {
    console.log("✅ Submitted Form Data:", data);
    toast.success("Form submitted successfully!");
    // onAdd(data); // uncomment to actually add to table
    onClose();
  };

  const statusButton = (key, options) => (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => {
        const active = watch(key) === opt;
        const activeStyle =
          "bg-indigo-600 text-white border-indigo-600 shadow-sm";
        const inactiveStyle =
          "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setValue(key, opt)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
              active ? activeStyle : inactiveStyle
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 w-[92%] sm:w-full max-w-md shadow-2xl border border-gray-100"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Add New User
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            {statusButton("accountType", ["individual", "business"])}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-lg py-2 mt-2 font-medium hover:bg-indigo-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 🧱 TableHeader
// -----------------------------------------------------------------------------
const TableHeader = () => {
  const headers = [
    "User",
    "Account Type",
    "Card Status",
    "Payment Status",
    "Actions",
  ];

  return (
    <thead className="bg-gray-50 text-gray-600">
      <tr>
        {headers.map((h) => (
          <th
            key={h}
            className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
};

// -----------------------------------------------------------------------------
// 🧱 UserRow
// -----------------------------------------------------------------------------
const UserRow = ({
  user,
  onAccountChange,
  onCardChange,
  onPaymentChange,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-indigo-50/50 transition-all duration-150">
      <td className="px-4 sm:px-6 py-4">
        <div className="font-medium text-gray-900">{user.fullName}</div>
        <div className="text-xs text-gray-500">{user.email}</div>
        <div className="text-xs italic text-indigo-500">{user.jobTitle}</div>
      </td>

      <td className="px-4 sm:px-6 py-4 w-36">
        <select
          value={user.accountType}
          onChange={(e) => onAccountChange(user.id, e.target.value)}
          className="p-2 outline-none rounded-lg border border-gray-200"
        >
          <option value="individual">Individual</option>
          <option value="business">Business</option>
        </select>
      </td>

      <td className="px-4 sm:px-6 py-4 w-40">
        <select
          value={user.cardStatus}
          onChange={(e) => onCardChange(user.id, e.target.value)}
          className="p-2 outline-none rounded-lg border border-gray-200"
        >
          <option>Draft</option>
          <option>Designed</option>
          <option>Delivered</option>
        </select>
      </td>

      <td className="px-4 sm:px-6 py-4 w-40">
        <select
          value={user.paymentStatus}
          onChange={(e) => onPaymentChange(user.id, e.target.value)}
          className="p-2 outline-none rounded-lg border border-gray-200"
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </td>

      <td className="px-4 sm:px-6 py-4 flex gap-2">
        <button
          className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-full hover:bg-indigo-100"
          title="Edit User"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-100"
          title="Delete User"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

// -----------------------------------------------------------------------------
// 🧱 UserTable
// -----------------------------------------------------------------------------
const UserTable = ({
  users,
  onAccountChange,
  onCardChange,
  onPaymentChange,
  onDelete,
}) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <TableHeader />
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onAccountChange={onAccountChange}
              onCardChange={onCardChange}
              onPaymentChange={onPaymentChange}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// 🧱 ManageUsersView
// -----------------------------------------------------------------------------
const ManageUsersView = () => {
  const [users, setUsers] = useState(initialUsersData);
  const [showModal, setShowModal] = useState(false);

  const handleAccountTypeChange = (id, newType) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, accountType: newType } : u))
    );
    toast.success(`Account type updated to ${newType}`);
  };

  const handleCardStatusChange = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, cardStatus: newStatus } : u))
    );
    toast.success(`Card status updated to ${newStatus}`);
  };

  const handlePaymentStatusChange = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, paymentStatus: newStatus } : u))
    );
    toast.success(`Payment status updated to ${newStatus}`);
  };

  const handleAddUser = (newUser) => {
    setUsers((prev) => [...prev, { ...newUser, id: prev.length + 1 }]);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted successfully!");
  };

  return (
    <div className="py-5 px-2 sm:px-4 md:px-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-xl font-semibold text-gray-800">Manage Users</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-md w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      <AddUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddUser}
      />

      <UserTable
        users={users}
        onAccountChange={handleAccountTypeChange}
        onCardChange={handleCardStatusChange}
        onPaymentChange={handlePaymentStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

// -----------------------------------------------------------------------------
// 🧱 Export Main Page
// -----------------------------------------------------------------------------
export default function Dashboard() {
  return (
    <AdminLayout>
      <ManageUsersView />
    </AdminLayout>
  );
}
