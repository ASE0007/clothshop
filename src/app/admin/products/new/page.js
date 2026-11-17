"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Plus, Check } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    price: "",
    discount: "0",
    category: "Tops",
    image: "",
    stock: "20",
    stockLimit: "50",
    status: "active",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setForm((prev) => ({ ...prev, image: json.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create product");
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/admin/products" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to products
      </Link>

      <h1 className="text-4xl font-serif italic text-neutral-900 mb-8">Add New Dress</h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Dress Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="e.g. Velvet Evening Gown"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Price ($)</label>
              <input
                className="input"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                placeholder="79.99"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Discount (%)</label>
              <input
                className="input"
                type="number"
                step="0.1"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {["Tops", "Dresses", "Bottoms", "Outerwear", "Shoes", "Accessories", "Sleepwear"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="out_of_stock">Stock Out</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Current Stock (Stock Renew)</label>
              <input
                className="input"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Stock Limit (Max Capacity)</label>
              <input
                className="input"
                type="number"
                value={form.stockLimit}
                onChange={(e) => setForm({ ...form, stockLimit: e.target.value })}
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Dress Image (Upload or Image URL)</label>
            <div className="flex gap-4 items-center mb-3">
              <label className="btn btn-ghost cursor-pointer inline-flex items-center gap-2">
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload Image File"}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
              <span className="text-xs text-neutral-400">or enter direct URL below</span>
            </div>
            <input
              className="input"
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/images/dress.jpg or https://..."
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={submitting}
            className="btn btn-primary w-full py-4 text-base shadow-lg shadow-neutral-900/20"
          >
            {submitting ? "Creating Dress..." : "Save & Publish Dress"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}