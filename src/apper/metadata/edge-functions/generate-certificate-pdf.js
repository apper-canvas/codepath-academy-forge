import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      }), { 
        status: 405, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const certificateData = await req.json();
    
    // Validate required fields
    if (!certificateData.courseName || !certificateData.completionDate) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required certificate data' 
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Generate HTML certificate
    const htmlContent = generateCertificateHTML(certificateData);
    
    // Use Puppeteer to convert HTML to PDF
    const puppeteer = await import('npm:puppeteer');
    
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    // Convert buffer to base64
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));
    
    return new Response(JSON.stringify({ 
      success: true, 
      pdfData: pdfBase64 
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Certificate generation failed: ${error.message}` 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
});

function generateCertificateHTML(certificateData) {
  const completionDate = new Date(certificateData.completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        body {
          margin: 0;
          padding: 40px;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #F8FAFC;
        }
        
        .certificate {
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
          border: 3px solid #6366F1;
          border-radius: 16px;
          padding: 60px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .certificate::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 2px solid #8B5CF6;
          border-radius: 12px;
          pointer-events: none;
        }
        
        .header {
          margin-bottom: 40px;
        }
        
        .logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #6366F1;
          margin-bottom: 20px;
        }
        
        .title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 48px;
          font-weight: 700;
          color: #F8FAFC;
          margin-bottom: 20px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .subtitle {
          font-size: 18px;
          color: #CBD5E1;
          margin-bottom: 40px;
        }
        
        .recipient {
          margin-bottom: 40px;
        }
        
        .awarded-to {
          font-size: 16px;
          color: #94A3B8;
          margin-bottom: 10px;
        }
        
        .name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 36px;
          font-weight: 600;
          color: #F8FAFC;
          margin-bottom: 30px;
          border-bottom: 2px solid #6366F1;
          display: inline-block;
          padding-bottom: 10px;
        }
        
        .course-info {
          margin-bottom: 40px;
        }
        
        .course-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 600;
          color: #10B981;
          margin-bottom: 15px;
        }
        
        .course-details {
          font-size: 16px;
          color: #CBD5E1;
          line-height: 1.6;
        }
        
        .completion-info {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
          padding-top: 30px;
          border-top: 1px solid #475569;
        }
        
        .date, .certificate-number {
          text-align: center;
        }
        
        .label {
          font-size: 12px;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        
        .value {
          font-size: 16px;
          font-weight: 600;
          color: #F8FAFC;
        }
        
        .signature {
          text-align: center;
          margin-top: 30px;
        }
        
        .signature-line {
          width: 200px;
          border-bottom: 2px solid #6366F1;
          margin: 0 auto 10px auto;
        }
        
        .instructor-name {
          font-size: 16px;
          font-weight: 600;
          color: #F8FAFC;
        }
        
        .instructor-title {
          font-size: 14px;
          color: #94A3B8;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="logo">CodePath Academy</div>
          <h1 class="title">Certificate of Completion</h1>
          <p class="subtitle">This certifies that</p>
        </div>
        
        <div class="recipient">
          <p class="awarded-to">is hereby awarded to</p>
          <div class="name">Student</div>
        </div>
        
        <div class="course-info">
          <div class="course-title">${certificateData.courseName}</div>
          <div class="course-details">
            Successfully completed the ${certificateData.language || 'Programming'} course<br>
            Difficulty Level: ${certificateData.difficulty || 'Intermediate'}<br>
            ${certificateData.duration ? `Duration: ${certificateData.duration} hours` : ''}
          </div>
        </div>
        
        <div class="completion-info">
          <div class="date">
            <div class="label">Completion Date</div>
            <div class="value">${completionDate}</div>
          </div>
          
          <div class="signature">
            <div class="signature-line"></div>
            <div class="instructor-name">${certificateData.instructor || 'CodePath Academy'}</div>
            <div class="instructor-title">Course Instructor</div>
          </div>
          
          <div class="certificate-number">
            <div class="label">Certificate No.</div>
            <div class="value">${certificateData.certificateNumber}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}