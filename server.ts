import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS } from './src/data/initialData';
import { Product, Order, Customer, AnalyticsSummary, CalendarDayData, OrderStatus } from './src/types';

const PORT = 3000;
const app = express();

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Database directory & persistence file
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded formulation media statically
app.use('/uploads', express.static(UPLOADS_DIR));

interface DbState {
  adminPasswordHash: string;
  adminSessions: { token: string; createdAt: number }[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial Admin Password: 14301430
const INITIAL_ADMIN_HASH = hashPassword('14301430');

function loadDatabase(): DbState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        adminPasswordHash: parsed.adminPasswordHash || INITIAL_ADMIN_HASH,
        adminSessions: parsed.adminSessions || [],
        products: parsed.products && parsed.products.length ? parsed.products : INITIAL_PRODUCTS,
        orders: parsed.orders || INITIAL_ORDERS,
        customers: parsed.customers || INITIAL_CUSTOMERS,
      };
    }
  } catch (err) {
    console.error('Error loading database file, falling back to seed data:', err);
  }

  const defaultDb: DbState = {
    adminPasswordHash: INITIAL_ADMIN_HASH,
    adminSessions: [],
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    customers: INITIAL_CUSTOMERS,
  };
  saveDatabase(defaultDb);
  return defaultDb;
}

let db: DbState = loadDatabase();

function saveDatabase(state: DbState = db) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file:', err);
  }
}

// Admin Auth Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.substring(7).trim();
  const session = db.adminSessions.find((s) => s.token === token);
  // Allow tokens within 7 days
  const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
  if (!session || Date.now() - session.createdAt > MAX_AGE) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
  next();
}

/* ==========================================================================
   ADMIN AUTHENTICATION ENDPOINTS
   ========================================================================== */

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const incomingHash = hashPassword(password);
  if (incomingHash !== db.adminPasswordHash) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = 'aura_adm_' + crypto.randomBytes(24).toString('hex');
  db.adminSessions.push({ token, createdAt: Date.now() });
  saveDatabase();

  return res.json({
    success: true,
    token,
    message: 'Admin access authenticated successfully'
  });
});

app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }
  const token = authHeader.substring(7).trim();
  const session = db.adminSessions.find((s) => s.token === token);
  if (!session || Date.now() - session.createdAt > 7 * 24 * 60 * 60 * 1000) {
    return res.status(401).json({ authenticated: false });
  }
  return res.json({ authenticated: true });
});

app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  db.adminPasswordHash = hashPassword(newPassword);
  saveDatabase();
  return res.json({ success: true, message: 'Admin password updated successfully' });
});

app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    db.adminSessions = db.adminSessions.filter((s) => s.token !== token);
    saveDatabase();
  }
  return res.json({ success: true });
});

/* ==========================================================================
   PRODUCT ENDPOINTS (STOREFRONT & ADMIN CRUD)
   ========================================================================== */

