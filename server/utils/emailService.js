import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Welcome Email Template
const getWelcomeEmailTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ResumeAI</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }
            .welcome-text {
                font-size: 18px;
                margin-bottom: 20px;
            }
            .features {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .features h3 {
                color: #667eea;
                margin-top: 0;
            }
            .features ul {
                padding-left: 20px;
            }
            .features li {
                margin: 10px 0;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 14px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">📄 ResumeAI</div>
            <h1>Welcome to ResumeAI!</h1>
        </div>
        <div class="content">
            <p class="welcome-text">Hi ${name},</p>
            <p>Welcome to ResumeAI! We're thrilled to have you on board. You're now ready to create professional, AI-powered resumes that stand out.</p>
            
            <div class="features">
                <h3>✨ What You Can Do:</h3>
                <ul>
                    <li>🤖 Create resumes with AI-powered suggestions</li>
                    <li>🎨 Choose from beautiful, professional templates</li>
                    <li>📥 Download your resumes in PDF format</li>
                    <li>🔗 Share your resumes with a simple link</li>
                </ul>
            </div>
            
            <p>Ready to get started? Click the button below to create your first resume!</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/app" class="cta-button">Start Building Your Resume</a>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
        <div class="footer">
            <p>© 2024 ResumeAI. All rights reserved.</p>
            <p>This email was sent to you because you signed up for a ResumeAI account.</p>
        </div>
    </body>
    </html>
    `;
};

// Resume Download Email Template
const getResumeDownloadTemplate = (name, resumeTitle) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume Downloaded - ResumeAI</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }
            .success-box {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .resume-info {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
            }
            .resume-info h3 {
                color: #667eea;
                margin-top: 0;
            }
            .tips {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .tips h3 {
                color: #667eea;
                margin-top: 0;
            }
            .tips ul {
                padding-left: 20px;
            }
            .tips li {
                margin: 10px 0;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 14px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">📄 ResumeAI</div>
            <h1>Resume Downloaded Successfully!</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            
            <div class="success-box">
                <strong>🎉 Great news!</strong> Your resume has been downloaded successfully.
            </div>
            
            <div class="resume-info">
                <h3>📋 Resume Details</h3>
                <p><strong>Title:</strong> ${resumeTitle}</p>
                <p><strong>Download Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="tips">
                <h3>💡 Tips for Your Resume:</h3>
                <ul>
                    <li>Customize your resume for each job application</li>
                    <li>Keep it concise - aim for 1-2 pages</li>
                    <li>Use action verbs and quantify achievements</li>
                    <li>Proofread carefully for typos and errors</li>
                </ul>
            </div>
            
            <p>Want to make more changes? Click below to edit your resume.</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/app" class="cta-button">Edit Your Resume</a>
            
            <p>Good luck with your job search! 🚀</p>
        </div>
        <div class="footer">
            <p>© 2024 ResumeAI. All rights reserved.</p>
            <p>This email was sent to you because you downloaded a resume from ResumeAI.</p>
        </div>
    </body>
    </html>
    `;
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'resumai@example.com',
            to: email,
            subject: 'Welcome to ResumeAI - Start Building Your Perfect Resume!',
            html: getWelcomeEmailTemplate(name)
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to:', email);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't throw error to prevent blocking registration
    }
};

// Send Resume Download Email
export const sendResumeDownloadEmail = async (email, name, resumeTitle) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'resumai@example.com',
            to: email,
            subject: 'Your Resume Has Been Downloaded - ResumeAI',
            html: getResumeDownloadTemplate(name, resumeTitle)
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Resume download email sent successfully to:', email);
    } catch (error) {
        console.error('Error sending resume download email:', error);
        // Don't throw error to prevent blocking download
    }
};
