import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MoveUpRight, Star } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { business, whatsappLink } from "@/lib/business";

export default function Home() {
  return (
    <>
      <section className="hero page-shell">
        <div className="hero-copy">
          <p className="eyebrow">Premium hair · Abuja, Nigeria</p>
          <h1>Hair that makes an <em>entrance.</em></h1>
          <p className="lead">Carefully selected luxury bundles, flawless textures and statement wigs made for the woman who refuses to blend in.</p>
          <div className="button-row"><Link className="button button-dark" href="/shop">Shop the collection <MoveUpRight size={17} /></Link><a className="text-link" href={whatsappLink("Hello Gee Hair NG, I would like help choosing the right hair for me.")} target="_blank" rel="noreferrer">Get a recommendation <ArrowRight size={15} /></a></div>
          <div className="mini-proof"><div className="proof-faces"><span>A</span><span>N</span><span>K</span></div><div><strong>Trusted by hair lovers</strong><p>Every order quality checked</p></div></div>
        </div>
        <div className="hero-gallery">
          <div className="hero-main-image"><Image src="https://images.unsplash.com/photo-1604514628550-37477afdf4e3?auto=format&fit=crop&w=1200&q=90" alt="Woman wearing long polished waves" fill priority sizes="(max-width: 800px) 90vw, 48vw" /><span className="vertical-caption">SIGNATURE WAVES · 01</span></div>
          <div className="hero-small-image"><Image src="https://images.unsplash.com/photo-1616847220575-31b062a4cd05?auto=format&fit=crop&w=700&q=90" alt="Woman with voluminous curly hair" fill sizes="(max-width: 800px) 45vw, 20vw" /></div>
          <div className="roundel"><span>G</span><p>Luxury in every strand</p></div>
        </div>
      </section>

      <section className="promise-bar"><p><span>01</span> Premium textures</p><p><span>02</span> Carefully sourced</p><p><span>03</span> Personal guidance</p><p><span>04</span> Nationwide delivery</p></section>

      <section className="section page-shell" id="featured">
        <div className="section-heading"><div><p className="eyebrow">The edit</p><h2>Find your <em>signature.</em></h2></div><div><p>From sleek bone straight to cloud-soft curls, every texture is selected for fullness, movement and a beautiful finish.</p><Link className="text-link" href="/shop">View all pieces <ArrowRight size={15} /></Link></div></div>
        <div className="product-grid">{products.filter((product) => product.featured).map((product) => <ProductCard product={product} key={product.id} />)}</div>
      </section>

      <section className="custom-section page-shell">
        <div className="custom-image"><Image src="https://images.unsplash.com/photo-1595475884562-073c30d45670?auto=format&fit=crop&w=1200&q=88" alt="Stylist working carefully on luxury hair" fill sizes="(max-width: 800px) 100vw, 50vw" /><span>Selected with care.<br />Styled for you.</span></div>
        <div className="custom-copy"><p className="eyebrow">Not sure what to choose?</p><h2>Your dream hair, <em>personally sourced.</em></h2><p>Tell us your preferred texture, length, colour and budget. We will help you find the right match and confirm every detail before your order.</p><ul><li><Check size={17} /> Texture and length consultation</li><li><Check size={17} /> Clear order confirmation</li><li><Check size={17} /> Delivery updates on WhatsApp</li></ul><a className="button button-cream" href={whatsappLink("Hello Gee Hair NG, I would like to place a custom hair order.")} target="_blank" rel="noreferrer">Start a custom order <MoveUpRight size={17} /></a></div>
      </section>

      <section className="story section page-shell" id="story">
        <div className="story-copy"><p className="eyebrow">More than good hair</p><h2>Confidence you can <em>wear.</em></h2><p>Gee Hair NG is your trusted plug for premium luxury hair and extensions in your preferred lengths and textures. Based in Karsana, Abuja, we pair beautiful products with thoughtful, one-to-one service.</p><p>Our goal is simple: help every client step out feeling polished, powerful and completely herself.</p><a className="text-link" href={whatsappLink("Hello Gee Hair NG, I would like to learn more about your products.")} target="_blank" rel="noreferrer">Meet Gee Hair NG <ArrowRight size={15} /></a></div>
        <div className="story-collage"><div className="story-tall"><Image src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=88" alt="Confident woman with long hair" fill sizes="50vw" /></div><div className="story-small"><Image src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=88" alt="Healthy textured hair" fill sizes="30vw" /></div><span>Luxury, without<br />the guesswork.</span></div>
      </section>

      <section className="steps section page-shell"><div className="section-heading"><div><p className="eyebrow">Simple from start to slay</p><h2>How to <em>order.</em></h2></div><p>Shop in the app or speak directly with us on WhatsApp. We keep the process personal, clear and easy.</p></div><div className="step-grid"><article><span>01</span><h3>Choose your look</h3><p>Browse our edit or send us an inspiration photo for a recommendation.</p></article><article><span>02</span><h3>Confirm the details</h3><p>Select length and quantity. We confirm availability, cost and delivery.</p></article><article><span>03</span><h3>Receive and glow</h3><p>Your order is prepared with care, with progress updates along the way.</p></article></div></section>

      <section className="testimonial"><div className="stars"><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /></div><blockquote>“The quality was even better than I expected. Gee helped me choose the perfect length, kept me updated, and the hair came so full and soft.”</blockquote><p><strong>Amara O.</strong> · Verified client, Abuja</p></section>

      <section className="contact-cta page-shell"><div><p className="eyebrow">Come say hello</p><h2>Let’s find your <em>next look.</em></h2><p>Questions, custom requests, or ready to order? We are open {business.hours.toLowerCase()}.</p></div><a className="button button-dark" href={whatsappLink("Hello Gee Hair NG, I would like to make an enquiry.")} target="_blank" rel="noreferrer">Chat on WhatsApp <MoveUpRight size={17} /></a></section>
    </>
  );
}