app.get('/api/products', (req, res) => {
  let products = [...db.products];

  // If request is from public storefront, only show published products unless admin
  const isInternal = req.query.all === 'true';
  if (!isInternal) {
    products = products.filter((p) => p.published !== false);
  }

  const { search, category, collection, gender, fragranceFamily, sort, inStock } = req.query;

  if (search && typeof search === 'string') {
    const query = search.toLowerCase().trim();
    products = products.filter((p) => {
      const notes = [...(p.topNotes || []), ...(p.heartNotes || []), ...(p.baseNotes || [])].join(' ').toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.collection.toLowerCase().includes(query) ||
        p.fragranceFamily.toLowerCase().includes(query) ||
        notes.includes(query)
      );
    });
  }

  if (category && typeof category === 'string' && category !== 'All') {
    products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (collection && typeof collection === 'string' && collection !== 'All') {
    products = products.filter((p) => p.collection.toLowerCase() === collection.toLowerCase());
  }

  if (gender && typeof gender === 'string' && gender !== 'All') {
    products = products.filter((p) => p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'Unisex');
  }

  if (fragranceFamily && typeof fragranceFamily === 'string' && fragranceFamily !== 'All') {
    products = products.filter((p) => p.fragranceFamily.toLowerCase() === fragranceFamily.toLowerCase());
  }

  if (inStock === 'true') {
    products = products.filter((p) => p.stock > 0);
  }

  if (sort && typeof sort === 'string') {
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'best-selling':
        products.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
        break;
      case 'featured':
      default:
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
  }

  res.json(products);
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const product = db.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', requireAdmin, (req, res) => {
  const data = req.body;
  if (!data.name || !data.price) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  const id = 'aura-' + Date.now().toString(36);
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const productImages: string[] = Array.isArray(data.productImages) && data.productImages.length > 0
    ? data.productImages.slice(0, 4)
    : (Array.isArray(data.images) && data.images.length > 0 ? data.images.slice(0, 4) : [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85'
      ]);

  const primaryImage: string = data.primaryImage && productImages.includes(data.primaryImage)
    ? data.primaryImage
    : productImages[0];

  // Primary image is positioned first in images array for backward compatibility
  const orderedImages: string[] = [primaryImage, ...productImages.filter(img => img !== primaryImage)];

  const newProduct: Product = {
    id,
    name: data.name,
    slug,
    tagline: data.tagline || '',
    description: data.description || '',
    shortDescription: data.shortDescription || data.description?.slice(0, 120) || '',
    price: Number(data.price),
    compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
    category: data.category || 'Unisex',
    collection: data.collection || 'Artisanal Heritage',
    gender: data.gender || 'Unisex',
    fragranceFamily: data.fragranceFamily || 'Woody',
    topNotes: Array.isArray(data.topNotes) ? data.topNotes : [],
    heartNotes: Array.isArray(data.heartNotes) ? data.heartNotes : [],
    baseNotes: Array.isArray(data.baseNotes) ? data.baseNotes : [],
    sizeOptions: Array.isArray(data.sizeOptions) && data.sizeOptions.length ? data.sizeOptions : ['50ml / 1.7 fl oz', '100ml / 3.4 fl oz'],
    productImages,
    primaryImage,
    images: orderedImages,
    featured: Boolean(data.featured),
    bestSeller: Boolean(data.bestSeller),
    published: data.published !== undefined ? Boolean(data.published) : true,
    stock: Number(data.stock) || 0,
    sku: data.sku || 'AUR-' + Math.floor(1000 + Math.random() * 9000),
    variations: Array.isArray(data.variations) ? data.variations : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  saveDatabase();
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Formulation not found in database' });
  }

  const existing = db.products[index];
  const incomingImages = Array.isArray(req.body.productImages) && req.body.productImages.length > 0
    ? req.body.productImages.slice(0, 4)
    : (Array.isArray(req.body.images) && req.body.images.length > 0 ? req.body.images.slice(0, 4) : (existing.productImages || existing.images || []));

  const primaryImage = req.body.primaryImage && incomingImages.includes(req.body.primaryImage)
    ? req.body.primaryImage
    : (incomingImages[0] || existing.primaryImage || existing.images?.[0] || '');

  const orderedImages = [primaryImage, ...incomingImages.filter((img: string) => img !== primaryImage)];

  const updated: Product = {
    ...existing,
    ...req.body,
    productImages: incomingImages,
    primaryImage,
    images: orderedImages.length > 0 ? orderedImages : existing.images,
    id: existing.id, // prevent ID change
    updatedAt: new Date().toISOString()
  };

  db.products[index] = updated;
  saveDatabase();
  res.json(updated);
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const targetProduct = db.products.find((p) => p.id === id);

  if (!targetProduct) {
    return res.status(404).json({ error: 'Formulation not found in database' });
  }

  // Collect any uploaded image URLs associated with this formulation
  const associatedImages = new Set<string>();
  if (targetProduct.primaryImage && targetProduct.primaryImage.startsWith('/uploads/')) {
    associatedImages.add(targetProduct.primaryImage);
  }
  (targetProduct.productImages || []).forEach(img => {
    if (img && typeof img === 'string' && img.startsWith('/uploads/')) associatedImages.add(img);
  });
  (targetProduct.images || []).forEach(img => {
    if (img && typeof img === 'string' && img.startsWith('/uploads/')) associatedImages.add(img);
  });
  (targetProduct.variations || []).forEach(v => {
    if (v.image && typeof v.image === 'string' && v.image.startsWith('/uploads/')) associatedImages.add(v.image);
  });

  // Remove formulation from database
  db.products = db.products.filter((p) => p.id !== id);
  saveDatabase();

  // Clean up associated images from storage if not used by any remaining product
  associatedImages.forEach(imgUrl => {
    const isUsedElsewhere = db.products.some(p => {
      const list = (p.productImages || p.images || []);
      return list.includes(imgUrl) || p.primaryImage === imgUrl || (p.variations || []).some(v => v.image === imgUrl);
    });

    if (!isUsedElsewhere) {
      try {
        const filename = path.basename(imgUrl);
        const filePath = path.join(UPLOADS_DIR, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Error cleaning up orphaned formulation image:', imgUrl, err);
      }
    }
  });

  res.json({ success: true, message: 'Formulation deleted successfully.' });
});

/* ==========================================================================
   IMAGE UPLOADS (SERVER DISK STORAGE & PERSISTENCE)
   ========================================================================== */

app.post('/api/upload', requireAdmin, (req, res) => {
  const { dataUrl, filename } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ error: 'Image data is required.' });
  }

  // If already an existing upload or external URL, return directly
  if (typeof dataUrl === 'string' && (dataUrl.startsWith('/uploads/') || dataUrl.startsWith('http://') || dataUrl.startsWith('https://'))) {
    return res.json({ success: true, url: dataUrl });
  }

  try {
    // Validate Base64 data URL format
    const matches = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i);
    if (!matches) {
      return res.status(400).json({ error: 'Unsupported format. Allowed formats: JPG, JPEG, PNG, WEBP.' });
    }

    const rawExt = matches[1].toLowerCase();
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // 10MB file size limit
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 10MB limit.' });
    }

    const uniqueId = `aura_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueId);
    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${uniqueId}`;
    res.json({ success: true, url: publicUrl, filename: uniqueId });
  } catch (err) {
    console.error('Failed to save image file:', err);
    res.status(500).json({ error: 'Failed to process and store image.' });
  }
});

