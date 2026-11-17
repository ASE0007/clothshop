import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default async function AdminOrdersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-2">
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <h1 className="text-4xl font-serif italic text-neutral-900">Buying Reports & Orders</h1>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="card p-12 text-center text-neutral-500">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg">No orders placed yet.</p>
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-100 gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900">Order #{o.id} — {o.customer}</h3>
                  <p className="text-sm text-neutral-500">{o.email} • {o.phone} • {o.address}, {o.city}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase">
                    {o.status}
                  </span>
                  <span className="text-xl font-bold text-neutral-900">${o.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Ordered Items</h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {o.items.map((item) => (
                    <div key={item.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-neutral-900">{item.name}</p>
                        <p className="text-xs text-neutral-500">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                      </div>
                      <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-400 flex justify-between">
                <span>Placed on {new Date(o.createdAt).toLocaleString()}</span>
                <span>ID: {o.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}