export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function assetPath(folder: string, file: string) {
  return encodeURI(`/assets/catalog/${folder}/${file}`);
}

export function buildWhatsAppLink(phone: string, productName?: string) {
  const message = productName
    ? `I am interested in ${productName}. Please share pricing, lead time and catalogue details.`
    : "Hello, I would like to know more about the SUN SEATINGS collection.";

  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function buildPhoneLink(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function cleanProductName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/\bw:o\b/gi, "without arm")
    .replace(/\bw arm\b/gi, "with arm")
    .replace(/\s+-\s+/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${random}`;
}
