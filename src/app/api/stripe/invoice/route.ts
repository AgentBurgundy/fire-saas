import { NextResponse } from "next/server";
import { getStripeServerSide } from "@/lib/stripe/getStripeServerSide";

export async function POST(req: Request) {
  try {
    const { customerId, amount, dueDate } = await req.json();
    if (!customerId || !amount || !dueDate) {
      return NextResponse.json(
        { error: "Customer ID, amount, and due date are required" },
        { status: 400 }
      );
    }

    const stripe = await getStripeServerSide();

    // Calculate days until due
    const currentDate = new Date();
    const dueDateObject = new Date(dueDate);
    const daysUntilDue = Math.ceil(
      (dueDateObject.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
    );

    // Create a new draft invoice for the customer
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: false,
      collection_method: "send_invoice",
      days_until_due: daysUntilDue,
    });

    // Add an invoice item to the draft invoice
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: Math.round(amount * 100),
      currency: "usd",
      invoice: invoice.id,
      description: "Custom invoice item",
    });

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    // Get the hosted invoice URL
    const hostedInvoiceUrl = finalizedInvoice.hosted_invoice_url;

    return NextResponse.json({ invoiceUrl: hostedInvoiceUrl });
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
