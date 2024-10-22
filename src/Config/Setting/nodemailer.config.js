const nodemailer = require('nodemailer');
const emailTemplates = require('../../Api/EmailTemplets/Templates');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, templateName, templateData = {}, attachments = []) => {
  try {
    // Retrieve the template based on template name
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // Pass templateData to the template function
    const html = await template(templateData);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: html, 
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} with subject "${subject}". Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${to} with subject "${subject}". Error: ${error.message}`);
    throw error; 
  }
};

module.exports = sendMail;
