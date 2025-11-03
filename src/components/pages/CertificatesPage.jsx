import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { certificateService } from "@/services/api/certificateService";

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await certificateService.getAll();
      setCertificates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleDownload = async (certificateId) => {
    try {
      setDownloadingId(certificateId);
      await certificateService.download(certificateId);
      toast.success("Certificate downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download certificate");
    } finally {
      setDownloadingId(null);
    }
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'secondary';
    }
  };

  const getLanguageIcon = (language) => {
    switch (language?.toLowerCase()) {
      case 'javascript': return 'FileText';
      case 'python': return 'Terminal';
      case 'java': return 'Coffee';
      case 'c++': return 'Code';
      default: return 'BookOpen';
    }
  };

  if (loading) return <Loading type="courses" />;
  if (error) return <Error message={error} onRetry={loadCertificates} />;

  if (certificates.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-2xl mb-6 inline-block">
              <ApperIcon name="Award" size={64} className="text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-4">
              No Certificates Yet
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Complete courses to earn certificates and showcase your achievements.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <ApperIcon name="Award" size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              My Certificates
            </h1>
            <p className="text-gray-400 text-lg">
              Download and share your course completion certificates
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gradient-to-br from-success/20 to-green-600/20 border border-success/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <ApperIcon name="Trophy" size={24} className="text-success" />
            <Badge variant="success" size="sm">Earned</Badge>
          </div>
          <div className="text-2xl font-bold text-white">{certificates.length}</div>
          <div className="text-sm text-gray-400">Certificates earned</div>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <ApperIcon name="Code" size={24} className="text-primary" />
            <Badge variant="primary" size="sm">Languages</Badge>
          </div>
          <div className="text-2xl font-bold text-white">
            {new Set(certificates.map(c => c.language)).size}
          </div>
          <div className="text-sm text-gray-400">Programming languages</div>
        </div>

        <div className="bg-gradient-to-br from-warning/20 to-yellow-600/20 border border-warning/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <ApperIcon name="Clock" size={24} className="text-warning" />
            <Badge variant="warning" size="sm">Hours</Badge>
          </div>
          <div className="text-2xl font-bold text-white">
            {certificates.reduce((sum, cert) => sum + (cert.duration || 0), 0)}
          </div>
          <div className="text-sm text-gray-400">Total learning hours</div>
        </div>
      </motion.div>

      {/* Certificates Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {certificates.map((certificate) => (
          <motion.div
            key={certificate.Id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-surface to-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-primary/50 transition-all duration-200 shadow-card hover:shadow-card-hover group"
          >
            {/* Certificate Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <ApperIcon 
                  name={getLanguageIcon(certificate.language)} 
                  size={20} 
                  className="text-primary" 
                />
                <Badge 
                  variant={getDifficultyVariant(certificate.difficulty)}
                  size="sm"
                >
                  {certificate.difficulty || 'Course'}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                #{certificate.certificateNumber?.slice(-6)}
              </div>
            </div>

            {/* Course Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {certificate.courseName}
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Instructor: {certificate.instructor || 'CodePath Academy'}
              </p>
            </div>

            {/* Completion Date */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
              <ApperIcon name="Calendar" size={16} />
              Completed {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>

            {/* Duration */}
            {certificate.duration && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <ApperIcon name="Clock" size={16} />
                {certificate.duration} hours
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-700">
              <Button
                onClick={() => handleDownload(certificate.Id)}
                disabled={downloadingId === certificate.Id}
                variant="primary"
                size="sm"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {downloadingId === certificate.Id ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Download" size={16} />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CertificatesPage;