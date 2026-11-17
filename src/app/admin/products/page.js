import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Package, Plus, Trash2, Edit3, ArrowLeft } from "lucide-react";

export default async function AdminProductsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-2">
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <h1 className="text-4xl font-serif italic text-neutral-900">Dress Catalog & Stock Management</h1>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary inline-flex items-center gap-2">
          <Plus size={18} /> Add New Dress
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Dress</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / Discount</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {products.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= 5;
                return (
                  <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl">
                        👗
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">{p.name}</p>
                        <p className="text-xs text-neutral-400">Added {new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">${p.price.toFixed(2)}</span>
                      {p.discount > 0 && <span className="ml-2 text-xs text-emerald-600 font-semibold">(-{p.discount}%)</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${
                          isOutOfStock ? "bg-red-50 text-red-700" : isLowStock ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {isOutOfStock ? "Stock Out" : isLowStock ? `Low Stock (${p.stock})` : `${p.stock} in stock`}
                        </span>
                        <span className="text-[10px] text-neutral-400">Limit: {p.stockLimit}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/products/${p.id}/edit`} className="btn btn-ghost px-3 py-1.5 text-xs inline-flex items-center gap-1">
                        <Edit3 size={14} /> Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}