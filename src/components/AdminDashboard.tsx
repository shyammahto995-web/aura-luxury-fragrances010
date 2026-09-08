import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Calendar as CalendarIcon, 
  Users, 
  Key, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Banknote,
  Phone,
  MapPin,
  ArrowUpRight, 
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { Product, ProductVariation, Order, Customer } from '../types';

interface AdminDashboardProps {
  onReturnToStore: () => void;
  onRefreshProducts: () => Promise<void>;
  products: Product[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onReturnToStore,
  onRefreshProducts,
  products
}) => {
  const { token, logout, changePassword } = useAdmin();

  // Active Tab: 'overview' | 'products' | 'orders' | 'calendar' | 'customers' | 'security'
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'calendar' | 'customers' | 'security'>('overview');

  // Local synchronized products state for immediate UI feedback on deletion
  const [localProducts, setLocalProducts] = useState<Product[]>(products);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Formulation Deletion Confirmation Dialog & Loading states
  const [deleteModalProduct, setDeleteModalProduct] = useState<{ id: string; name: string; sku?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // General Action Notification Toast
  const [actionToast, setActionToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (actionToast) {
      const timer = setTimeout(() => {
        setActionToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [actionToast]);

  // Direct Image Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Filters & Searches
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Editing Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selected Order for Detail View
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Defensive accessors for customer and order properties
  const ordCustFirst = (o: any) => o?.customer?.firstName || o?.customerName?.split(' ')[0] || 'Client';
  const ordCustLast = (o: any) => o?.customer?.lastName || o?.customerName?.split(' ').slice(1).join(' ') || '';
  const ordCustName = (o: any) => o?.customerName || (o?.customer ? [o.customer.firstName, o.customer.lastName].filter(Boolean).join(' ') : 'Valued Client');
  const ordCustMobile = (o: any) => o?.mobileNumber || o?.customerMobile || o?.phone || o?.customer?.phone || o?.customer?.mobileNumber || '—';
  const ordCustEmail = (o: any) => o?.customer?.email || o?.email || '—';
  const ordStreet = (o: any) => o?.address || o?.customer?.address?.street || o?.shippingAddress?.address1 || 'Standard Address';
  const ordCity = (o: any) => o?.city || o?.customer?.address?.city || o?.shippingAddress?.city || '';
  const ordState = (o: any) => o?.state || o?.customer?.address?.state || o?.shippingAddress?.state || '';
  const ordZip = (o: any) => o?.pinCode || o?.customer?.address?.zip || o?.shippingAddress?.postalCode || '';

  // Fetch all admin data
  const fetchAdminData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch analytics
      const [resStats, resOrders, resCustomers, resCalendar] = await Promise.all([
        fetch('/api/analytics', { headers }),
        fetch('/api/orders', { headers }),
        fetch('/api/customers', { headers }),
        fetch('/api/analytics/calendar', { headers })
      ]);

      if (resStats.ok) setAnalytics(await resStats.json());
      if (resOrders.ok) setOrders(await resOrders.json());
      if (resCustomers.ok) setCustomers(await resCustomers.json());
      if (resCalendar.ok) {
        const cal = await resCalendar.json();
        setCalendarDays(Array.isArray(cal) ? cal : Object.values(cal));
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updated);
        }
        fetchAdminData();
      }
    } catch (e) {
      console.error('Failed to update order status', e);
    }
  };

  // Delete formulation - open confirmation dialog
  const handlePromptDelete = (p: Product) => {
    setDeleteError(null);
    setDeleteModalProduct({ id: p.id, name: p.name, sku: p.sku });
  };

  // Confirm delete formulation
  const handleConfirmDelete = async () => {
    if (!deleteModalProduct || !token) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/products/${deleteModalProduct.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        // Immediate UI removal without manual page refresh
        setLocalProducts(prev => prev.filter(p => p.id !== deleteModalProduct.id));
        setDeleteModalProduct(null);
        setActionToast({ text: 'Formulation deleted successfully.', type: 'success' });
        // Refresh background state
        await onRefreshProducts();
        fetchAdminData();
      } else {
        const d = await res.json().catch(() => ({}));
        const msg = d.error || 'Failed to delete formulation from server.';
        console.error('Delete formulation error:', msg);
        setDeleteError(msg);
      }
    } catch (err) {
      console.error('Network error during formulation deletion:', err);
      setDeleteError('Network error connecting to database. Please check your connection.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Product Modal (New)
  const handleOpenNewProduct = () => {
    setImageUploadError(null);
    const defaultImg = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85';
    setEditingProduct({
      name: '',
      tagline: '',
      description: '',
      shortDescription: '',
      price: 135,
      stock: 20,
      sku: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'Unisex',
      collection: 'Artisanal Heritage',
      fragranceFamily: 'Woody',
      gender: 'Unisex',
      sizeOptions: ['50ml / 1.7 fl oz', '100ml / 3.4 fl oz'],
      productImages: [defaultImg],
      primaryImage: defaultImg,
      images: [defaultImg],
      variations: [
        {
          id: 'v-1',
          name: 'Classic Amber',
          color: '#D4AF37',
          sku: `AUR-VAR-01`,
          price: 135,
          stock: 12,
          image: defaultImg,
          gallery: []
        }
      ],
      topNotes: ['Bergamot'],
      heartNotes: ['Iris'],
      baseNotes: ['Amber'],
      featured: false,
      bestSeller: false
    });
    setIsProductModalOpen(true);
  };

  // Open Product Modal (Edit)
  const handleOpenEditProduct = (prod: Product) => {
    setImageUploadError(null);
    const clone = JSON.parse(JSON.stringify(prod));
    const prodImages = Array.isArray(clone.productImages) && clone.productImages.length > 0
      ? clone.productImages.slice(0, 4)
      : (Array.isArray(clone.images) && clone.images.length > 0 ? clone.images.slice(0, 4) : []);
    const primImg = clone.primaryImage && prodImages.includes(clone.primaryImage)
      ? clone.primaryImage
      : (prodImages[0] || clone.images?.[0] || '');

    clone.productImages = prodImages;
    clone.primaryImage = primImg;
    clone.images = [primImg, ...prodImages.filter((img: string) => img !== primImg)];

    setEditingProduct(clone);
    setIsProductModalOpen(true);
  };

  // Direct Image Upload Handler (Max 4 images, JPG/PNG/WEBP, max 10MB)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    // Reset input value so same files can be re-selected if desired
    e.target.value = '';
    setImageUploadError(null);

    const currentImages = (editingProduct?.productImages && editingProduct.productImages.length > 0)
      ? editingProduct.productImages
      : (editingProduct?.images || []);

    if (currentImages.length + files.length > 4) {
      setImageUploadError('You can upload a maximum of 4 images.');
      return;
    }

    // Format & size validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setImageUploadError('Invalid format. Accepted formats: JPG, JPEG, PNG, WEBP.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setImageUploadError(`File "${file.name}" exceeds the 10MB limit.`);
        return;
      }
    }

    setIsUploadingImage(true);
    const newUploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);

        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ dataUrl, filename: file.name })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to upload image to storage.');
        }

        const data = await res.json();
        newUploadedUrls.push(data.url);
      }

      const merged = [...currentImages, ...newUploadedUrls].slice(0, 4);
      const chosenPrimary = editingProduct?.primaryImage && merged.includes(editingProduct.primaryImage)
        ? editingProduct.primaryImage
        : merged[0];

      setEditingProduct({
        ...editingProduct,
        productImages: merged,
        primaryImage: chosenPrimary,
        images: [chosenPrimary, ...merged.filter(u => u !== chosenPrimary)]
      });
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setImageUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(null);
    }
  };

  // Remove Image from formulation
  const handleRemoveImage = (imgUrlToRemove: string) => {
    if (!editingProduct) return;
    const currentImages = (editingProduct.productImages && editingProduct.productImages.length > 0)
      ? editingProduct.productImages
      : (editingProduct.images || []);

    const remaining = currentImages.filter(u => u !== imgUrlToRemove);

    let newPrimary = editingProduct.primaryImage;
    if (newPrimary === imgUrlToRemove || !remaining.includes(newPrimary || '')) {
      newPrimary = remaining[0] || '';
    }

    setEditingProduct({
      ...editingProduct,
      productImages: remaining,
      primaryImage: newPrimary,
      images: remaining.length > 0 ? [newPrimary, ...remaining.filter(u => u !== newPrimary)] : []
    });

    // Notify server to clean up orphaned upload file
    if (imgUrlToRemove.startsWith('/uploads/')) {
      fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ url: imgUrlToRemove })
      }).catch(err => console.error('Failed to clean up image on server:', err));
    }
  };

  // Designate Primary Image
  const handleSetPrimaryImage = (imgUrl: string) => {
    if (!editingProduct) return;
    const currentImages = (editingProduct.productImages && editingProduct.productImages.length > 0)
      ? editingProduct.productImages
      : (editingProduct.images || []);

    const ordered = [imgUrl, ...currentImages.filter(u => u !== imgUrl)];

    setEditingProduct({
      ...editingProduct,
      primaryImage: imgUrl,
      images: ordered
    });
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !token) return;

    try {
      const isEdit = !!editingProduct.id;
      const url = isEdit ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const prodImages = (editingProduct.productImages || editingProduct.images || []).slice(0, 4);
      const primImage = editingProduct.primaryImage && prodImages.includes(editingProduct.primaryImage)
        ? editingProduct.primaryImage
        : (prodImages[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85');

      const orderedImages = [primImage, ...prodImages.filter(u => u !== primImage)];

      const payload = {
        ...editingProduct,
        productImages: prodImages.length > 0 ? prodImages : [primImage],
        primaryImage: primImage,
        images: orderedImages.length > 0 ? orderedImages : [primImage]
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setActionToast({
          text: isEdit ? 'Formulation updated successfully.' : 'New formulation created successfully.',
          type: 'success'
        });
        await onRefreshProducts();
        fetchAdminData();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save formulation.');
      }
    } catch (e) {
      console.error('Error saving product', e);
      alert('Network error saving formulation');
    }
  };

  // Password Change
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    const res = await changePassword(newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Administrative password updated successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: res.error || 'Failed to change password.' });
    }
  };

  // Low stock products
  const lowStockProducts = products.filter(p => p.stock <= 5);

  return (
    <div id="aura-admin-dashboard" className="w-full bg-[#FAF8F5] min-h-screen">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-[#141312] text-white px-4 sm:px-8 py-3.5 border-b border-[#292623] flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-[0.25em] uppercase font-medium">AURA</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#A69E90]">Atelier Operations</span>
          </div>
          <span className="hidden sm:inline text-xs text-[#524B42] font-mono">|</span>
          <span className="hidden sm:inline text-xs text-[#B5A996] uppercase tracking-wider font-semibold">
            Administrative Portal
          </span>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 text-xs">
          <button
            onClick={onReturnToStore}
            className="inline-flex items-center space-x-1.5 bg-[#2B2824] hover:bg-[#3D3934] text-[#EAE4DC] px-3.5 py-1.5 border border-[#403B35] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Boutique</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center space-x-1.5 text-[#C45E5E] hover:text-[#E07A7A] px-2 py-1.5 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`p-4 border flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
              actionToast.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {actionToast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
              )}
              <span>{actionToast.text}</span>
            </div>
            <button
              onClick={() => setActionToast(null)}
              className="text-gray-500 hover:text-black ml-4"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-b border-[#DDD4C5] pb-px overflow-x-auto mb-8 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'border-[#141312] text-[#141312] bg-[#F2ECE1]'
                : 'border-transparent text-[#6E675B] hover:text-black hover:bg-[#F7F2EB]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'products'
                ? 'border-[#141312] text-[#141312] bg-[#F2ECE1]'
                : 'border-transparent text-[#6E675B] hover:text-black hover:bg-[#F7F2EB]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Fragrance Formulations ({localProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#141312] text-[#141312] bg-[#F2ECE1]'
                : 'border-transparent text-[#6E675B] hover:text-black hover:bg-[#F7F2EB]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Dispatches ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'calendar'
                ? 'border-[#141312] text-[#141312] bg-[#F2ECE1]'
                : 'border-transparent text-[#6E675B] hover:text-black hover:bg-[#F7F2EB]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Sales Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'customers'
                ? 'border-[#141312] text-[#141312] bg-[#F2ECE1]'
                : 'border-transparent text-[#6E675B] hover:text-black hover:bg-[#F7F2EB]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Clientele ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'security'
                ? 'border-[#141312] text-[#141312] bg-[#F2ECE1]'
                : 'border-transparent text-[#6E675B] hover:text-black hover:bg-[#F7F2EB]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Security & Passkey</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW & ANALYTICS
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white p-5 border border-[#ECE4D8] shadow-xs">
                <div className="flex items-center justify-between text-[#857C6F] mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Total Revenue</span>
                  <IndianRupee className="w-4 h-4 text-[#8A6724]" />
                </div>
                <div className="font-serif text-3xl text-[#141312] font-semibold">
                  ₹{(analytics?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-[#7A7265] mt-1">Gross boutique transactions</p>
              </div>

              <div className="bg-white p-5 border border-[#ECE4D8] shadow-xs">
                <div className="flex items-center justify-between text-[#857C6F] mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#8A6724]" />
                </div>
                <div className="font-serif text-3xl text-[#141312] font-semibold">
                  {analytics?.totalOrders || orders.length}
                </div>
                <p className="text-[11px] text-[#7A7265] mt-1">Processed orders</p>
              </div>

              <div className="bg-white p-5 border border-[#ECE4D8] shadow-xs">
                <div className="flex items-center justify-between text-[#857C6F] mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Average Basket</span>
                  <ArrowUpRight className="w-4 h-4 text-[#8A6724]" />
                </div>
                <div className="font-serif text-3xl text-[#141312] font-semibold">
                  ₹{(analytics?.averageOrderValue || 0).toFixed(2)}
                </div>
                <p className="text-[11px] text-[#7A7265] mt-1">Per transaction average</p>
              </div>

              <div className="bg-white p-5 border border-[#ECE4D8] shadow-xs">
                <div className="flex items-center justify-between text-[#857C6F] mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Catalog Formulations</span>
                  <Package className="w-4 h-4 text-[#8A6724]" />
                </div>
                <div className="font-serif text-3xl text-[#141312] font-semibold">
                  {products.length}
                </div>
                <p className="text-[11px] text-[#7A7265] mt-1">Active perfume flacons</p>
              </div>

            </div>

            {/* Low Stock Alerts & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Orders (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-[#ECE4D8] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <h3 className="font-serif text-lg text-[#141312] font-semibold">Recent Dispatches</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs uppercase tracking-wider text-[#8A6724] font-semibold hover:underline">
                    View All Orders
                  </button>
                </div>

                <div className="divide-y divide-[#F2ECE1]">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-semibold text-[#141312]">{ord.orderNumber}</span>
                          <span className={`px-2 py-0.5 text-[9px] uppercase font-semibold tracking-wider rounded-none ${
                            (ord.status || ord.orderStatus) === 'DELIVERED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            (ord.status || ord.orderStatus) === 'SHIPPED' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                            (ord.status || ord.orderStatus) === 'PROCESSING' || (ord.status || ord.orderStatus) === 'Confirmed' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ord.status || ord.orderStatus}
                          </span>
                        </div>
                        <p className="text-[#6E675C] mt-0.5">
                          {ordCustFirst(ord)} {ordCustLast(ord)} · {ord.items.length} items
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-semibold text-[#141312]">₹{ord.total.toFixed(2)}</span>
                        <p className="text-[10px] text-[#8C8476]">{new Date(ord.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Inventory Warnings (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-[#ECE4D8] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                    <h3 className="font-serif text-lg text-[#141312] font-semibold">Atelier Stock Alerts</h3>
                  </div>
                  <span className="text-[11px] text-[#8C8476]">Threshold: ≤ 5</span>
                </div>

                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-[#70685D] py-6 text-center font-light">
                    All perfume flacons and editions are well-stocked.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="p-3 bg-[#FAF7F2] border border-[#EBE3D7] flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-contain bg-white border border-[#DDD4C5]" />
                          <div>
                            <h4 className="font-serif text-sm font-semibold text-[#141312]">{p.name}</h4>
                            <p className="text-[10px] text-[#857D71]">SKU: {p.sku}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200">
                            {p.stock} units
                          </span>
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="block text-[10px] uppercase tracking-wider text-[#8A6724] font-semibold hover:underline mt-1"
                          >
                            Restock
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PRODUCT & VARIATION MANAGEMENT
           ========================================================================= */}
        {activeTab === 'products' && (() => {
          const filteredProducts = localProducts.filter(p => {
            if (!productSearch.trim()) return true;
            const q = productSearch.toLowerCase();
            return (
              (p.name && p.name.toLowerCase().includes(q)) ||
              (p.sku && p.sku.toLowerCase().includes(q)) ||
              (p.collection && p.collection.toLowerCase().includes(q)) ||
              (p.category && p.category.toLowerCase().includes(q))
            );
          });

          return (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Header & New Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 border border-[#ECE4D8]">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8476]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search catalog by name, sku, or collection..."
                    className="w-full bg-[#FAF8F5] border border-[#DDD4C5] pl-9 pr-3.5 py-2 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewProduct}
                  className="inline-flex items-center space-x-2 bg-[#141312] hover:bg-[#2B2824] text-white px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Formulation</span>
                </button>
              </div>

              {/* Empty State: All formulations deleted from catalog */}
              {localProducts.length === 0 ? (
                <div className="bg-white border border-[#ECE4D8] p-12 text-center shadow-xs">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] border border-[#DDD4C5] flex items-center justify-center text-[#8C8476] mb-4">
                    <Package className="w-7 h-7 text-[#7A7366]" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#141312] mb-1">
                    No Fragrance Formulations in Catalog
                  </h3>
                  <p className="text-xs text-[#7A7366] max-w-md mx-auto mb-6">
                    All formulations have been deleted from the database. Create a new formulation to replenish your boutique catalog.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenNewProduct}
                    className="inline-flex items-center space-x-2 bg-[#141312] hover:bg-[#2B2824] text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Formulation</span>
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                /* Empty State: Search filter yielded no items */
                <div className="bg-white border border-[#ECE4D8] p-10 text-center shadow-xs">
                  <Search className="w-8 h-8 text-[#8C8476] mx-auto mb-3" />
                  <h3 className="font-serif text-base font-semibold text-[#141312] mb-1">
                    No matching formulations found
                  </h3>
                  <p className="text-xs text-[#7A7366] mb-4">
                    No fragrance formulation matches "{productSearch}".
                  </p>
                  <button
                    type="button"
                    onClick={() => setProductSearch('')}
                    className="text-xs text-[#8A6724] font-semibold underline uppercase tracking-wider hover:text-black"
                  >
                    Clear Search Filter
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop & Laptop Table View */}
                  <div className="hidden md:block bg-white border border-[#ECE4D8] overflow-x-auto shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] border-b border-[#EAE3D6] text-[10px] uppercase tracking-wider text-[#6E675C]">
                        <tr>
                          <th className="py-3 px-4">Fragrance</th>
                          <th className="py-3 px-4">Collection / Cat</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Stock</th>
                          <th className="py-3 px-4">Variations (Editions)</th>
                          <th className="py-3 px-4">Status Badges</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EBE1]">
                        {filteredProducts.map((p) => {
                          const displayImg = p.primaryImage || (Array.isArray(p.images) && p.images[0]) || '';
                          return (
                            <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={displayImg}
                                    alt={p.name}
                                    className="w-10 h-12 object-contain bg-[#F4EFE6] border border-[#DDD4C5] p-1"
                                  />
                                  <div>
                                    <h4 className="font-serif text-sm font-semibold text-[#141312]">{p.name}</h4>
                                    <span className="text-[10px] text-[#8C8476]">SKU: {p.sku}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-[#524B40]">
                                {p.collection} <br />
                                <span className="text-[10px] text-[#8C8476]">{p.category}</span>
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-[#141312]">
                                ₹{p.price.toFixed(2)}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 text-[10px] font-semibold ${
                                  p.stock <= 0 ? 'bg-red-50 text-red-700 border border-red-200' :
                                  p.stock <= 5 ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                                  'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}>
                                  {p.stock} left
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                {p.variations && p.variations.length > 0 ? (
                                  <div className="flex items-center space-x-1.5">
                                    {p.variations.map(v => (
                                      <span
                                        key={v.id}
                                        title={`${v.name} (${v.stock} in stock)`}
                                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                                        style={{ backgroundColor: v.color }}
                                      />
                                    ))}
                                    <span className="text-[10px] text-[#7A7367] ml-1">({p.variations.length})</span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-[#A69E90] italic">Standard Flacon</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 space-x-1">
                                {p.bestSeller && (
                                  <span className="bg-[#141312] text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5">
                                    Best Seller
                                  </span>
                                )}
                                {p.featured && (
                                  <span className="bg-[#EFE9DF] text-[#3D372E] text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[#DDD3C4]">
                                    Featured
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="px-2.5 py-1.5 text-xs text-[#524B40] hover:text-[#141312] bg-[#FAF8F5] hover:bg-[#EFE9DF] border border-[#DDD4C5] transition-colors flex items-center space-x-1.5"
                                    title="Edit Formulation & Variations"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handlePromptDelete(p)}
                                    className="px-2.5 py-1.5 text-xs text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 border border-red-300 transition-colors flex items-center space-x-1.5 active:scale-95"
                                    title="Delete Formulation"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile & Tablet Responsive Cards Layout */}
                  <div className="block md:hidden space-y-4">
                    {filteredProducts.map((p) => {
                      const displayImg = p.primaryImage || (Array.isArray(p.images) && p.images[0]) || '';
                      return (
                        <div key={p.id} className="bg-white border border-[#ECE4D8] p-4 shadow-xs space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center space-x-3 min-w-0">
                              <img
                                src={displayImg}
                                alt={p.name}
                                className="w-14 h-16 object-contain bg-[#F4EFE6] border border-[#DDD4C5] p-1 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="font-serif text-base font-semibold text-[#141312] truncate">{p.name}</h4>
                                <span className="block text-[11px] font-mono text-[#8C8476]">SKU: {p.sku}</span>
                                <span className="block text-xs font-serif font-bold text-[#141312] mt-0.5">₹{p.price.toFixed(2)}</span>
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                              p.stock <= 0 ? 'bg-red-50 text-red-700 border border-red-200' :
                              p.stock <= 5 ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              {p.stock} in stock
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F5EFE6] text-xs text-[#524B40]">
                            <span className="bg-[#FAF8F5] px-2 py-0.5 border border-[#EAE3D6] text-[10px]">
                              {p.collection}
                            </span>
                            <span className="bg-[#FAF8F5] px-2 py-0.5 border border-[#EAE3D6] text-[10px]">
                              {p.category}
                            </span>
                            {p.bestSeller && (
                              <span className="bg-[#141312] text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-semibold">
                                Best Seller
                              </span>
                            )}
                            {p.featured && (
                              <span className="bg-[#EFE9DF] text-[#3D372E] text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[#DDD3C4]">
                                Featured
                              </span>
                            )}
                          </div>

                          {/* Mobile Touch-Optimized Actions (min 44px height, balanced layout) */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F5EFE6]">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(p)}
                              className="min-h-[44px] py-2.5 px-3 border border-[#DDD4C5] bg-[#FAF8F5] hover:bg-[#EFE9DF] text-[#141312] text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePromptDelete(p)}
                              className="min-h-[44px] py-2.5 px-3 border border-red-300 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

            </div>
          );
        })()}

        {/* =========================================================================
            TAB 3: ORDER MANAGEMENT
           ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 border border-[#ECE4D8]">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8476]" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, client name, email..."
                  className="w-full bg-[#FAF8F5] border border-[#DDD4C5] pl-9 pr-3.5 py-2 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider text-[#736B5E] font-medium">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white border border-[#DDD4C5] px-3 py-2 text-xs uppercase tracking-wider font-medium text-[#141312] focus:outline-none"
                >
                  <option value="ALL">All Statuses ({orders.length})</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-[#ECE4D8] overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] border-b border-[#EAE3D6] text-[10px] uppercase tracking-wider text-[#6E675C]">
                  <tr>
                    <th className="py-3 px-4">Order # & Date</th>
                    <th className="py-3 px-4">Client & Contact</th>
                    <th className="py-3 px-4">Delivery Destination</th>
                    <th className="py-3 px-4">Items / Formulations</th>
                    <th className="py-3 px-4">Total (COD)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE1]">
                  {orders
                    .filter(o => {
                      const curStatus = o.status || o.orderStatus;
                      if (orderStatusFilter !== 'ALL' && curStatus !== orderStatusFilter) return false;
                      if (!orderSearch.trim()) return true;
                      const q = orderSearch.toLowerCase();
                      const name = ordCustName(o).toLowerCase();
                      const mobile = ordCustMobile(o).toLowerCase();
                      const email = ordCustEmail(o).toLowerCase();
                      const city = ordCity(o).toLowerCase();
                      const state = ordState(o).toLowerCase();
                      const pin = ordZip(o).toLowerCase();
                      const num = (o.orderNumber || '').toLowerCase();
                      return num.includes(q) || name.includes(q) || mobile.includes(q) || email.includes(q) || city.includes(q) || state.includes(q) || pin.includes(q);
                    })
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-[#141312] block">{o.orderNumber}</span>
                          <span className="text-[10px] text-[#8A8173]">{new Date(o.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-[#141312] font-semibold block">{ordCustName(o)}</strong>
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#696155] font-mono mt-0.5">
                            <Phone className="w-3 h-3 text-[#8A6724]" />
                            <span>{ordCustMobile(o)}</span>
                          </span>
                          {ordCustEmail(o) !== '—' && (
                            <span className="block text-[10px] text-[#8A8173] truncate max-w-[140px]">{ordCustEmail(o)}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#524B40] max-w-xs">
                          <p className="font-medium text-[#141312] truncate">{ordStreet(o)}</p>
                          <p className="text-[11px] text-[#6E675C]">
                            {ordCity(o)}{ordState(o) ? `, ${ordState(o)}` : ''}{ordZip(o) ? ` - ${ordZip(o)}` : ''}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-[#524B40]">
                          {o.items.map((it, i) => (
                            <span key={i} className="block truncate max-w-xs text-[11px]">
                              {it.quantity}x {it.productName} {it.variationName ? `(${it.variationName})` : ''}
                            </span>
                          ))}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#141312] block text-sm">₹{o.total.toFixed(2)}</span>
                          <span className="text-[9px] uppercase tracking-wider text-amber-800 bg-amber-50 px-1.5 py-0.5 border border-amber-200 inline-block mt-0.5">
                            Cash on Delivery
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={o.status || o.orderStatus || 'Confirmed'}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 border focus:outline-none cursor-pointer ${
                              (o.status || o.orderStatus) === 'DELIVERED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              (o.status || o.orderStatus) === 'SHIPPED' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                              (o.status || o.orderStatus) === 'PROCESSING' || (o.status || o.orderStatus) === 'Confirmed' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              (o.status || o.orderStatus) === 'CANCELLED' ? 'bg-red-50 text-red-800 border-red-300' :
                              'bg-gray-50 text-gray-800 border-gray-300'
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="text-xs uppercase tracking-wider font-semibold text-[#8A6724] hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: SALES CALENDAR
           ========================================================================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 border border-[#ECE4D8] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0EBE1] gap-2 mb-6">
                <div>
                  <h3 className="font-serif text-xl text-[#141312] font-semibold">Atelier Dispatch Calendar</h3>
                  <p className="text-xs text-[#70685D] font-light">Interactive date timeline of incoming client acquisitions and revenues</p>
                </div>
                <div className="flex items-center space-x-4 text-xs text-[#736B5E]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#141312]" /> Days with active revenue</span>
                </div>
              </div>

              {/* Grid of Calendar Days */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {calendarDays.map((day) => {
                  const isSelected = selectedCalendarDay?.date === day.date;
                  const hasSales = day.orderCount > 0;

                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setSelectedCalendarDay(day)}
                      className={`p-3.5 border text-left flex flex-col justify-between min-h-[90px] transition-all ${
                        isSelected
                          ? 'border-[#141312] bg-[#F2ECE1] ring-1 ring-[#141312]'
                          : hasSales
                          ? 'border-[#DDD4C5] bg-[#FAF8F5] hover:border-[#8A6724]'
                          : 'border-[#EAE3D6] bg-white opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-[#141312]">{day.date.slice(5)}</span>
                        {hasSales && (
                          <span className="bg-[#141312] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                            {day.orderCount}
                          </span>
                        )}
                      </div>

                      <div className="mt-2">
                        {hasSales ? (
                          <>
                            <span className="font-semibold text-xs text-[#8A6724] block">
                              ₹{day.revenue.toFixed(0)}
                            </span>
                            <span className="text-[10px] text-[#7A7366] block">
                              {day.orderCount} order{day.orderCount > 1 ? 's' : ''}
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] text-[#A69E90]">—</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Details */}
              {selectedCalendarDay && (
                <div className="mt-8 p-5 bg-[#FAF7F2] border border-[#E0D7C9] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base text-[#141312] font-semibold">
                      Orders Dispatched on {selectedCalendarDay.date}
                    </h4>
                    <span className="text-xs font-semibold text-[#8A6724]">
                      Total Day Revenue: ₹{selectedCalendarDay.revenue.toFixed(2)}
                    </span>
                  </div>

                  {selectedCalendarDay.orders.length === 0 ? (
                    <p className="text-xs text-[#7A7265] italic">No orders were recorded on this date.</p>
                  ) : (
                    <div className="divide-y divide-[#EAE3D6]">
                      {selectedCalendarDay.orders.map((ord: any) => (
                        <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono font-bold text-[#141312]">{ord.orderNumber}</span>
                            <span className="text-[#696155] ml-2">{ordCustName(ord)}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-[#141312]">₹{ord.total.toFixed(2)}</span>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="text-[11px] uppercase tracking-wider text-[#8A6724] font-semibold hover:underline"
                            >
                              Inspect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: CLIENTELE DIRECTORY
           ========================================================================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-[#ECE4D8] overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] border-b border-[#EAE3D6] text-[10px] uppercase tracking-wider text-[#6E675C]">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Contact Email</th>
                    <th className="py-3 px-4">Primary Destination</th>
                    <th className="py-3 px-4">Lifetime Orders</th>
                    <th className="py-3 px-4 text-right">Lifetime Expenditure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE1]">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 px-4 font-medium text-[#141312]">
                        {c.firstName ? `${c.firstName} ${c.lastName || ''}` : (c.name || 'Client')}
                      </td>
                      <td className="py-3.5 px-4 text-[#665F52]">
                        {c.email}
                      </td>
                      <td className="py-3.5 px-4 text-[#665F52]">
                        {c.address ? `${c.address.city}, ${c.address.state || c.address.country}` : c.addresses?.[0] ? `${c.addresses[0].city}, ${c.addresses[0].state || c.addresses[0].country}` : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[#FAF7F2] border border-[#DDD4C5] px-2.5 py-0.5 font-bold text-[#141312]">
                          {c.totalOrders ?? c.orderCount ?? 1}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-serif font-bold text-sm text-[#141312]">
                        ₹{(c.totalSpent || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: SECURITY & PASSWORD CHANGE
           ========================================================================= */}
        {activeTab === 'security' && (
          <div className="max-w-md bg-white p-6 sm:p-8 border border-[#ECE4D8] shadow-xs space-y-5 animate-in fade-in duration-200">
            <div className="pb-3 border-b border-[#F0EBE1]">
              <h3 className="font-serif text-lg text-[#141312] font-semibold">Change Administrator Passkey</h3>
              <p className="text-xs text-[#70685D] font-light mt-1">
                Protect sensitive formulation recipes, order histories, and payment logs.
              </p>
            </div>

            {passwordMsg && (
              <div className={`p-3 text-xs flex items-center space-x-2 border ${
                passwordMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                  New Passkey *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-3 py-2 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                  Confirm New Passkey *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter passkey"
                  className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-3 py-2 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#141312] text-white hover:bg-[#2B2824] text-xs uppercase tracking-[0.2em] font-semibold transition-all"
                >
                  Update Passkey
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* =========================================================================
          PRODUCT EDIT / CREATE MODAL WITH COMPLETE VARIATION SUPPORT
         ========================================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-[#DDD4C5] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#ECE4D8]">
              <h3 className="font-serif text-xl text-[#141312] font-semibold">
                {editingProduct.id ? `Edit Formulation: ${editingProduct.name}` : 'New Artisanal Formulation'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-[#666054] hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-6">
              {/* Row 1: Name, Tagline, SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                    Perfume Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Élan Extrait de Parfum"
                    className="w-full bg-white border border-[#DDD4C5] px-3 py-2 text-xs text-[#141312]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                    Primary SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full bg-white border border-[#DDD4C5] px-3 py-2 text-xs font-mono text-[#141312]"
                  />
                </div>
              </div>

              {/* Row 2: Price, Compare-At, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                    Retail Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-[#DDD4C5] px-3 py-2 text-xs text-[#141312]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                    Compare At Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.compareAtPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, compareAtPrice: parseFloat(e.target.value) || undefined })}
                    placeholder="Optional"
                    className="w-full bg-white border border-[#DDD4C5] px-3 py-2 text-xs text-[#141312]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                    Inventory Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock ?? 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-white border border-[#DDD4C5] px-3 py-2 text-xs text-[#141312]"
                  />
                </div>
              </div>

              {/* Row 3: Category, Collection, Family, Gender */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category || 'Women'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-white border border-[#DDD4C5] px-2.5 py-2 text-xs text-[#141312]"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Gift Sets">Gift Sets</option>
                    <option value="Discovery Sets">Discovery Sets</option>
                    <option value="Perfume Oils">Perfume Oils</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                    Collection
                  </label>
                  <select
                    value={editingProduct.collection || 'Artisanal Heritage'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, collection: e.target.value })}
                    className="w-full bg-white border border-[#DDD4C5] px-2.5 py-2 text-xs text-[#141312]"
                  >
                    <option value="Artisanal Heritage">Artisanal Heritage</option>
                    <option value="Midnight Nocturne">Midnight Nocturne</option>
                    <option value="Solar Radiance">Solar Radiance</option>
                    <option value="Private Reserve">Private Reserve</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                    Olfactory Family
                  </label>
                  <select
                    value={editingProduct.fragranceFamily || 'Floral'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fragranceFamily: e.target.value })}
                    className="w-full bg-white border border-[#DDD4C5] px-2.5 py-2 text-xs text-[#141312]"
                  >
                    <option value="Woody">Woody</option>
                    <option value="Floral">Floral</option>
                    <option value="Amber">Amber</option>
                    <option value="Citrus">Citrus</option>
                    <option value="Oriental">Oriental</option>
                    <option value="Gourmand">Gourmand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                    Gender
                  </label>
                  <select
                    value={editingProduct.gender || 'Unisex'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, gender: e.target.value as any })}
                    className="w-full bg-white border border-[#DDD4C5] px-2.5 py-2 text-xs text-[#141312]"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detailed narrative description of the scent journey..."
                  className="w-full bg-white border border-[#DDD4C5] p-3 text-xs text-[#141312]"
                />
              </div>

              {/* ===============================================================
                  PRODUCT IMAGES (DIRECT IMAGE UPLOAD SYSTEM - MAX 4 IMAGES)
                 =============================================================== */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold">
                      Product Images
                    </label>
                    <p className="text-[11px] text-[#8C8476]">
                      Upload up to 4 images for this fragrance (JPG, JPEG, PNG, WEBP — max 10MB each).
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#8C8476] self-start sm:self-auto">
                    {((editingProduct.productImages && editingProduct.productImages.length > 0)
                      ? editingProduct.productImages
                      : (editingProduct.images || [])
                    ).slice(0, 4).length} / 4 uploaded
                  </span>
                </div>

                {/* Image Upload Error Alert */}
                {imageUploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{imageUploadError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUploadError(null)}
                      className="text-red-700 hover:text-red-900 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Responsive Image Previews Grid */}
                {(() => {
                  const currentImages = ((editingProduct.productImages && editingProduct.productImages.length > 0)
                    ? editingProduct.productImages
                    : (editingProduct.images || [])
                  ).slice(0, 4);

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {currentImages.map((imgUrl, idx) => {
                        const isPrimary = (editingProduct.primaryImage === imgUrl) || (!editingProduct.primaryImage && idx === 0);
                        return (
                          <div
                            key={imgUrl + idx}
                            className={`relative group bg-[#FAF8F5] border p-2 flex flex-col items-center justify-between transition-all ${
                              isPrimary
                                ? 'border-[#B29255] ring-1 ring-[#B29255] shadow-xs'
                                : 'border-[#DDD4C5] hover:border-[#8C8476]'
                            }`}
                          >
                            {/* Top row: Primary badge & Remove button */}
                            <div className="w-full flex items-center justify-between mb-1.5 min-h-[22px]">
                              {isPrimary ? (
                                <span className="inline-flex items-center space-x-1 bg-[#B29255] text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-semibold">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Primary</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#8C8476] font-mono">Image {idx + 1}</span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(imgUrl)}
                                className="text-[#8C8476] hover:text-red-700 hover:bg-red-50 p-1 transition-colors"
                                title="Remove image"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Image Thumbnail */}
                            <div className="w-full h-28 bg-white border border-[#ECE4D8] flex items-center justify-center overflow-hidden mb-2">
                              <img
                                src={imgUrl}
                                alt={`Formulation ${idx + 1}`}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>

                            {/* Bottom row: Primary Selector */}
                            <div className="w-full pt-1">
                              {isPrimary ? (
                                <div className="w-full py-1 text-center text-[10px] uppercase tracking-wider font-semibold text-[#8A6724]">
                                  ✓ Main Display
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(imgUrl)}
                                  className="w-full py-1 text-center text-[10px] uppercase tracking-wider font-semibold text-[#524B40] hover:text-[#141312] hover:bg-[#ECE4D8] border border-[#DDD4C5] transition-colors"
                                >
                                  Set as Primary
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Upload Slot Tile (if less than 4 images) */}
                      {currentImages.length < 4 && (
                        <div
                          onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                          className={`border-2 border-dashed border-[#DDD4C5] hover:border-[#141312] bg-white hover:bg-[#FAF8F5] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[175px] ${
                            isUploadingImage ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          {isUploadingImage ? (
                            <div className="flex flex-col items-center space-y-2">
                              <Clock className="w-6 h-6 text-[#8A6724] animate-spin" />
                              <span className="text-[11px] font-semibold text-[#141312]">
                                {uploadProgress || 'Uploading...'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#DDD4C5] flex items-center justify-center text-[#524B40]">
                                <UploadCloud className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-[#141312] block">
                                  + Upload Image
                                </span>
                                <span className="text-[10px] text-[#8C8476] block mt-0.5">
                                  {4 - currentImages.length} slot{4 - currentImages.length > 1 ? 's' : ''} available
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* ===============================================================
                  CRITICAL REQUIREMENT: COLOR / APPEARANCE VARIATION BUILDER
                 =============================================================== */}
              <div className="border-t border-[#EAE3D6] pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base text-[#141312] font-semibold">
                      Color & Flacon Variations
                    </h4>
                    <p className="text-[11px] text-[#787165]">
                      Manage distinct colorways, custom swatch colors, individual stock, and bespoke flacon images.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentVars = editingProduct.variations || [];
                      const newVar: ProductVariation = {
                        id: `v-${Date.now()}`,
                        name: 'New Edition',
                        color: '#B29255',
                        sku: `${editingProduct.sku || 'AURA'}-ED`,
                        price: editingProduct.price,
                        stock: 10,
                        image: editingProduct.images?.[0] || '',
                        gallery: []
                      };
                      setEditingProduct({
                        ...editingProduct,
                        variations: [...currentVars, newVar]
                      });
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold text-[#8A6724] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Variation</span>
                  </button>
                </div>

                {(!editingProduct.variations || editingProduct.variations.length === 0) ? (
                  <p className="text-xs text-[#8C8476] italic">No variations defined yet. Scent will use single standard appearance.</p>
                ) : (
                  <div className="space-y-3">
                    {editingProduct.variations.map((v, idx) => (
                      <div key={v.id} className="p-3 bg-white border border-[#DDD4C5] grid grid-cols-1 sm:grid-cols-6 gap-3 items-center">
                        {/* Swatch & Name */}
                        <div className="sm:col-span-2 flex items-center space-x-2">
                          <input
                            type="color"
                            value={v.color}
                            onChange={(e) => {
                              const updated = [...(editingProduct.variations || [])];
                              updated[idx].color = e.target.value;
                              setEditingProduct({ ...editingProduct, variations: updated });
                            }}
                            className="w-7 h-7 p-0 border border-black/20 rounded cursor-pointer shrink-0"
                            title="Pick swatch color"
                          />
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => {
                              const updated = [...(editingProduct.variations || [])];
                              updated[idx].name = e.target.value;
                              setEditingProduct({ ...editingProduct, variations: updated });
                            }}
                            placeholder="e.g. Amber Edition"
                            className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-2 py-1 text-xs font-medium text-[#141312]"
                          />
                        </div>

                        {/* Stock */}
                        <div>
                          <label className="text-[9px] uppercase tracking-wider text-[#8A8173] block">Stock</label>
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => {
                              const updated = [...(editingProduct.variations || [])];
                              updated[idx].stock = parseInt(e.target.value, 10) || 0;
                              setEditingProduct({ ...editingProduct, variations: updated });
                            }}
                            className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-2 py-1 text-xs"
                          />
                        </div>

                        {/* Price Override */}
                        <div>
                          <label className="text-[9px] uppercase tracking-wider text-[#8A8173] block">Price (₹)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={v.price || ''}
                            onChange={(e) => {
                              const updated = [...(editingProduct.variations || [])];
                              updated[idx].price = parseFloat(e.target.value) || undefined;
                              setEditingProduct({ ...editingProduct, variations: updated });
                            }}
                            placeholder="Inherit"
                            className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-2 py-1 text-xs"
                          />
                        </div>

                        {/* Image URL */}
                        <div className="sm:col-span-2 flex items-center space-x-2">
                          <input
                            type="url"
                            value={v.image || ''}
                            onChange={(e) => {
                              const updated = [...(editingProduct.variations || [])];
                              updated[idx].image = e.target.value;
                              setEditingProduct({ ...editingProduct, variations: updated });
                            }}
                            placeholder="Variation Image URL"
                            className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-2 py-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProduct.variations || []).filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, variations: updated });
                            }}
                            className="text-red-600 hover:text-red-800 p-1 shrink-0"
                            title="Remove variation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Best Seller & Featured Toggles */}
              <div className="flex items-center space-x-6 border-t border-[#EAE3D6] pt-4 text-xs font-semibold">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="accent-[#141312] w-4 h-4"
                  />
                  <span>Featured Fragrance</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.bestSeller || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, bestSeller: e.target.checked })}
                    className="accent-[#141312] w-4 h-4"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#ECE4D8]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#666053] hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#141312] text-white px-7 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2B2824]"
                >
                  Save Formulation
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          ORDER INSPECT & INVOICE MODAL
         ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-[#DDD4C5] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#ECE4D8]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8476] font-semibold">Dispatch Invoice</span>
                <h3 className="font-serif text-2xl text-[#141312] font-semibold">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#666054] hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5 text-xs">
              {/* Comprehensive Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7F2] p-5 border border-[#ECE4D8]">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-[#E8DFD0]">
                    <Phone className="w-3.5 h-3.5 text-[#8A6724]" />
                    <strong className="text-[10px] uppercase tracking-wider text-[#8A8174]">Customer & Contact</strong>
                  </div>
                  <p className="font-semibold text-sm text-[#141312]">{ordCustName(selectedOrder)}</p>
                  <p className="text-[#696155] font-mono text-xs flex items-center gap-1">
                    <span className="font-semibold text-[#141312]">Mobile:</span> {ordCustMobile(selectedOrder)}
                  </p>
                  {ordCustEmail(selectedOrder) !== '—' && (
                    <p className="text-[#696155] text-[11px]"><span className="text-[#8A8174]">Email:</span> {ordCustEmail(selectedOrder)}</p>
                  )}
                  <div className="pt-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200 inline-block">
                      Payment: {selectedOrder.paymentMethod || 'Cash on Delivery'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-[#E8DFD0]">
                    <MapPin className="w-3.5 h-3.5 text-[#8A6724]" />
                    <strong className="text-[10px] uppercase tracking-wider text-[#8A8174]">Delivery Address</strong>
                  </div>
                  <p className="font-medium text-[#141312]">{ordStreet(selectedOrder)}</p>
                  <p className="text-[#696155]">
                    {ordCity(selectedOrder)}{ordState(selectedOrder) ? `, ${ordState(selectedOrder)}` : ''}
                  </p>
                  <p className="text-[#141312] font-mono font-semibold">
                    PIN Code: {ordZip(selectedOrder) || '—'}
                  </p>
                  <p className="text-[#8C8476] text-[11px] pt-1">
                    Courier: {selectedOrder.shippingMethod || 'Standard Fragrance Courier (Cash on Delivery)'}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="border border-[#ECE4D8] divide-y divide-[#ECE4D8]">
                <div className="bg-[#FAF7F2] px-4 py-2 text-[10px] uppercase tracking-wider font-semibold text-[#8A8174]">
                  Ordered Fragrances ({selectedOrder.items.length})
                </div>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={it.image} alt={it.productName} className="w-10 h-12 object-contain bg-[#FAF7F2] border border-[#DDD4C5]" />
                      <div>
                        <h5 className="font-serif text-sm font-semibold text-[#141312]">{it.productName}</h5>
                        <p className="text-[11px] text-[#7A7265]">
                          {it.variationName && <span className="font-medium text-[#141312]">{it.variationName} · </span>}
                          {it.selectedSize} · Qty {it.quantity} @ ₹{(it.unitPrice || it.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#141312]">₹{((it.unitPrice || it.price || 0) * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-right pt-2">
                <p>Subtotal: <strong className="text-[#141312]">₹{selectedOrder.subtotal.toFixed(2)}</strong></p>
                {selectedOrder.discount > 0 && <p className="text-emerald-800 font-medium">Discount: -₹{selectedOrder.discount.toFixed(2)}</p>}
                <p>Shipping: <strong className="text-[#141312]">₹{selectedOrder.shipping.toFixed(2)}</strong></p>
                <p>Tax: <strong className="text-[#141312]">₹{selectedOrder.tax.toFixed(2)}</strong></p>
                <p className="text-base font-serif font-bold text-[#141312] pt-2 border-t border-[#EAE3D6]">
                  Total Amount Payable (COD): ₹{selectedOrder.total.toFixed(2)}
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#ECE4D8]">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-[#DDD4C5] text-xs uppercase tracking-wider font-semibold text-[#141312] hover:bg-[#F2ECE1]"
                >
                  Print Packing Slip
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-[#141312] text-white text-xs uppercase tracking-wider font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION DIALOG MODAL
         ========================================================================= */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#ECE4D8] w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start space-x-3.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-[#141312]">
                  Delete Fragrance Formulation
                </h3>
                <p className="text-xs text-[#7A7366] mt-1 leading-relaxed">
                  Are you sure you want to delete <strong className="text-[#141312]">"{deleteModalProduct.name}"</strong>? This will permanently remove this fragrance formulation and all associated inventory and assets from the catalog.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#DDD4C5] p-3 text-xs text-[#524B40] mb-5 flex items-center space-x-3">
              <img
                src={deleteModalProduct.primaryImage || (Array.isArray(deleteModalProduct.images) && deleteModalProduct.images[0]) || ''}
                alt={deleteModalProduct.name}
                className="w-10 h-12 object-contain bg-white border border-[#DDD4C5] p-0.5"
              />
              <div className="min-w-0">
                <p className="font-semibold text-[#141312] truncate">{deleteModalProduct.name}</p>
                <p className="text-[11px] text-[#8C8476]">SKU: {deleteModalProduct.sku} · ₹{deleteModalProduct.price.toFixed(2)}</p>
                <p className="text-[11px] text-[#8C8476]">{deleteModalProduct.stock} units in inventory</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalProduct(null)}
                className="px-4 py-2.5 border border-[#DDD4C5] text-xs uppercase tracking-wider font-semibold text-[#524B40] hover:text-[#141312] hover:bg-[#FAF8F5] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
