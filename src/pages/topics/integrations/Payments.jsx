import { Styled } from "./styled";

const Payments = () => {
    return (
        <Styled.Page>
            <Styled.Title>Payments (External Integrations)</Styled.Title>

            <Styled.Lead>
                Web payments connect your app to a <b>Payment Service Provider (PSP)</b> like Stripe, Razorpay, or PayPal.
                React handles the UI and calls your backend; the backend talks to the PSP securely. The golden rule:
                <b> never put secret keys in the frontend</b>.
            </Styled.Lead>

            {/* 1) What is a payment? */}
            <Styled.Section>
                <Styled.H2>What is a “payment” in web apps?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Payment Intent / Order:</b> a record that says “we plan to charge X amount in Y currency”.
                        It tracks status like <i>requires_action</i>, <i>succeeded</i>, or <i>failed</i>.
                    </li>
                    <li>
                        <b>Payment Method:</b> how the customer pays — card, UPI, netbanking, wallet, etc. A PSP standardizes these.
                    </li>
                    <li>
                        <b>Capture:</b> actually taking the money (some flows <i>authorize</i> first, then <i>capture</i> later).
                    </li>
                    <li>
                        <b>Refund/Void:</b> returning funds. Void cancels an uncaptured authorization; refund returns captured funds.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core concepts (definitions) */}
            <Styled.Section>
                <Styled.H2>Core concepts & definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>PSP (Payment Service Provider):</b> a platform that processes payments and abstracts banks/card networks.
                    </li>
                    <li>
                        <b>Tokenization:</b> sensitive card/UPI details are exchanged for a temporary <i>token</i>. Your app uses the token,
                        not raw card numbers.
                    </li>
                    <li>
                        <b>PCI DSS:</b> security standard for handling card data. Using PSP SDKs + tokenization helps you avoid storing card data yourself.
                    </li>
                    <li>
                        <b>3-D Secure / SCA:</b> extra authentication step (OTP/challenge) to reduce fraud. PSPs handle this in their UIs/SKDs.
                    </li>
                    <li>
                        <b>Idempotency:</b> sending the same request key twice should only charge once. Backends use an <i>Idempotency-Key</i>.
                    </li>
                    <li>
                        <b>Webhook:</b> a secure callback from the PSP to your backend with final truth of payment status.
                    </li>
                    <li>
                        <b>Minor units:</b> store money in the smallest unit (e.g., INR paise, USD cents) as integers to avoid float errors.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Roles: frontend vs backend */}
            <Styled.Section>
                <Styled.H2>Who does what? (Frontend vs Backend)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Frontend (React):</b> gathers amount/currency, collects payment method via PSP's SDK/Elements,
                        displays statuses/errors, and calls your backend endpoints.
                    </li>
                    <li>
                        <b>Backend (Server):</b> holds <i>secret keys</i>, creates <i>payment intents/orders</i>, verifies signatures,
                        listens to <i>webhooks</i>, handles <i>idempotency</i>, and updates your database.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Typical sequence:
// 1) Client -> POST /api/payments/create-intent {amount, currency}
// 2) Server -> PSP: create intent/order; return client_secret/order_id
// 3) Client -> PSP SDK: confirm/authorize with client_secret/order_id
// 4) PSP -> Webhook -> Server: "payment.succeeded" (source of truth)
// 5) Server -> DB: mark order paid; Client polls or receives status`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Amounts & currency */}
            <Styled.Section>
                <Styled.H2>Amounts & currency</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Always calculate on the server</b> to prevent tampering (e.g., price from DB × quantity, plus taxes/shipping).
                    </li>
                    <li>
                        Use <b>minor units</b> (e.g., ₹1.00 = 100 paise) stored as integers; convert to human format for display only.
                    </li>
                    <li>
                        Keep a <b>currency</b> column; PSPs require currency (e.g., <code>INR</code>, <code>USD</code>) for every charge.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example (display vs store):
const pricePaise = 49900; // ₹499.00 stored as 49900
const display = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
  .format(pricePaise / 100); // "₹499.00"`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Minimal React flow (generic) */}
            <Styled.Section>
                <Styled.H2>Minimal React flow (generic)</Styled.H2>
                <Styled.Pre>
                    {`function PayButton({ cartTotalPaise }) {
  const [status, setStatus] = React.useState("idle");
  async function handlePay() {
    setStatus("creating");
    // Create intent/order on your server (never in the client)
    const res = await fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: cartTotalPaise, currency: "INR" }),
    }).then(r => r.json());

    // res: { clientSecret | orderId, provider: "stripe" | "razorpay" | ... }

    setStatus("confirming");
    // Next step depends on provider SDK (see examples below)
  }
  return (
    <button disabled={status !== "idle"} onClick={handlePay}>
      {status === "idle" ? "Pay Now" : "Processing..."}
    </button>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    The client fetches a short-lived token/secret from your backend, then hands control to the provider's SDK.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Example: Stripe (Elements + Payment Intent) */}
            <Styled.Section>
                <Styled.H2>Example: Stripe (Elements & Payment Intents)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Elements:</b> prebuilt UI fields that handle card entry and tokenization securely in the browser.
                    </li>
                    <li>
                        <b>Payment Intent:</b> server-created object that represents the charge attempt and its state.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Client (React) — minimal sketch (pseudocode):
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ amountPaise }) {
  const stripe = useStripe();
  const elements = useElements();
  const [msg, setMsg] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    // 1) Create PaymentIntent on your server
    const { clientSecret } = await fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountPaise, currency: "INR" }),
    }).then(r => r.json());

    // 2) Confirm card payment (handles 3DS if required)
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (result.error) setMsg(result.error.message);
    else if (result.paymentIntent?.status === "succeeded") setMsg("Payment successful!");
  }

  return (
    <form onSubmit={onSubmit}>
      <CardElement />
      <button type="submit">Pay</button>
      <p>{msg}</p>
    </form>
  );
}

export default function StripeCheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amountPaise={49900} />
    </Elements>
  );
}

// Server (sketch):
// POST /api/payments/create-intent {amount, currency}
// -> create PaymentIntent with secret key, return clientSecret
// Use idempotency keys when creating to avoid duplicates`}
                </Styled.Pre>
                <Styled.Small>
                    Stripe handles the challenge step (OTP/3DS) inside <code>confirmCardPayment</code>. The final status
                    should be verified by your backend via a webhook before delivering goods.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Example: Razorpay (Order + Checkout) */}
            <Styled.Section>
                <Styled.H2>Example: Razorpay (Order & Checkout)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Order:</b> server-created object with <code>amount</code>, <code>currency</code>, and <code>order_id</code>.
                    </li>
                    <li>
                        <b>Checkout:</b> Razorpay's UI popup handles card/UPI/wallet and returns a payment signature to verify on the server.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Client (React) — minimal sketch (pseudocode):
