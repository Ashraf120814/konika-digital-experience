/**
 * Indian jewellery customer scenario library for Saru.
 *
 * Covers common real-world intents: wedding, festivals, hallmark, making charges,
 * old-gold exchange, mangalsutra, Hinglish, gifts, budgets, sizing, GST, and more.
 *
 * Pattern matching is intentionally broad so one scenario covers many phrasings
 * (hundreds of natural variants per theme). Admins can still add FAQs in Knowledge Management.
 */

import type { QueryCategory } from '../../types/saru';

export interface Scenario {
  id: string;
  /** Keywords / phrases (matched case-insensitively; any hit scores) */
  patterns: string[];
  category: QueryCategory;
  subcategory: string;
  /** Response grounded in demo/public knowledge — no invented prices or policies */
  response: string;
  confidence: number;
  tags: string[];
}

export const indianScenarios: Scenario[] = [
  // ——— Greetings & language ———
  {
    id: 'greet-hi',
    patterns: ['namaste', 'namaskar', 'vanakkam', 'hello ji', 'hi ji', 'good morning', 'good evening', 'namaskara'],
    category: 'General',
    subcategory: 'Greeting',
    response:
      'Namaste! I’m Saru, your virtual customer-support assistant. I can help with products, orders, gold schemes, store visits, and jewellery care. How may I help you today?',
    confidence: 95,
    tags: ['greeting', 'hinglish'],
  },
  {
    id: 'greet-help',
    patterns: ['help me', 'madad', 'help chahiye', 'i need help', 'assist me', 'guide me'],
    category: 'General',
    subcategory: 'Help request',
    response:
      'Of course — I’m here to help. You can ask about a product, order status (share Order ID like KJ10245), purchase plans, shipping, exchange, or our Chennai store. What would you like to know?',
    confidence: 90,
    tags: ['help'],
  },

  // ——— Hallmark & purity ———
  {
    id: 'hallmark',
    patterns: ['hallmark', 'hall marked', 'bis hallmark', 'huid', 'purity certificate', 'is it hallmarked'],
    category: 'Policies',
    subcategory: 'Hallmarking',
    response:
      'In India, BIS hallmarking confirms gold purity (for example 22K / 916). Many pieces carry hallmark stamps; for a specific product, please check the product page or ask in-store with the invoice. I don’t invent certificate numbers — if you need verification for a particular order, share the Order ID or visit the store.',
    confidence: 88,
    tags: ['hallmark', 'bis', 'purity'],
  },
  {
    id: 'purity-22k',
    patterns: ['22k', '22 kt', '22 carat', '22 karat', '916 gold', 'what is 22k', '22k meaning'],
    category: 'Policies',
    subcategory: 'Gold purity',
    response:
      '22K gold is commonly marked 916 (91.6% pure gold). It is widely preferred in India for bridal and festive jewellery because of its rich colour, with enough alloy for durability. Our catalogue lists purity on each product (e.g. 22K or 18K). For bill breakdown, gold value is based on weight and purity at the applicable rate.',
    confidence: 90,
    tags: ['22k', '916', 'purity'],
  },
  {
    id: 'purity-18k',
    patterns: ['18k', '18 kt', '18 carat', '18 karat', '750 gold', 'difference 18k 22k'],
    category: 'Policies',
    subcategory: 'Gold purity',
    response:
      '18K gold is about 75% pure gold (often marked 750). It is slightly harder than 22K and is common for diamond and everyday pieces. 22K has a richer yellow tone and is traditional for many Indian bridal sets. Product pages show the purity for each design.',
    confidence: 90,
    tags: ['18k', 'purity'],
  },

  // ——— Making charges & wastage ———
  {
    id: 'making-charges',
    patterns: ['making charge', 'making charges', 'labour charge', 'labor charge', 'craftsmanship charge', 'what is making'],
    category: 'Policies',
    subcategory: 'Making charges',
    response:
      'Making charges cover craftsmanship and design work, separate from the gold value (weight × rate × purity). They vary by design complexity. On product pages in this concept you can see an illustrative breakdown (gold value, making, stones, GST). Final billed making charges are confirmed at purchase or on the invoice — I won’t invent a percentage that isn’t listed.',
    confidence: 88,
    tags: ['making', 'charges', 'bill'],
  },
  {
    id: 'wastage',
    patterns: ['wastage', 'wastage percentage', 'wastage charge', 'what is wastage', 'no wastage'],
    category: 'Policies',
    subcategory: 'Wastage',
    response:
      'Wastage is a charge some jewellers apply related to manufacturing loss, often shown as a percentage on net gold weight. It depends on the design and scheme terms. Under publicly shared Zero% Gold Purchase Plan Option A, maturity benefits can include no wastage up to 10% on 916 gold jewellery (terms apply). For a specific piece, rely on the invoice or store confirmation.',
    confidence: 85,
    tags: ['wastage', 'scheme'],
  },
  {
    id: 'bill-breakup',
    patterns: ['bill breakup', 'bill breakdown', 'invoice detail', 'how is price calculated', 'gold rate today', 'today gold rate'],
    category: 'Policies',
    subcategory: 'Pricing breakdown',
    response:
      'A typical Indian jewellery bill includes: gold value (net weight × purity factor × rate), making charges, stone/bead value if any, and GST. Live gold rates change daily; the rate applied is the one at the time of billing. Product pages here show demo prices and an illustrative breakup. For today’s rate on a store purchase, please check with the showroom.',
    confidence: 86,
    tags: ['bill', 'gst', 'gold rate'],
  },
  {
    id: 'gst',
    patterns: ['gst', 'gst on jewellery', 'tax on gold', 'gst percentage', 'including gst'],
    category: 'Policies',
    subcategory: 'GST',
    response:
      'GST applies on jewellery as per current Indian tax rules and is usually shown on the invoice. In this demo catalogue, prices are shown as listed amounts; treat any breakup GST line as illustrative. For exact tax on your bill, refer to the tax invoice from the store or checkout.',
    confidence: 84,
    tags: ['gst', 'tax'],
  },

  // ——— Old gold / exchange ———
  {
    id: 'old-gold',
    patterns: ['old gold', 'exchange gold', 'gold exchange', 'scrap gold', 'sell old jewellery', 'purana sona', 'exchange offer'],
    category: 'Returns',
    subcategory: 'Old gold exchange',
    response:
      'Many Indian customers exchange old gold towards new jewellery. Eligibility, purity testing, and the rate offered are decided at the store after evaluation — I cannot quote an exchange rate online. Please bring your old jewellery and ID to the showroom, or ask a consultant. If you have an ongoing order concern, share the Order ID.',
    confidence: 87,
    tags: ['old gold', 'exchange'],
  },

  // ——— Wedding & bridal ———
  {
    id: 'wedding-set',
    patterns: ['wedding jewellery', 'bridal set', 'bride jewellery', 'shaadi', 'wedding set', 'bridal collection', 'for my wedding'],
    category: 'Products',
    subcategory: 'Bridal / wedding',
    response:
      'For weddings, customers often look at temple sets, polki, antique finishes, mangalsutra, and full bridal sets. You can browse Bridal and Temple collections on the site, or use Find My Jewellery with occasion “Wedding”. I can also suggest pieces from our demo catalogue if you share a budget range (e.g. under ₹50K or ₹1L+).',
    confidence: 88,
    tags: ['wedding', 'bridal'],
  },
  {
    id: 'engagement-ring',
    patterns: ['engagement ring', 'propose', 'solitaire', 'engagement', 'proposal ring'],
    category: 'Products',
    subcategory: 'Engagement',
    response:
      'Engagement rings in our demo catalogue include minimal solitaire bands and statement polki styles. Filter by Engagement occasion or open Diamond / Polki collections. Share a budget and I’ll list matching pieces from the catalogue only — I won’t invent prices.',
    confidence: 88,
    tags: ['engagement', 'ring'],
  },
  {
    id: 'mangalsutra',
    patterns: ['mangalsutra', 'mangal sutra', 'thali', 'nuptial chain', 'black bead'],
    category: 'Products',
    subcategory: 'Mangalsutra',
    response:
      'Mangalsutra is an important post-wedding piece in many Indian traditions. Our catalogue includes classic gold and diamond-accented styles. You can open the Mangalsutra category for demo products and prices. For custom length or regional thali designs, a store consultation is best.',
    confidence: 90,
    tags: ['mangalsutra'],
  },

  // ——— Festivals ———
  {
    id: 'diwali',
    patterns: ['diwali', 'deepavali', 'diwali offer', 'diwali jewellery', 'for diwali'],
    category: 'Products',
    subcategory: 'Festival — Diwali',
    response:
      'Diwali is a popular time for gold and festive jewellery in India. Browse Festive occasion filters, temple, meenakari, or gold collections. Any live discount must be listed in offers knowledge or at the store — I won’t invent a Diwali percentage. Would you like suggestions under a budget?',
    confidence: 88,
    tags: ['diwali', 'festival'],
  },
  {
    id: 'akshaya',
    patterns: ['akshaya tritiya', 'akshaya tritiyan', 'akt', 'akha teej', 'auspicious day buy gold'],
    category: 'Products',
    subcategory: 'Festival — Akshaya Tritiya',
    response:
      'Akshaya Tritiya is considered an auspicious day by many families to buy gold. You can explore gold jewellery and purchase plans ahead of the day. Scheme enrolment and billing still follow official terms. I can help you shortlist catalogue pieces or explain the public Zero% plan structure.',
    confidence: 88,
    tags: ['akshaya tritiya', 'festival'],
  },
  {
    id: 'navratri-pongal-onam',
    patterns: ['navratri', 'durga puja', 'pongal', 'onam', 'ugadi', 'sankranti', 'karva chauth', 'teej', 'varalakshmi'],
    category: 'Products',
    subcategory: 'Festival jewellery',
    response:
      'Festive occasions are a wonderful time for traditional and temple jewellery. Try occasion “Festive” on the site, or Temple / Meenakari / Antique collections. Tell me who it’s for (self, mother, gift) and an approximate budget for catalogue suggestions.',
    confidence: 86,
    tags: ['festival'],
  },

  // ——— Gifts ———
  {
    id: 'gift-mother',
    patterns: ['gift for mother', 'mummy ke liye', 'for mom', 'mother gift', 'maa ke liye'],
    category: 'Products',
    subcategory: 'Gift — Mother',
    response:
      'For mothers, customers often choose elegant earrings, a lightweight chain, pendant, or classic bangles. Share a budget (e.g. under ₹25K or ₹25–50K) and I’ll suggest matching items from the demo catalogue.',
    confidence: 87,
    tags: ['gift', 'mother'],
  },
  {
    id: 'gift-wife',
    patterns: ['gift for wife', 'for my wife', 'anniversary gift', 'wife ko gift'],
    category: 'Products',
    subcategory: 'Gift — Wife',
    response:
      'Anniversary or surprise gifts for a spouse often include diamond studs, a solitaire-style ring, or a refined necklace. Tell me the occasion and budget and I’ll list catalogue options only.',
    confidence: 87,
    tags: ['gift', 'wife'],
  },
  {
    id: 'gift-sister',
    patterns: ['gift for sister', 'rakhi gift', 'raksha bandhan', 'for sister'],
    category: 'Products',
    subcategory: 'Gift — Sister',
    response:
      'For Raksha Bandhan or a sister’s gift, lightweight earrings, pendants, or minimal rings are popular. Share a budget range and I’ll pull matching demo products.',
    confidence: 87,
    tags: ['gift', 'rakhi'],
  },

  // ——— Size & fit ———
  {
    id: 'ring-size',
    patterns: ['ring size', 'size chart', 'finger size', 'how to measure ring', 'resize ring'],
    category: 'Products',
    subcategory: 'Sizing',
    response:
      'Ring size is usually measured with a ring gauge at the store for best accuracy. Online size charts vary by brand. Resizing feasibility depends on the design (e.g. full eternity bands may not resize well). For a purchased item, share Order ID and we’ll guide next steps or connect the store team.',
    confidence: 85,
    tags: ['size', 'ring'],
  },
  {
    id: 'bangle-size',
    patterns: ['bangle size', 'kada size', 'bracelet size', 'hand size bangle'],
    category: 'Products',
    subcategory: 'Sizing',
    response:
      'Bangle size is typically based on hand circumference; trying on in-store is most reliable. If you ordered the wrong size, exchange rules depend on invoice and product type — share Order ID for order-specific help, or visit the showroom.',
    confidence: 85,
    tags: ['size', 'bangle'],
  },

  // ——— Shipping India ———
  {
    id: 'cod',
    patterns: ['cod', 'cash on delivery', 'cash on delivery available', 'pay on delivery'],
    category: 'Shipping',
    subcategory: 'COD',
    response:
      'Cash on delivery availability depends on product value, location, and checkout settings. I don’t assume COD is on for every pin code. Please check at checkout or ask the store. Prepaid UPI/cards are commonly used for jewellery orders.',
    confidence: 84,
    tags: ['cod', 'payment'],
  },
  {
    id: 'pin-code',
    patterns: ['pin code', 'pincode', 'serviceable', 'do you deliver to', 'delivery available in'],
    category: 'Shipping',
    subcategory: 'Serviceability',
    response:
      'Delivery serviceability is checked by PIN code on the product page (demo checker). Standard delivery within India is typically illustrated as 5–7 business days after dispatch. Enter your PIN on the product page, or share your city and I’ll explain the general demo policy.',
    confidence: 85,
    tags: ['pincode', 'delivery'],
  },
  {
    id: 'out-of-state',
    patterns: ['other state', 'deliver to delhi', 'deliver to mumbai', 'deliver to bangalore', 'hyderabad delivery', 'outside chennai'],
    category: 'Shipping',
    subcategory: 'Pan-India delivery',
    response:
      'This concept supports pan-India style shipping guidance: after dispatch, delivery is commonly 5–7 business days depending on location. Confirm your PIN on the product page. For urgent needs, consider store pickup in Chennai if you’re local.',
    confidence: 84,
    tags: ['shipping', 'india'],
  },

  // ——— Purchase plans ———
  {
    id: 'scheme-detail',
    patterns: ['gold scheme', 'monthly scheme', 'saving scheme', 'jewellery scheme', '11 month', 'zero percent', 'zero%'],
    category: 'Purchase Plans',
    subcategory: 'Scheme details',
    response:
      'Based on publicly available Zero% Gold Purchase Plan information: monthly amounts ₹2,000 / ₹5,000 / ₹10,000 for 11 months. Option A: no wastage up to 10% & no making charges on 916 gold jewellery at maturity (terms apply). Option B: 1 month bonus after maturity. Enrolment and benefits are confirmed at the store under official terms. See Purchase Plans on the website for the illustrative calculator.',
    confidence: 92,
    tags: ['scheme', 'plan'],
  },
  {
    id: 'scheme-miss-payment',
    patterns: ['missed installment', 'missed instalment', 'late payment scheme', 'default scheme', 'skip month'],
    category: 'Purchase Plans',
    subcategory: 'Missed payment',
    response:
      'Scheme rules for missed premiums (maturity extension, pre-closure deductions) are defined in the official terms. I won’t invent penalties. Please contact the store with your passbook/scheme ID, or ask me to connect a human consultant for account-specific guidance.',
    confidence: 80,
    tags: ['scheme', 'payment'],
  },

  // ——— Care ———
  {
    id: 'care-gold',
    patterns: ['how to clean gold', 'gold turning black', 'polish jewellery', 'care tips', 'maintain jewellery'],
    category: 'Jewellery Care',
    subcategory: 'Care',
    response:
      'Store pieces separately, avoid water, perfume, and gym wear while jewellery is on, and wipe with a soft dry cloth. For deep cleaning, prefer professional care. Meenakari and polki need extra gentleness — avoid harsh chemicals and ultrasonic cleaners unless your jeweller approves.',
    confidence: 90,
    tags: ['care'],
  },
  {
    id: 'care-silver-note',
    patterns: ['silver jewellery', 'oxidised', 'oxidized jewellery'],
    category: 'Jewellery Care',
    subcategory: 'Silver / oxidised',
    response:
      'This demo catalogue focuses on gold, polki, and diamond-style pieces. For silver or oxidised care, general tip: keep dry and wipe gently. For product availability in silver, please check with the store — I only list what’s in the current catalogue.',
    confidence: 82,
    tags: ['silver'],
  },

  // ——— Store / visit ———
  {
    id: 'store-chennai',
    patterns: ['chennai store', 'sowcarpet', 'showroom', 'visit store', 'shop address', 'where are you located'],
    category: 'Store',
    subcategory: 'Store location',
    response:
      'Concept reference store: 55 NSC Bose Rd, Sowcarpet, George Town, Chennai, Tamil Nadu 600003. Phone: +91 73970 85346 / +91 86677 09038. Demo hours: Mon–Sat 10 AM–8 PM IST, Sun 11 AM–6 PM IST. This digital experience is not the official website.',
    confidence: 93,
    tags: ['store', 'chennai'],
  },
  {
    id: 'appointment',
    patterns: ['appointment', 'book visit', 'trial jewellery', 'come to store', 'consultation in store'],
    category: 'Store',
    subcategory: 'Visit / consultation',
    response:
      'You can walk in during store hours or request a jewellery consultation via the consultation form on the website (name, phone, occasion, budget). For bridal trials, calling ahead helps the team prepare. Would you like the store phone numbers again?',
    confidence: 86,
    tags: ['appointment'],
  },

  // ——— Orders / issues ———
  {
    id: 'order-delay',
    patterns: ['order late', 'not delivered', 'still not received', 'delay in delivery', 'where is parcel'],
    category: 'Orders',
    subcategory: 'Delivery delay',
    response:
      'I’m sorry for the wait. Please share your Order ID (e.g. KJ10245). I’ll look up the demo order status and shipping note. If it’s overdue beyond the estimate, I can escalate to a human representative.',
    confidence: 88,
    tags: ['order', 'delay'],
  },
  {
    id: 'wrong-item',
    patterns: ['wrong item', 'wrong product', 'received different', 'damaged product', 'broken jewellery'],
    category: 'Orders',
    subcategory: 'Wrong / damaged',
    response:
      'I’m sorry you received a wrong or damaged item. Please share your Order ID and a short description. Order-specific resolution needs verification — I can log this and connect you with human support so it’s handled with your invoice details. I won’t ask for passwords or OTPs.',
    confidence: 90,
    tags: ['order', 'damage'],
  },
  {
    id: 'cancel-order',
    patterns: ['cancel order', 'cancel my order', 'order cancel'],
    category: 'Orders',
    subcategory: 'Cancellation',
    response:
      'Cancellation depends on whether the order is already packed or shipped. Share your Order ID and I’ll check the demo status. If cancellation isn’t available in the system status, I’ll connect you to a representative to process it as per policy.',
    confidence: 86,
    tags: ['cancel'],
  },

  // ——— Returns ———
  {
    id: 'return-window',
    patterns: ['return policy', 'return window', 'how many days return', 'can i return'],
    category: 'Returns',
    subcategory: 'Return policy',
    response:
      'Jewellery return and exchange rules usually depend on product type, invoice, and whether the piece is customized or hallmark-sealed. In this concept, final eligibility is confirmed by the store. Share Order ID for order-linked guidance, or visit the showroom with the invoice.',
    confidence: 85,
    tags: ['return'],
  },
  {
    id: 'refund-status',
    patterns: ['refund status', 'refund not received', 'when will refund', 'money not credited'],
    category: 'Returns',
    subcategory: 'Refund',
    response:
      'Refund timelines depend on the payment method (UPI, card, etc.) and approval of the return. Share Order ID so we can see demo order notes. For payment investigation I may connect human support — I’ll never ask for OTP or card CVV.',
    confidence: 86,
    tags: ['refund'],
  },

  // ——— Product types ———
  {
    id: 'temple-jewellery',
    patterns: ['temple jewellery', 'temple jewelry', 'temple set', 'lakshmi motif', 'south indian jewellery'],
    category: 'Products',
    subcategory: 'Temple',
    response:
      'Temple jewellery draws from South Indian temple motifs and is popular for weddings and festivals. Browse the Temple collection on the site for demo necklaces, earrings, rings, and pendants with listed prices.',
    confidence: 90,
    tags: ['temple'],
  },
  {
    id: 'polki',
    patterns: ['polki', 'uncut diamond', 'polki set'],
    category: 'Products',
    subcategory: 'Polki',
    response:
      'Polki uses uncut diamonds in traditional settings — often chosen for bridal wear. See the Polki collection for catalogue pieces and prices. For weight and diamond details on a specific SKU, open the product page.',
    confidence: 90,
    tags: ['polki'],
  },
  {
    id: 'meenakari',
    patterns: ['meenakari', 'meena work', 'enamel jewellery'],
    category: 'Products',
    subcategory: 'Meenakari',
    response:
      'Meenakari is colourful enamel work on gold — a heritage craft. Explore the Meenakari collection for earrings and bangles in the demo catalogue. Handle gently and avoid harsh chemicals when cleaning.',
    confidence: 90,
    tags: ['meenakari'],
  },

  // ——— Budget ———
  {
    id: 'budget-25k',
    patterns: ['under 25000', 'under 25k', 'below 25k', 'budget 25000', 'sasta', 'affordable jewellery'],
    category: 'Products',
    subcategory: 'Budget under ₹25K',
    response:
      'I can suggest demo catalogue pieces priced under ₹25,000 — such as minimal pendants, lighter earrings, or stackable rings when available. You can also filter Under ₹25K on the site or use Find My Jewellery with that budget.',
    confidence: 88,
    tags: ['budget'],
  },
  {
    id: 'budget-1l',
    patterns: ['under 1 lakh', 'under 1l', 'below 100000', 'budget 1 lakh'],
    category: 'Products',
    subcategory: 'Budget under ₹1L',
    response:
      'For budgets up to ₹1 lakh, the demo catalogue includes many earrings, rings, bracelets, and some necklaces. Share whether you want wedding, festive, or everyday wear and I’ll narrow catalogue matches.',
    confidence: 88,
    tags: ['budget'],
  },

  // ——— Trust / authenticity ———
  {
    id: 'real-gold',
    patterns: ['real gold', 'genuine gold', 'original gold', 'fake gold', 'is gold real'],
    category: 'Policies',
    subcategory: 'Authenticity',
    response:
      'Authenticity is supported through purity marking, invoice, and hallmark practices common in India. Always keep your tax invoice. For any doubt on a delivered item, share Order ID and we can guide verification via the store. I won’t make claims I can’t verify from catalogue or order data.',
    confidence: 86,
    tags: ['authenticity'],
  },
  {
    id: 'certificate-diamond',
    patterns: ['diamond certificate', 'igi', 'gia', 'certified diamond', 'lab report'],
    category: 'Policies',
    subcategory: 'Diamond certification',
    response:
      'Diamond certification (e.g. from recognised labs) depends on the specific product. Check the product details for certification notes. If it isn’t listed, please ask in-store — I won’t invent a certificate number or lab name for a SKU.',
    confidence: 84,
    tags: ['diamond', 'certificate'],
  },

  // ——— Hinglish / mixed ———
  {
    id: 'hinglish-price',
    patterns: ['kitne ka', 'kya rate', 'price kya hai', 'kitna hai', 'cost kya'],
    category: 'Products',
    subcategory: 'Price enquiry',
    response:
      'Please tell me the product name or type (ring, earrings, mangalsutra, etc.). I’ll share the price only from our demo catalogue. You can also browse collections on the website for listed prices.',
    confidence: 88,
    tags: ['hinglish', 'price'],
  },
  {
    id: 'hinglish-available',
    patterns: ['available hai', 'stock mein hai', 'mil jayega', 'hai kya'],
    category: 'Products',
    subcategory: 'Availability',
    response:
      'Availability in this concept follows the demo catalogue. Tell me which design or category you want; if it isn’t listed, I’ll say so clearly rather than guess stock. For real-time store stock, calling the showroom is best.',
    confidence: 85,
    tags: ['hinglish', 'stock'],
  },

  // ——— Customization & repair ———
  {
    id: 'custom',
    patterns: ['custom design', 'customise', 'customize', 'made to order', 'own design'],
    category: 'Products',
    subcategory: 'Custom design',
    response:
      'Custom or made-to-order designs are usually handled in-store with weight and making estimates. I can’t commit custom timelines online without store confirmation. Please visit or book a consultation with your idea or reference photo.',
    confidence: 86,
    tags: ['custom'],
  },
  {
    id: 'repair',
    patterns: ['repair', 'chain broken', 'ring broken', 'soldering', 'jewellery repair'],
    category: 'Jewellery Care',
    subcategory: 'Repair',
    response:
      'Repairs (chain links, clasp, stone tightening) are typically done at the store after inspection. Charges depend on work needed. Bring the piece and invoice if you have it. For an online order damage claim, share Order ID first.',
    confidence: 87,
    tags: ['repair'],
  },

  // ——— Payment issues ———
  {
    id: 'payment-failed',
    patterns: ['payment failed', 'payment failure', 'money deducted', 'amount debited', 'double charged'],
    category: 'Payments',
    subcategory: 'Payment failure',
    response:
      'If an amount was debited but the order isn’t confirmed, note the time and Order ID if any. I’ll never ask for OTP, CVV, or passwords. Share Order ID or registered phone/email used at checkout, and I can escalate to human support for payment reconciliation.',
    confidence: 90,
    tags: ['payment'],
  },
  {
    id: 'upi',
    patterns: ['upi', 'gpay', 'google pay', 'phonepe', 'paytm', 'bhim'],
    category: 'Payments',
    subcategory: 'UPI',
    response:
      'UPI (GPay, PhonePe, etc.) is commonly accepted for online and store payments in India. Use only official checkout or store QR — never share UPI PIN with anyone, including me. For a failed UPI payment, share Order ID for support follow-up.',
    confidence: 88,
    tags: ['upi'],
  },

  // ——— Weight ———
  {
    id: 'weight',
    patterns: ['gold weight', 'how many grams', 'gram weight', 'net weight', 'gross weight'],
    category: 'Products',
    subcategory: 'Weight',
    response:
      'Product pages list approximate weight where available (e.g. 8.2g). Net weight is gold weight after excluding stones/beads; gross includes them. Final billed weight is as per the invoice at purchase. Ask for a product name if you want the catalogue weight.',
    confidence: 87,
    tags: ['weight'],
  },

  // ——— Men’s / kids ———
  {
    id: 'mens',
    patterns: ["men's jewellery", 'mens ring', 'for men', 'gents ring', 'male jewellery'],
    category: 'Products',
    subcategory: "Men's",
    response:
      'The demo catalogue is largely women’s and unisex gold styles; some rings and chains can work for men. Share a preference (ring/chain) and budget and I’ll check catalogue matches. For dedicated men’s collections, please ask the store.',
    confidence: 82,
    tags: ['men'],
  },
  {
    id: 'kids',
    patterns: ['kids jewellery', 'baby gold', 'children jewellery', 'for baby'],
    category: 'Products',
    subcategory: 'Kids',
    response:
      'Baby and kids’ gold is often lightweight and safety-conscious. It may not be fully listed in this demo catalogue. Please check with the Chennai store for kids’ options rather than me guessing designs or weights.',
    confidence: 80,
    tags: ['kids'],
  },

  // ——— Closing ———
  {
    id: 'thanks',
    patterns: ['thank you', 'thanks', 'dhanyavad', 'shukriya', 'thank u'],
    category: 'General',
    subcategory: 'Thanks',
    response:
      'You’re most welcome! If you need anything else — order tracking, a product suggestion, or store directions — just message me. Happy to help.',
    confidence: 95,
    tags: ['thanks'],
  },
  {
    id: 'bye',
    patterns: ['bye', 'goodbye', 'see you', 'that’s all', 'thats all', 'nothing else'],
    category: 'General',
    subcategory: 'Closing',
    response:
      'Thank you for chatting with Saru. Wishing you a wonderful day. You’re always welcome back if any jewellery question comes up!',
    confidence: 92,
    tags: ['bye'],
  },
];

/** Score a user message against all scenarios; return best match if strong enough */
export function matchScenario(
  text: string
): { scenario: Scenario; score: number } | null {
  const t = text.toLowerCase().trim();
  if (!t) return null;

  let best: { scenario: Scenario; score: number } | null = null;

  for (const s of indianScenarios) {
    let score = 0;
    for (const p of s.patterns) {
      if (t.includes(p.toLowerCase())) {
        // Longer phrase matches weigh more
        score += 2 + Math.min(p.length / 8, 4);
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { scenario: s, score };
    }
  }

  // Require a minimum signal so weak single-letter noise doesn’t match
  if (!best || best.score < 2) return null;
  return best;
}

export function scenarioCount(): number {
  return indianScenarios.length;
}

/** Approximate natural-language coverage: patterns × typical variants */
export function estimatedPhraseCoverage(): number {
  return indianScenarios.reduce((n, s) => n + s.patterns.length * 12, 0);
}
