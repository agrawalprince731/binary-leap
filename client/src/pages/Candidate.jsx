import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  Calendar,
  Clock,
  ArrowLeft,
  Download,
  Briefcase,
  Award,
  MessageCircle,
  ChevronDown,
  ExternalLink,
  Check,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useCandidates from "../hooks/useCandidates";


const Candidate = () => {
  const navigate = useNavigate();
  const [expandedTranscript, setExpandedTranscript] = React.useState(false);
  const {transcript, candidateAnalytics, name, loading, handleFetchCandidateAnalytics} = useCandidates();
  const {id} = useParams();
  const [candidateData, setCandidateData] = useState({});
  
  // Calculate overall score inside the component where it has access to updated data
  const overallScore = React.useMemo(() => {
    if (!candidateData.experience_analysis || !candidateData.sentimental_analysis) {
      return 0; // Return a default value when data isn't loaded yet
    }
    return Math.round(
      (candidateData.experience_analysis.overall_fit_score +
        candidateData.sentimental_analysis.overall_score) / 2
    );
  }, [candidateData]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Interview date extraction from transcript
  const interviewDate = "28 Feb 2025";

  // Prepare data for charts
  const skillsChartData = React.useMemo(() => {
    if (!candidateData.experience_analysis || !candidateData.sentimental_analysis) {
      return []; // Return empty array when data isn't loaded
    }
    
    return [
      {
        subject: "Experience Match",
        A: candidateData.experience_analysis.experience_match,
        fullMark: 100,
      },
      {
        subject: "Complexity",
        A: candidateData.experience_analysis?.complexity_handled * 10,
        fullMark: 100,
      },
      {
        subject: "Grammar",
        A: candidateData.sentimental_analysis?.grammar_accuracy,
        fullMark: 100,
      },
      {
        subject: "Communication",
        A: candidateData.sentimental_analysis?.overall_score,
        fullMark: 100,
      },
      {
        subject: "Sentiment",
        A: candidateData.sentimental_analysis?.polarity_score * 100,
        fullMark: 100,
      },
    ];
  }, [candidateData]);

  const scoreData = React.useMemo(() => {
    if (!candidateData.experience_analysis || !candidateData.sentimental_analysis) {
      return []; // Return empty array when data isn't loaded
    }
    
    return [
      { name: "Overall", value: overallScore },
      {
        name: "Experience",
        value: candidateData.experience_analysis.overall_fit_score,
      },
      {
        name: "Communication",
        value: candidateData.sentimental_analysis.overall_score,
      },
    ];
  }, [candidateData, overallScore]);

  // Colors for charts
  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"];
  const SCORE_COLORS = {
    high: "#10b981", // emerald-500
    medium: "#f59e0b", // amber-500
    low: "#ef4444", // red-500
  };

  const getScoreColor = (score) => {
    if (score >= 80) return SCORE_COLORS.high;
    if (score >= 60) return SCORE_COLORS.medium;
    return SCORE_COLORS.low;
  };

  const getBgScoreColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getTextScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const toggleTranscript = () => {
    setExpandedTranscript(!expandedTranscript);
  };

  useEffect(()=>{
    handleFetchCandidateAnalytics(id)
  },[])

  useEffect(() => {
    // Only update candidateData when necessary data is available
    console.log(candidateAnalytics , candidateAnalytics.experience_analysis , 
      candidateAnalytics.sentimental_analysis , name)
    if (transcript && candidateAnalytics && candidateAnalytics.experience_analysis && 
      candidateAnalytics.sentimental_analysis && name) {
        console.log(transcript,candidateAnalytics)
      setCandidateData({
        _id: {
          $oid: "67c1102626314942c16083bd",
        },
        name: name,
        transcript: transcript,
        experience_analysis: candidateAnalytics.experience_analysis,
        sentimental_analysis: candidateAnalytics.sentimental_analysis,
        createdAt: {
          $date: "2025-02-28T01:23:50.312Z",
        },
        updatedAt: {
          $date: "2025-02-28T01:23:50.312Z",
        },
        __v: 0,
      });
    }
  }, [transcript, candidateAnalytics, name]);

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="text-white mr-4 hover:bg-indigo-700 p-2 rounded-full transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-white">
                Interview Analyzer
              </h1>
            </div>
            <span className="text-white/80 flex items-center gap-2 text-sm bg-indigo-700/50 px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4" />
              {interviewDate}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Candidate Overview Card */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-lg">
                {candidateData.name?.split(" ")?.map((word) => word[0])
                  .join("")}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {candidateData.name}
                </h2>
                <p className="text-gray-500 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Software Developer
                </p>
                <div className="flex flex-wrap items-center mt-3 text-sm text-gray-500 gap-4">
                  <span className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 mr-1 text-indigo-500" />
                    {formatDate(candidateData?.createdAt?.$date)}
                  </span>
                  <span className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                    <User className="w-4 h-4 mr-1 text-indigo-500" />
                    Interviewed by Prince Agarwal
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div
                className={`mx-auto inline-flex items-center justify-center h-28 w-28 rounded-full ${getBgScoreColor(
                  overallScore
                )} text-white shadow-lg`}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold">{overallScore}</div>
                  <div className="text-xs font-medium">OVERALL SCORE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-700">
                Experience Match
              </h3>
              <span
                className={`text-lg font-bold ${getTextScoreColor(
                  candidateData.experience_analysis?.experience_match
                )}`}
              >
                {candidateData.experience_analysis?.experience_match}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div
                className={`h-2.5 rounded-full ${getBgScoreColor(
                  candidateData.experience_analysis?.experience_match
                )}`}
                style={{
                  width: `${candidateData.experience_analysis?.experience_match}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-700">
                Communication
              </h3>
              <span
                className={`text-lg font-bold ${getTextScoreColor(
                  candidateData.sentimental_analysis?.overall_score
                )}`}
              >
                {candidateData.sentimental_analysis?.overall_score?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div
                className={`h-2.5 rounded-full ${getBgScoreColor(
                  candidateData.sentimental_analysis?.overall_score
                )}`}
                style={{
                  width: `${candidateData.sentimental_analysis?.overall_score}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-700">Overall Fit</h3>
              <span
                className={`text-lg font-bold ${getTextScoreColor(
                  candidateData.experience_analysis?.overall_fit_score
                )}`}
              >
                {candidateData.experience_analysis?.overall_fit_score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div
                className={`h-2.5 rounded-full ${getBgScoreColor(
                  candidateData.experience_analysis?.overall_fit_score
                )}`}
                style={{
                  width: `${candidateData.experience_analysis?.overall_fit_score}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Two-column layout for detailed analysis and charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Detailed Analysis */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience Analysis */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-6">
                <Award className="text-indigo-500 w-5 h-5" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Experience Analysis
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Experience Match
                  </span>
                  <span
                    className={`text-sm font-medium ${getTextScoreColor(
                      candidateData.experience_analysis?.experience_match
                    )}`}
                  >
                    {candidateData.experience_analysis?.experience_match}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getBgScoreColor(
                      candidateData.experience_analysis?.experience_match
                    )}`}
                    style={{
                      width: `${candidateData.experience_analysis?.experience_match}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Complexity Handled
                  </span>
                  <span
                    className={`text-sm font-medium ${getTextScoreColor(
                      candidateData.experience_analysis?.complexity_handled * 10
                    )}`}
                  >
                    {candidateData.experience_analysis?.complexity_handled}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getBgScoreColor(
                      candidateData.experience_analysis?.complexity_handled * 10
                    )}`}
                    style={{
                      width: `${
                        candidateData.experience_analysis?.complexity_handled *
                        10
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Fit
                  </span>
                  <span
                    className={`text-sm font-medium ${getTextScoreColor(
                      candidateData.experience_analysis?.overall_fit_score
                    )}`}
                  >
                    {candidateData.experience_analysis?.overall_fit_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getBgScoreColor(
                      candidateData.experience_analysis?.overall_fit_score
                    )}`}
                    style={{
                      width: `${candidateData.experience_analysis?.overall_fit_score}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Key Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidateData.experience_analysis?.key_strengths?.map(
                    (strength, index) => (
                      <div
                        key={index}
                        className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-sm flex items-center border border-emerald-100"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {strength}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidateData.experience_analysis?.missing_skills?.map(
                    (skill, index) => (
                      <div
                        key={index}
                        className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm flex items-center border border-red-100"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {skill}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Communication Analysis */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="text-indigo-500 w-5 h-5" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Communication Analysis
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Grammar Accuracy
                  </span>
                  <span className="text-sm font-medium text-emerald-600">
                    {candidateData.sentimental_analysis?.grammar_accuracy}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-emerald-500"
                    style={{
                      width: `${candidateData.sentimental_analysis?.grammar_accuracy}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Filler Word Usage
                  </span>
                  <span className="text-sm font-medium text-emerald-600">
                    {candidateData.sentimental_analysis?.filler_word_percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-emerald-500"
                    style={{
                      width: `${candidateData.sentimental_analysis?.filler_word_percentage}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Sentiment Score
                  </span>
                  <span
                    className={`text-sm font-medium ${getTextScoreColor(
                      candidateData.sentimental_analysis?.polarity_score * 100
                    )}`}
                  >
                    {(
                      candidateData.sentimental_analysis?.polarity_score * 100
                    )?.toFixed(1)}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getBgScoreColor(
                      candidateData.sentimental_analysis?.polarity_score * 100
                    )}`}
                    style={{
                      width: `${
                        candidateData.sentimental_analysis?.polarity_score * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Communication
                  </span>
                  <span
                    className={`text-sm font-medium ${getTextScoreColor(
                      candidateData.sentimental_analysis?.overall_score
                    )}`}
                  >
                    {candidateData.sentimental_analysis?.overall_score?.toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getBgScoreColor(
                      candidateData.sentimental_analysis?.overall_score
                    )}`}
                    style={{
                      width: `${candidateData.sentimental_analysis?.overall_score}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Overall Sentiment:{" "}
                    <span className="text-emerald-600 font-semibold">
                      {candidateData.sentimental_analysis?.overall_sentiment}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    No Grammar Mistakes Detected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Radar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Candidate Skills Radar
            </h3>
            <div className="h-70">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="45%"
                  cy="45%"
                  outerRadius="70%"
                  data={skillsChartData}
                >
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                  />
                  <Radar
                    name="Candidate"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 border-t pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Skill Scores
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {skillsChartData?.map((item) => (
                  <div key={item.subject} className="flex items-center">
                    <div className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">
                      {item.subject}:{" "}
                    </span>
                    <span className="text-xs font-medium ml-1">{item.A}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Score Comparison Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Score Comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                <Bar dataKey="value" name="Score" radius={[4, 4, 0, 0]}>
                  {scoreData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getScoreColor(entry.value)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="text-indigo-500 w-5 h-5" />
              <h3 className="text-lg font-semibold text-gray-900">
                Interview Transcript
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTranscript}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100"
              >
                <span className="text-sm">
                  {expandedTranscript ? "Collapse" : "Expand"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedTranscript ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
          <div
            className={`${
              expandedTranscript ? "" : "max-h-64"
            } overflow-y-auto rounded-lg p-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 transition-all duration-300`}
          >
            {candidateData.transcript?.split("  ")?.map((part, index) => {
              // Simple parsing of the transcript
              const [speaker, text] = part.split(": ");
              const time = speaker ? speaker.match(/\((.*?)\)/) : null;
              const name = speaker ? speaker.replace(/\(.*?\)/, "").trim() : "";

              const isInterviewer = name === "Prince Agarwal";

              return (
                <div
                  key={index}
                  className={`mb-4 ${
                    isInterviewer
                      ? "bg-indigo-50 border-l-4 border-indigo-400"
                      : "bg-emerald-50 border-l-4 border-emerald-400"
                  } p-3 rounded-r-lg`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`font-medium ${
                        isInterviewer ? "text-indigo-600" : "text-emerald-600"
                      }`}
                    >
                      {name}
                    </span>
                    {time && (
                      <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-500">
                        {time[1]}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Previous Candidate
          </button>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md">
            Next Candidate
          </button>
        </div> */}
      </main>
    </div>
  );
};

export default Candidate;
