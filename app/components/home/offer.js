
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function Offer() {
  const [supabase] = useState(() => createClient());
  const [offers, setOffers] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    async function fetchOffers() {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(4);

      if (error) {
        console.error("Error fetching homepage offers:", error);
      } else {
        setOffers(data || []);
        setActive(0);
      }

      setLoading(false);
    }

    fetchOffers();

    // Update the offer list if the database changes.
    const channel = supabase
      .channel("homepage-offers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "offers" },
        fetchOffers
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Update the countdown every second.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatically rotate the main offer.
  useEffect(() => {
    if (offers.length < 2) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % offers.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [offers.length]);

  const previous = () => {
    setActive((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const next = () => {
    setActive((prev) => (prev + 1) % offers.length);
  };

  function getCountdown(expiresAt) {
    if (!expiresAt) return null;

    const seconds = Math.max(
      0,
      Math.floor((new Date(expiresAt).getTime() - now) / 1000)
    );

    return {
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60,
      expired: seconds === 0,
    };
  }

  if (loading) {
    return (
      <section className="bg-[#FAF7F2] px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl text-center text-sm text-neutral-500">
          Loading offers...
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  const offer = offers[active] || offers[0];
  const countdown = getCountdown(offer.expires_at);

  return (
    <section className="bg-[#FAF7F2] px-5 py-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#29231F]/70">
            Limited Time Only
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-[#29231F] md:text-5xl">
            Best Deals & Offers
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-600 md:text-base">
            Upgrade your wardrobe with exclusive offers. Limited-time deals,
            just for you.
          </p>
        </div>

        {/* Main Offer Slider */}
        <div className="relative">
          <div
            key={offer.id}
            className="grid overflow-hidden rounded-3xl border border-[#E9DFD4] bg-white/70 shadow-lg backdrop-blur-md md:min-h-[400px] md:grid-cols-2"
          >
            {/* Offer Details */}
            <div className="flex flex-col items-start justify-center p-7 md:p-12 lg:p-16">
              <span className="mb-6 rounded-full border border-[#d2f78d] bg-[#D9F99D] px-4 py-1.5 text-xs font-bold tracking-wider text-[#29231F] shadow-sm">
                {offer.badge}
              </span>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#29231F]/80">
                {offer.category}
              </p>

              <h3 className="text-4xl font-bold leading-tight text-[#29231F] md:text-5xl lg:text-6xl">
                {offer.title}
                <span className="mt-1 block text-neutral-900 underline decoration-[#D9F99D] decoration-wavy decoration-2">
                  {offer.discount}
                </span>
              </h3>

              <p className="mt-5 max-w-md text-sm leading-6 text-neutral-600 md:text-base">
                {offer.description}
              </p>

              {countdown && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-neutral-600">
                  <Clock size={15} />
                  {countdown.expired ? (
                    <span>Offer expired</span>
                  ) : (
                    <>
                      <span>Ends in:</span>
                      <span className="rounded-md bg-[#29231F] px-2 py-1 text-[#D9F99D]">
                        {String(countdown.hours).padStart(2, "0")}h
                      </span>
                      <span className="rounded-md bg-[#29231F] px-2 py-1 text-[#D9F99D]">
                        {String(countdown.minutes).padStart(2, "0")}m
                      </span>
                      <span className="rounded-md bg-[#29231F] px-2 py-1 text-[#D9F99D]">
                        {String(countdown.seconds).padStart(2, "0")}s
                      </span>
                    </>
                  )}
                </div>
              )}

              <Link
                href={offer.link || "/products"}
                className="mt-7 inline-flex items-center gap-2.5 rounded-xl bg-[#D9F99D] px-6 py-3 text-sm font-bold text-[#29231F] shadow-sm transition-all hover:brightness-95 active:scale-95"
              >
                {offer.button}
                <ArrowUpRight size={18} />
              </Link>
            </div>

            {/* Offer Image */}
            <div className="relative min-h-[300px] overflow-hidden md:min-h-[400px]">
              <img
                src={offer.image}
                alt={offer.category}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute right-5 top-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/60 bg-[#D9F99D] text-center text-[10px] font-bold leading-4 text-[#29231F] shadow-md md:right-8 md:top-8">
                LIMITED
                <br />
                TIME
                <br />
                OFFER
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {offers.length > 1 && (
            <>
              <button
                onClick={previous}
                aria-label="Previous offer"
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E9DFD4] bg-white text-[#29231F] shadow-md transition hover:bg-[#D9F99D] md:left-0 md:h-12 md:w-12"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={next}
                aria-label="Next offer"
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E9DFD4] bg-white text-[#29231F] shadow-md transition hover:bg-[#D9F99D] md:right-0 md:h-12 md:w-12"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Slider Dots */}
        {offers.length > 1 && (
          <div className="mt-6 flex justify-center gap-2.5">
            {offers.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActive(index)}
                aria-label={`Show ${item.category} offer`}
                aria-current={active === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  active === index
                    ? "w-8 bg-[#D9F99D] ring-1 ring-neutral-400"
                    : "w-2.5 bg-neutral-300 hover:bg-[#D9F99D]"
                }`}
              />
            ))}
          </div>
        )}

        {/* Offer Category Mini Cards */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {offers.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActive(index)}
              className={`group overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                active === index
                  ? "border-[#D9F99D] shadow-md ring-2 ring-[#D9F99D]"
                  : "border-[#E9DFD4] hover:border-neutral-300"
              }`}
            >
              <div className="relative h-36 overflow-hidden bg-[#F5F2ED] md:h-44">
                <img
                  src={item.image}
                  alt={item.category}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-2.5 top-2.5 rounded-full bg-[#D9F99D] px-2 py-0.5 text-[10px] font-bold text-[#29231F] shadow-sm">
                  {item.badge}
                </span>
              </div>

              <div className="bg-white/80 p-3">
                <p className="text-xs font-bold text-[#29231F]">
                  {item.category}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-neutral-600">
                  {item.discount}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 border-b border-[#29231F] pb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#29231F] transition hover:border-[#D9F99D]"
          >
            View All Products <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Offer;
