import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { customer, email, phone, address, city, total, items } = await req.json();

    if (!customer || !email || !phone || !address || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = items.map((i) => Number(i.productId));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const p = productMap.get(Number(item.productId));
      if (!p) return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
      if (p.stock < item.qty) return NextResponse.json({ error: `Not enough stock for ${p.name}` }, { status: 400 });
    }

    const computedTotal = items.reduce((s, i) => s + Number(i.price) * i.qty, 0);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customer, email, phone, address, city, total: computedTotal,
          status: "pending",
          items: {
            create: items.map((i) => ({
              productId: Number(i.productId),
              name: i.name,
              price: Number(i.price),
              qty: i.qty,
            })),
          },
        },
      });
      for (const item of items) {
        await tx.product.update({
          where: { id: Number(item.productId) },
          data: { stock: { decrement: item.qty } },
        });
      }
      return created;
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}