import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const batches = [
  { name: "Developer Interviews", position: "Software Developer", candidates: 17 },
  { name: "Management", position: "HR Intern", candidates: 12},
];

const Dashboard = () => {
  const navigate=useNavigate()
  const handleOpenBatch=()=>{
    navigate("/batch")
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview Batches</h1>
          <p className="text-gray-500 mt-2">Manage and view your ongoing interview processes</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">{batch.name}</h2>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Active</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Position</span>
                    <span className="font-medium">{batch.position}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Candidates</span>
                    <span className="font-medium">{batch.candidates}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100">
                <button onClick={handleOpenBatch} className="w-full py-4 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium">
                  Open Batch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add New Batch Card */}
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 hover:border-blue-400 transition-colors duration-200 cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
              <span className="text-blue-600 text-2xl font-semibold">+</span>
            </div>
            <p className="text-gray-600 font-medium">Add New Batch</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;