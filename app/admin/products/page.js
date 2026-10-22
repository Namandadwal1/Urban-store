
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Package, ImagePlus } from "lucide-react";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { createClient } from "@/lib///supabase/client";

const supabase = createClient();
const categories = ["Shirts", "T-Shirts", "Trousers", "Jackets"];
const emptyProduct = {
  name: "", category: "Shirts", price: "", stock: "",
  status: "Active", image_url: "", image_urls: [],
};

const inputStyle = "w-full rounded-lg border border-[#E9DFD4] px-3 py-2.5 text-sm outline-none focus:border-[#A56A43]";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products").select("*").order("id", { ascending: false });

    if (error) setError(error.message);
    else setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || p.category === category)
  );

  function clearPreviews() {
    previews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });
  }

  function closeForm() {
    clearPreviews();
    setShowForm(false);
    setSelectedImages([]);
    setPreviews([]);
    setError("");
  }

  function openAddForm() {
    closeForm();
    setForm({ ...emptyProduct });
    setEditingId(null);
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(product) {
    closeForm();
    const images = product.image_urls?.length
      ? product.image_urls
      : product.image_url ? [product.image_url] : [];

    setForm({
      ...emptyProduct,
      ...product,
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      image_url: images[0] || "",
      image_urls: images,
    });
    setPreviews(images);
    setEditingId(product.id);
    setMessage("");
    setShowForm(true);
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files || []);

    if (files.length > 3) {
      setError("Select a maximum of 3 images.");
    } else if (files.some((f) => !f.type.startsWith("image/"))) {
      setError("Select image files only.");
    } else if (files.some((f) => f.size > 5 * 1024 * 1024)) {
      setError("Each image must be under 5 MB.");
    } else {
      clearPreviews();
      setSelectedImages(files);
      setPreviews(files.map((f) => URL.createObjectURL(f)));
      setError("");
    }

    e.target.value = "";
  }

  async function uploadImages() {
    if (!selectedImages.length) {
      return form.image_urls?.length
        ? form.image_urls
        : form.image_url ? [form.image_url] : [];
    }

    const urls = [];

    for (const file of selectedImages) {
      const path = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

      const { error } = await supabase.storage
        .from("Image").upload(path, file);

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from("Image").getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !form.name.trim() || form.price === "" || form.stock === "" ||
      !Number.isFinite(Number(form.price)) ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.price) < 0 || Number(form.stock) < 0
    ) {
      setError("Enter a valid name, price and whole-number stock.");
      return;
    }

    setSaving(true);

    try {
      const images = await uploadImages();
      const product = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        status: Number(form.stock) === 0 ? "Out of stock" : form.status,
        image_url: images[0] || null,
        image_urls: images,
      };

      const result = editingId !== null
        ? await supabase.from("products").update(product).eq("id", editingId).select()
        : await supabase.from("products").insert([product]).select();

      if (result.error) throw new Error(result.error.message);
      if (!result.data?.length) {
        throw new Error("No product returned. Check your Supabase RLS policies.");
      }

      closeForm();
      setForm({ ...emptyProduct });
      setEditingId(null);
      setMessage(editingId !== null ? "Product updated successfully." : "Product added successfully.");
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setError("");
    setMessage("");

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setProducts((items) => items.filter((p) => p.id !== id));
    setMessage("Product deleted successfully.");
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#29231F]">
      <AdminSidebar />

      <main className="ml-64 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px] space-y-7">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm text-[#A56A43]">Admin / Products</p>
              <h1 className="text-3xl font-semibold">Products</h1>
              <p className="mt-2 text-sm text-gray-500">Manage your clothing collection and inventory.</p>
            </div>
            <button onClick={openAddForm} className="flex items-center justify-center gap-2 rounded-lg bg-[#A56A43] px-5 py-3 text-sm text-white hover:bg-[#875334]">
              <Plus size={18} /> Add Product
            </button>
          </header>

          {message && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
          {error && !showForm && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <section className="grid gap-4 sm:grid-cols-3">
            {[
              ["Total Products", products.length],
              ["In Stock", products.filter((p) => Number(p.stock) > 0).length],
              ["Out of Stock", products.filter((p) => Number(p.stock) === 0).length],
            ].map(([title, value]) => (
              <div key={title} className="rounded-xl border border-[#E9DFD4] bg-white p-5">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="mt-3 text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-[#E9DFD4] bg-white p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className={`${inputStyle} pl-10`} />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputStyle + " sm:w-48"}>
              <option value="All">All Categories</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </section>

          <section className="overflow-hidden rounded-xl border border-[#E9DFD4] bg-white">
            <div className="border-b border-[#E9DFD4] px-5 py-4">
              <h2 className="font-semibold">All Products</h2>
              <p className="mt-1 text-sm text-gray-500">{filtered.length} products found</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-[#FAF7F2] text-xs uppercase text-gray-500">
                  <tr>{["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-[#E9DFD4]">
                  {loading ? (
                    <tr><td colSpan={6} className="p-10 text-center">Loading products...</td></tr>
                  ) : filtered.length ? filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {p.image_url ? <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded-lg object-cover" /> : <Package className="text-[#A56A43]" />}
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">{p.category}</td>
                      <td className="px-5 py-4">₹{Number(p.price).toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4">{p.stock}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs ${Number(p.stock) === 0 ? "bg-red-50 text-red-700" : p.status === "Draft" ? "bg-gray-100 text-gray-700" : "bg-green-50 text-green-700"}`}>
                          {Number(p.stock) === 0 ? "Out of stock" : p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditForm(p)} aria-label="Edit product" className="rounded-lg border p-2 text-[#A56A43]"><Pencil size={16} /></button>
                          <button onClick={() => deleteProduct(p.id)} aria-label="Delete product" className="rounded-lg border p-2 text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="p-10 text-center text-gray-500">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{editingId !== null ? "Edit Product" : "Add New Product"}</h2>
                <p className="mt-1 text-sm text-gray-500">Add product details and up to 3 images.</p>
              </div>
              <button onClick={closeForm} aria-label="Close form"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium">
                Product Name
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Classic Linen Shirt" className={inputStyle + " mt-1.5"} />
              </label>

              <label className="block text-sm font-medium">
                Category
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputStyle + " mt-1.5"}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-medium">Price (₹)
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputStyle + " mt-1.5"} />
                </label>
                <label className="text-sm font-medium">Stock Quantity
                  <input required type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputStyle + " mt-1.5"} />
                </label>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Product Images (up to 3)</p>
                <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#E9DFD4] bg-[#FAF7F2] p-5 text-center">
                  <ImagePlus size={26} className="mb-2 text-[#A56A43]" />
                  <span className="text-sm">Click to select images</span>
                  <span className="mt-1 text-xs text-gray-500">Maximum 5 MB per image</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>

                {previews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {previews.map((url, i) => (
                      <div key={`${url}-${i}`} className="relative">
                        <img src={url} alt={`Product ${i + 1}`} className="h-24 w-full rounded-lg object-cover" />
                        {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-black/70 px-2 py-1 text-xs text-white">Main image</span>}
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">Selecting new images replaces the existing gallery. Leave unchanged to keep current images.</p>
              </div>

              <label className="block text-sm font-medium">Status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputStyle + " mt-1.5"}>
                  <option>Active</option>
                  <option>Draft</option>
                </select>
              </label>

              {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={closeForm} disabled={saving} className="rounded-lg border px-4 py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-[#A56A43] px-5 py-2.5 text-sm text-white disabled:opacity-60">
                  {saving ? "Saving..." : editingId !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
