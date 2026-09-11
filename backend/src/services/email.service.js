import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    console.log("ℹ SMTP credentials not fully provided in .env. Email service running in Console Fallback mode.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendTaskAssignedEmail({ employeeEmail, employeeName, taskTitle, description, priority, dueDate }) {
  const subject = "New Task Assigned";
  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const textContent = `Hello ${employeeName},

A new task has been assigned to you.

Task:
${taskTitle}

Description:
${description}

Priority:
${priority.toUpperCase()}

Due Date:
${formattedDate}

Please login to the Task Management System to view the task.

Regards,
Task Management System`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4f46e5;">New Task Assigned</h2>
      <p>Hello <strong>${employeeName}</strong>,</p>
      <p>A new task has been assigned to you in the Task Management System.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 5px 0;"><strong>Task Title:</strong> ${taskTitle}</p>
        <p style="margin: 5px 0;"><strong>Description:</strong> ${description}</p>
        <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="text-transform: capitalize; font-weight: bold; color: ${priority === 'high' ? '#dc2626' : priority === 'medium' ? '#d97706' : '#2563eb'};">${priority}</span></p>
        <p style="margin: 5px 0;"><strong>Due Date:</strong> ${formattedDate}</p>
      </div>
      <p>Please login to your employee dashboard to view and manage this task.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Regards,<br>Task Management System</p>
    </div>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`\n================ EMAIL NOTIFICATION (SIMULATED) ================`);
    console.log(`To: ${employeeEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(textContent);
    console.log(`=================================================================\n`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"Task Management System" <${process.env.SMTP_USER}>`,
      to: employeeEmail,
      subject,
      text: textContent,
      html: htmlContent,
    });
    console.log(`Task assignment email sent successfully to ${employeeEmail}`);
    return true;
  } catch (error) {
    console.error(`Failed to send task assignment email to ${employeeEmail}:`, error.message);
    return false;
  }
}

export async function sendTaskStatusUpdatedEmail({ adminEmail, employeeName, taskTitle, oldStatus, newStatus, updatedAt }) {
  const recipient = adminEmail || process.env.ADMIN_EMAIL || "admin@example.com";
  const subject = "Task Status Updated";
  const formattedTime = new Date(updatedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const formatStatus = (s) => s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const textContent = `Hello Admin,

Employee ${employeeName} has updated a task.

Task:
${taskTitle}

Previous Status:
${formatStatus(oldStatus)}

New Status:
${formatStatus(newStatus)}

Updated At:
${formattedTime}

Regards,
Task Management System`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4f46e5;">Task Status Updated</h2>
      <p>Hello Admin,</p>
      <p>Employee <strong>${employeeName}</strong> has updated the status of a task.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 5px 0;"><strong>Task Title:</strong> ${taskTitle}</p>
        <p style="margin: 5px 0;"><strong>Previous Status:</strong> ${formatStatus(oldStatus)}</p>
        <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="font-weight: bold; color: #4f46e5;">${formatStatus(newStatus)}</span></p>
        <p style="margin: 5px 0;"><strong>Updated At:</strong> ${formattedTime}</p>
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Regards,<br>Task Management System</p>
    </div>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`\n================ EMAIL NOTIFICATION (SIMULATED) ================`);
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(textContent);
    console.log(`=================================================================\n`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"Task Management System" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      text: textContent,
      html: htmlContent,
    });
    console.log(`Task status update email sent successfully to ${recipient}`);
    return true;
  } catch (error) {
    console.error(`Failed to send task update email to ${recipient}:`, error.message);
    return false;
  }
}
