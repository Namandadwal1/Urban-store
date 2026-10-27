
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { toast } from "sonner";
import { Save, RefreshCw, Tag, Plus, Trash2, X, Clock } from "lucide-react";

const inputStyle =
  "mt-1.5 w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] px-3 py-2.5 text-sm text-[#29231F] outline-none focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]";

const emptyOffer = {
  category: "",
  title: "",
  discount: "",
  description: "",
  badge: "",
  image: "",
  button: "",
  link: "/products",
  is_active: true,
  countdown_hours: 34,
  expires_at: null,
};

function getTimeLeft(expiresAt) {
  const seconds = Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
  );

  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export default function AdminDealsPage() {
  const [supabase] = useState(() => createClient());
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({ ...emptyOffer });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchOffers();

    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchOffers() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load offers:", error);
        toast.error("Unable to load offers. Please try again later.");
        return;
      }

      setOffers(data || []);
    } catch (err) {
      console.error("Unexpected error while loading offers:", err);
      toast.error("Something went wrong while loading offers.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(id, field, value) {
    setOffers((current) =>
      current.map((offer) =>
        offer.id === id ? { ...offer, [field]: value } : offer
      )
    );
  }

  function handleNewChange(field, value) {
    setNewOffer((current) => ({ ...current, [field]: value }));
  }

  function createExpiry(hours) {
    return new Date(Date.now() + Number(hours) * 60 * 60 * 1000).toISOString();
  }

  function isValidDuration(value) {
    const duration = Number(value);
    return Number.isFinite(duration) && duration >= 1 && duration <= 720;
  }

  async function handleAddOffer(e) {
    e.preventDefault();

    if (offers.length >= 4) {
      toast.error("You can have only four homepage offers.");
      return;
    }

    if (!isValidDuration(newOffer.countdown_hours)) {
      toast.error("Countdown duration must be between 1 and 720 hours.");
      return;
    }

    setSaving(true);

    try {
      const duration = Number(newOffer.countdown_hours);

      const { data, error } = await supabase
        .from("offers")
        .insert({
          ...newOffer,
          countdown_hours: duration,
          expires_at: createExpiry(duration),
          sort_order: offers.length
            ? Math.max(...offers.map((offer) => offer.sort_order || 0)) + 1
            : 1,
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to create offer:", error);
        toast.error(
          "Unable to create the offer. Please check your details and try again."
        );
        return;
      }

      setOffers((current) =>
        [...current, data].sort(
          (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
        )
      );
      setNewOffer({ ...emptyOffer });
      setShowForm(false);
      toast.success("Offer created successfully!");
    } catch (err) {
      console.error("Unexpected error while creating offer:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSave(offer) {
    if (!isValidDuration(offer.countdown_hours)) {
      toast.error("Countdown duration must be between 1 and 720 hours.");
      return;
    }

    setSavingId(offer.id);

    try {
      const oldOffer = offers.find((item) => item.id === offer.id);
      const duration = Number(offer.countdown_hours);

      // Restart the countdown only if its duration was changed.
      const durationChanged =
        Number(oldOffer?.countdown_hours) !== duration;

      const updates = {
        category: offer.category,
        title: offer.title,
        discount: offer.discount,
        description: offer.description,
        badge: offer.badge,
        image: offer.image,
        button: offer.button,
        link: offer.link,
        is_active: offer.is_active,
        countdown_hours: duration,
      };

      if (durationChanged || !offer.expires_at) {
        updates.expires_at = createExpiry(duration);
      }

      const { error } = await supabase
        .from("offers")
        .update(updates)
        .eq("id", offer.id);

      if (error) {
        console.error("Failed to update offer:", error);
        toast.error("Unable to save changes. Please try again later.");
        return;
      }

      toast.success("Offer updated successfully!");
      await fetchOffers();
    } catch (err) {
      console.error("Unexpected error while updating offer:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(offer) {
    const confirmed = window.confirm(
      `Delete "${offer.category}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(offer.id);

    try {
      const { error } = await supabase
        .from("offers")
        .delete()
        .eq("id", offer.id);

      if (error) {
        console.error("Failed to delete offer:", error);
        toast.error("Unable to delete the offer. Please try again later.");
        return;
      }

      setOffers((current) =>
        current.filter((item) => item.id !== offer.id)
      );
      toast.success("Offer deleted successfully.");
    } catch (err) {
      console.error("Unexpected error while deleting offer:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setDeletingId(null);
    }
  }

  function renderFields(offer, onChange) {
    return (
      <>
        <label className="text-xs font-bold">
          Category
          <input required value={offer.category || ""} onChange={(e) => onChange("category", e.target.value)} className={inputStyle} />
        </label>

        <label className="text-xs font-bold">
          Badge
          <input required value={offer.badge || ""} onChange={(e) => onChange("badge", e.target.value)} placeholder="50% OFF" className={inputStyle} />
        </label>

        <label className="text-xs font-bold">
          Heading
          <input required value={offer.title || ""} onChange={(e) => onChange("title", e.target.value)} className={inputStyle} />
        </label>

        <label className="text-xs font-bold">
          Discount text
          <input required value={offer.discount || ""} onChange={(e) => onChange("discount", e.target.value)} placeholder="50% Off" className={inputStyle} />
        </label>

        <label className="text-xs font-bold sm:col-span-2">
          Description
          <textarea required rows={2} value={offer.description || ""} onChange={(e) => onChange("description", e.target.value)} className={inputStyle} />
        </label>

        <label className="text-xs font-bold">
          Image URL
          <input required type="url" value={offer.image || ""} onChange={(e) => onChange("image", e.target.value)} className={inputStyle} />
        </label>

        <label className="text-xs font-bold">
          Button text
          <input required value={offer.button || ""} onChange={(e) => onChange("button", e.target.value)} className={inputStyle} />
        </label>

        <label className="text-xs font-bold sm:col-span-2">
          Button link
          <input required value={offer.link || ""} onChange={(e) => onChange("link", e.target.value)} className={inputStyle} />
        </label>

        <label className="text-xs font-bold sm:col-span-2">
          Countdown duration (hours)
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              required
              type="number"
              min="1"
              max="720"
              value={offer.countdown_hours ?? 34}
              onChange={(e) => onChange("countdown_hours", e.target.value)}
              className={`${inputStyle} pl-9`}
            />
          </div>
          <p className="mt-1 font-normal text-neutral-500">
            Changing the duration and saving restarts this offer's countdown.
          </p>
        </label>
      </>
    );
  }

  function countdown(expiresAt) {
    if (!expiresAt) return "Not started";

    const time = getTimeLeft(expiresAt);

    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      return "Offer expired";
    }

    return `${time.hours}h ${String(time.minutes).padStart(2, "0")}m ${String(time.seconds).padStart(2, "0")}s`;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#29231F]">
      <AdminSidebar />

      <main className="ml-16 min-w-0 p-4 pb-28 transition-all duration-300 sm:p-6 md:ml-64 md:pb-8 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="border-b border-[#E9DFD4] pb-5">
            <span className="rounded-full border border-[#cff281] bg-[#D9F99D] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              Admin / Deals & Offers
            </span>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Homepage Offers</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Create, edit, delete and manage countdowns for your four homepage offers.
            </p>
          </header>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E9DFD4] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9F99D]">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Existing offers</p>
                <p className="text-xs text-neutral-500">{offers.length} of 4 offers</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={fetchOffers} disabled={loading} className="flex items-center gap-2 rounded-xl border border-[#E9DFD4] px-3 py-2 text-xs font-bold hover:bg-[#D9F99D] disabled:opacity-50">
                <RefreshCw size={14} /> Refresh
              </button>
              <button type="button" onClick={() => setShowForm(!showForm)} disabled={offers.length >= 4} className="flex items-center gap-2 rounded-xl bg-[#D9F99D] px-3 py-2 text-xs font-bold disabled:opacity-50">
                {showForm ? <X size={14} /> : <Plus size={14} />}
                {showForm ? "Cancel" : "Add Offer"}
              </button>
            </div>
          </div>

          {showForm && offers.length < 4 && (
            <form onSubmit={handleAddOffer} className="overflow-hidden rounded-2xl border border-[#E9DFD4] bg-white">
              <div className="bg-[#29231F] px-5 py-4 text-white">
                <p className="text-xs font-bold text-[#D9F99D]">NEW HOMEPAGE OFFER</p>
                <h2 className="mt-1 font-bold">Create Offer</h2>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2">
                {renderFields(newOffer, handleNewChange)}

                <label className="flex items-center gap-2 text-xs font-bold sm:col-span-2">
                  <input type="checkbox" checked={newOffer.is_active} onChange={(e) => handleNewChange("is_active", e.target.checked)} className="h-4 w-4 accent-[#29231F]" />
                  Active
                </label>

                <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-[#D9F99D] px-5 py-3 text-sm font-bold disabled:opacity-50 sm:col-span-2 sm:justify-self-start">
                  <Save size={16} /> {saving ? "Creating..." : "Create Offer"}
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="rounded-2xl border border-[#E9DFD4] bg-white p-10 text-center text-sm text-neutral-500">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="rounded-2xl border border-[#E9DFD4] bg-white p-8 text-center">
              <p className="font-bold">No offers created yet</p>
              <p className="mt-2 text-sm text-neutral-500">Click Add Offer to create your first offer.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {offers.map((offer, index) => (
                <form key={offer.id} onSubmit={(e) => { e.preventDefault(); handleSave(offer); }} className="overflow-hidden rounded-2xl border border-[#E9DFD4] bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#29231F] px-5 py-4 text-white">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#D9F99D]">Homepage Offer {index + 1}</p>
                      <h2 className="mt-1 font-bold">{offer.category || "Untitled offer"}</h2>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-300">
                        <Clock size={13} /> {countdown(offer.expires_at)}
                      </p>
                    </div>

                    <label className="flex cursor-pointer items-center gap-2 text-xs">
                      <input type="checkbox" checked={offer.is_active ?? true} onChange={(e) => handleChange(offer.id, "is_active", e.target.checked)} className="h-4 w-4 accent-[#D9F99D]" />
                      Active
                    </label>
                  </div>

                  <div className="grid gap-5 p-5 lg:grid-cols-[180px_1fr]">
                    <div>
                      <div className="h-40 overflow-hidden rounded-xl bg-[#F5F2ED]">
                        <img src={offer.image || ""} alt={offer.category} className="h-full w-full object-cover" />
                      </div>
                    </div>

                    <div className="grid content-start gap-4 sm:grid-cols-2">
                      {renderFields(offer, (field, value) => handleChange(offer.id, field, value))}

                      <button type="submit" disabled={savingId === offer.id} className="flex items-center justify-center gap-2 rounded-xl bg-[#D9F99D] px-5 py-3 text-sm font-bold disabled:opacity-50 sm:justify-self-start">
                        <Save size={16} /> {savingId === offer.id ? "Saving..." : "Save Changes"}
                      </button>

                      <button type="button" onClick={() => handleDelete(offer)} disabled={deletingId === offer.id} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50 sm:justify-self-start">
                        <Trash2 size={16} /> {deletingId === offer.id ? "Deleting..." : "Delete Offer"}
                      </button>
                    </div>
                  </div>
                </form>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
