import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle, MoveUpRight, Scissors, SwatchBook, Weight } from "lucide-react";
import { CustomerGuidance } from "@/components/CustomerGuidance";
import { ProductCard } from "@/components/ProductCard";
import { ServicesShowcase } from "@/components/ServicesShowcase";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { getPublicCatalog } from "@/lib/catalog-backend";
import { business, whatsappLink } from "@/lib/business";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { products } = await getPublicCatalog();
  const featuredProducts = products.filter((product) => product.featured && product.active);
  return (
    <>
      <section className="hero page-shell">
        <div className="hero-copy">
          <p className="eyebrow">100% virgin hair · Abuja, Nigeria</p>
          <h1>Beauty delivered. <em>Confidence unleashed.</em></h1>
          <p className="lead">At Gee Hair NG, we believe great hair is more than a look—it&apos;s confidence in every strand. We curate premium-quality human hair known for its beauty, durability and natural finish, ensuring every customer enjoys luxury without compromise, supported by exceptional service and trusted nationwide delivery.</p>
          <div className="button-row"><Link className="button button-dark" href="/shop">Choose your hair <MoveUpRight size={17} /></Link><WhatsAppLink className="text-link" href={whatsappLink("Hello Gee Hair NG, please help me choose the right hair texture and length.")} eventName="general_whatsapp_enquiry" eventData={{ placement: "hero" }}>Ask Gee on WhatsApp <ArrowRight size={15} /></WhatsAppLink></div>
          <div className="verified-offer"><span className="service-icon service-icon-compact"><Scissors size={19} strokeWidth={1.6} /></span><p><strong>First time ordering?</strong><br />Your wigging service is complimentary.</p></div>
        </div>
        <div className="hero-gallery">
          <div className="hero-main-image"><Image src="/products/bouncy-curls.jpeg" alt="Gee Hair NG Bouncy Curls wig" fill priority sizes="(max-width: 800px) 90vw, 48vw" /><span className="vertical-caption">BOUNCY CURLS · 12–34 INCHES</span></div>
          <div className="hero-small-image"><Image src="/products/bone-straight.jpeg" alt="Gee Hair NG Bone Straight wig" fill sizes="(max-width: 800px) 45vw, 20vw" /></div>
          <div className="roundel"><span>G</span><p>Beauty delivered</p></div>
        </div>
      </section>

      <section className="promise-bar"><p><span>01</span> 100% virgin hair</p><p><span>02</span> 100g per bundle</p><p><span>03</span> All colours</p><p><span>04</span> Free first-time wigging</p></section>

      <section className="section page-shell" id="featured">
        <div className="section-heading"><div><p className="eyebrow">Currently available</p><h2>Choose your <em>texture.</em></h2></div><div><p>Every visible product is part of Gee Hair NG’s real collection. Choose a texture, configure your inches, colour and bundle quantity, then continue directly on WhatsApp.</p><Link className="text-link" href="/shop">View the full collection <ArrowRight size={15} /></Link></div></div>
        <div className="product-grid">{featuredProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div>
      </section>

      <section className="custom-section page-shell">
        <div className="custom-image"><Image src="/products/pixie-curls.jpeg" alt="Gee Hair NG Pixie Curls in burgundy" fill sizes="(max-width: 800px) 100vw, 50vw" /><span>100 grams.<br />Every bundle.</span></div>
        <div className="custom-copy"><p className="eyebrow">A first order worth remembering</p><h2>Your hair, <em>wigged for free.</em></h2><p>Buying from Gee Hair NG for the first time? Select your premium virgin hair and request complimentary wigging while configuring your order.</p><ul><li><Check size={17} /> Choose your preferred inches</li><li><Check size={17} /> Request any available colour</li><li><Check size={17} /> Select the number of 100g bundles</li></ul><Link className="button button-cream" href="/shop">Choose a texture <MoveUpRight size={17} /></Link></div>
      </section>

      <section className="story section page-shell" id="story">
        <div className="story-copy"><p className="eyebrow">The Gee Hair difference</p><h2>Confidence you can <em>wear.</em></h2><p>Gee Hair NG supplies 100% virgin hair extensions in different textures, lengths and colours. Every bundle weighs 100g, so you always know exactly what you are selecting.</p><p>The service remains personal from first enquiry to final confirmation: you configure what you want in the app and continue the conversation directly with Gee on WhatsApp.</p><WhatsAppLink className="text-link" href={whatsappLink("Hello Gee Hair NG, I would like to learn more about your 100% virgin hair.")} eventName="general_whatsapp_enquiry" eventData={{ placement: "story" }}>Talk to Gee Hair NG <ArrowRight size={15} /></WhatsAppLink></div>
        <div className="story-collage"><div className="story-images"><div className="story-tall"><Image src="/products/deep-waves.jpeg" alt="Gee Hair NG Deep Waves" fill sizes="50vw" /></div><div className="story-small"><Image src="/products/bone-straight.jpeg" alt="Gee Hair NG Bone Straight" fill sizes="30vw" /></div></div><p className="story-tagline">{business.tagline}.</p></div>
      </section>

      <section className="service-facts"><article><span className="service-icon"><Weight size={26} strokeWidth={1.5} /></span><h3>100g bundles</h3><p>Each bundle is sold by weight, with 100 grams in every bundle.</p></article><article><span className="service-icon"><SwatchBook size={26} strokeWidth={1.5} /></span><h3>All colours</h3><p>Tell Gee your preferred shade while configuring your WhatsApp order.</p></article><article><span className="service-icon"><Scissors size={26} strokeWidth={1.5} /></span><h3>Free first-time wigging</h3><p>First-time customers can request complimentary wigging with their order.</p></article></section>

      <section className="steps section page-shell" id="how-to-order"><div className="section-heading"><div><p className="eyebrow">Simple from selection to confirmation</p><h2>How to <em>order.</em></h2></div><p>No fake checkout and no hidden transaction page. Your configured request goes directly to the official Gee Hair NG WhatsApp.</p></div><div className="step-grid"><article><span>01</span><h3>Choose your texture</h3><p>Browse the current collection and open the product you want.</p></article><article><span>02</span><h3>Configure your hair</h3><p>Select inches, colour, number of 100g bundles and first-time wigging.</p></article><article><span>03</span><h3>Confirm on WhatsApp</h3><p>Gee confirms your price, availability, delivery and payment directly.</p></article></div></section>

      <div className="page-shell"><ServicesShowcase compact /><div className="services-view-all"><Link className="button button-dark" href="/services">Explore all other services <MoveUpRight size={17} /></Link></div></div>

      <div className="page-shell"><CustomerGuidance compact /></div>

      <section className="contact-cta page-shell"><div><p className="eyebrow">Personal service, one message away</p><h2>Let’s find your <em>next look.</em></h2><p>Questions, colour requests or ready to order? Message Gee Hair NG directly.</p></div><WhatsAppLink className="button button-dark" href={whatsappLink("Hello Gee Hair NG, I would like to make an enquiry.")} eventName="general_whatsapp_enquiry" eventData={{ placement: "home_footer_cta" }}><MessageCircle size={18} /> Chat on WhatsApp</WhatsAppLink></section>
    </>
  );
}
