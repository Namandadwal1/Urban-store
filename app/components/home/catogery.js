import React from 'react'

const categories = [
  {
    name: 'T-Shirts',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Shirts',
    image:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Jeans',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Trousers',
    image:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Jackets',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Ethnic Wear',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
  },
]

function Category() {
  return (
    <section className="bg-[#FAF7F2] px-5 py-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
              Find Your Style
            </p>
            <h2 className="text-3xl font-medium text-neutral-900 md:text-5xl">
              Shop by Category
            </h2>
          </div>

          <a
            href="/shop"
            className="hidden border-b border-neutral-900 pb-1 text-sm md:block"
          >
            View All Products
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#EAE5DC]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="flex items-center justify-between border-b border-neutral-300 py-4">
                <h3 className="text-sm font-medium text-neutral-900 md:text-base">
                  {category.name}
                </h3>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>

        <a
          href="/shop"
          className="mt-8 inline-block border-b border-neutral-900 pb-1 text-sm md:hidden"
        >
          View All Products ↗
        </a>
      </div>
    </section>
  )
}

export default Category