import React, { useEffect, useState } from 'react';
import { ChevronLeft, Search, Filter, UserPlus, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCandidates from '../hooks/useCandidates';

const Batch = ({ batch = { name: "Software Developers", role: "SDE-2", candidates: 30 } }) => {
  // Sample candidates data - replace with your actual data
  const navigate=useNavigate()
  const {candidates, handleFetchAllCandidates} = useCandidates([])
//   const [candidates, setCandidates] = useState([
//     { 
//       id: 1, 
//       name: "Alex Johnson", 
//       interviewDate: "2025-02-15", 
//       interviewTime: "10:30 AM",
//       status: "Completed" 
//     },
//     { 
//       id: 2, 
//       name: "Taylor Smith", 
//       interviewDate: "2025-02-18", 
//       interviewTime: "2:00 PM",
//       status: "Scheduled" 
//     },
//     { 
//       id: 3, 
//       name: "Jordan Lee", 
//       interviewDate: "2025-02-20", 
//       interviewTime: "11:15 AM",
//       status: "Pending" 
//     },
//     { 
//       id: 4, 
//       name: "Morgan Wilson", 
//       interviewDate: "2025-02-10", 
//       interviewTime: "3:45 PM",
//       status: "Completed" 
//     },
//     { 
//       id: 5, 
//       name: "Casey Brown", 
//       interviewDate: "2025-02-25", 
//       interviewTime: "9:00 AM",
//       status: "Scheduled" 
//     }
//   ]);

  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCandidate = (candidateId) => {

    navigate(`/candidate/${candidateId}`)
    // console.log("Opening candidate:", candidate);
    // Navigate to candidate details or open modal
    // e.g., router.push(`/batches/${batch.id}/candidates/${candidate.id}`);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  };

  const handleAddCandidate = () => {
    console.log("Adding new candidate to batch");
    // Open modal or navigate to add candidate form
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  useEffect(() => {
    handleFetchAllCandidates()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button and header */}
        <div className="mb-8">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{batch.name}</h1>
              <p className="text-gray-600 mt-1">{batch.role} • {batch.candidates} candidates</p>
            </div>
            <button 
              onClick={handleAddCandidate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus size={20} />
              <span>Add Candidate</span>
            </button>
          </div>
        </div>

        {/* Search and filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Candidates list */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interview Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interview Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        {candidate.interviewDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        {candidate.interviewTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button 
                        onClick={() => handleOpenCandidate(candidate._id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1"
                      >
                        <span>Open</span>
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty state */}
          {filteredCandidates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No candidates found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Batch;