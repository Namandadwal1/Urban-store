
import Product from "../components/home/product";
import Sales from "../components/home/sales";
import Category from "../components/home/catogery";
import Offer from "../components/home/offer";

function Home() {
  return (
    <div className="min-h-screen bg-[#FCFBF4]">
      <div className="mx-auto max-w-7xl space-y-12 px-5 py-6">
        <section id="sales">
          <Sales />
        </section>

        <section id="products">
          <Product />
        </section>

        <section id="category">
          <Category />
        </section>

        <section id="offers">
          <Offer />
        </section>
      </div>
    </div>
  );
}

export default Home;