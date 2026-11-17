export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <h2 className="text-white text-2xl font-serif italic mb-4">VELORA</h2>
          <p className="text-sm max-w-sm">
            Curating modern elegance. We blend contemporary design with timeless quality to bring you a collection that defines sophistication.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>New Arrivals</li>
            <li>Dresses</li>
            <li>Outerwear</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>Shipping</li>
            <li>Returns</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-800 text-xs text-neutral-600">
        © {new Date().getFullYear()} Velora. All rights reserved.
      </div>
    </footer>
  );
}