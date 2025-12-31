'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function FilterBar({ filters, setFilters, options = [] }) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
      {options.map((option) => (
        <div key={option.id} className="flex-1 min-w-[200px] space-y-2">
          <Label htmlFor={option.id}>{option.label}</Label>
          <Select
            value={filters[option.id]}
            onValueChange={(value) => setFilters({ ...filters, [option.id]: value })}
          >
            <SelectTrigger id={option.id}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {option.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}