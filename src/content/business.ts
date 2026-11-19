import data from "@/data/catalog.json";

/**
 * Business facts from ecoffee.mn (Zochil shop 2168: shop settings, address, payment and delivery rules, delivery option,
 * FAQ, about page, posts, banners), read on 2026-11-19. Nothing here is invented; open points are in
 * docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;
const zone = shop.delivery[0];

export const business = {
  name: "Ecoffee",
  domain: "ecoffee.mn",
  company: "«Ай Жи Ти Си» ХХК (International Global Trading Company)",
  /** The tagline written under the logo. */
  tagline: "Кофены ертөнцөд зочил.",
  description:
    "Bialetti мока пот, Lavazza, Borbone кофе, 1883 сироп, бариста хэрэгсэл, кофе машин болон бариста сургалт. 2015 оноос хойш Италийн кофены брэндүүдийг албан ёсны эрхтэй худалдаалж байна.",
  phone: { display: "8003-2255", tel: "+97680032255" },
  email: shop.email,
  facebook: "https://www.facebook.com/www.ecoffee.mn",
  instagram: shop.instagram,
  /** About page, word for word. */
  about: shop.about,
  /** What the company does besides the web shop (Zochil shop description). */
  services: [
    { title: "Кофе ханган нийлүүлэлт", text: "Сүлжээ дэлгүүр, зочид буудал, ресторан, кофе шоп (HORECA), оффист." },
    { title: "Lavazza эрх", text: "Lavazza кофе чанах эрх олгоно (HORECA)." },
    { title: "Тоног төхөөрөмж", text: "Кофе машин, бутлагч болон дагалдах хэрэгсэл нийлүүлнэ." },
    { title: "Кофены сургалт", text: "Хувь хүн, байгууллагад кофены мэдлэг олгох, бариста бэлтгэх сургалт." },
    { title: "Catering", text: "Сургалт, семинар, хурлын завсарлагад кофе ба амттан." },
    { title: "Зөвлөгөө", text: "Оффисын кофе булан тохижуулах, шинэ кофе шоп нээх, HORECA үйлчилгээг сайжруулах." },
    { title: "Үзэсгэлэн, түрээс", text: "Үзэсгэлэн яармагт кофе булангаар үйлчилж, кофе машин түрээслүүлнэ." },
  ],
  facts: [
    { big: "2015", line: "оноос кофены салбарт" },
    { big: "6", line: "брэндийг албан ёсны эрхтэй худалдаална" },
    { big: "2", line: "дэлгүүр Улаанбаатарт" },
  ],
  /** The two shops in the Zochil address (open question 3: a newer banner names Хүннү Молл for branch 2). */
  stores: [
    { name: "Ecoffee дэлгүүр", place: "Сүхбаатар дүүрэг, 1-р хороо", line: "Төв номын сангийн урд, Гурван гал худалдааны төв, B1 давхар", phone: { display: "8003-2255", tel: "+97680032255" } },
    { name: "Ecoffee mall", place: "Чингэлтэй дүүрэг, 4-р хороо, 18-р байр", line: "5-р сургуулийн баруун урд, Ecaffe кофе шопын зэргэлдээ хаалга", phone: { display: "8025-0255", tel: "+97680250255" } },
  ],
  /**
   * Zochil payment rule: full prepayment by bank transfer to a Khan Bank account with the order code. The QPay method
   * exists (has_qpay, template Z_ECOFFEE_INVOICE) but is disabled on Zochil; the website offers QPay through erxes and
   * the shop's own transfer rule (open question 1).
   */
  payments: [
    { id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө. Захиалга өгсний дараа төлбөрийн хуудас нээгдэнэ." },
    { id: "transfer", name: "Дансаар шилжүүлэх", note: "Хаан банкны дансанд захиалгын кодоо гүйлгээний утгад бичиж шилжүүлнэ." },
  ],
  bank: { bank: "Хаан банк", account: "5011130146", holder: "Ж.Оюунжаргал" },
  /** Zochil delivery option «Үндсэн хүргэлт» (id 454): Ulaanbaatar, 8,000₮, free above 200,000₮. No countryside option. */
  delivery: [{ id: "city", name: "Улаанбаатар", note: "Хаяг дээр тань хүргэнэ", fee: zone?.price ?? 8000, freeFrom: zone?.freeFrom ?? 200000 }],
  rules: {
    /** Zochil payment rule, word for word (the account is on the order page). */
    payment: "100 хувь төлбөрөө төлж захиалгаа баталгаажуулна.",
    /** Zochil delivery rule, word for word. */
    delivery: "Хүргэлтийн хөлс 8,000 төгрөг. 200,000 төгрөгөөс дээш хүргэлт үнэгүй.",
    countryside: "Онлайн захиалга одоогоор зөвхөн Улаанбаатарт хүргэгдэнэ. Орон нутагт илгээх бол утсаар холбогдоорой.",
    preorder: "Урьдчилсан захиалгын бараа захиалснаас хойш 14–30 хоногт ирнэ.",
    ebarimt: "И-баримтыг төлбөр баталгаажсаны дараа erxes-ээс албан ёсоор олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
  /** Zochil FAQ: all three are about moka pots. */
  faq: shop.faq,
} as const;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export type PaymentId = (typeof business.payments)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id) ?? business.delivery[0];
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Zochil: 8,000₮; 0₮ when the goods are above 200,000₮ (open question 4: exactly 200,000₮). */
export function deliveryFee(id: DeliveryId, subtotal: number): number {
  const d = deliveryOption(id);
  return d.freeFrom && subtotal > d.freeFrom ? 0 : d.fee;
}

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Хүлээгдэж байна", note: "Захиалга ирсэн, төлбөр хүлээгдэж байна" },
  { id: "confirmed", name: "Баталгаажсан", note: "QPay эсвэл дансны төлбөр орсон" },
  { id: "packing", name: "Бэлтгэж байна", note: "Кофе, хэрэгслийг тань савлаж байна" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "Жолооч тантай утсаар холбогдоно" },
  { id: "delivered", name: "Хүргэгдсэн", note: "Хүлээн авсан" },
  { id: "cancelled", name: "Цуцлагдсан", note: "Төлбөр төлөгдөөгүй" },
] as const;
