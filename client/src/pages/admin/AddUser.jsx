import React, { useState } from "react";
import AdminLayout from "./layout/AdminLayout";
import { UserPlus } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const AddUser = () => {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User added:", form);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <UserPlus className="w-6 h-6 mr-2 text-blue-600" />
        Add New User
      </h1>

      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded shadow">
        <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email" />
        <Button type="submit" className="w-full mt-4">Add User</Button>
      </form>
    </AdminLayout>
  );
};

export default AddUser;
