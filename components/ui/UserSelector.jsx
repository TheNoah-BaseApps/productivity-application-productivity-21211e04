'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UserSelector({ value, onValueChange, disabled = false }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
      <SelectTrigger>
        <SelectValue placeholder={loading ? 'Loading users...' : 'Select user'} />
      </SelectTrigger>
      <SelectContent>
        {users.map(user => (
          <SelectItem key={user.id} value={user.id}>
            {user.name} ({user.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}