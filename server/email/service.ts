/**
 * Email Service for Trustlance
 * Handles sending notifications to clients and freelancers
 */

import { notifyOwner } from "../_core/notification";

export type EmailType =
  | "application_submitted"
  | "application_accepted"
  | "application_rejected"
  | "payment_released"
  | "dispute_filed"
  | "project_milestone"
  | "project_completed";

interface EmailParams {
  to: string;
  type: EmailType;
  data: Record<string, any>;
}

/**
 * Email templates for different notification types
 */
const emailTemplates: Record<EmailType, (data: any) => { subject: string; body: string }> = {
  application_submitted: (data) => ({
    subject: `New Application for "${data.projectTitle}"`,
    body: `
      <h2>New Application Received</h2>
      <p>A freelancer has applied to your project: <strong>${data.projectTitle}</strong></p>
      <p><strong>Freelancer:</strong> ${data.freelancerName}</p>
      <p><strong>Cover Letter:</strong> ${data.coverLetter}</p>
      ${data.proposedBudget ? `<p><strong>Proposed Budget:</strong> $${data.proposedBudget}</strong></p>` : ""}
      <p><a href="${data.projectUrl}">View Application</a></p>
    `,
  }),

  application_accepted: (data) => ({
    subject: `Your Application Was Accepted for "${data.projectTitle}"`,
    body: `
      <h2>Congratulations!</h2>
      <p>Your application for <strong>${data.projectTitle}</strong> has been accepted!</p>
      <p>The client will be funding the escrow soon. You can start working once the funds are secured.</p>
      <p><a href="${data.projectUrl}">View Project Details</a></p>
    `,
  }),

  application_rejected: (data) => ({
    subject: `Application Update for "${data.projectTitle}"`,
    body: `
      <h2>Application Status</h2>
      <p>Unfortunately, your application for <strong>${data.projectTitle}</strong> was not selected at this time.</p>
      <p>Don't worry! There are many other projects available. Keep applying and building your portfolio.</p>
      <p><a href="${data.dashboardUrl}">Browse More Projects</a></p>
    `,
  }),

  payment_released: (data) => ({
    subject: `Payment Released for "${data.projectTitle}"`,
    body: `
      <h2>Payment Released</h2>
      <p>The client has approved your work and released the payment for <strong>${data.projectTitle}</strong>.</p>
      <p><strong>Amount:</strong> $${data.amount}</p>
      <p>The funds should appear in your account within 1-2 business days.</p>
      <p><a href="${data.projectUrl}">View Project</a></p>
    `,
  }),

  dispute_filed: (data) => ({
    subject: `Dispute Filed for "${data.projectTitle}"`,
    body: `
      <h2>Dispute Notification</h2>
      <p>A dispute has been filed for <strong>${data.projectTitle}</strong>.</p>
      <p><strong>Reason:</strong> ${data.reason}</p>
      <p>Our team will review the dispute and contact both parties with a resolution.</p>
      <p><a href="${data.projectUrl}">View Dispute Details</a></p>
    `,
  }),

  project_milestone: (data) => ({
    subject: `Milestone Update: "${data.milestoneName}"`,
    body: `
      <h2>Milestone Update</h2>
      <p>There's an update on milestone <strong>${data.milestoneName}</strong> for project <strong>${data.projectTitle}</strong>.</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><a href="${data.projectUrl}">View Project</a></p>
    `,
  }),

  project_completed: (data) => ({
    subject: `Project Completed: "${data.projectTitle}"`,
    body: `
      <h2>Project Completed</h2>
      <p>The project <strong>${data.projectTitle}</strong> has been completed successfully!</p>
      <p>Thank you for using Trustlance. We hope to work with you again soon.</p>
      <p><a href="${data.projectUrl}">View Project</a></p>
    `,
  }),
};

/**
 * Send email notification
 * Currently logs to console and notifies owner
 * In production, integrate with email service (SendGrid, AWS SES, etc.)
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const template = emailTemplates[params.type];
    if (!template) {
      console.error("[Email] Unknown email type:", params.type);
      return false;
    }

    const { subject, body } = template(params.data);

    // Log email for development
    console.log(`[Email] Sending ${params.type} to ${params.to}`);
    console.log(`[Email] Subject: ${subject}`);

    // In production, send via email service
    // Example: await sendgrid.send({ to: params.to, subject, html: body });

    // Notify owner of important events
    if (["payment_released", "dispute_filed"].includes(params.type)) {
      await notifyOwner({
        title: `Trustlance: ${subject}`,
        content: `Email sent to ${params.to}`,
      });
    }

    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

/**
 * Send application notification to client
 */
export async function notifyApplicationSubmitted(
  clientEmail: string,
  projectTitle: string,
  freelancerName: string,
  coverLetter: string,
  proposedBudget: string | null,
  projectUrl: string
) {
  return sendEmail({
    to: clientEmail,
    type: "application_submitted",
    data: {
      projectTitle,
      freelancerName,
      coverLetter,
      proposedBudget,
      projectUrl,
    },
  });
}

/**
 * Send acceptance notification to freelancer
 */
export async function notifyApplicationAccepted(
  freelancerEmail: string,
  projectTitle: string,
  projectUrl: string
) {
  return sendEmail({
    to: freelancerEmail,
    type: "application_accepted",
    data: {
      projectTitle,
      projectUrl,
    },
  });
}

/**
 * Send rejection notification to freelancer
 */
export async function notifyApplicationRejected(
  freelancerEmail: string,
  projectTitle: string,
  dashboardUrl: string
) {
  return sendEmail({
    to: freelancerEmail,
    type: "application_rejected",
    data: {
      projectTitle,
      dashboardUrl,
    },
  });
}

/**
 * Send payment released notification to freelancer
 */
export async function notifyPaymentReleased(
  freelancerEmail: string,
  projectTitle: string,
  amount: string,
  projectUrl: string
) {
  return sendEmail({
    to: freelancerEmail,
    type: "payment_released",
    data: {
      projectTitle,
      amount,
      projectUrl,
    },
  });
}

/**
 * Send dispute filed notification
 */
export async function notifyDisputeFiled(
  recipientEmail: string,
  projectTitle: string,
  reason: string,
  projectUrl: string
) {
  return sendEmail({
    to: recipientEmail,
    type: "dispute_filed",
    data: {
      projectTitle,
      reason,
      projectUrl,
    },
  });
}
