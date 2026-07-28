export const business = {
  name: "Gee Hair NG",
  phoneDisplay: "+234 803 558 9586",
  phoneInternational: "2348035589586",
  email: "ochijegoodness9@gmail.com",
  location: "Karsana, Federal Capital Territory, Nigeria",
  shortLocation: "Karsana, Abuja",
  hours: "Daily · 07:00–23:00",
  facebook: "Hair Addict"
};

export const formatNaira = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value).replace("NGN", "₦");

export const whatsappLink = (message: string) =>
  `https://wa.me/${business.phoneInternational}?text=${encodeURIComponent(message)}`;
