import Stripe from 'stripe';

// Ensure the STRIPE_SECRET_KEY is set
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a new Stripe customer
 * @param email Customer email
 * @param name Optional customer name
 * @returns Stripe Customer
 */
export async function createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    name
  });
}

/**
 * Creates a subscription for a customer
 * @param customerId Stripe customer ID
 * @returns Object containing the subscription and payment intent
 */
export async function createSubscription(customerId: string): Promise<{subscription: Stripe.Subscription, paymentIntent: Stripe.PaymentIntent}> {
  // First, create a product if it doesn't exist
  const product = await stripe.products.create({
    name: 'Melbourne Schools Premium Subscription',
    description: 'Monthly subscription for premium access to Melbourne Schools information',
  });
  
  // Then create a price for the product
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 699, // $6.99
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
  });
  
  // Create a PaymentIntent first
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 699, // $6.99
    currency: 'usd',
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  // Now create the subscription using the price ID
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: price.id,
      },
    ],
  });
  
  // Return both the subscription and payment intent as separate objects
  return {
    subscription,
    paymentIntent
  };
}

/**
 * Creates a payment intent for a one-time payment
 * @param amount Amount in cents
 * @param customerId Optional customer ID to associate with the payment
 * @param options Additional Stripe PaymentIntent options
 * @returns Stripe PaymentIntent
 */
export async function createPaymentIntent(
  amount: number, 
  customerId?: string, 
  options?: Partial<Stripe.PaymentIntentCreateParams>
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
    ...options
  });
  
  return paymentIntent;
}

/**
 * Retrieves a subscription by ID
 * @param subscriptionId Stripe subscription ID
 * @returns Stripe Subscription
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancels a subscription
 * @param subscriptionId Stripe subscription ID
 * @returns Stripe Subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Creates a portal session for managing subscriptions
 * @param customerId Stripe customer ID
 * @param returnUrl URL to return to after managing subscription
 * @returns Stripe billing portal session
 */
export async function createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}