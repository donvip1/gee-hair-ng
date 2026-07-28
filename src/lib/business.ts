export const business = {
  name: "Gee Hair NG",
  tagline: "Beauty delivered, Confidence unleashed",
  phoneDisplay: "+234 805 558 9586",
  phoneInternational: "2348055589586",
  email: "geeofficialng@gmail.com",
  location: "Karsana, Federal Capital Territory, Nigeria",
  shortLocation: "Karsana, Abuja",
  hours: "Daily · 07:00–23:00",
  facebook: "Hair Addict",
  facebookUrl: "https://www.facebook.com/search/top?q=Hair%20Addict"
};

export const whatsappLink = (message: string) =>
  `https://wa.me/${business.phoneInternational}?text=${encodeURIComponent(message)}`;
