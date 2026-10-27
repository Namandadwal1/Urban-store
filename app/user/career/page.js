
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Briefcase,
  Users,
  Send,
  Sparkles,
  CheckCircle2,
  Shirt,
  ShoppingBag,
  Mail,
  User,
  Phone,
  Globe,
  Award,
} from "lucide-react";

const inputStyle =
  "w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] px-4 py-3 text-xs sm:text-sm text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]";

export default function CareersPage() {
  const [supabase] = useState(() => createClient());
  const [activeTab, setActiveTab] = useState("job");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [jobForm, setJobForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "Store Sales Associate",
    experience: "",
    coverLetter: "",
  });

  const [collabForm, setCollabForm] = useState({
    name: "",
    email: "",
    socialHandle: "",
    collabType: "Content Creator / UGC",
    proposal: "",
  });

  async function handleJobSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      const { error } = await supabase.from("job_applications").insert({
        full_name: jobForm.fullName.trim(),
        email: jobForm.email.trim().toLowerCase(),
        phone: jobForm.phone.trim(),
        position: jobForm.position,
        experience: jobForm.experience.trim(),
        cover_letter: jobForm.coverLetter.trim(),
        status: "pending",
      });

      if (error) throw error;

      setSuccess(true);
      toast.success("Application submitted successfully!");

      setJobForm({
        fullName: "",
        email: "",
        phone: "",
        position: "Store Sales Associate",
        experience: "",
        coverLetter: "",
      });
    } catch (err) {
      console.error("Job application error:", err);
      toast.error(err.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCollabSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      const { error } = await supabase.from("collaborations").insert({
        name: collabForm.name.trim(),
        email: collabForm.email.trim().toLowerCase(),
        social_handle: collabForm.socialHandle.trim(),
        collab_type: collabForm.collabType,
        proposal: collabForm.proposal.trim(),
        status: "pending",
      });

      if (error) throw error;

      setSuccess(true);
      toast.success("Collaboration request submitted successfully!");

      setCollabForm({
        name: "",
        email: "",
        socialHandle: "",
        collabType: "Content Creator / UGC",
        proposal: "",
      });
    } catch (err) {
      console.error("Collaboration submission error:", err);
      toast.error(err.message || "Failed to submit collaboration request.");
    } finally {
      setSubmitting(false);
    }
  }

  function changeTab(tab) {
    setActiveTab(tab);
    setSuccess(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF7F2] px-4 py-12 text-[#29231F] sm:py-20">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl" />

      {/* Background icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute right-12 top-12 rotate-12 text-[#29231F]">
          <Shirt size={150} strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-12 -rotate-12 text-[#29231F]">
          <ShoppingBag size={160} strokeWidth={1} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#cff281] bg-[#D9F99D] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#29231F] shadow-sm">
            <Sparkles size={12} />
            Opportunities at UrbanWear
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-[#29231F] sm:text-4xl">
            Careers & Brand Collaborations
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-xs text-neutral-600 sm:text-sm">
            Work with us in our store operations or partner with our brand as a
            content creator and affiliate.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => changeTab("job")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-sm transition-all sm:text-sm ${
              activeTab === "job"
                ? "scale-105 bg-[#D9F99D] text-[#29231F]"
                : "border border-[#E9DFD4] bg-white/80 text-neutral-600 hover:bg-white hover:text-[#29231F]"
            }`}
          >
            <Briefcase size={18} />
            Apply as Store Worker
          </button>

          <button
            type="button"
            onClick={() => changeTab("collab")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-sm transition-all sm:text-sm ${
              activeTab === "collab"
                ? "scale-105 bg-[#D9F99D] text-[#29231F]"
                : "border border-[#E9DFD4] bg-white/80 text-neutral-600 hover:bg-white hover:text-[#29231F]"
            }`}
          >
            <Users size={18} />
            Collaborate With Store
          </button>
        </div>

        {/* Form container */}
        <div className="rounded-3xl border border-[#E9DFD4] bg-white/80 p-6 shadow-sm backdrop-blur-xl sm:p-10">
          {success ? (
            <div className="space-y-4 py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] shadow-sm">
                <CheckCircle2 size={32} />
              </div>

              <h2 className="text-xl font-bold text-[#29231F]">
                Request Submitted Successfully!
              </h2>

              <p className="mx-auto max-w-md text-xs text-neutral-600 sm:text-sm">
                Thank you for reaching out. Your submission has been saved.
                Our team will review it and get back to you.
              </p>

              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-4 rounded-xl bg-[#29231F] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-neutral-800"
              >
                Submit Another Request
              </button>
            </div>
          ) : activeTab === "job" ? (
            /* Job application form */
            <form onSubmit={handleJobSubmit} className="space-y-5">
              <div className="mb-4 border-b border-[#E9DFD4] pb-4">
                <h2 className="text-lg font-bold text-[#29231F]">
                  Store Staff & Worker Application
                </h2>
                <p className="text-xs text-neutral-500">
                  Apply for in-store sales, inventory management, or customer
                  service roles.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Full Name
                  <div className="relative mt-1.5">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      required
                      type="text"
                      maxLength={100}
                      autoComplete="name"
                      value={jobForm.fullName}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, fullName: e.target.value })
                      }
                      placeholder="Alex Morgan"
                      className={inputStyle + " pl-10"}
                    />
                  </div>
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider">
                  Email Address
                  <div className="relative mt-1.5">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      required
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      value={jobForm.email}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, email: e.target.value })
                      }
                      placeholder="alex@example.com"
                      className={inputStyle + " pl-10"}
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Phone Number
                  <div className="relative mt-1.5">
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      required
                      type="tel"
                      maxLength={30}
                      autoComplete="tel"
                      value={jobForm.phone}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className={inputStyle + " pl-10"}
                    />
                  </div>
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider">
                  Desired Store Role
                  <select
                    value={jobForm.position}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, position: e.target.value })
                    }
                    className={inputStyle + " mt-1.5"}
                  >
                    <option value="Store Sales Associate">
                      Store Sales Associate
                    </option>
                    <option value="Inventory & Stock Worker">
                      Inventory & Stock Worker
                    </option>
                    <option value="Customer Support Executive">
                      Customer Support Executive
                    </option>
                    <option value="Store Supervisor">Store Supervisor</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider">
                Work Experience (Years / Summary)
                <div className="relative mt-1.5">
                  <Award size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    required
                    type="text"
                    maxLength={500}
                    value={jobForm.experience}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, experience: e.target.value })
                    }
                    placeholder="e.g. 1 year in retail fashion sales"
                    className={inputStyle + " pl-10"}
                  />
                </div>
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider">
                Why do you want to work at UrbanWear?
                <textarea
                  required
                  rows={4}
                  maxLength={5000}
                  value={jobForm.coverLetter}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, coverLetter: e.target.value })
                  }
                  placeholder="Share a short summary of your background and availability..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] p-4 text-xs text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D] sm:text-sm"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9F99D] py-3.5 text-xs font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                <Send size={16} />
                {submitting ? "Submitting Application..." : "Submit Worker Application"}
              </button>
            </form>
          ) : (
            /* Collaboration form */
            <form onSubmit={handleCollabSubmit} className="space-y-5">
              <div className="mb-4 border-b border-[#E9DFD4] pb-4">
                <h2 className="text-lg font-bold text-[#29231F]">
                  Store Collaboration & Partner Request
                </h2>
                <p className="text-xs text-neutral-500">
                  Partner with UrbanWear for UGC, social promotions, affiliate
                  code deals, or fashion styling.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Name / Brand Name
                  <div className="relative mt-1.5">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      required
                      type="text"
                      maxLength={100}
                      autoComplete="name"
                      value={collabForm.name}
                      onChange={(e) =>
                        setCollabForm({ ...collabForm, name: e.target.value })
                      }
                      placeholder="Jane Creator"
                      className={inputStyle + " pl-10"}
                    />
                  </div>
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider">
                  Email Address
                  <div className="relative mt-1.5">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      required
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      value={collabForm.email}
                      onChange={(e) =>
                        setCollabForm({ ...collabForm, email: e.target.value })
                      }
                      placeholder="creator@example.com"
                      className={inputStyle + " pl-10"}
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Social Media Handle / Website Link
                  <div className="relative mt-1.5">
                    <Globe
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      required
                      type="text"
                      maxLength={500}
                      value={collabForm.socialHandle}
                      onChange={(e) =>
                        setCollabForm({
                          ...collabForm,
                          socialHandle: e.target.value,
                        })
                      }
                      placeholder="@instagram / youtube.com/..."
                      className={inputStyle + " pl-10"}
                    />
                  </div>
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider">
                  Collaboration Type
                  <select
                    value={collabForm.collabType}
                    onChange={(e) =>
                      setCollabForm({
                        ...collabForm,
                        collabType: e.target.value,
                      })
                    }
                    className={inputStyle + " mt-1.5"}
                  >
                    <option value="Content Creator / UGC">
                      Content Creator / UGC
                    </option>
                    <option value="Affiliate Partner">Affiliate Partner</option>
                    <option value="Brand Ambassador">Brand Ambassador</option>
                    <option value="Stylist / Designer Collab">
                      Stylist / Designer Collab
                    </option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider">
                Collaboration Proposal Details
                <textarea
                  required
                  rows={4}
                  maxLength={5000}
                  value={collabForm.proposal}
                  onChange={(e) =>
                    setCollabForm({ ...collabForm, proposal: e.target.value })
                  }
                  placeholder="Describe how you'd like to collaborate with UrbanWear..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] p-4 text-xs text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D] sm:text-sm"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9F99D] py-3.5 text-xs font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                <Send size={16} />
                {submitting
                  ? "Submitting Proposal..."
                  : "Submit Collaboration Proposal"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