app.delete('/api/upload', requireAdmin, (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) {
    return res.json({ success: true, message: 'No local file deletion required' });
  }

  // Check if used by any product
  const isUsed = db.products.some(p => {
    const list = (p.productImages || p.images || []);
    return list.includes(url) || p.primaryImage === url || (p.variations || []).some(v => v.image === url);
  });

  if (!isUsed) {
    try {
      const filename = path.basename(url);
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Error removing upload file:', err);
    }
  }

  res.json({ success: true });
});

/* ==========================================================================
   ORDER ENDPOINTS & CHECKOUT (REAL SERVER-SIDE INVENTORY & PRICING)
   ========================================================================== */

function formatOrder(order: Order) {
  const parts = (order.customerName || '').trim().split(' ');
  const firstName = parts[0] || 'Valued';
  const lastName = parts.slice(1).join(' ') || 'Client';

  const street = order.address || (order.shippingAddress?.address1
    ? `${order.shippingAddress.address1}${order.shippingAddress.address2 ? ', ' + order.shippingAddress.address2 : ''}`
    : '');
  const city = order.city || order.shippingAddress?.city || '';
  const state = order.state || order.shippingAddress?.state || '';
  const pinCode = order.pinCode || order.shippingAddress?.postalCode || '';
  const mobileNumber = order.mobileNumber || order.phone || '';

  const customerObj = order.customer || {
    firstName,
    lastName,
    email: order.email || '',
    phone: mobileNumber,
    address: {
      street: street || 'Not available',
      city: city || 'Not available',
      state: state || 'Not available',
      zip: pinCode || 'Not available',
      country: order.shippingAddress?.country || 'India'
    }
  };

  return {
    ...order,
    customerName: order.customerName || `${firstName} ${lastName}`.trim(),
    mobileNumber: mobileNumber || 'Not available',
    address: street || 'Not available',
    city: city || 'Not available',
    state: state || 'Not available',
    pinCode: pinCode || 'Not available',
    status: order.orderStatus,
    customer: customerObj,
    shippingMethod: order.shippingMethod || (order.shipping === 0 ? 'Standard Complimentary' : 'Express White-Glove')
  };
}

