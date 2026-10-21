import { Order, EmailOutboxItem } from '../types';

export function generateEmailHtml(order: Order, eventType: EmailOutboxItem['eventType']): { subject: string; html: string } {
  const brandRed = '#C92520';
  const brandBurgundy = '#641E24';
  const brandCharcoal = '#272321';
  const brandIvory = '#FFF9F4';
  const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const logoUrl = 'https://sargammart.com/images/logo.png'; // Fallback or official asset reference
  const trackingUrl = `${window.location.origin}/orders/${order.orderNumber}?token=${order.secureAccessToken}`;

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #E5E7EB;">
      <td style="padding: 12px 8px; font-size: 14px; color: ${brandCharcoal}; font-weight: 500;">
        ${item.name}
        <div style="font-size: 12px; color: #6D6661;">Pack: ${item.packSize} · Brand: ${item.brand}</div>
      </td>
      <td style="padding: 12px 8px; font-size: 14px; text-align: center; color: ${brandCharcoal};">
        ${item.quantity}
      </td>
      <td style="padding: 12px 8px; font-size: 14px; text-align: right; color: ${brandCharcoal};">
        ₹${item.unitPrice}
      </td>
      <td style="padding: 12px 8px; font-size: 14px; text-align: right; font-weight: 600; color: ${brandCharcoal};">
        ₹${item.total}
      </td>
    </tr>
  `
    )
    .join('');

  let subject = '';
  let eventHeadline = '';
  let eventMessage = '';
  let paymentNoticeHtml = '';

  const amountReceived = order.paymentStatus === 'verified' ? order.grandTotal : 0;
  const amountOutstanding = order.paymentStatus === 'verified' ? 0 : order.grandTotal;

  switch (eventType) {
    case 'order_received':
      subject = `Order Received — Sargam Mart #${order.orderNumber}`;
      eventHeadline = `We've Received Your Order!`;
      eventMessage = `Thank you for shopping with Malpani Sargam Super Mart. Your order has been registered in our system and is being processed by our store team.`;
      if (order.paymentStatus === 'pending') {
        paymentNoticeHtml = `
          <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 6px; padding: 12px; margin: 16px 0; color: #92400E; font-size: 13px;">
            <strong>Payment Status:</strong> Payment pending — no online payment has been confirmed yet. If you opted for Pay on Delivery, please keep ₹${order.grandTotal} ready at delivery.
          </div>
        `;
      }
      break;

    case 'payment_confirmed':
      subject = `Payment Confirmed — Sargam Mart #${order.orderNumber}`;
      eventHeadline = `Payment Verified Successfully`;
      eventMessage = `Your payment of <strong>₹${order.grandTotal}</strong> for order #${order.orderNumber} has been securely verified via Razorpay.`;
      paymentNoticeHtml = `
        <div style="background-color: #ECFDF5; border: 1px solid #10B981; border-radius: 6px; padding: 12px; margin: 16px 0; color: #065F46; font-size: 13px;">
          <strong>Payment Verified:</strong> Razorpay Ref: ${order.razorpayPaymentId || 'RP-TEST-AUTH'}<br/>
          Amount Paid: ₹${order.grandTotal} · Amount Outstanding: ₹0.00
        </div>
      `;
      break;

    case 'order_confirmed':
      subject = `Order Confirmed by Store — Sargam Mart #${order.orderNumber}`;
      eventHeadline = `Order Confirmed by ${order.branchName}`;
      eventMessage = `Great news! Authorized staff at our <strong>${order.branchName}</strong> have accepted and verified your order basket. We are now picking and packing your items.`;
      break;

    case 'order_packed':
      subject = `Order Packed & Ready — Sargam Mart #${order.orderNumber}`;
      if (order.fulfillmentType === 'pickup') {
        eventHeadline = `Your Order is Ready for Store Pickup`;
        eventMessage = `Your grocery package has been neatly packed and placed at the customer pickup desk at <strong>${order.branchName}</strong>. You may pick it up at your convenience during branch hours.`;
      } else {
        eventHeadline = `Order Packed & Awaiting Dispatch`;
        eventMessage = `Your order items have passed quality inspection, have been safely sanitized and packaged, and are awaiting driver dispatch.`;
      }
      break;

    case 'out_for_delivery':
      subject = `Out for Delivery — Sargam Mart #${order.orderNumber}`;
      eventHeadline = `Your Sargam Mart Order is on the Way!`;
      eventMessage = `Our dedicated delivery executive has departed from ${order.branchName} and is en route to your specified address.`;
      break;

    case 'order_completed':
      subject = `Order Completed — Sargam Mart #${order.orderNumber}`;
      eventHeadline = `Order Successfully Delivered`;
      eventMessage = `Your order #${order.orderNumber} has been successfully completed. Thank you for choosing Malpani Sargam Super Mart for your daily family needs!`;
      break;

    case 'order_cancelled':
      subject = `Order Cancelled — Sargam Mart #${order.orderNumber}`;
      eventHeadline = `Order Cancellation Notice`;
      eventMessage = `Your order #${order.orderNumber} has been cancelled. If any online payment was collected, an automatic refund has been initiated to your source payment method (typically credited within 3-5 business days).`;
      break;
  }

  const fulfillmentDetailsHtml =
    order.fulfillmentType === 'delivery'
      ? `
      <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 20px;">
        <h4 style="margin: 0 0 8px 0; color: ${brandBurgundy}; font-size: 14px;">Delivery Address</h4>
        <p style="margin: 0; font-size: 13px; color: ${brandCharcoal}; line-height: 1.5;">
          ${order.deliveryAddress?.street}, ${order.deliveryAddress?.area}<br/>
          ${order.deliveryAddress?.landmark ? `Landmark: ${order.deliveryAddress.landmark}<br/>` : ''}
          ${order.deliveryAddress?.city} – ${order.deliveryAddress?.pincode}<br/>
          <strong>Phone:</strong> ${order.customerPhone}
        </p>
        ${order.deliveryInstructions ? `<div style="font-size: 12px; color: #6D6661; margin-top: 6px;"><em>Instructions: ${order.deliveryInstructions}</em></div>` : ''}
      </div>
    `
      : `
      <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 20px;">
        <h4 style="margin: 0 0 8px 0; color: ${brandBurgundy}; font-size: 14px;">Store Self-Pickup Details</h4>
        <p style="margin: 0; font-size: 13px; color: ${brandCharcoal}; line-height: 1.5;">
          <strong>Pickup Counter:</strong> ${order.branchName}<br/>
          Please present this email or Order #${order.orderNumber} at the billing desk.
        </p>
      </div>
    `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${brandIvory}; margin: 0; padding: 24px 12px; color: ${brandCharcoal};">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <tr>
          <td style="background-color: ${brandRed}; padding: 24px; text-align: center;">
            <div style="color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
              MALPANI SARGAM SUPER MART
            </div>
            <div style="color: #FEE2E2; font-size: 12px; margin-top: 4px; letter-spacing: 0.5px;">
              Everything Your Family Needs · All in One Place
            </div>
          </td>
        </tr>

        <!-- Body Content -->
        <tr>
          <td style="padding: 28px 24px;">
            <h2 style="margin: 0 0 12px 0; font-size: 20px; color: ${brandBurgundy}; font-weight: 700;">
              ${eventHeadline}
            </h2>
            <p style="font-size: 14px; color: #4B5563; line-height: 1.6; margin: 0 0 16px 0;">
              Hello <strong>${order.customerName}</strong>,<br/>
              ${eventMessage}
            </p>

            ${paymentNoticeHtml}

            <!-- Key Order Details Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 12px 16px; font-size: 13px; color: #64748B;">Order Number:</td>
                <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; text-align: right; color: ${brandRed}; font-family: monospace;">#${order.orderNumber}</td>
              </tr>
              <tr style="border-top: 1px solid #E2E8F0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748B;">Date & Time:</td>
                <td style="padding: 12px 16px; font-size: 13px; text-align: right; color: ${brandCharcoal};">${formattedDate}</td>
              </tr>
              <tr style="border-top: 1px solid #E2E8F0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748B;">Assigned Store Branch:</td>
                <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; text-align: right; color: ${brandCharcoal};">${order.branchName}</td>
              </tr>
              <tr style="border-top: 1px solid #E2E8F0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748B;">Fulfillment Method:</td>
                <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; text-align: right; color: ${brandCharcoal}; text-transform: capitalize;">${order.fulfillmentType}</td>
              </tr>
              <tr style="border-top: 1px solid #E2E8F0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748B;">Payment Method & Status:</td>
                <td style="padding: 12px 16px; font-size: 13px; text-align: right; color: ${brandCharcoal}; font-weight: 600;">
                  ${order.paymentMethod === 'razorpay' ? 'Razorpay Online' : 'Pay on Delivery'} · <span style="text-transform: capitalize;">${order.paymentStatus}</span>
                </td>
              </tr>
            </table>

            <!-- Fulfillment Details -->
            ${fulfillmentDetailsHtml}

            <!-- Items Table -->
            <h3 style="font-size: 15px; margin: 24px 0 12px 0; color: ${brandBurgundy}; border-bottom: 2px solid ${brandRed}; padding-bottom: 6px;">
              Items in Your Basket (${order.itemCount})
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #F1E8E0; text-align: left;">
                  <th style="padding: 8px; font-size: 12px; font-weight: 700; color: ${brandCharcoal};">Item</th>
                  <th style="padding: 8px; font-size: 12px; font-weight: 700; color: ${brandCharcoal}; text-align: center;">Qty</th>
                  <th style="padding: 8px; font-size: 12px; font-weight: 700; color: ${brandCharcoal}; text-align: right;">Price</th>
                  <th style="padding: 8px; font-size: 12px; font-weight: 700; color: ${brandCharcoal}; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Price Breakdown -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-top: 1px solid #E5E7EB; padding-top: 12px;">
              <tr>
                <td style="padding: 4px 8px; font-size: 13px; color: #6B7280;">Subtotal:</td>
                <td style="padding: 4px 8px; font-size: 13px; text-align: right; color: ${brandCharcoal};">₹${order.subtotal}</td>
              </tr>
              ${
                order.discountTotal > 0
                  ? `<tr>
                  <td style="padding: 4px 8px; font-size: 13px; color: #16A34A;">Promotional Savings:</td>
                  <td style="padding: 4px 8px; font-size: 13px; text-align: right; color: #16A34A; font-weight: 600;">-₹${order.discountTotal}</td>
                </tr>`
                  : ''
              }
              <tr>
                <td style="padding: 4px 8px; font-size: 13px; color: #6B7280;">Delivery Charge:</td>
                <td style="padding: 4px 8px; font-size: 13px; text-align: right; color: ${brandCharcoal};">${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</td>
              </tr>
              <tr style="border-top: 1px dashed #D1D5DB;">
                <td style="padding: 10px 8px; font-size: 16px; font-weight: 700; color: ${brandCharcoal};">Grand Total:</td>
                <td style="padding: 10px 8px; font-size: 18px; font-weight: 800; text-align: right; color: ${brandRed};">₹${order.grandTotal}</td>
              </tr>
              <tr>
                <td style="padding: 4px 8px; font-size: 12px; color: #6B7280;">Amount Received:</td>
                <td style="padding: 4px 8px; font-size: 12px; text-align: right; color: #16A34A; font-weight: 600;">₹${amountReceived}</td>
              </tr>
              <tr>
                <td style="padding: 4px 8px; font-size: 12px; color: #6B7280;">Amount Outstanding:</td>
                <td style="padding: 4px 8px; font-size: 12px; text-align: right; color: ${amountOutstanding > 0 ? '#DC2626' : '#6B7280'}; font-weight: 600;">₹${amountOutstanding}</td>
              </tr>
            </table>

            <!-- CTA Track Button -->
            <div style="text-align: center; margin: 32px 0 16px 0;">
              <a href="${trackingUrl}" style="background-color: ${brandRed}; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
                Track Live Order Status →
              </a>
            </div>
            
            <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 16px;">
              Can't click the button? Copy and paste this link in your browser:<br/>
              <span style="color: #6B7280; word-break: break-all;">${trackingUrl}</span>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px; text-align: center; font-size: 12px; color: #64748B; line-height: 1.5;">
            <strong>Malpani Sargam Super Mart</strong><br/>
            Customer Support: +91 2425 225 500 · orders@sargammart.com<br/>
            Malpani Estate, Sangamner-Pune Road, Sangamner, Maharashtra 422605<br/>
            <em>Part of the Malpani Group · Quality, Integrity & Family Trust Since 1894</em>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { subject, html };
}
