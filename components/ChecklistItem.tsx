'use client';

import { useState } from 'react';
import { ChecklistItem as ChecklistItemType } from '@/app/types';
import { Trash2 } from 'lucide-react';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onUpdateText: (id: string, text: string) => void;
}

export default function ChecklistItem({ item, onToggle, onDelete, onUpdateAmount, onUpdateText }: ChecklistItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdateText(item.id, editText.trim());
      setIsEditing(false);
    } else {
      setEditText(item.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group">
      <input
        type="checkbox"
        checked={item.isChecked}
        onChange={() => onToggle(item.id)}
        className="w-6 h-6 sm:w-6 sm:h-6 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              setEditText(item.text);
              setIsEditing(false);
            }
          }}
          className="flex-1 text-base sm:text-lg text-gray-800 break-words min-w-0 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-1 text-base sm:text-lg text-gray-800 break-words min-w-0 cursor-text ${
            item.isChecked ? 'line-through text-gray-400' : ''
          }`}
        >
          {item.text}
        </span>
      )}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <input
          type="number"
          value={item.amount}
          onChange={(e) => {
            const value = e.target.value;
            // Allow empty string for easier editing
            if (value === '') {
              onUpdateAmount(item.id, 0);
            } else {
              onUpdateAmount(item.id, parseInt(value) || 0);
            }
          }}
          onFocus={(e) => e.target.select()}
          min="0"
          className="w-14 sm:w-20 px-1 sm:px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
        />
        <button
          onClick={() => onDelete(item.id)}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity flex-shrink-0"
          aria-label="Delete item"
        >
          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
    </div>
  );
}
