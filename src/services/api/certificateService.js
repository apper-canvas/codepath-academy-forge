import { courseService } from './courseService';

// Certificate storage
const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class CertificateService {
  async getAll() {
    await delay();
    return [...certificates];
  }

  async getByCourse(courseId) {
    await delay();
    return certificates.filter(cert => cert.courseId === courseId);
  }

  async getById(id) {
    await delay();
    const certificate = certificates.find(cert => cert.Id === id);
    if (!certificate) {
      throw new Error('Certificate not found');
    }
    return { ...certificate };
  }

  async generate(certificateData) {
    await delay();
    
    const { courseId, userId = 1, completionDate } = certificateData;
    
    // Check if certificate already exists
    const existing = certificates.find(cert => 
      cert.courseId === courseId && cert.userId === userId
    );
    
    if (existing) {
      return { ...existing };
    }

    // Get course details
    const course = await courseService.getById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const newCertificate = {
      Id: Math.max(0, ...certificates.map(c => c.Id)) + 1,
      courseId,
      userId,
      courseName: course.title,
      courseDescription: course.description,
      instructor: course.instructor,
      completionDate: completionDate || new Date().toISOString(),
      issueDate: new Date().toISOString(),
      certificateNumber: `CERT-${Date.now()}-${courseId}`,
      language: course.language,
      difficulty: course.difficulty,
      duration: course.estimatedHours
    };

    certificates.push(newCertificate);
    localStorage.setItem('certificates', JSON.stringify(certificates));
    
    return { ...newCertificate };
  }

  async download(certificateId) {
    await delay();
    
    const certificate = await this.getById(certificateId);
    
    try {
      // Call Edge Function to generate PDF
      const { ApperClient } = window.ApperSDK;
      
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const result = await apperClient.functions.invoke(import.meta.env.VITE_GENERATE_CERTIFICATE_PDF, {
        body: JSON.stringify(certificate),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!result.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_GENERATE_CERTIFICATE_PDF}. The response body is: ${JSON.stringify(result)}.`);
        throw new Error('Failed to generate PDF');
      }

      // Convert base64 to blob and download
      const byteCharacters = atob(result.pdfData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.courseName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, message: 'Certificate downloaded successfully' };
    } catch (error) {
      console.info(`apper_info: Got this error an this function: ${import.meta.env.VITE_GENERATE_CERTIFICATE_PDF}. The error is: ${error.message}`);
      throw new Error('Failed to download certificate');
    }
  }

  async delete(id) {
    await delay();
    const index = certificates.findIndex(cert => cert.Id === id);
    if (index === -1) {
      throw new Error('Certificate not found');
    }
    
    certificates.splice(index, 1);
    localStorage.setItem('certificates', JSON.stringify(certificates));
    
    return { success: true, message: 'Certificate deleted successfully' };
  }
}

export const certificateService = new CertificateService();