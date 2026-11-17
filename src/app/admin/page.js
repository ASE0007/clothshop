import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, Package, TrendingUp, Users, DollarSign, ArrowRight, Settings } from "lucide-react";

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const [productsCount, ordersCount, products, orders, orderItems] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { items: true } }),
    prisma.orderItem.findMany(),
  ]);

  const totalRevenue = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const totalUnitsSold = orderItems.reduce((s, i) => s + i.qty, 0);
  const uniqueCustomers = new Set(orders.map((o) => o.email)).size;
  const lowStockCount = await prisma.product.count({ where: { stock: { lte: 5 } } });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-neutral-50 min-h-screen text-neutral-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif italic">Velora Admin Dashboard</h1>
          <p className="text-neutral-500 mt-2">Welcome back, {admin.username}. Here is your complete store overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/products/new" className="btn btn-primary inline-flex items-center gap-2">
            <Package size={16} />
            Add New Dress
          </Link>
          <Link href="/admin/orders" className="btn btn-ghost inline-flex items-center gap-2">
            <ShoppingBag size={16} />
            Manage Orders
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="btn btn-ghost text-red-600 border-red-200 hover:bg-red-50">Logout</button>
          </form>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">Selling Report</span>
          </div>
          <p className="text-neutral-500 text-sm font-medium">Total Revenue</p>
          <p className="text-4xl font-serif italic mt-2">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-neutral-400 mt-2">{totalUnitsSold} total units sold</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Users size={24} />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">Engagement</span>
          </div>
          <p className="text-neutral-500 text-sm font-medium">Customer Engage</p>
          <p className="text-4xl font-serif italic mt-2">{uniqueCustomers}</p>
          <p className="text-xs text-neutral-400 mt-2">{ordersCount} total orders placed</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Package size={24} />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">Catalog</span>
          </div>
          <p className="text-neutral-500 text-sm font-medium">Total Products</p>
          <p className="text-4xl font-serif italic mt-2">{productsCount}</p>
          <Link href="/admin/products" className="text-xs text-neutral-900 font-semibold mt-2 inline-block hover:underline">
            Manage catalog →
          </Link>
        </div>

        <div className="card p-6" style={{ borderColor: lowStockCount > 0 ? "rgba(239, 68, 68, 0.3)" : undefined }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-full">Stock Alert</span>
          </div>
          <p className="text-neutral-500 text-sm font-medium">Low Stock / Out</p>
          <p className="text-4xl font-serif italic mt-2 text-red-600">{lowStockCount}</p>
          <p className="text-xs text-red-500 mt-2">Requires restocking</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* Recent Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif italic">Recent Dresses</h2>
            <Link href="/admin/products" className="text-sm font-semibold text-neutral-900 hover:underline">View all →</Link>
          </div>
          <div className="space-y-4">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <div>
                  <h3 className="font-semibold text-neutral-900">{p.name}</h3>
                  <p className="text-xs text-neutral-500">${p.price.toFixed(2)} {p.discount > 0 && <span className="text-emerald-600">(-{p.discount}%)</span>} • Stock: <span className={p.stock === 0 ? "text-red-600 font-bold" : ""}>{p.stock}</span> (Limit: {p.stockLimit})</p>
                </div>
                <Link href={`/admin/products/${p.id}/edit`} className="btn btn-ghost px-3 py-1.5 text-xs">Edit</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders / Buying Report */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif italic">Buying Report (Recent Orders)</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-neutral-900 hover:underline">View all →</Link>
          </div>
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-neutral-900">Order #{o.id} — {o.customer}</span>
                  <span className="font-bold text-neutral-900">${o.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{o.city} • {o.items.length} items • <span className="uppercase font-semibold text-amber-600">{o.status}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}