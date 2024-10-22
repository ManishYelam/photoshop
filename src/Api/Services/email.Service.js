const sendMail = require('../../Config/Setting/nodemailer.config');
const {
  registrationTemplate,
  passwordChangeTemplate,
  performanceTrackingTemplate,
  systemLogsTemplate,
  notificationTemplate,
} = require('../EmailTemplets/Templates');
const { User } = require('../Models/Association');

module.exports = {
  // Send registration email
  sendRegistrationEmail: async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const subject = 'Welcome to [Your App Name] - Verify Your Email';
    const html = registrationTemplate(
      user.name,
      'http://13.127.13.10:5000/verify?token=abc123'
    );
    await sendMail(user.email, subject, html);
  },

  sendPasswordChangeEmail: async (userId) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error('User not found');
  
      const userEmail = user.email;
      const subject = 'Your Password has been Changed';
      const templateName = 'passwordChangeTemplate';
      const templateData = { userName: user.name };

      await sendMail(userEmail, subject, templateName, templateData);
    } catch (error) {
      console.error(`Failed to send password change email to user ID ${userId}: ${error.message}`);
      throw error; 
    }
  },

  // Send performance tracking email
  sendPerformanceTrackingEmail: async (userId, data) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const subject = 'Performance Tracking Report';
    const html = performanceTrackingTemplate(data);
    await sendMail(user.email, subject, html);
  },
  // Send system logs email
  sendSystemLogsEmail: async (userId, logData) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const subject = 'System Logs Report';
    const html = systemLogsTemplate(logData);
    await sendMail(user.email, subject, html);
  },
  // Send generic notification email
  sendNotificationEmail: async (userId, title, content) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const subject = title;
    const html = notificationTemplate(title, content);
    await sendMail(user.email, subject, html);
  },
};
