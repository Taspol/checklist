'use client';

import { useState } from 'react';
import { ChecklistTable as ChecklistTableType } from '@/app/types';
import ChecklistItem from './ChecklistItem';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface ChecklistTableProps {
  table: ChecklistTableType;
  onUpdateTable: (tableId: string, updates: Partial<ChecklistTableType>) => void;
  onDeleteTable: (tableId: string) => void;
  onToggleFocus: (tableId: string) => void;
  isFocused: boolean;
}

export default function ChecklistTable({ table, onUpdateTable, onDeleteTable, onToggleFocus, isFocused }: ChecklistTableProps) {
  const [newItemText, setNewItemText] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('1');
  const [showAddForm, setShowAddForm] = useState(false);

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        amount: parseInt(newItemAmount) || 1,
        isChecked: false,
      };
      onUpdateTable(table.id, {
        items: [...table.items, newItem],
      });
      setNewItemText('');
      setNewItemAmount('1');
      setShowAddForm(false);
    }
  };

  const toggleItem = (itemId: string) => {
    const updatedItems = table.items.map((item) =>
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );
    onUpdateTable(table.id, { items: updatedItems });
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = table.items.filter((item) => item.id !== itemId);
    onUpdateTable(table.id, { items: updatedItems });
  };

  const updateItemAmount = (itemId: string, amount: number) => {
    const updatedItems = table.items.map((item) =>
      item.id === itemId ? { ...item, amount } : item
    );
    onUpdateTable(table.id, { items: updatedItems });
  };

  const updateItemText = (itemId: string, text: string) => {
    const updatedItems = table.items.map((item) =>
      item.id === itemId ? { ...item, text } : item
    );
    onUpdateTable(table.id, { items: updatedItems });
  };

  const handleDeleteTable = () => {
    if (window.confirm(`Are you sure you want to delete "${table.name}"? This action cannot be undone.`)) {
      onDeleteTable(table.id);
    }
  };

  const completedCount = table.items.filter((item) => item.isChecked).length;
  const totalCount = table.items.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{table.name}</h2>
          {totalCount > 0 && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {completedCount} of {totalCount} completed
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => onToggleFocus(table.id)}
            className={`${
              isFocused
                ? 'text-blue-600 bg-blue-50 hover:text-blue-800 hover:bg-blue-100'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            } p-1.5 sm:p-2 rounded-lg transition-colors`}
            aria-label={isFocused ? 'Unfocus table' : 'Focus on this table'}
          >
            {isFocused ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
          </button>
          <button
            onClick={handleDeleteTable}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-colors"
            aria-label="Delete table"
          >
            <Trash2 size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 font-medium text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            Add Item
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="Add a new item..."
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                autoFocus
              />
              <input
                type="number"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="Amount"
                min="1"
                className="w-full sm:w-24 px-2 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addItem}
                className="flex-1 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewItemText('');
                  setNewItemAmount('1');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {table.items.length === 0 ? (
          <p className="text-center text-gray-400 py-6 sm:py-8 text-sm sm:text-base">No items yet. Add your first item above!</p>
        ) : (
          table.items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={toggleItem}
              onDelete={deleteItem}
              onUpdateAmount={updateItemAmount}
              onUpdateText={updateItemText}
            />
          ))
        )}
      </div>
    </div>
  );
}
