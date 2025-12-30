'use client';

import { useState, useEffect } from 'react';
import { ChecklistTable as ChecklistTableType } from '@/app/types';
import ChecklistTable from '@/components/ChecklistTable';
import { Plus, Search } from 'lucide-react';

export default function Home() {
  const [tables, setTables] = useState<ChecklistTableType[]>([]);
  const [newTableName, setNewTableName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedTableId, setFocusedTableId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from server on mount
  useEffect(() => {
    const loadTables = async () => {
      try {
        const response = await fetch('/api/tables');
        if (response.ok) {
          const data = await response.json();
          setTables(data);
        }
      } catch (error) {
        console.error('Failed to load tables:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTables();
  }, []);

  // Save data to server whenever tables change (with debounce)
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(async () => {
      try {
        await fetch('/api/tables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tables),
        });
      } catch (error) {
        console.error('Failed to save tables:', error);
      }
    }, 500); // Wait 500ms after last change before saving

    return () => clearTimeout(timeoutId);
  }, [tables, isLoaded]);

  const addTable = () => {
    if (newTableName.trim()) {
      const newTable: ChecklistTableType = {
        id: Date.now().toString(),
        name: newTableName.trim(),
        items: [],
      };
      setTables([...tables, newTable]);
      setNewTableName('');
      setShowInput(false);
    }
  };

  const updateTable = (tableId: string, updates: Partial<ChecklistTableType>) => {
    setTables(tables.map((table) =>
      table.id === tableId ? { ...table, ...updates } : table
    ));
  };

  const deleteTable = (tableId: string) => {
    setTables(tables.filter((table) => table.id !== tableId));
    if (focusedTableId === tableId) {
      setFocusedTableId(null);
    }
  };

  const handleToggleFocus = (tableId: string) => {
    setFocusedTableId(focusedTableId === tableId ? null : tableId);
  };

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedTables = focusedTableId
    ? filteredTables.filter(table => table.id === focusedTableId)
    : filteredTables;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {tables.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tables..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg mx-auto text-sm sm:text-base"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Create New Table</span>
            </button>
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">New Checklist Table</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTable()}
                  placeholder="Enter table name..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={addTable}
                    className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowInput(false);
                      setNewTableName('');
                    }}
                    className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          {displayedTables.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-24 h-24 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {tables.length === 0 ? 'No checklist tables yet' : 'No tables found'}
              </h3>
              <p className="text-gray-500">
                {tables.length === 0 ? 'Create your first checklist table to get started!' : 'Try a different search term'}
              </p>
            </div>
          ) : (
            displayedTables.map((table) => (
              <ChecklistTable
                key={table.id}
                table={table}
                onUpdateTable={updateTable}
                onDeleteTable={deleteTable}
                onToggleFocus={handleToggleFocus}
                isFocused={focusedTableId === table.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
