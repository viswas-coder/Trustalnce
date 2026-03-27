/**
 * Stripe Products Configuration for Trustlance
 * Defines all payment products and their pricing
 */

export const STRIPE_PRODUCTS = {
  // Escrow deposits - one-time payments
  ESCROW_DEPOSIT: {
    name: "Project Escrow Deposit",
    description: "Secure escrow deposit for freelance project",
    type: "one_time" as const,
  },
} as const;

/**
 * Helper to create a checkout session for escrow deposits
 * The amount is passed dynamically based on project budget
 */
export function getEscrowCheckoutConfig(projectId: number, amount: number, clientEmail: string, clientName: string, clientId: number) {
  return {
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: STRIPE_PRODUCTS.ESCROW_DEPOSIT.name,
            description: `${STRIPE_PRODUCTS.ESCROW_DEPOSIT.description} (Project #${projectId})`,
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment" as const,
    customer_email: clientEmail,
    client_reference_id: clientId.toString(),
    metadata: {
      user_id: clientId.toString(),
      customer_email: clientEmail,
      customer_name: clientName,
      project_id: projectId.toString(),
      type: "escrow_deposit",
    },
    allow_promotion_codes: true,
  };
}
