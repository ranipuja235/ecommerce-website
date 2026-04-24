import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-cream-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Architecture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-midnight/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-12">
          <h1 className="text-gold font-playfair text-5xl md:text-7xl mb-6">Our Story</h1>
          <p className="text-cream-white text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            Redefining modern luxury through timeless elegance, exceptional craftsmanship, and unparalleled service since 2010.
          </p>
        </div>
      </section>

      {/* The Philosophy Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&q=80&w=1200" 
                alt="Luxury Details" 
                className="w-full h-auto object-cover shadow-2xl rounded-sm"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <h2 className="text-midnight font-playfair text-3xl md:text-4xl">The LUXE Philosophy</h2>
              <div className="w-16 h-1 bg-gold mx-auto md:mx-0"></div>
              <p className="text-gray-600 leading-relaxed">
                At LUXE, we believe that true luxury is not just about the label, but the experience. It is the culmination of meticulous attention to detail, the finest sourced materials, and a profound respect for the heritage of artisanship.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every piece in our curated collection is selected with an uncompromising eye for quality. Whether it is a flawless diamond, a precision-engineered timepiece, or a hand-stitched leather accessory, we ensure that what you wear is a reflection of exceptional taste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 px-4 md:px-6 bg-midnight text-cream-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=1200" 
                alt="Craftsmanship" 
                className="w-full h-auto object-cover shadow-2xl rounded-sm border border-gold/20"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <h2 className="text-gold font-playfair text-3xl md:text-4xl">Master Craftsmanship</h2>
              <div className="w-16 h-1 bg-gold mx-auto md:mx-0"></div>
              <p className="text-gray-300 leading-relaxed font-light">
                We partner exclusively with master artisans who have dedicated their lives to perfecting their craft. From the historic ateliers of Europe to the hidden workshops of independent watchmakers, our relationships span the globe to bring you creations of unparalleled distinction.
              </p>
              <p className="text-gray-300 leading-relaxed font-light">
                Sustainability and ethical sourcing are at the heart of our operations. We trace the origins of our precious metals and stones to ensure they meet the highest global standards, offering you luxury with a clear conscience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us / Contact */}
      <section className="py-24 px-4 md:px-6 bg-cream-white text-center">
        <div className="container mx-auto max-w-3xl space-y-8">
          <h2 className="text-midnight font-playfair text-3xl md:text-4xl">Experience LUXE</h2>
          <div className="w-16 h-1 bg-gold mx-auto"></div>
          <p className="text-gray-600 leading-relaxed">
            Our flagship boutiques offer a private, bespoke shopping experience tailored entirely to your desires. Schedule an appointment with our luxury consultants to explore the collection in person.
          </p>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-8 text-midnight">
            <div>
              <h4 className="font-medium uppercase tracking-wider text-sm mb-2">New York Boutique</h4>
              <p className="text-gray-500 text-sm">767 5th Ave, New York, NY 10153</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-300"></div>
            <div>
              <h4 className="font-medium uppercase tracking-wider text-sm mb-2">London Boutique</h4>
              <p className="text-gray-500 text-sm">167 New Bond St, London W1S 4AY</p>
            </div>
          </div>
          <div className="pt-8">
            <a href="mailto:concierge@luxe.com" className="inline-block bg-midnight text-gold px-8 py-4 uppercase tracking-widest text-sm hover:bg-black transition-colors duration-300 shadow-md">
              Contact Concierge
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
