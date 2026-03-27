/**
 * LLM-Powered Dispute Resolution Service
 * Uses Claude to analyze disputes and suggest fair resolutions
 */

import { invokeLLM } from "../_core/llm";
import { getDisputeByProjectId, getProjectById, getMessagesByProjectId, getUserById } from "../db";

interface DisputeAnalysis {
  summary: string;
  keyIssues: string[];
  suggestedResolution: string;
  fairnessScore: number; // 0-100, where 50 is neutral
  recommendedAction: "full_refund" | "partial_refund" | "full_payment" | "split_payment" | "mediation";
}

/**
 * Analyze a dispute using LLM and suggest resolution
 */
export async function analyzeDispute(projectId: number): Promise<DisputeAnalysis | null> {
  try {
    const dispute = await getDisputeByProjectId(projectId);
    if (!dispute) {
      console.log("[LLM] No dispute found for project:", projectId);
      return null;
    }

    const project = await getProjectById(projectId);
    if (!project) {
      console.log("[LLM] Project not found:", projectId);
      return null;
    }

    const client = await getUserById(project.clientId);
    const freelancer = project.selectedFreelancerId ? await getUserById(project.selectedFreelancerId) : null;
    const messages = await getMessagesByProjectId(projectId);

    // Build context for LLM
    const context = `
Project: ${project.title}
Budget: $${project.budget}
Status: ${project.status}

Dispute Filed By: ${dispute.filedBy === project.clientId ? "Client" : "Freelancer"}
Reason: ${dispute.reason}
Evidence: ${dispute.evidence || "None provided"}

Project Description: ${project.description}
Deadline: ${new Date(project.deadline).toLocaleDateString()}

Communication History:
${messages.map(m => `- ${new Date(m.createdAt).toLocaleString()}: ${m.content}`).join("\n")}
    `;

    const prompt = `You are a fair and impartial dispute resolution expert for a freelancing platform. Analyze the following dispute and provide a resolution recommendation.

${context}

Please provide:
1. A brief summary of the dispute
2. Key issues identified
3. A suggested fair resolution
4. A fairness score (0-100, where 50 is neutral between client and freelancer)
5. A recommended action (full_refund, partial_refund, full_payment, split_payment, or mediation)

Format your response as JSON with these exact fields:
{
  "summary": "...",
  "keyIssues": ["...", "..."],
  "suggestedResolution": "...",
  "fairnessScore": 50,
  "recommendedAction": "mediation"
}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a fair and impartial dispute resolution expert. Always provide balanced, fair recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      console.error("[LLM] No response from LLM");
      return null;
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[LLM] Could not parse JSON from response:", content);
      return null;
    }

    const analysis = JSON.parse(jsonMatch[0]) as DisputeAnalysis;
    console.log("[LLM] Dispute analysis completed:", analysis);

    return analysis;
  } catch (error) {
    console.error("[LLM] Error analyzing dispute:", error);
    return null;
  }
}

/**
 * Generate mediation summary for dispute resolution
 */
export async function generateMediationSummary(
  projectId: number,
  analysis: DisputeAnalysis
): Promise<string> {
  try {
    const project = await getProjectById(projectId);
    if (!project) return "";

    const prompt = `Based on this dispute analysis for project "${project.title}":

Summary: ${analysis.summary}
Key Issues: ${analysis.keyIssues.join(", ")}
Suggested Resolution: ${analysis.suggestedResolution}
Fairness Score: ${analysis.fairnessScore}/100
Recommended Action: ${analysis.recommendedAction}

Generate a professional mediation summary that:
1. Acknowledges both parties' concerns
2. Explains the recommended resolution
3. Is fair and impartial
4. Encourages acceptance of the resolution

Keep it concise (2-3 paragraphs).`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a professional mediator writing a dispute resolution summary.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const summary = typeof content === "string" ? content : "";
    console.log("[LLM] Mediation summary generated");

    return summary;
  } catch (error) {
    console.error("[LLM] Error generating mediation summary:", error);
    return "";
  }
}

/**
 * Determine payment distribution based on dispute resolution
 */
export function calculatePaymentDistribution(
  totalAmount: number,
  recommendedAction: DisputeAnalysis["recommendedAction"],
  fairnessScore: number
): { clientRefund: number; freelancerPayment: number } {
  switch (recommendedAction) {
    case "full_refund":
      return { clientRefund: totalAmount, freelancerPayment: 0 };

    case "full_payment":
      return { clientRefund: 0, freelancerPayment: totalAmount };

    case "split_payment":
      // Split based on fairness score (50 = equal split)
      const freelancerPercentage = fairnessScore / 100;
      return {
        clientRefund: totalAmount * (1 - freelancerPercentage),
        freelancerPayment: totalAmount * freelancerPercentage,
      };

    case "partial_refund":
      // 70% to freelancer, 30% refund to client
      return {
        clientRefund: totalAmount * 0.3,
        freelancerPayment: totalAmount * 0.7,
      };

    case "mediation":
    default:
      // Default to equal split pending mediation
      return {
        clientRefund: totalAmount * 0.5,
        freelancerPayment: totalAmount * 0.5,
      };
  }
}