function RazorpayButton({ amountPaise }) {
  async function openRzp() {
    // 1) Create Order on server
    const order = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountPaise, currency: "INR" }),
    }).then(r => r.json()); // { id: order_id, amount, currency }

    // 2) Open Checkout
    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "Your Brand",
      handler: function (response) {
        // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        // 3) Verify on server
        fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        }).then(() => alert("Payment verified!"));
      },
      modal: { ondismiss: () => console.log("Checkout closed") },
      prefill: { name: "Test User", email: "test@example.com" }
    });
    rzp.open();
  }

  return <button onClick={openRzp}>Pay with Razorpay</button>;
}

// Server routes (sketch):
// POST /create-order -> Razorpay Orders API (secret key) -> return {id, amount, currency}
// POST /verify -> validate signature using secret -> mark order paid in DB`}
                </Styled.Pre>
                <Styled.Small>
                    UPI and netbanking support are built-in. Always verify the signature server-side and trust webhooks for final status.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Webhooks & source of truth */}
            <Styled.Section>
                <Styled.H2>Webhooks: the source of truth</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Webhook:</b> PSP's POST request to your backend about events (e.g., <i>payment.succeeded</i>).
                    </li>
                    <li>
                        Your server verifies the webhook signature, updates the order status, and triggers fulfillment.
                    </li>
                    <li>
                        The frontend should reflect the server's status; don't ship goods solely on a client-side “success”.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Express pseudo-code:
app.post("/webhooks/psp", verifySignature, async (req, res) => {
  const event = req.body; // payment.succeeded / payment.failed / refund.created ...
  // 1) Find your Order by event.data.reference
  // 2) Update DB status accordingly
  // 3) Trigger email/fulfillment
  res.sendStatus(200);
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Testing, sandbox, and errors */}
            <Styled.Section>
                <Styled.H2>Testing, sandbox, and errors</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Sandbox/Test mode:</b> PSPs provide test keys and test payment methods. Keep test and live keys separate.
                    </li>
                    <li>
                        <b>Retry & idempotency:</b> if network fails while creating intents/orders, retry with the same idempotency key.
                    </li>
                    <li>
                        <b>User feedback:</b> show clear states—<i>processing</i>, <i>action required</i>, <i>failed</i>—and allow retry.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Security & compliance checklist */}
            <Styled.Section>
                <Styled.H2>Security & compliance checklist</Styled.H2>
                <Styled.List>
                    <li>Never expose <b>secret keys</b> in the client or commit them to Git.</li>
                    <li>Validate amounts on the server, not from client input.</li>
                    <li>Use <b>HTTPS</b> everywhere; enable <b>HSTS</b> and secure cookies for sessions.</li>
                    <li>Verify <b>webhook signatures</b> before trusting payloads.</li>
                    <li>Use <b>idempotency keys</b> for create/charge operations to avoid duplicate charges.</li>
                    <li>Store <b>only tokens</b> or PSP IDs; never store raw card PAN/expiry/CVV.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do/Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> calculate prices and discounts on the server.</li>
                    <li><b>Do</b> depend on webhook-confirmed status before fulfillment.</li>
                    <li><b>Do</b> keep currency and minor units consistent in DB.</li>
                    <li><b>Don't</b> charge directly from React using secret keys.</li>
                    <li><b>Don't</b> trust client-side “success” without server verification.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Authorization:</b> hold funds on a card without completing the capture yet.</li>
                    <li><b>Capture:</b> finalize the charge so money moves.</li>
                    <li><b>SCA/3DS:</b> additional customer authentication (OTP/challenge) required by banks/regulations.</li>
                    <li><b>Chargeback:</b> customer disputes a charge with their bank; handle via PSP dashboards/flows.</li>
                    <li><b>Settlement:</b> PSP pays out collected funds to your bank account on a schedule.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: React builds clean payment UIs, but your <b>backend</b> is where secrets live, orders are created,
                webhooks are verified, and truth is stored. Start with a single PSP, keep amounts server-driven, and
                commit to webhook-based fulfillment.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Payments;
