import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Eye, Calendar, User, CheckCircle, XCircle,
  Clock, Activity, FileText, Phone, Mail, Thermometer, FileText as ReportIcon
} from 'lucide-react';
import { UPLOAD_URL } from '../../config';
import axios from 'axios';
import toast from 'react-hot-toast';

const PredictionResultDetail = () => {
  const { id } = useParams();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    loadPrediction();
  }, [id]);

  const loadPrediction = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/prediction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrediction(res.data.data.prediction);
    } catch (error) {
      console.error('Error loading prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/prediction/${id}/generate-report`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 'success' && res.data.data.reportUrl) {
        toast.success('Report generated successfully!');
        window.open(res.data.data.reportUrl, '_blank');
        loadPrediction(); // Refresh to get updated report URL
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in-review': return 'bg-blue-100 text-blue-700';
      case 'reviewed': return 'bg-green-100 text-green-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPredictionColor = (prediction) => {
    switch (prediction) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'diabetes': return 'text-red-600 bg-red-50';
      case 'glaucoma': return 'text-purple-600 bg-purple-50';
      case 'cataract': return 'text-blue-600 bg-blue-50';
      case 'myopia': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="text-center py-12">
        <Eye className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Prediction not found</h3>
        <Link to="/history" className="text-sky-600 hover:underline">Back to History</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/history"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Diagnosis Details</h1>
            <p className="text-sm text-gray-500">
              {new Date(prediction.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isGeneratingReport ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <ReportIcon className="h-4 w-4" />
                <span>Generate Report</span>
              </>
            )}
          </button>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(prediction.status)}`}>
            {prediction.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Eye Scan Image
            </h3>
            {prediction.imageUrl ? (
              <img
                src={UPLOAD_URL(prediction.imageUrl)}
                alt="Eye scan"
                className="w-full rounded-lg object-contain max-h-80 bg-gray-50"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Eye className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Grad-CAM Heatmap */}
          {prediction.gradcamImageUrl && (
            <div className="bg-white rounded-xl shadow-md p-6 mt-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-purple-600" />
                AI Attention Heatmap
              </h3>
              <img
                src={UPLOAD_URL(prediction.gradcamImageUrl)}
                alt="Heatmap"
                className="w-full rounded-lg object-contain max-h-80 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Highlighted areas show AI focus during diagnosis
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Diagnosis Result */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              AI Diagnosis Result
            </h3>
            
            <div className={`p-4 rounded-xl mb-4 ${getPredictionColor(prediction.prediction)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-75">Predicted Condition</p>
                  <p className="text-2xl font-bold capitalize">
                    {prediction.prediction === 'normal' ? 'Healthy Eyes' : prediction.prediction}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">Confidence</p>
                  <p className="text-2xl font-bold">
                    {Math.round(prediction.confidence * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Binary Classification */}
            {prediction.binaryResult && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Classification</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600">Normal</p>
                    <p className="text-xl font-bold text-green-700">
                      {(prediction.binaryResult.normalProbability * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">Disease</p>
                    <p className="text-xl font-bold text-red-700">
                      {(prediction.binaryResult.diseaseProbability * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Disease Classification */}
            {prediction.diseaseResult && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Disease Probabilities</p>
                <div className="space-y-2">
                  {Object.entries(prediction.diseaseResult.probabilities || {}).map(([disease, prob]) => (
                    <div key={disease} className="flex items-center">
                      <span className="w-28 text-sm capitalize text-gray-600">{disease}</span>
                      <div className="flex-1 mx-3">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full ${
                              disease === prediction.prediction ? 'bg-sky-600' : 'bg-gray-400'
                            }`}
                            style={{ width: `${prob * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="w-16 text-right text-sm font-medium">
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Doctor Review Section */}
          {prediction.doctorReview && prediction.doctorReview.reviewedAt && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Doctor's Review
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-semibold text-lg">
                      {prediction.doctorReview.doctorId?.name?.charAt(0)?.toUpperCase() || 'D'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">Dr. {prediction.doctorReview.doctorId?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">
                      {prediction.doctorReview.doctorId?.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      Reviewed on {new Date(prediction.doctorReview.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {prediction.doctorReview.confirmedDiagnosis && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Confirmed Diagnosis</p>
                    <p className="font-semibold capitalize text-lg">{prediction.doctorReview.confirmedDiagnosis}</p>
                  </div>
                )}

                {prediction.doctorReview.notes && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Doctor's Notes</p>
                    <p className="text-gray-700">{prediction.doctorReview.notes}</p>
                  </div>
                )}

                {prediction.doctorReview.treatmentPlan && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Treatment Plan</p>
                    <p className="text-gray-700">{prediction.doctorReview.treatmentPlan}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pending Review Status */}
          {prediction.reviewRequest && prediction.reviewRequest.sentToDoctorId && !prediction.doctorReview?.reviewedAt && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800">
                  <strong>Under Review</strong> - Your prediction has been sent to a doctor for review.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionResultDetail;