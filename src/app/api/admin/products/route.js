import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { name, price, discount, category, image, stock, stockLimit, status } = await req.json();
    if (!name || price == null || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const p = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        discount: Number(discount) || 0,
        category,
        image: image || "/images/placeholder.jpg",
        stock: Number(stock) || 0,
        stockLimit: Number(stockLimit) || 0,
        status: status || "active",
      },
    });
    return NextResponse.json(p, { status: 201 });
  } catch (e) {
    console.error("Create product error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}