app.get('/api/orders', requireAdmin, (req, res) => {
  let orders = [...db.orders];
  const { status, paymentStatus, search } = req.query;

  if (status && status !== 'All') {
    orders = orders.filter((o) => o.orderStatus === status || o.status === status);
  }
  if (paymentStatus && paymentStatus !== 'All') {
    orders = orders.filter((o) => o.paymentStatus === paymentStatus);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    orders = orders.filter((o) => 
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q)
    );
  }

  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(orders.map(formatOrder));
});

app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const order = db.orders.find((o) => o.id === id || o.orderNumber === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(formatOrder(order));
});

// Checkout / Order creation endpoint with server-side validation & stock deduction
app.post('/api/orders', (req, res) => {
  let {
    customerName,
    mobileNumber,
    address,
    city,
    state,
    pinCode,
    email,
    phone,
    shippingAddress,
    billingAddress,
    items,
    shippingMethod,
    discount = 0,
    paymentMethod = 'Cash on Delivery',
    paymentStatus = 'Pending',
    orderStatus = 'Pending'
  } = req.body;

  // Support legacy nested customer object if provided
  if (req.body.customer) {
    const c = req.body.customer;
    if (!customerName) {
      customerName = [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Valued Client';
    }
    if (!email) email = c.email;
    if (!mobileNumber) mobileNumber = c.phone || '';
    if (!phone) phone = mobileNumber;
    if (!shippingAddress && c.address) {
      shippingAddress = {
        address1: c.address.street || c.address.address1 || '',
        address2: c.address.address2 || '',
        city: c.address.city || '',
        state: c.address.state || '',
        postalCode: c.address.zip || c.address.postalCode || '',
        country: c.address.country || 'India'
      };
    }
  }

  // Derive phone and email if not provided directly
  mobileNumber = mobileNumber || phone || '';
  phone = mobileNumber;
  email = email || `${(customerName || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'client'}@auraparfums.com`;

  // Build shippingAddress if flattened fields were provided
  if (!shippingAddress) {
    shippingAddress = {
      address1: address || '',
      city: city || '',
      state: state || '',
      postalCode: pinCode || '',
      country: 'India'
    };
  } else {
    address = address || shippingAddress.address1 || '';
    city = city || shippingAddress.city || '';
    state = state || shippingAddress.state || '';
    pinCode = pinCode || shippingAddress.postalCode || '';
  }

  // Enforce required customer checkout details: Full Name, Address, City, State, Mobile, PIN Code
  if (!customerName || !address || !city || !state || !mobileNumber || !pinCode || !items || !items.length) {
    return res.status(400).json({ 
      error: 'Please provide all required checkout fields: Full Name, Mobile Number, Full Address, City, State, and PIN Code.' 
    });
  }

  // Server-side inventory and price verification
  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product "${item.productName || item.productId}" is no longer available.` });
    }

    let unitPrice = product.price;
    let availableStock = product.stock;
    let variationItem = null;

    if (item.variationId && product.variations) {
      variationItem = product.variations.find((v) => v.id === item.variationId);
      if (variationItem) {
        if (variationItem.price !== undefined && variationItem.price > 0) {
          unitPrice = variationItem.price;
        }
        availableStock = variationItem.stock;
      }
    }

    const qty = Math.max(1, Number(item.quantity) || 1);

    if (qty > availableStock) {
      return res.status(400).json({
        error: `Insufficient stock for "${product.name}${variationItem ? ' (' + variationItem.name + ')' : ''}". Only ${availableStock} remaining.`
      });
    }

    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;

    verifiedItems.push({
      productId: product.id,
      productName: product.name,
      variationId: variationItem ? variationItem.id : undefined,
      variationName: variationItem ? variationItem.name : undefined,
      sku: variationItem?.sku || product.sku,
      selectedSize: item.selectedSize || '50ml / 1.7 fl oz',
      quantity: qty,
      unitPrice,
      totalPrice: lineTotal,
      image: variationItem?.image || product.images[0]
    });
  }

  // Calculate tax & shipping (₹0 if subtotal >= 75)
  const shipping = subtotal >= 75 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.max(0, Math.round((subtotal + shipping + tax - Number(discount || 0)) * 100) / 100);

  // Atomically deduct inventory
  for (const item of verifiedItems) {
    const product = db.products.find((p) => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      if (item.variationId && product.variations) {
        const v = product.variations.find((varItem) => varItem.id === item.variationId);
        if (v) {
          v.stock = Math.max(0, v.stock - item.quantity);
        }
      }
    }
  }

  // Generate unique order number
  const randSeq = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `AURA-2026-${randSeq}`;
  const orderId = 'ord-' + Date.now();

  const nameParts = customerName.trim().split(' ');
  const firstName = nameParts[0] || 'Valued';
  const lastName = nameParts.slice(1).join(' ') || 'Client';

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    customerName,
    mobileNumber,
    address,
    city,
    state,
    pinCode,
    email,
    phone: mobileNumber,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    items: verifiedItems,
    subtotal,
    shipping,
    shippingMethod: shippingMethod || (shipping === 0 ? 'Standard Complimentary' : 'Express White-Glove'),
    tax,
    discount: Number(discount) || 0,
    total,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    status: 'Pending',
    customer: {
      firstName,
      lastName,
      email,
      phone: mobileNumber,
      address: {
        street: address,
        city,
        state,
        zip: pinCode,
        country: shippingAddress.country || 'India'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Sync / update Customer profile
  const existingCustomer = db.customers.find((c) => 
    (email && c.email.toLowerCase() === email.toLowerCase()) || 
    (mobileNumber && c.phone === mobileNumber)
  );
  if (existingCustomer) {
    existingCustomer.totalSpent = Math.round((existingCustomer.totalSpent + total) * 100) / 100;
    existingCustomer.orderCount += 1;
    existingCustomer.lastOrderDate = newOrder.createdAt;
    existingCustomer.phone = mobileNumber;
  } else {
    db.customers.unshift({
      id: 'cust-' + Date.now(),
      name: customerName,
      email,
      phone: mobileNumber,
      totalSpent: total,
      orderCount: 1,
      lastOrderDate: newOrder.createdAt,
      registeredAt: newOrder.createdAt,
      addresses: [shippingAddress]
    });
  }

  saveDatabase();
  const formatted = formatOrder(newOrder);
  res.status(201).json({ order: formatted, ...formatted });
});

app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { orderStatus, status, paymentStatus, internalNotes } = req.body;

  const order = db.orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const newStatus = status || orderStatus;
  if (newStatus) {
    order.orderStatus = newStatus as OrderStatus;
    order.status = newStatus;
  }
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (internalNotes !== undefined) order.internalNotes = internalNotes;
  order.updatedAt = new Date().toISOString();

  saveDatabase();
  res.json(formatOrder(order));
});

/* ==========================================================================
   CUSTOMERS & ANALYTICS
   ========================================================================== */

app.get('/api/customers', requireAdmin, (req, res) => {
  const customers = [...db.customers].map((c) => {
    const parts = (c.name || '').trim().split(' ');
    const firstName = c.firstName || parts[0] || 'Client';
    const lastName = c.lastName || parts.slice(1).join(' ') || '';
    const firstAddr = c.addresses?.[0] || {
      address1: '10 Place Vendôme',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: '75001',
      country: 'France'
    };
    return {
      ...c,
      firstName,
      lastName,
      totalOrders: c.totalOrders || c.orderCount || 1,
      address: c.address || {
        street: firstAddr.address1,
        city: firstAddr.city,
        state: firstAddr.state,
        zip: firstAddr.postalCode,
        country: firstAddr.country
      }
    };
  }).sort((a, b) => b.totalSpent - a.totalSpent);
  res.json(customers);
});

app.get('/api/customers/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const customer = db.customers.find((c) => c.id === id || c.email === id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  const customerOrders = db.orders.filter((o) => o.email.toLowerCase() === customer.email.toLowerCase());
  res.json({ customer, orders: customerOrders.map(formatOrder) });
});

app.get('/api/analytics', requireAdmin, (req, res) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  let totalSales = 0;
  let todaySales = 0;
  let ordersToday = 0;
  let pendingOrders = 0;

  const salesByDayMap: Record<string, { amount: number; orders: number }> = {};
  const productSalesMap: Record<string, { name: string; sold: number; revenue: number; image: string }> = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    salesByDayMap[dStr] = { amount: 0, orders: 0 };
  }

  for (const order of db.orders) {
    totalSales += order.total;
    const orderDate = order.createdAt.split('T')[0];

    if (orderDate === todayStr) {
      todaySales += order.total;
      ordersToday += 1;
    }

    if (order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed' || order.status === 'PROCESSING') {
      pendingOrders += 1;
    }

    if (salesByDayMap[orderDate]) {
      salesByDayMap[orderDate].amount += order.total;
      salesByDayMap[orderDate].orders += 1;
    }

    for (const item of order.items) {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.productName,
          sold: 0,
          revenue: 0,
          image: item.image
        };
      }
      productSalesMap[item.productId].sold += item.quantity;
      productSalesMap[item.productId].revenue += item.totalPrice;
    }
  }

  const dailySales = Object.entries(salesByDayMap).map(([date, data]) => ({
    date,
    amount: Math.round(data.amount * 100) / 100,
    orders: data.orders
  }));

  const bestSellers = Object.entries(productSalesMap)
    .map(([id, data]) => ({
      id,
      name: data.name,
      sold: data.sold,
      revenue: Math.round(data.revenue * 100) / 100,
      image: data.image
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const lowStockCount = db.products.filter((p) => p.stock < 15).length;

  const analytics: any = {
    totalRevenue: Math.round(totalSales * 100) / 100,
    totalSales: Math.round(totalSales * 100) / 100,
    todaySales: Math.round(todaySales * 100) / 100,
    ordersToday,
    totalOrders: db.orders.length,
    averageOrderValue: db.orders.length > 0 ? Math.round((totalSales / db.orders.length) * 100) / 100 : 0,
    totalCustomers: db.customers.length,
    totalProducts: db.products.length,
    lowStockCount,
    pendingOrders,
    dailySales,
    weeklySales: [
      { week: 'Wk 33', amount: 1420, orders: 8 },
      { week: 'Wk 34', amount: 1890, orders: 11 },
      { week: 'Wk 35', amount: 2340, orders: 14 },
      { week: 'Wk 36 (Current)', amount: Math.round(totalSales * 100) / 100, orders: db.orders.length }
    ],
    monthlySales: [
      { month: 'June', amount: 4850, orders: 28 },
      { month: 'July', amount: 6200, orders: 36 },
      { month: 'August', amount: 7900, orders: 45 },
      { month: 'September', amount: Math.round(totalSales * 100) / 100, orders: db.orders.length }
    ],
    bestSellers
  };

  res.json(analytics);
});

// Sales calendar endpoint
app.get('/api/analytics/calendar', requireAdmin, (req, res) => {
  const calendarMap: Record<string, any> = {};

  // Seed last 14 days
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    calendarMap[dStr] = {
      date: dStr,
      revenue: 0,
      salesAmount: 0,
      orderCount: 0,
      itemsSold: 0,
      averageOrderValue: 0,
      orders: []
    };
  }

  for (const order of db.orders) {
    const dStr = order.createdAt.split('T')[0];
    if (!calendarMap[dStr]) {
      calendarMap[dStr] = {
        date: dStr,
        revenue: 0,
        salesAmount: 0,
        orderCount: 0,
        itemsSold: 0,
        averageOrderValue: 0,
        orders: []
      };
    }

    const day = calendarMap[dStr];
    day.revenue = Math.round((day.revenue + order.total) * 100) / 100;
    day.salesAmount = day.revenue;
    day.orderCount += 1;
    const totalItems = order.items.reduce((acc, it) => acc + it.quantity, 0);
    day.itemsSold += totalItems;
    day.orders.push(formatOrder(order));
    day.averageOrderValue = Math.round((day.revenue / day.orderCount) * 100) / 100;
  }

  const calendarDays = Object.values(calendarMap).sort((a, b) => a.date.localeCompare(b.date));
  res.json(calendarDays);
});

// Reset demo endpoint if admin desires
app.post('/api/admin/reset-demo', requireAdmin, (req, res) => {
  db = {
    adminPasswordHash: INITIAL_ADMIN_HASH,
    adminSessions: db.adminSessions,
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    customers: INITIAL_CUSTOMERS
  };
  saveDatabase();
  res.json({ success: true, message: 'Catalog and sample orders restored' });
});

/* ==========================================================================
   VITE DEV MIDDLEWARE & PRODUCTION STATIC SERVING
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURA Haute Parfumerie server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
