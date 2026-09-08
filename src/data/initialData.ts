import { Product, Order, Customer } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'aura-01',
    name: 'AURA No. 01 — Élan',
    slug: 'aura-no-01-elan',
    tagline: 'Luminous Solar Florals & Velvet Musk',
    description: 'An effervescent ode to grace and momentum. Élan opens with sun-drenched Italian bergamot and pink pepper before unveiling a rich heart of Damask rose and rare French iris, anchored by creamy sandalwood and warm skin musk.',
    shortDescription: 'Luminous Italian bergamot, Turkish rose, and warm cashmere musk.',
    price: 135,
    compareAtPrice: 155,
    category: 'Women',
    collection: 'Artisanal Heritage',
    gender: 'Women',
    fragranceFamily: 'Floral',
    topNotes: ['Calabrian Bergamot', 'Pink Pepper', 'Mandarin Essence'],
    heartNotes: ['Damask Rose Absolu', 'Florentine Iris', 'Night Jasmine'],
    baseNotes: ['Cashmere Wood', 'White Amber', 'Bourbon Vanilla'],
    sizeOptions: ['50ml / 1.7 fl oz', '100ml / 3.4 fl oz', 'Travel 10ml'],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: true,
    bestSeller: true,
    published: true,
    stock: 42,
    sku: 'AUR-01-ELAN',
    variations: [
      {
        id: 'var-01-clear',
        name: 'Clear Cristallin',
        color: '#E8E4DC',
        sku: 'AUR-01-CLR',
        price: 135,
        stock: 18,
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85'
        ]
      },
      {
        id: 'var-01-amber',
        name: 'Amber Doré',
        color: '#C8944B',
        sku: 'AUR-01-AMB',
        price: 145,
        compareAtPrice: 165,
        stock: 14,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85'
        ]
      },
      {
        id: 'var-01-rose',
        name: 'Rose Éternelle',
        color: '#D89A9E',
        sku: 'AUR-01-RSE',
        price: 140,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85'
        ]
      },
      {
        id: 'var-01-midnight',
        name: 'Obsidian Noir',
        color: '#1C1A18',
        sku: 'AUR-01-NOIR',
        price: 150,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
        gallery: [
          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85'
        ]
      }
    ],
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-09-01T12:00:00.000Z'
  },
  {
    id: 'aura-02',
    name: 'AURA No. 02 — Serein',
    slug: 'aura-no-02-serein',
    tagline: 'Crisp Cedar, Cardamom & Mineral Iris',
    description: 'Inspired by the stillness of alpine dawn. Serein marries cool crushed cardamom and violet leaf with a heart of powdery orris root and Atlas cedarwood. A lingering finish of white amber and haitian vetiver imparts quiet poise.',
    shortDescription: 'Cool cardamom, Florentine orris, and noble Atlas cedarwood.',
    price: 145,
    category: 'Unisex',
    collection: 'Artisanal Heritage',
    gender: 'Unisex',
    fragranceFamily: 'Woody',
    topNotes: ['Guatemalan Cardamom', 'Crisp Violet Leaf', 'Crushed Juniper'],
    heartNotes: ['Florentine Orris', 'Cypress Wood', 'Black Tea'],
    baseNotes: ['Atlas Cedarwood', 'Haitian Vetiver', 'White Suede'],
    sizeOptions: ['50ml / 1.7 fl oz', '100ml / 3.4 fl oz'],
    images: [
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: true,
    bestSeller: true,
    published: true,
    stock: 28,
    sku: 'AUR-02-SEREIN',
    variations: [
      {
        id: 'var-02-clear',
        name: 'Frost Cristallin',
        color: '#E4ECE9',
        sku: 'AUR-02-FROST',
        price: 145,
        stock: 16,
        image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'var-02-smoke',
        name: 'Smoked Quartz',
        color: '#4A4643',
        sku: 'AUR-02-SMK',
        price: 155,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    createdAt: '2026-08-05T10:00:00.000Z',
    updatedAt: '2026-09-02T14:30:00.000Z'
  },
  {
    id: 'aura-03',
    name: 'AURA No. 03 — Ember',
    slug: 'aura-no-03-ember',
    tagline: 'Smoky Amber, Tonka Bean & Spiced Tobacco',
    description: 'A magnetic, opulent elixir wrapped in glowing hearthwood. Warm Ceylon cinnamon and saffron curl through rare Turkish tobacco leaves and resinous labdanum, settling into a decadent bed of roasted tonka and Bourbon vanilla.',
    shortDescription: 'Ceylon cinnamon, golden labdanum resin, and aged Bourbon vanilla.',
    price: 160,
    compareAtPrice: 180,
    category: 'Unisex',
    collection: 'Private Reserve',
    gender: 'Unisex',
    fragranceFamily: 'Amber',
    topNotes: ['Ceylon Cinnamon', 'Wild Saffron', 'Bitter Orange Peel'],
    heartNotes: ['Blonde Tobacco Leaf', 'Rockrose Labdanum', 'Myrrh'],
    baseNotes: ['Bourbon Vanilla Bean', 'Golden Amber', 'Roasted Tonka'],
    sizeOptions: ['50ml / 1.7 fl oz', '100ml / 3.4 fl oz'],
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: true,
    bestSeller: false,
    published: true,
    stock: 22,
    sku: 'AUR-03-EMBER',
    variations: [
      {
        id: 'var-03-amber',
        name: 'Gilded Amber',
        color: '#B5742D',
        sku: 'AUR-03-GLD',
        price: 160,
        stock: 14,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'var-03-onyx',
        name: 'Onyx Reserve',
        color: '#161514',
        sku: 'AUR-03-ONX',
        price: 175,
        compareAtPrice: 195,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    createdAt: '2026-08-10T11:00:00.000Z',
    updatedAt: '2026-09-03T09:15:00.000Z'
  },
  {
    id: 'aura-04',
    name: 'AURA No. 04 — Veil',
    slug: 'aura-no-04-veil',
    tagline: 'Silk Petals, Dewy White Tea & Sensual Musk',
    description: 'Understated, intimate, and impossibly soft. Veil hovers close to the neck like whispered linen. Airy white tea and peony petals merge with creamy almond milk and clean ambrette seeds for an effortless second-skin signature.',
    shortDescription: 'Silken white tea blossoms, morning peony, and powdery ambrette seed.',
    price: 125,
    category: 'Women',
    collection: 'Artisanal Heritage',
    gender: 'Women',
    fragranceFamily: 'Floral',
    topNotes: ['Silver Needle Tea', 'Crisp Nashi Pear', 'Morning Dew'],
    heartNotes: ['Peony Petals', 'Magnolia Grandiflora', 'Almond Milk'],
    baseNotes: ['Clean Ambrette Seeds', 'White Sandalwood', 'Skin Musk'],
    sizeOptions: ['50ml / 1.7 fl oz', '100ml / 3.4 fl oz', 'Travel 10ml'],
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: false,
    bestSeller: true,
    published: true,
    stock: 35,
    sku: 'AUR-04-VEIL',
    variations: [
      {
        id: 'var-04-rose',
        name: 'Blush Silk',
        color: '#E6B8BA',
        sku: 'AUR-04-BLS',
        price: 125,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'var-04-clear',
        name: 'Pure Porcelain',
        color: '#F4F0E8',
        sku: 'AUR-04-PRC',
        price: 125,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-09-04T10:00:00.000Z'
  },
  {
    id: 'aura-05',
    name: 'AURA No. 05 — Nocturne',
    slug: 'aura-no-05-nocturne',
    tagline: 'Smoked Agarwood, Black Iris & Aged Leather',
    description: 'An enigmatic twilight silhouette. Intense Cambodian oud meets dark velvety black iris and hand-cured Florentine leather, deepened by smoky birch tar and dark Indonesian patchouli. Bold, architectural, and seductive.',
    shortDescription: 'Cambodian agarwood, night-blooming iris, and hand-stitched leather.',
    price: 175,
    compareAtPrice: 195,
    category: 'Men',
    collection: 'Midnight Nocturne',
    gender: 'Men',
    fragranceFamily: 'Woody',
    topNotes: ['Black Saffron', 'Incense Smoke', 'Pink Pepper'],
    heartNotes: ['Black Iris Petals', 'Aged Florentine Leather', 'Birch Tar'],
    baseNotes: ['Cambodian Agarwood (Oud)', 'Dark Patchouli', 'Amber Noir'],
    sizeOptions: ['50ml / 1.7 fl oz', '100ml / 3.4 fl oz'],
    images: [
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: true,
    bestSeller: true,
    published: true,
    stock: 19,
    sku: 'AUR-05-NOCTURNE',
    variations: [
      {
        id: 'var-05-midnight',
        name: 'Midnight Black',
        color: '#151413',
        sku: 'AUR-05-MNT',
        price: 175,
        stock: 11,
        image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'var-05-gold',
        name: 'Gilded Shadow',
        color: '#7D6A42',
        sku: 'AUR-05-GLD',
        price: 185,
        compareAtPrice: 210,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    createdAt: '2026-08-15T09:00:00.000Z',
    updatedAt: '2026-09-05T16:00:00.000Z'
  },
  {
    id: 'aura-06',
    name: 'AURA No. 06 — Solenne',
    slug: 'aura-no-06-solenne',
    tagline: 'Golden Neroli, Petitgrain & Sunlit Cedar',
    description: 'A joyful meditation on Mediterranean sunlight. Sparkling Sicilian neroli and bitter orange petitgrain sparkle above aromatic lavender fields and Mediterranean cedarwood, grounded in warm golden musk.',
    shortDescription: 'Sicilian neroli petals, bitter petitgrain, and sun-warmed cedar.',
    price: 130,
    category: 'Unisex',
    collection: 'Solar Radiance',
    gender: 'Unisex',
    fragranceFamily: 'Citrus',
    topNotes: ['Sicilian Sun Neroli', 'Italian Bergamot', 'Bitter Orange'],
    heartNotes: ['Petitgrain Bigarade', 'Provencal Lavender', 'Orange Blossom'],
    baseNotes: ['Atlas Cedarwood', 'Clean Musks', 'Solar Amber'],
    sizeOptions: ['50ml / 1.7 fl oz', '100ml / 3.4 fl oz', 'Travel 10ml'],
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: false,
    bestSeller: false,
    published: true,
    stock: 25,
    sku: 'AUR-06-SOLENNE',
    variations: [
      {
        id: 'var-06-sun',
        name: 'Sunlight Flacon',
        color: '#F0D179',
        sku: 'AUR-06-SUN',
        price: 130,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'var-06-clear',
        name: 'Crystal Clear',
        color: '#ECE9E2',
        sku: 'AUR-06-CLR',
        price: 130,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    createdAt: '2026-08-18T14:00:00.000Z',
    updatedAt: '2026-09-06T11:20:00.000Z'
  },
  {
    id: 'aura-07',
    name: 'AURA The Discovery Collection',
    slug: 'aura-discovery-collection',
    tagline: 'Six Curated 5ml Flacons in Velvet Presentation Box',
    description: 'The definitive introduction to AURA. Explore our iconic universe with six curated 5ml extrait de parfum miniatures: Élan, Serein, Ember, Veil, Nocturne, and Solenne. Includes a ₹50 redeemable certificate toward your first full-size flacon.',
    shortDescription: 'Six 5ml iconic fragrances in a handcrafted linen and velvet presentation coffer.',
    price: 75,
    category: 'Discovery Sets',
    collection: 'Artisanal Heritage',
    gender: 'Unisex',
    fragranceFamily: 'Woody',
    topNotes: ['Diverse Signature Notes across 6 Master Blends'],
    heartNotes: ['Rare Florals, Resins, and Woods'],
    baseNotes: ['Sensual Musks, Ambers, and Bourbon Vanilla'],
    sizeOptions: ['6 x 5ml Discovery Set'],
    images: [
      'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: true,
    bestSeller: true,
    published: true,
    stock: 50,
    sku: 'AUR-SET-DISC',
    variations: [
      {
        id: 'var-disc-noir',
        name: 'Midnight Velvet Box',
        color: '#181716',
        sku: 'AUR-SET-NOIR',
        price: 75,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'var-disc-ivory',
        name: 'Linen Ivory Box',
        color: '#EFECE3',
        sku: 'AUR-SET-IVR',
        price: 75,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-09-07T08:00:00.000Z'
  },
  {
    id: 'aura-08',
    name: 'AURA Grand Gifting Coffer',
    slug: 'aura-grand-gifting-coffer',
    tagline: '100ml Eau de Parfum + 15ml Extrait + Scented Candle',
    description: 'The pinnacle of olfactory luxury. Housed in a champagne embossed rigid presentation box bound with black grosgrain ribbon. Choose your full-size 100ml fragrance accompanied by a matching travel extrait and our signature soy-wax candle.',
    shortDescription: '100ml Eau de Parfum, 15ml Travel Extrait, and 240g Hand-Poured Candle.',
    price: 260,
    compareAtPrice: 295,
    category: 'Gift Sets',
    collection: 'Private Reserve',
    gender: 'Unisex',
    fragranceFamily: 'Oriental',
    topNotes: ['Custom Gilded Selection'],
    heartNotes: ['Haute Perfumery Accords'],
    baseNotes: ['Precious Woods and Ambers'],
    sizeOptions: ['Deluxe Grand Coffer'],
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: true,
    bestSeller: false,
    published: true,
    stock: 15,
    sku: 'AUR-GIFT-GRAND',
    variations: [
      {
        id: 'var-gift-gold',
        name: 'Champagne & Grosgrain',
        color: '#C6B289',
        sku: 'AUR-GFT-CHAMP',
        price: 260,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'var-gift-noir',
        name: 'Matte Obsidian & Satin',
        color: '#1E1D1B',
        sku: 'AUR-GFT-OBSID',
        price: 260,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    createdAt: '2026-08-22T10:00:00.000Z',
    updatedAt: '2026-09-07T12:00:00.000Z'
  },
  {
    id: 'aura-09',
    name: 'AURA Botanical Roller Oil — Serein',
    slug: 'aura-botanical-roller-oil-serein',
    tagline: '100% Pure Alcohol-Free Perfume Oil',
    description: 'Formulated in a nourishing base of organic golden jojoba oil. Designed for pulse-point application, this concentrated perfume oil melts into warm skin, releasing intimate notes of cedar, cardamom, and soft cashmere amber throughout the day.',
    shortDescription: 'Alcohol-free concentrated perfume oil in heavy amber glass rollerball.',
    price: 65,
    category: 'Perfume Oils',
    collection: 'Artisanal Heritage',
    gender: 'Unisex',
    fragranceFamily: 'Woody',
    topNotes: ['Crushed Cardamom Seed', 'Juniper Essence'],
    heartNotes: ['Iris Root Powder', 'Atlas Cedar Resin'],
    baseNotes: ['Cashmere Amber', 'Skin Musk', 'Jojoba Oil'],
    sizeOptions: ['10ml Roller Flacon'],
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: false,
    bestSeller: true,
    published: true,
    stock: 45,
    sku: 'AUR-OIL-SEREIN',
    variations: [
      {
        id: 'var-oil-amber',
        name: 'Amber Glass & Brass Cap',
        color: '#B07530',
        sku: 'AUR-OIL-AMB',
        price: 65,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'var-oil-frosted',
        name: 'Frosted Glass & Silver Cap',
        color: '#D8DDD9',
        sku: 'AUR-OIL-FRST',
        price: 65,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    createdAt: '2026-08-25T11:00:00.000Z',
    updatedAt: '2026-09-08T09:00:00.000Z'
  },
  {
    id: 'aura-10',
    name: 'AURA No. 08 — Obsidian',
    slug: 'aura-no-08-obsidian',
    tagline: 'Dark Cocoa Pod, Smoked Vetiver & Incense',
    description: 'A hypnotic exploration of shadows and luminescence. Pure dark cocoa absolute entwined with Javanese vetiver, frankincense smoke, and black plum liquor. An unapologetically mysterious and addictive sensory experience.',
    shortDescription: 'Roasted cocoa pod, wild Indonesian vetiver, and sacred frankincense.',
    price: 170,
    category: 'Men',
    collection: 'Midnight Nocturne',
    gender: 'Men',
    fragranceFamily: 'Gourmand',
    topNotes: ['Black Plum Liquor', 'Pink Pepper', 'Smoked Bergamot'],
    heartNotes: ['Dark Cocoa Absolute', 'Frankincense Tears', 'Nutmeg'],
    baseNotes: ['Javanese Vetiver', 'Cedarwood Heart', 'Black Amber'],
    sizeOptions: ['50ml / 1.7 fl oz', '100ml / 3.4 fl oz'],
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=85'
    ],
    featured: true,
    bestSeller: false,
    published: true,
    stock: 14,
    sku: 'AUR-08-OBSIDIAN',
    variations: [
      {
        id: 'var-08-black',
        name: 'Obsidian Smoked Crystal',
        color: '#11100F',
        sku: 'AUR-08-OBS',
        price: 170,
        stock: 9,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85'
      },
      {
        id: 'var-08-gold',
        name: 'Gilded Rim Flacon',
        color: '#655737',
        sku: 'AUR-08-GLD',
        price: 180,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    createdAt: '2026-08-28T15:00:00.000Z',
    updatedAt: '2026-09-08T11:00:00.000Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AURA-2026-9812',
    customerId: 'cust-01',
    customerName: 'Victoria Sterling',
    email: 'victoria.sterling@example.com',
    phone: '+1 (415) 555-0182',
    shippingAddress: {
      address1: '742 Evergreen Terrace',
      address2: 'Penthouse B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States'
    },
    billingAddress: {
      address1: '742 Evergreen Terrace',
      address2: 'Penthouse B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States'
    },
    items: [
      {
        productId: 'aura-01',
        productName: 'AURA No. 01 — Élan',
        variationId: 'var-01-amber',
        variationName: 'Amber Doré',
        sku: 'AUR-01-AMB',
        selectedSize: '100ml / 3.4 fl oz',
        quantity: 1,
        unitPrice: 145,
        totalPrice: 145,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85'
      },
      {
        productId: 'aura-07',
        productName: 'AURA The Discovery Collection',
        variationId: 'var-disc-noir',
        variationName: 'Midnight Velvet Box',
        sku: 'AUR-SET-NOIR',
        selectedSize: '6 x 5ml Discovery Set',
        quantity: 1,
        unitPrice: 75,
        totalPrice: 75,
        image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    subtotal: 220,
    shipping: 0,
    tax: 17.60,
    discount: 0,
    total: 237.60,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    paymentMethod: 'Credit Card (Visa)',
    internalNotes: 'Complimentary signature samples included per luxury gift request.',
    createdAt: '2026-09-08T09:14:00.000Z',
    updatedAt: '2026-09-08T11:30:00.000Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'AURA-2026-9813',
    customerId: 'cust-02',
    customerName: 'Julian Montgomery',
    email: 'j.montgomery@londonparfums.co.uk',
    phone: '+44 20 7946 0912',
    shippingAddress: {
      address1: '14 Berkeley Square',
      city: 'London',
      state: 'Greater London',
      postalCode: 'W1J 6BQ',
      country: 'United Kingdom'
    },
    billingAddress: {
      address1: '14 Berkeley Square',
      city: 'London',
      state: 'Greater London',
      postalCode: 'W1J 6BQ',
      country: 'United Kingdom'
    },
    items: [
      {
        productId: 'aura-05',
        productName: 'AURA No. 05 — Nocturne',
        variationId: 'var-05-midnight',
        variationName: 'Midnight Black',
        sku: 'AUR-05-MNT',
        selectedSize: '100ml / 3.4 fl oz',
        quantity: 2,
        unitPrice: 175,
        totalPrice: 350,
        image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    subtotal: 350,
    shipping: 0,
    tax: 28.00,
    discount: 0,
    total: 378.00,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    paymentMethod: 'Credit Card (Mastercard)',
    createdAt: '2026-09-08T11:45:00.000Z',
    updatedAt: '2026-09-08T12:00:00.000Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'AURA-2026-9814',
    customerId: 'cust-03',
    customerName: 'Elena Rostova',
    email: 'elena.rostova@geneva.ch',
    phone: '+41 22 731 4455',
    shippingAddress: {
      address1: 'Rue du Rhône 42',
      city: 'Geneva',
      state: 'GE',
      postalCode: '1204',
      country: 'Switzerland'
    },
    billingAddress: {
      address1: 'Rue du Rhône 42',
      city: 'Geneva',
      state: 'GE',
      postalCode: '1204',
      country: 'Switzerland'
    },
    items: [
      {
        productId: 'aura-08',
        productName: 'AURA Grand Gifting Coffer',
        variationId: 'var-gift-gold',
        variationName: 'Champagne & Grosgrain',
        sku: 'AUR-GFT-CHAMP',
        selectedSize: 'Deluxe Grand Coffer',
        quantity: 1,
        unitPrice: 260,
        totalPrice: 260,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    subtotal: 260,
    shipping: 0,
    tax: 20.80,
    discount: 0,
    total: 280.80,
    paymentStatus: 'Paid',
    orderStatus: 'Confirmed',
    paymentMethod: 'Apple Pay',
    createdAt: '2026-09-07T16:20:00.000Z',
    updatedAt: '2026-09-07T16:20:00.000Z'
  },
  {
    id: 'ord-1004',
    orderNumber: 'AURA-2026-9815',
    customerId: 'cust-01',
    customerName: 'Victoria Sterling',
    email: 'victoria.sterling@example.com',
    phone: '+1 (415) 555-0182',
    shippingAddress: {
      address1: '742 Evergreen Terrace',
      address2: 'Penthouse B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States'
    },
    billingAddress: {
      address1: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States'
    },
    items: [
      {
        productId: 'aura-04',
        productName: 'AURA No. 04 — Veil',
        variationId: 'var-04-rose',
        variationName: 'Blush Silk',
        sku: 'AUR-04-BLS',
        selectedSize: '50ml / 1.7 fl oz',
        quantity: 1,
        unitPrice: 125,
        totalPrice: 125,
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85'
      }
    ],
    subtotal: 125,
    shipping: 0,
    tax: 10.00,
    discount: 0,
    total: 135.00,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    paymentMethod: 'Credit Card (Visa)',
    createdAt: '2026-09-05T14:10:00.000Z',
    updatedAt: '2026-09-07T09:00:00.000Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-01',
    name: 'Victoria Sterling',
    email: 'victoria.sterling@example.com',
    phone: '+1 (415) 555-0182',
    totalSpent: 372.60,
    orderCount: 2,
    lastOrderDate: '2026-09-08T09:14:00.000Z',
    registeredAt: '2026-08-01T12:00:00.000Z',
    addresses: [
      {
        address1: '742 Evergreen Terrace',
        address2: 'Penthouse B',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102',
        country: 'United States'
      }
    ]
  },
  {
    id: 'cust-02',
    name: 'Julian Montgomery',
    email: 'j.montgomery@londonparfums.co.uk',
    phone: '+44 20 7946 0912',
    totalSpent: 378.00,
    orderCount: 1,
    lastOrderDate: '2026-09-08T11:45:00.000Z',
    registeredAt: '2026-08-15T15:30:00.000Z',
    addresses: [
      {
        address1: '14 Berkeley Square',
        city: 'London',
        state: 'Greater London',
        postalCode: 'W1J 6BQ',
        country: 'United Kingdom'
      }
    ]
  },
  {
    id: 'cust-03',
    name: 'Elena Rostova',
    email: 'elena.rostova@geneva.ch',
    phone: '+41 22 731 4455',
    totalSpent: 280.80,
    orderCount: 1,
    lastOrderDate: '2026-09-07T16:20:00.000Z',
    registeredAt: '2026-09-01T08:20:00.000Z',
    addresses: [
      {
        address1: 'Rue du Rhône 42',
        city: 'Geneva',
        state: 'GE',
        postalCode: '1204',
        country: 'Switzerland'
      }
    ]
  }
];
