import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory / persistent mock store for standalone production server
let standaloneOrders: any[] = [];
let standaloneEmails: any[] = [];

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'Malpani Sargam Super Mart',
    mode: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// 2. Razorpay Order Creation
app.post('/api/payments/razorpay/order', (req: Request, res: Response) => {
  const { amount, currency = 'INR', receipt } = req.body;
  if (!amount) {
    return res.status(400).json({ error: 'Missing order amount' });
  }

  // Simulated Razorpay Order ID for test mode
  const orderId = `order_SGM_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  res.json({
    id: orderId,
    entity: 'order',
    amount,
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    status: 'created',
  });
});

// 3. Razorpay Signature Verification
app.post('/api/payments/razorpay/verify', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ verified: false, message: 'Missing signature parameters' });
  }

  // In test mode: verify signature prefix
  const isValid = razorpay_signature.startsWith('sig_');
  res.json({
    verified: isValid,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });
});

// 4. Transactional Email API (Resend / SMTP Outbox)
app.post('/api/emails/send', (req: Request, res: Response) => {
  const { recipientEmail, subject, htmlContent, orderNumber, eventType } = req.body;
  if (!recipientEmail || !subject) {
    return res.status(400).json({ error: 'Missing email recipient or subject' });
  }

  const emailRecord = {
    id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    recipientEmail,
    subject,
    orderNumber,
    eventType,
    status: 'sent',
    sentAt: new Date().toISOString(),
  };

  standaloneEmails.unshift(emailRecord);
  res.json({ success: true, email: emailRecord });
});

// Serve Vite static assets when built in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Start listening if not running via Vite dev middleware
if (process.env.NODE_ENV === 'production') {
  app.listen(PORT, () => {
    console.log(`Malpani Sargam Super Mart server running on port ${PORT}`);
  });
}

export default app;
