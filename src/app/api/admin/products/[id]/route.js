import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = Number(params.id);
    const { name, price, discount, category, image, stock, stockLimit, status } = await req.json();
    const p = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price: Number(price) }),
        ...(discount !== undefined && { discount: Number(discount) || 0 }),
        ...(category !== undefined && { category }),
        ...(image !== undefined && { image }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(stockLimit !== undefined && { stockLimit: Number(stockLimit) || 0 }),
        ...(status !== undefined && { status }),
      },
    });
    return NextResponse.json(p);
  } catch (e) {
    console.error("Update product error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = Number(params.id);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Delete product error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}