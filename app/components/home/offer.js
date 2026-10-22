"use client"
import React, { useEffect, useState } from 'react'

const offers = [
  {
    category: "MEN'S T-SHIRTS",
    title: 'Buy 2 Get',
    discount: '50% Off',
    description: 'Upgrade your casual look with premium cotton t-shirts made for everyday comfort.',
    badge: '50% OFF',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
    button: 'Shop T-Shirts',
    link: '/shop?category=T-Shirts',
  },
  {
    category: "MEN'S SHIRTS",
    title: 'Flat',
    discount: '40% Off',
    description: 'Discover timeless shirts that bring style and confidence to every occasion.',
    badge: '40% OFF',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    button: 'Shop Shirts',
    link: '/shop?category=Shirts',
  },
  {
    category: 'DENIM COLLECTION',
    title: 'Up To',
    discount: '60% Off',
    description: 'Find your perfect fit with premium denim made for your everyday wardrobe.',
    badge: '60% OFF',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
    button: 'Shop Denim',
    link: '/shop?category=Jeans',
  },
  {
    category: "MEN'S JACKETS",
    title: 'Flat',
    discount: '45% Off',
    description: 'Layer up with versatile jackets designed to make a statement.',
    badge: '45% OFF',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800',
    button: 'Shop Jackets',
    link: '/shop?category=Jackets',
  },
]

function Offer() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % offers.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  const offer = offers[active]

  const previous = () => {
    setActive((prev) => (prev - 1 + offers.length) % offers.length)
  }

  const next = () => {
    setActive((prev) => (prev + 1) % offers.length)
  }

  return (
    <section className="bg-[#FAF7F2] px-5 py-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#A56A43]">
            Limited Time Only
          </p>

          <h2 className="text-3xl font-medium text-neutral-900 md:text-5xl">
            Best <span className="text-[#A56A43]">Deals</span> & Offers
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base">
            Upgrade your wardrobe with exclusive offers.
            Limited-time deals, just for you.
          </p>
        </div>

        {/* Main Offer Slider */}
        <div className="relative">
          <div
            key={active}
            className="grid overflow-hidden rounded-2xl bg-[#F0E5D8] md:min-h-[390px] md:grid-cols-2"
          >

            {/* Offer Details */}
            <div className="flex flex-col items-start justify-center p-7 md:p-12 lg:p-16">
              <span className="mb-6 rounded-full bg-[#A56A43] px-4 py-2 text-xs font-medium tracking-wider text-white">
                {offer.badge}
              </span>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#A56A43]">
                {offer.category}
              </p>

              <h3 className="text-4xl font-medium leading-tight text-neutral-900 md:text-5xl lg:text-6xl">
                {offer.title}
                <span className="mt-1 block text-[#A56A43]">
                  {offer.discount}
                </span>
              </h3>

              <p className="mt-5 max-w-md text-sm leading-6 text-neutral-600 md:text-base">
                {offer.description}
              </p>

              <a
                href={offer.link}
                className="mt-7 inline-flex items-center gap-3 rounded-md bg-[#A56A43] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#875333]"
              >
                {offer.button}
                <span>↗</span>
              </a>
            </div>

            {/* Offer Image */}
            <div className="relative min-h-[300px] overflow-hidden md:min-h-[390px]">
              <img
                src={offer.image}
                alt={offer.category}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute right-5 top-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#A56A43] text-center text-xs font-medium leading-5 text-white md:right-8 md:top-8">
                LIMITED
                <br />
                TIME
                <br />
                OFFER
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={previous}
            aria-label="Previous offer"
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#A56A43]/30 bg-[#FAF7F2] text-xl text-[#A56A43] transition hover:bg-[#A56A43] hover:text-white md:left-0 md:h-12 md:w-12"
          >
            ←
          </button>

          <button
            onClick={next}
            aria-label="Next offer"
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#A56A43]/30 bg-[#FAF7F2] text-xl text-[#A56A43] transition hover:bg-[#A56A43] hover:text-white md:right-0 md:h-12 md:w-12"
          >
            →
          </button>
        </div>

        {/* Slider Dots */}
        <div className="mt-6 flex justify-center gap-3">
          {offers.map((item, index) => (
            <button
              key={item.category}
              onClick={() => setActive(index)}
              aria-label={`Show ${item.category} offer`}
              aria-current={active === index ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                active === index
                  ? 'w-8 bg-[#A56A43]'
                  : 'w-2.5 bg-[#DCC9B8] hover:bg-[#A56A43]'
              }`}
            />
          ))}
        </div>

        {/* Offer Categories */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {offers.map((item, index) => (
            <button
              key={item.category}
              onClick={() => setActive(index)}
              className={`group overflow-hidden rounded-xl border text-left transition ${
                active === index
                  ? 'border-[#A56A43]'
                  : 'border-transparent'
              }`}
            >
              <div className="relative h-36 overflow-hidden bg-[#F0E5D8] md:h-44">
                <img
                  src={item.image}
                  alt={item.category}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-2 top-2 rounded bg-[#A56A43] px-2 py-1 text-[10px] text-white">
                  {item.badge}
                </span>
              </div>

              <div className="bg-white/60 p-3">
                <p className="text-xs font-medium text-neutral-900">
                  {item.category}
                </p>
                <p className="mt-1 text-sm text-[#A56A43]">
                  {item.discount}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/shop"
            className="inline-block border-b border-[#A56A43] pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#A56A43] transition hover:text-neutral-900"
          >
            View All Offers ↗
          </a>
        </div>

      </div>
    </section>
  )
}

export default Offer