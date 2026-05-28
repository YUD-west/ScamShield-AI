import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { config } from "@/lib/config";

export async function POST(req: NextRequest) {
  if (!config.stripe.secretKey) {
    return NextResponse.json(
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY in .env" },
      { status: 503 },
    );
  }

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();
  const priceId =
    plan === "enterprise" ? config.stripe.prices.enterprise : config.stripe.prices.pro;

  if (!priceId) {
    return NextResponse.json({ error: "Price ID not configured" }, { status: 503 });
  }

  const stripe = new Stripe(config.stripe.secretKey);

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${config.app.url}/dashboard/settings?success=1`,
    cancel_url: `${config.app.url}/#pricing`,
    metadata: { userId: session.user.id, plan },
  });

  return NextResponse.json({ url: checkout.url });
}
