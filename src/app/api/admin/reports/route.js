import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [products, orders, orderItems] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.orderItem.findMany(),
  ]);

  const totalRevenue = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const avgOrderValue = orders > 0 ? totalRevenue / orders : 0;

  // Top selling products
  const productSales = {};
  for (const item of orderItems) {
    productSales[item.productId] = (productSales[item.productId] || 0) + item.qty;
  }
  const topProducts = await prisma.product.findMany({
    where: { id: { in: Object.keys(productSales).map(Number) } },
  });
  const topSelling = topProducts
    .map((p) => ({ ...p, sold: productSales[p.id] }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10);

  return NextResponse.json({
    totalProducts: products,
    totalOrders: orders,
    totalRevenue,
    avgOrderValue,
    topSelling,
  });
}