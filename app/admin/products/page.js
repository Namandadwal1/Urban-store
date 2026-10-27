
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Package, ImagePlus } from "lucide-react";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/client";

const categories = ["Shirts", "T-Shirts", "Trousers", "Jackets"];

const emptyProduct = {
  name: "",
  category: "Shirts",
  price: "",
  stock: "",
  status: "Active",
  image_url: "",
  image_urls: [],
};

const inputStyle = "w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] px-3.5 py-3 text-xs sm:text-sm text-[#29231F] outline-none transition-all focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]";

export default function ProductsPage() {
  const [supabase] = useState(() => createClient());
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
    setError("");

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Failed to fetch products:", error);
        setError("Unable to load products. Please try again later.");
        return;
      }

      setProducts(data || []);
    } catch (err) {
      console.error("Unexpected error while loading products:", err);
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [supabase]);

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
      : product.image_url
        ? [product.image_url]
        : [];

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
    } else if (files.some((file) => !file.type.startsWith("image/"))) {
      setError("Select image files only.");
    } else if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("Each image must be under 5 MB.");
    } else {
      clearPreviews();
      setSelectedImages(files);
      setPreviews(files.map((file) => URL.createObjectURL(file)));
      setError("");
    }

    e.target.value = "";
  }

  async function uploadImages() {
    if (!selectedImages.length) {
      return form.image_urls?.length
        ? form.image_urls
        : form.image_url
          ? [form.image_url]
          : [];
    }

    const urls = [];

    for (const file of selectedImages) {
      const path = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

      const { data, error } = await supabase.storage
        .from("Image")
        .upload(path, file);

      if (error) {
        console.error("Failed to upload product image:", error);
        throw new Error("Unable to upload product images. Please try again.");
      }

      const { data: publicData } = supabase.storage
        .from("Image")
        .getPublicUrl(path);

      if (!publicData?.publicUrl) {
        console.error("Unable to generate a public URL for an uploaded image.");
        throw new Error("Unable to prepare the product image.");
      }

      urls.push(publicData.publicUrl);
    }

    return urls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !form.name.trim() ||
      form.price === "" ||
      form.stock === "" ||
      !Number.isFinite(Number(form.price)) ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.price) < 0 ||
      Number(form.stock) < 0
    ) {
      setError("Enter a valid name, price and whole-number stock.");
      return;
    }

    if (!form.category || !categories.includes(form.category)) {
      setError("Please select a valid product category.");
      return;
    }

    if (!["Active", "Draft"].includes(form.status)) {
      setError("Please select a valid product status.");
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
        ? await supabase
            .from("products")
            .update(product)
            .eq("id", editingId)
            .select()
        : await supabase
            .from("products")
            .insert([product])
            .select();

      if (result.error) {
        console.error("Failed to save product:", result.error);
        setError("Unable to save the product. Please check your connection and try again.");
        return;
      }

      if (!result.data?.length) {
        console.error("No product was returned after saving. Check database permissions and RLS policies.");
        setError("The product could not be saved. Please check your access permissions.");
        return;
      }

      const wasEditing = editingId !== null;

      closeForm();
      setForm({ ...emptyProduct });
      setEditingId(null);
      setMessage(
        wasEditing
          ? "Product updated successfully."
          : "Product added successfully."
      );

      await fetchProducts();
    } catch (err) {
      console.error("Unexpected error while saving product:", err);
      setError(
        err instanceof Error && err.message.startsWith("Unable to")
          ? err.message
          : "Something went wrong while saving the product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Failed to delete product:", error);
        setError("Unable to delete this product. Please try again.");
        return;
      }

      setProducts((items) => items.filter((product) => product.id !== id));
      setMessage("Product deleted successfully.");
    } catch (err) {
      console.error("Unexpected error while deleting product:", err);
      setError("Something went wrong while deleting the product.");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#29231F]">
      <AdminSidebar />

      <main className="ml-16 md:ml-64 min-w-0 p-4 sm:p-6 lg:p-8 pb-28 md:pb-8 transition-all duration-300">
        <div className="mx-auto max-w-[1600px] space-y-7">

          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-[#E9DFD4] pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-2.5 py-0.5 rounded-full border border-[#cff281]">
                Admin / Products
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#29231F]">
                Products Management
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                Manage your clothing collection, prices, and stock inventory.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#D9F99D] px-5 py-3 text-xs sm:text-sm font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95"
            >
              <Plus size={18} /> Add Product
            </button>
          </header>

          {message && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs sm:text-sm text-emerald-700">
              {message}
            </div>
          )}

          {error && !showForm && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-600">
              {error}
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ["Total Products", products.length],
              ["In Stock", products.filter((p) => Number(p.stock) > 0).length],
              ["Out of Stock", products.filter((p) => Number(p.stock) === 0).length],
            ].map(([title, value]) => (
              <div
                key={title}
                className="rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-5 shadow-sm transition hover:border-[#D9F99D]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {title}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#29231F]">
                  {value}
                </p>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-4 sm:flex-row shadow-sm">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name..."
                className={`${inputStyle} pl-10`}
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputStyle} sm:w-48`}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md shadow-sm">
            <div className="border-b border-[#E9DFD4] px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#29231F]">All Products</h2>
                <p className="text-xs text-neutral-500">{filtered.length} products found</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-[#E9DFD4]">
                  <tr>
                    {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E9DFD4]/60 text-neutral-800">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-neutral-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29231F] border-t-transparent" />
                          Loading products...
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length ? (
                    filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="h-11 w-11 rounded-xl object-cover border border-[#E9DFD4] bg-[#FAF7F2]"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E9DFD4] text-[#29231F]">
                                <Package size={20} />
                              </div>
                            )}

                            <span className="font-bold text-[#29231F]">{p.name}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 font-medium text-neutral-600">{p.category}</td>

                        <td className="px-5 py-3.5 font-bold text-[#29231F]">
                          ₹{Number(p.price || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>

                        <td className="px-5 py-3.5 font-semibold text-neutral-700">{p.stock}</td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              Number(p.stock) === 0
                                ? "bg-red-50 text-red-700 border-red-200"
                                : p.status === "Draft"
                                  ? "bg-neutral-100 text-neutral-700 border-neutral-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {Number(p.stock) === 0 ? "Out of stock" : p.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditForm(p)}
                              aria-label="Edit product"
                              className="rounded-xl border border-[#E9DFD4] bg-white p-2 text-[#29231F] shadow-sm transition hover:bg-[#D9F99D] hover:border-[#D9F99D]"
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              onClick={() => deleteProduct(p.id)}
                              aria-label="Delete product"
                              className="rounded-xl border border-red-200 bg-white p-2 text-red-600 shadow-sm transition hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-neutral-500">
                        No products found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
          <div className="my-auto w-full max-w-lg rounded-3xl border border-[#E9DFD4] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-[#E9DFD4] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#29231F]">
                  {editingId !== null ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Fill in details and upload up to 3 showcase images.
                </p>
              </div>

              <button
                onClick={closeForm}
                aria-label="Close form"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] text-[#29231F] transition hover:bg-neutral-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#29231F]">
                Product Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Classic Linen Shirt"
                  className={inputStyle + " mt-1.5"}
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-[#29231F]">
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputStyle + " mt-1.5"}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#29231F]">
                  Price (₹)
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={inputStyle + " mt-1.5"}
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-[#29231F]">
                  Stock Quantity
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className={inputStyle + " mt-1.5"}
                  />
                </label>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-[#29231F]">
                  Product Images (up to 3)
                </p>

                <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-[#E9DFD4] bg-[#FAF7F2] p-5 text-center transition hover:border-[#29231F]">
                  <ImagePlus size={24} className="mb-2 text-[#29231F]" />
                  <span className="text-xs font-bold text-[#29231F]">Click to select images</span>
                  <span className="mt-0.5 text-[11px] text-neutral-400">Maximum 5 MB per image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {previews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {previews.map((url, i) => (
                      <div
                        key={`${url}-${i}`}
                        className="relative rounded-xl overflow-hidden border border-[#E9DFD4] bg-[#FAF7F2]"
                      >
                        <img
                          src={url}
                          alt={`Product ${i + 1}`}
                          className="h-24 w-full object-cover"
                        />

                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 rounded bg-[#29231F] px-1.5 py-0.5 text-[9px] font-bold text-[#D9F99D]">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <p className="mt-1.5 text-[11px] text-neutral-400">
                  Selecting new images replaces the existing gallery.
                </p>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider text-[#29231F]">
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={inputStyle + " mt-1.5"}
                >
                  <option>Active</option>
                  <option>Draft</option>
                </select>
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E9DFD4]">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[#E9DFD4] bg-white px-4 py-2.5 text-xs font-bold text-[#29231F] transition hover:bg-neutral-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#D9F99D] px-5 py-2.5 text-xs font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
