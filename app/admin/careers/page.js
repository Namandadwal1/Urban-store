"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import {
  Users,
  Briefcase,
  Search,
  Mail,
  Phone,
  Globe,
  Eye,
  X,
  Award,
  Calendar,
  FileText,
  Sparkles,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function AdminCareersPage() {
  const [supabase] = useState(() => createClient());
  const [activeTab, setActiveTab] = useState("applications"); // "applications" or "collaborations"
  const [applications, setApplications] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const [appRes, collabRes] = await Promise.all([
          supabase
            .from("job_applications")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("collaborations")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (appRes.error) throw appRes.error;
        if (collabRes.error) throw collabRes.error;

        setApplications(appRes.data || []);
        setCollaborations(collabRes.data || []);
      } catch (err) {
        console.error("Failed to load careers data:", err);
        setError("Unable to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  async function handleDelete(id, table) {
    if (!window.confirm("Are you sure you want to delete this submission?"))
      return;

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      if (table === "job_applications") {
        setApplications((prev) => prev.filter((item) => item.id !== id));
      } else {
        setCollaborations((prev) => prev.filter((item) => item.id !== id));
      }
      setSelectedItem(null);
    } catch (err) {
      console.error("Failed to delete submission:", err);
      alert("Unable to delete this submission. Please try again.");
    }
  }

  // Filter logic
  const filteredApps = applications.filter((app) =>
    `${app.full_name || ""} ${app.email || ""} ${app.position || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const filteredCollabs = collaborations.filter((collab) =>
    `${collab.name || ""} ${collab.email || ""} ${collab.collab_type || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#29231F]">
      <AdminSidebar />

      {/* Main Content Container with responsive sidebar margin & bottom clearance */}
      <main className="ml-16 md:ml-64 min-w-0 p-4 sm:p-6 lg:p-8 pb-28 md:pb-8 transition-all duration-300">
        <div className="mx-auto w-full max-w-7xl space-y-7">
          {/* Header */}
          <header className="border-b border-[#E9DFD4] pb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-2.5 py-0.5 rounded-full border border-[#cff281]">
              Admin / Careers & Inquiries
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#29231F]">
              Careers & Collaborations Control
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500">
              Review store job applications and brand ambassador proposal
              requests.
            </p>
          </header>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              onClick={() => setActiveTab("applications")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition ${
                activeTab === "applications"
                  ? "border-[#29231F] bg-white ring-2 ring-[#D9F99D]"
                  : "border-[#E9DFD4] bg-white/80 hover:border-[#D9F99D]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Staff Job Applications
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F99D] text-[#29231F]">
                  <Briefcase size={18} />
                </div>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-[#29231F]">
                {applications.length}
              </h2>
            </div>

            <div
              onClick={() => setActiveTab("collaborations")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition ${
                activeTab === "collaborations"
                  ? "border-[#29231F] bg-white ring-2 ring-[#D9F99D]"
                  : "border-[#E9DFD4] bg-white/80 hover:border-[#D9F99D]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Brand Collaboration Proposals
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F99D] text-[#29231F]">
                  <Sparkles size={18} />
                </div>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-[#29231F]">
                {collaborations.length}
              </h2>
            </div>
          </div>

          {/* Toolbar and Section Tabs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-4 shadow-sm">
            {/* Tab Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("applications")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === "applications"
                    ? "bg-[#D9F99D] text-[#29231F] shadow-sm"
                    : "bg-[#FAF7F2] text-neutral-600 hover:text-[#29231F]"
                }`}
              >
                Store Staff ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab("collaborations")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === "collaborations"
                    ? "bg-[#D9F99D] text-[#29231F] shadow-sm"
                    : "bg-[#FAF7F2] text-neutral-600 hover:text-[#29231F]"
                }`}
              >
                Collaborations ({collaborations.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates or creators..."
                className="w-full sm:w-64 rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] py-2 pl-9 pr-3 text-xs text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]"
              />
            </div>
          </div>

          {/* Submissions List Area */}
          <section className="overflow-hidden rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-[#E9DFD4]">
                  <tr>
                    <th className="px-5 py-3.5">Name / Contact</th>
                    <th className="px-5 py-3.5">
                      {activeTab === "applications" ? "Desired Role" : "Type"}
                    </th>
                    <th className="px-5 py-3.5">
                      {activeTab === "applications"
                        ? "Experience"
                        : "Social / Link"}
                    </th>
                    <th className="px-5 py-3.5">Date Received</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E9DFD4]/60 text-neutral-800">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-10 text-center text-neutral-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29231F] border-t-transparent" />
                          Loading submissions...
                        </div>
                      </td>
                    </tr>
                  ) : activeTab === "applications" ? (
                    /* --- JOB APPLICATIONS ROWS --- */
                    filteredApps.length ? (
                      filteredApps.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-neutral-50/60 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-[#29231F]">
                              {item.full_name}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              {item.email} · {item.phone}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-[#29231F]">
                            {item.position}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-neutral-600">
                            {item.experience || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-neutral-500 whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  setSelectedItem({ ...item, type: "job" })
                                }
                                className="inline-flex items-center gap-1 rounded-xl border border-[#E9DFD4] bg-white px-3 py-1.5 text-xs font-bold text-[#29231F] shadow-sm transition hover:bg-[#D9F99D] hover:border-[#D9F99D]"
                              >
                                <Eye size={14} /> View Details
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(item.id, "job_applications")
                                }
                                className="rounded-xl border border-red-200 bg-white p-1.5 text-red-600 shadow-sm transition hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-10 text-center text-neutral-500"
                        >
                          No job applications found.
                        </td>
                      </tr>
                    )
                  ) : /* --- COLLABORATIONS ROWS --- */
                  filteredCollabs.length ? (
                    filteredCollabs.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-neutral-50/60 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-[#29231F]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {item.email}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-[#29231F]">
                          {item.collab_type}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-blue-600">
                          {item.social_handle || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-500 whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setSelectedItem({ ...item, type: "collab" })
                              }
                              className="inline-flex items-center gap-1 rounded-xl border border-[#E9DFD4] bg-white px-3 py-1.5 text-xs font-bold text-[#29231F] shadow-sm transition hover:bg-[#D9F99D] hover:border-[#D9F99D]"
                            >
                              <Eye size={14} /> Review Proposal
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(item.id, "collaborations")
                              }
                              className="rounded-xl border border-red-200 bg-white p-1.5 text-red-600 shadow-sm transition hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-10 text-center text-neutral-500"
                      >
                        No collaboration requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Detail Inspector Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-[#E9DFD4] bg-white p-6 sm:p-8 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-[#E9DFD4] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-2.5 py-0.5 rounded-full">
                  {selectedItem.type === "job"
                    ? "Job Application"
                    : "Collaboration Request"}
                </span>
                <h2 className="mt-1 text-xl font-bold text-[#29231F]">
                  {selectedItem.full_name || selectedItem.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] text-[#29231F] transition hover:bg-neutral-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-neutral-700">
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-neutral-400" />
                <span>
                  Email:{" "}
                  <strong className="text-[#29231F]">
                    {selectedItem.email}
                  </strong>
                </span>
              </div>

              {selectedItem.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-neutral-400" />
                  <span>Phone: {selectedItem.phone}</span>
                </div>
              )}

              {selectedItem.social_handle && (
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-neutral-400" />
                  <span>
                    Handle / Portfolio:{" "}
                    <strong className="text-blue-600">
                      {selectedItem.social_handle}
                    </strong>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Award size={15} className="text-neutral-400" />
                <span>
                  {selectedItem.type === "job" ? "Role Requested: " : "Type: "}
                  <strong className="text-[#29231F]">
                    {selectedItem.position || selectedItem.collab_type}
                  </strong>
                </span>
              </div>

              {selectedItem.experience && (
                <div className="flex items-center gap-2">
                  <Briefcase size={15} className="text-neutral-400" />
                  <span>Experience: {selectedItem.experience}</span>
                </div>
              )}

              <div className="rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-4 mt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  {selectedItem.type === "job"
                    ? "Cover Letter"
                    : "Proposal Details"}
                </p>
                <p className="text-xs text-[#29231F] leading-relaxed whitespace-pre-line">
                  {selectedItem.cover_letter ||
                    selectedItem.proposal ||
                    "No details provided."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${selectedItem.email}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#D9F99D] py-3 text-xs font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95"
              >
                <Mail size={15} /> Reply via Email
              </a>
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-[#E9DFD4] bg-white px-5 py-3 text-xs font-bold text-[#29231F] hover:bg-neutral-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
