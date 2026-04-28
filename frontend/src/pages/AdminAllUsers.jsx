import React, { useEffect, useState } from 'react';
import { userService } from '../api/userService';

export default function AdminAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId, role) => {
    await userService.updateRole(userId, role);
    loadUsers(); // refresh list
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-white">
        Loading users...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="font-semibold text-white">All Users</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs border-b border-white/10">
              <th className="px-6 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Change Role</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition">
                <td className="px-6 py-3 text-white">{u.name}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {u.email}
                </td>

                <td className="px-4 py-3 text-gray-300 text-xs">
                  {u.role}
                </td>

                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white"
                  >
                    <option value="USER">USER</option>
                    <option value="TECHNICIAN">TECHNICIAN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}