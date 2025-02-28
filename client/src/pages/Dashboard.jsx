import React, { use, useEffect, useState } from 'react';
import { PlusCircle, Users, ChevronRight } from 'lucide-react';
import useBatches from '../hooks/useBatches';
import { useNavigate } from 'react-router-dom';

const batches = [
  {
    name: "Software Developers",
    role: "SDE-2",
    candidates: 30,
  },
  // You can add more sample batches here
];

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({ name: '', role: '' });
  const {batches, handleFetchAllBatches, handleCreateNewBatch} = useBatches([])
  const navigate=useNavigate()

  const handleCreateBatch = () => {
    console.log("Creating new batch:", newBatch);
    handleCreateNewBatch(newBatch)
    setNewBatch({ name: '', role: '' });
    setIsModalOpen(false);
  };

  const handleOpenBatch = (batchId) => {
    navigate("/batch/"+batchId)
  };

  useEffect(() => {
    handleFetchAllBatches()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruitment Batches</h1>
            <p className="text-gray-600 mt-1">Manage your candidate batches</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            <span>Create Batch</span>
          </button>
        </div>

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{batch.name}</h2>
                    <p className="text-gray-600 mt-1">{batch.role}</p>
                  </div>
                  <div className="flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-12 h-12">
                    <Users size={20} />
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="bg-gray-100 rounded-lg py-2 px-3">
                    <span className="font-semibold text-gray-900">{batch.candidates}</span>
                    <span className="text-gray-600 ml-1">candidates</span>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => handleOpenBatch(batch._id)}
                className="bg-gray-50 py-3 px-6 border-t border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-100"
              >
                <span className="text-blue-600 font-medium">View Batch</span>
                <ChevronRight size={18} className="text-blue-600" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state if no batches */}
        {batches.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mt-8">
            <div className="mx-auto flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-16 h-16 mb-4">
              <Users size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No batches yet</h2>
            <p className="text-gray-600 mb-6">Create your first recruitment batch to get started</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={20} />
              <span>Create Batch</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0000004b] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Batch</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="batch-name">
                    Batch Name
                  </label>
                  <input
                    id="batch-name"
                    type="text"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter batch name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="batch-role">
                    Role
                  </label>
                  <input
                    id="batch-role"
                    type="text"
                    value={newBatch.role}
                    onChange={(e) => setNewBatch({...newBatch, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter role (e.g., SDE-2, Product Manager)"
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateBatch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={!newBatch.name || !newBatch.role}
              >
                Create Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;