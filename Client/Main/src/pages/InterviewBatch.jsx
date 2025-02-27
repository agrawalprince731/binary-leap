import React, { useState } from 'react';
import { Clock, Video, Calendar, Check, X, UserCheck } from 'lucide-react';

const InterviewBatch = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Sample candidate data
  const candidates = [
    {
      id: 1,
      name: "Alex Johnson",
      position: "Software Engineer",
      scheduled: "10:00 AM",
      status: "pending"
    },
    {
      id: 2,
      name: "Jamie Smith",
      position: "UX Designer",
      scheduled: "11:30 AM",
      status: "pending"
    },
    {
      id: 3,
      name: "Taylor Wang",
      position: "Product Manager",
      scheduled: "1:15 PM",
      status: "pending"
    },
    {
      id: 4,
      name: "Morgan Lee",
      position: "Data Scientist",
      scheduled: "2:45 PM",
      status: "completed"
    },
    {
      id: 5,
      name: "Casey Rivera",
      position: "DevOps Engineer",
      scheduled: "4:00 PM",
      status: "pending"
    }
  ];

  const startRecording = (candidateId) => {
    setIsRecording(true);
    setSelectedCandidate(candidateId);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setSelectedCandidate(null);
  };

  const getStatusBadge = (status) => {
    if (status === "completed") {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>;
    }
    return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interview Batch</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-600"><Calendar className="inline h-4 w-4 mr-1" /> February 27, 2025</span>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Engineering Team - Round 2</h2>
          <p className="text-sm text-gray-600">5 candidates scheduled</p>
        </div>
        <button 
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          onClick={isRecording ? stopRecording : () => startRecording(null)}
        >
          <Video className="h-4 w-4" />
          {isRecording ? "Stop Recording" : "Start Batch Recording"}
        </button>
      </div>
      
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div 
            key={candidate.id} 
            className={`p-4 border rounded-lg ${
              selectedCandidate === candidate.id 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{candidate.name}</h3>
                <p className="text-sm text-gray-600">{candidate.position}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {candidate.scheduled}
                </span>
                {getStatusBadge(candidate.status)}
                {candidate.status !== "completed" && (
                  <button 
                    className={`px-3 py-1 rounded-md ${
                      selectedCandidate === candidate.id
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                    onClick={
                      selectedCandidate === candidate.id
                        ? stopRecording
                        : () => startRecording(candidate.id)
                    }
                  >
                    {selectedCandidate === candidate.id ? (
                      <span className="flex items-center"><X className="h-4 w-4 mr-1" /> Stop</span>
                    ) : (
                      <span className="flex items-center"><UserCheck className="h-4 w-4 mr-1" /> Interview</span>
                    )}
                  </button>
                )}
              </div>
            </div>
            {selectedCandidate === candidate.id && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
                <div className="animate-pulse mr-2 h-2 w-2 bg-red-600 rounded-full"></div>
                Recording interview with {candidate.name}...
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-right">
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg mr-2">
          Cancel
        </button>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
          Complete Batch
        </button>
      </div>
    </div>
  );
};

export default InterviewBatch;