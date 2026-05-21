import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  User, Bike, ChefHat, UtensilsCrossed, LayoutDashboard, Store, ShoppingBag, CheckCircle, CookingPot, ArrowRight, PlusCircle, ShieldAlert, Plus, Minus, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- DAFTAR REKOMENDASI 5 USTADZ MEMBERSHIP ---
const USTADZ_MEMBERS = [
  'Ustadz Abdul Somad',
  'Ustadz Adi Hidayat',
  'Ustadz Hanan Attaki',
  'Ustadz Khalid Basalamah',
  'Ustadz Felix Siauw'
];

// --- INITIAL DATA PRODUK KULINER (LENGKAP DENGAN STOK) ---
const INITIAL_MENU = [
  { id: 1, name: 'Nasi Goreng Kampung', price: 25000, desc: 'Nasi goreng bumbu jawa otentik dengan telur mata sapi.', img: UtensilsCrossed, tag: 'Best Seller', category: 'makanan', stock: 10 },
  { id: 2, name: 'Sate Ayam Madura', price: 30000, desc: '10 tusuk sate ayam full daging dengan bumbu kacang kental.', img: ChefHat, tag: 'Rekomendasi', category: 'makanan', stock: 5 },
  { id: 3, name: 'Soto Ayam Lamongan', price: 22000, desc: 'Soto ayam kuah kuning koya gurih melimpah.', img: UtensilsCrossed, tag: 'Favorit', category: 'makanan', stock: 0 }, // Contoh Habis
  { id: 4, name: 'Es Teh Manis Jumbo', price: 5000, desc: 'Es teh manis segar menggunakan gula asli premium.', img: UtensilsCrossed, tag: 'Segar', category: 'minuman', stock: 20 },
  { id: 5, name: 'Es Jeruk Peras', price: 8000, desc: 'Jeruk peras murni segar kaya vitamin C.', img: ChefHat, tag: 'Banyak Dicari', category: 'minuman', stock: 0 }, // Contoh Habis
  { id: 6, name: 'Ayam Penyet Sambal Ijo', price: 28000, desc: 'Ayam goreng empuk dengan sambal ijo pedas nampol.', img: UtensilsCrossed, tag: 'Pedas', category: 'makanan', stock: 8 }
];

const DELIVERY_HOURS = [
  { label: '09:00 - 10:00 (Pagi)', value: '09:00', isPeak: false },
  { label: '10:30 - 11:30 (Siang Menjelang Maksi)', value: '10:30', isPeak: false },
  { label: '12:00 - 13:00 (Jam Padat Istirahat)', value: '12:00', isPeak: true },
  { label: '13:00 - 13:40 (Jam Padat Sibuk)', value: '13:00', isPeak: true },
  { label: '14:30 - 15:30 (Sore Nyantai)', value: '14:30', isPeak: false },
];

const LineArtIllustration = ({ icon: Icon, color1 = "#FF7F50", color2 = "#FFD700", size = 64 }) => (
  <div className="relative flex items-center justify-center" style={{ width: size * 1.5, height: size * 1.5 }}>
    <div className="absolute rounded-full opacity-40 blur-xl" style={{ backgroundColor: color1, width: size * 0.8, height: size * 0.8, top: '10%', left: '10%' }} />
    <div className="absolute rounded-full opacity-30 blur-xl" style={{ backgroundColor: color2, width: size * 0.6, height: size * 0.6, bottom: '15%', right: '15%' }} />
    <Icon size={size} strokeWidth={1.5} className="relative z-10 text-neutral-900" />
  </div>
);

const Navbar = ({ cartCount, user }) => (
  <nav className="flex justify-between items-center bg-white border-b border-slate-100 px-8 py-4 shadow-sm sticky top-0 z-50">
    <Link to="/" className="text-xl font-black text-[#FF6F61] tracking-tighter italic">DAHARO</Link>
    <div className="flex gap-6 text-xs font-bold uppercase tracking-wider">
      <Link to="/" className="text-slate-600 hover:text-[#FF6F61] transition-colors">Beranda</Link>
      <Link to="/menu" className="text-slate-600 hover:text-[#FF6F61] transition-colors">Daftar Menu</Link>
      <Link to="/checkout" className="text-slate-600 hover:text-[#FF6F61] transition-colors flex items-center gap-1">
        Keranjang {cartCount > 0 && <span className="bg-[#FF6F61] text-white text-[10px] px-1.5 py-0.5 rounded-full">{cartCount}</span>}
      </Link>
      <Link to="/dashboard" className="text-slate-600 hover:text-[#FF6F61] transition-colors">Dashboard</Link>
      {user && user.role === 'admin' && (
        <Link to="/admin" className="text-amber-600 hover:text-amber-700 transition-colors font-black">Admin CMS</Link>
      )}
    </div>
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-2 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50">
          <div className={`w-2.5 h-2.5 rounded-full ${user.role === 'admin' ? 'bg-red-500' : user.isUstadz ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          <span className="max-w-[120px] truncate capitalize">{user.name} ({user.role})</span>
        </div>
      ) : (
        <Link to="/auth" className="bg-slate-900 text-white text-xs px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors">Login / Pilih Role</Link>
      )}
    </div>
  </nav>
);

// ==========================================
// 1. LANDING PAGE & HALAMAN UTAMA
// ==========================================
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[400px] mb-20">
        <div className="space-y-6">
          <span className="text-xs font-bold tracking-widest text-[#FF6F61] uppercase bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">Platform Kuliner Modern</span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">Rasa Tradisional, <br />Pelayanan <span className="text-[#FF6F61]">Digital.</span></h1>
          <p className="text-slate-500 text-base max-w-md leading-relaxed">Pesan makanan & minuman favoritmu. Pilih diantar langsung ke rumah (Delivery Order) atau booking nomor antrean restoran secara praktis online.</p>
          <div className="flex gap-4 pt-4">
            <button onClick={() => navigate('/menu')} className="bg-[#FF6F61] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-coral-200 hover:bg-coral-600 transition-all flex items-center gap-2">Jelajahi Menu <ArrowRight size={18} /></button>
          </div>
        </div>
        <div className="flex justify-center relative">
          <LineArtIllustration icon={Store} size={150} color1="#FF6F61" color2="#FFD700" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. HALAMAN KATALOG PRODUK (DENGAN CEK STOK)
// ==========================================
const MenuPage = ({ menuList, addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const filteredMenu = selectedCategory === 'semua' ? menuList : menuList.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Menu Pilihan Toko</h1>
          <p className="text-sm text-slate-500">Pesan hidangan khas nusantara terbaik buatan koki andalan kami.</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0 bg-slate-100 p-1 rounded-xl border border-slate-200/40">
          {['semua', 'makanan', 'minuman'].map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-xs px-4 py-2 rounded-lg font-bold capitalize transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item) => {
          const isOutofStock = item.stock <= 0;
          return (
            <div key={item.id} className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group ${isOutofStock ? 'border-red-100 bg-red-50/5' : 'border-slate-200/80'}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${isOutofStock ? 'bg-red-50' : 'bg-slate-50 group-hover:bg-orange-50'}`}>
                    <LineArtIllustration icon={item.img || UtensilsCrossed} size={28} color1={isOutofStock ? "#EF4444" : "#FF6F61"} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full uppercase">{item.tag}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isOutofStock ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
                      {isOutofStock ? 'Habis' : `Stok: ${item.stock}`}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{item.name}</h3>
                <p className="text-xs text-slate-400 font-normal line-clamp-2 mb-4">{item.desc}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-[#FF6F61] font-black text-base">Rp {item.price.toLocaleString('id-ID')}</span>
                <button 
                  onClick={() => !isOutofStock && addToCart(item)} 
                  disabled={isOutofStock}
                  className={`p-2 rounded-xl transition-all text-xs font-bold px-4 flex items-center gap-1 ${isOutofStock ? 'bg-red-100 text-red-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-[#FF6F61] text-white'}`}
                >
                  {isOutofStock ? 'Habis' : <><Plus size={14} /> Beli</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 3. AUTH (LOGIN REGISTER MULTI-ROLE)
// ==========================================
const AuthPage = ({ loginUser }) => {
  const [inputName, setInputName] = useState('');
  const [role, setRole] = useState('member');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    let isUstadz = false;
    let finalDiscount = 0.00;

    if (role === 'member') {
      isUstadz = USTADZ_MEMBERS.some(u => u.toLowerCase() === inputName.trim().toLowerCase());
      finalDiscount = isUstadz ? 0.20 : 0.00;
    }

    loginUser({
      name: inputName,
      role: role,
      isUstadz: isUstadz,
      discount: finalDiscount
    });

    if (isUstadz) {
      alert(`Verifikasi Berhasil! Selamat Datang ${inputName}. Potongan Khusus Membership 20% Aktif.`);
    }
    navigate(role === 'admin' ? '/admin' : '/menu');
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <LineArtIllustration icon={User} size={44} color1="#FF6F61" />
        <h3 className="text-xl font-bold mt-3">Gerbang Autentikasi</h3>
        <p className="text-xs text-slate-400 mt-1">Gunakan nama Ustadz terdaftar untuk klaim benefit member</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
        <div>
          <label className="text-slate-500 uppercase block mb-1">Nama Lengkap Pengguna</label>
          <input type="text" className="w-full bg-slate-50 border p-3.5 rounded-xl text-sm outline-none focus:border-[#FF6F61]" placeholder="Contoh: Ustadz Adi Hidayat" value={inputName} onChange={(e) => setInputName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="text-slate-500 uppercase block">Pilih Tipe Peran</label>
          <div className="flex flex-col gap-2">
            <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${role === 'member' ? 'border-green-500 bg-green-50/10' : 'border-slate-100 bg-slate-50'}`}>
              <input type="radio" name="role" value="member" checked={role === 'member'} onChange={() => setRole('member')} />
              <div>
                <p className="text-slate-900 font-bold">1. Akun Jalur Membership</p>
                <p className="text-[10px] text-slate-400 font-normal">Klaim potongan 20% jika nama terdaftar sebagai 5 Ustadz.</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${role === 'non-member' ? 'border-slate-400 bg-slate-100/50' : 'border-slate-100 bg-slate-50'}`}>
              <input type="radio" name="role" value="non-member" checked={role === 'non-member'} onChange={() => setRole('non-member')} />
              <div>
                <p className="text-slate-900 font-bold">2. Akun Non-Member</p>
                <p className="text-[10px] text-slate-400 font-normal">Belanja umum tanpa benefit potongan harga khusus.</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${role === 'admin' ? 'border-amber-500 bg-amber-50/10' : 'border-slate-100 bg-slate-50'}`}>
              <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} />
              <div>
                <p className="text-slate-900 font-bold">3. Akun Admin Toko</p>
                <p className="text-[10px] text-slate-400 font-normal">Akses panel CMS produk, manajemen harga, dan finansial.</p>
              </div>
            </label>
          </div>
        </div>
        <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider">Masuk Aplikasi</button>
      </form>
    </div>
  );
};

// ==========================================
// 4. HALAMAN TRANSAKSI (SISTEM STRUK PRICING)
// ==========================================
const CheckoutPage = ({ cart, updateQty, removeFromCart, user, triggerActiveOrder, clearCart, validateCartStock, reduceStockOnCheckout }) => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('Online');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = user ? (subtotal * user.discount) : 0;
  
  const currentSlot = DELIVERY_HOURS[selectedSlotIndex];
  const peakFee = (subtotal > 0 && orderType === 'Online' && currentSlot.isPeak) ? 2000 : 0;
  const total = subtotal - discountAmount + peakFee;

  const handlePayment = () => {
    if (!user) return navigate('/auth');
    if (!validateCartStock(cart)) return;
    reduceStockOnCheckout(cart);
    triggerActiveOrder({ type: orderType, selectedTime: currentSlot.label, amount: total });
    clearCart();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-black text-slate-900">Keranjang Belanja Pembeli</h2>
        {cart.length === 0 ? (
          <div className="bg-white border p-8 text-center text-xs text-slate-400 rounded-2xl">Keranjang kosong. Silakan belanja terlebih dahulu.</div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white border p-4 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                  <p className="text-xs text-[#FF6F61] font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="border p-1 rounded bg-slate-50 text-xs px-2.5 font-bold">-</button>
                  <span className="text-xs font-black px-1">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="border p-1 rounded bg-slate-50 text-xs px-2.5 font-bold">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 font-bold text-xs ml-4">Hapus</button>
                </div>
              </div>
            ))}
            
            <div className="bg-white border p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-wide">Pilih Opsi Metode Layanan</h3>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setOrderType('Online')} className={`border-2 p-4 rounded-xl text-xs font-bold transition-all ${orderType === 'Online' ? 'border-[#FF6F61] bg-orange-50/20 text-slate-900' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>Pesan Antar (Delivery Order)</button>
                <button type="button" onClick={() => setOrderType('Offline')} className={`border-2 p-4 rounded-xl text-xs font-bold transition-all ${orderType === 'Offline' ? 'border-[#FF6F61] bg-orange-50/20 text-slate-900' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>Ambil Resto / Booking Antrean</button>
              </div>
              <div className="pt-2">
                <label className="text-slate-500 uppercase block mb-1 text-[10px]">Pilih Jadwal Waktu Operasional</label>
                <select className="w-full bg-slate-50 border p-3 rounded-xl font-bold outline-none text-slate-700 text-xs" value={selectedSlotIndex} onChange={e => setSelectedSlotIndex(parseInt(e.target.value))}>
                  {DELIVERY_HOURS.map((slot, i) => (
                    <option key={i} value={i}>{slot.label} {slot.isPeak ? '(Jam Sibuk Padat + Rp 2.000 khusus Delivery)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-black text-sm pb-2 border-b">Ringkasan Billing Transaksi</h3>
          <div className="text-xs space-y-3 text-slate-500">
            <div className="flex justify-between"><span>Subtotal Belanja</span><span className="font-bold text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-emerald-600 font-medium"><span>Diskon Berkah Member (20%)</span><span>- Rp {discountAmount.toLocaleString('id-ID')}</span></div>}
            {peakFee > 0 && <div className="flex justify-between text-red-500 font-medium"><span>Biaya Jam Padat Antrean</span><span>+ Rp {peakFee.toLocaleString('id-ID')}</span></div>}
            <div className="border-t border-dashed pt-3 flex justify-between font-black text-sm text-slate-900"><span>Total Pembayaran</span><span className="text-[#FF6F61] text-base">Rp {total.toLocaleString('id-ID')}</span></div>
          </div>
          <button disabled={cart.length === 0} onClick={handlePayment} className="w-full bg-slate-900 hover:bg-[#FF6F61] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:bg-slate-200 disabled:text-slate-400">Konfirmasi Bayar Sekarang</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. HALAMAN USER DASHBOARD & LIVE TRACKING
// ==========================================
const DashboardPage = ({ user, logoutUser, activeOrder }) => {
  const [orderStep, setOrderStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeOrder) {
      setOrderStep(1); 
      const interval = setInterval(() => {
        setOrderStep((prev) => (prev < 4 ? prev + 1 : 4));
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [activeOrder]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border rounded-2xl shadow-sm">
        <p className="text-slate-400 text-xs font-medium mb-4">Sesi login Anda belum terdeteksi sistem.</p>
        <button onClick={() => navigate('/auth')} className="bg-[#FF6F61] text-white px-5 py-2.5 rounded-xl text-xs font-bold">Pilih Akun Demo</button>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Pesanan Diterima', icon: ShoppingBag },
    { id: 2, name: 'Proses Dapur Olah', icon: CookingPot },
    { id: 3, name: activeOrder?.type === 'Online' ? 'Kurir Pengantaran' : 'Antrean Siap Ambil', icon: Bike },
    { id: 4, name: 'Selesai Sukses', icon: CheckCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white border rounded-2xl p-6 text-center flex flex-col justify-between items-center h-fit shadow-sm">
        <div className="w-full">
          <div className="w-14 h-14 rounded-full bg-[#FF6F61] text-white flex items-center justify-center font-black text-lg mb-3 uppercase mx-auto">{user.name.charAt(0)}</div>
          <p className="font-bold text-slate-900 capitalize">{user.name}</p>
          <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold uppercase mt-2 inline-block border">Akses: {user.role}</span>
          {user.discount > 0 && <div className="text-emerald-600 font-bold text-[10px] mt-2">Diskon Istimewa 20% Aktif</div>}
        </div>
        <button onClick={logoutUser} className="w-full mt-6 border border-red-100 text-red-500 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">Keluar Sesi</button>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Realtime Tracking System</h3>
          {activeOrder ? (
            <>
              <div className="grid grid-cols-4 gap-2 relative">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center text-center space-y-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${orderStep >= step.id ? 'bg-green-500 text-white border-green-500 shadow-sm' : 'bg-slate-50 text-slate-300 border-slate-200/60'}`}><Icon size={16} /></div>
                      <span className="text-[9px] font-bold text-slate-700">{step.name}</span>
                    </div>
                  );
                })}
              </div>
              <div className="h-28 bg-orange-50/20 rounded-xl flex items-center px-4 relative border border-dashed">
                {activeOrder.type === 'Online' && orderStep >= 3 ? (
                  <motion.div initial={{ x: "0%" }} animate={{ x: orderStep === 4 ? "85%" : "45%" }} transition={{ duration: 4 }} className="text-[#FF6F61]"><Bike size={32} /></motion.div>
                ) : activeOrder.type === 'Offline' && orderStep === 3 ? (
                  <div className="mx-auto text-xs bg-white border border-amber-200 font-bold p-3 text-amber-600 rounded-xl animate-bounce">🎟️ Tiket Booking Antrean Valid: Silakan Datang Ke Toko</div>
                ) : orderStep === 4 ? (
                  <p className="mx-auto text-xs text-emerald-600 font-bold">🎉 Transaksi Selesai. Terima kasih atas kepercayaan Anda!</p>
                ) : (
                  <p className="mx-auto text-xs text-slate-400 font-bold">Pesanan sedang disiapkan untuk slot jam {activeOrder.selectedTime}...</p>
                )}
              </div>
            </>
          ) : <p className="text-xs text-slate-400">Tidak ada pengiriman atau pesanan aktif yang sedang diproses.</p>}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. PANEL ADMIN CMS (BISA HAPUS & LIHAT STOK)
// ==========================================
const AdminPage = ({ user, menuList, addNewMenu, deleteMenu, orderHistory }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10'); // Default stok input
  const [category, setCategory] = useState('makanan');
  const [desc, setDesc] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-24 bg-white border p-8 rounded-2xl text-center space-y-4 shadow-md">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto"><ShieldAlert size={24} /></div>
        <h3 className="font-bold text-slate-900 text-base">Akses CMS Ditolak</h3>
        <p className="text-xs text-slate-400">Halaman CMS ini memerlukan kredensial dan otorisasi dari akun bertipe Administrator.</p>
        <Link to="/auth" className="inline-block bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">Login Admin</Link>
      </div>
    );
  }

  const totalEarnings = orderHistory.reduce((sum, order) => sum + order.amount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    addNewMenu({
      id: Date.now(), // Generate ID unik berbasis timestamp
      name,
      price: parseInt(price),
      stock: parseInt(stock) || 0,
      desc: desc || 'Deskripsi produk kuliner koki istimewa.',
      tag: 'Menu Baru',
      category: category
    });

    setName(''); setPrice(''); setStock('10'); setDesc('');
    alert('Sukses! Data produk baru masuk database sistem via CMS.');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-4">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3"><LayoutDashboard size={20} className="text-[#FF6F61]" /><h3 className="font-bold text-sm tracking-wide">CMS Analytics Dashboard</h3></div>
          <div className="border-t border-slate-800 pt-4 space-y-3 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Omset Pendapatan</p>
              <p className="text-xl font-black text-green-400">Rp {totalEarnings.toLocaleString('id-ID')}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Jumlah Transaksi Masuk</p>
              <p className="text-xl font-black text-amber-400">{orderHistory.length} Pesanan</p>
            </div>
          </div>
        </div>

        {/* REVISI BARU: DAFTAR MANAJEMEN ETALASE UNTUK HAPUS MENU */}
        <div className="bg-white border p-4 rounded-2xl shadow-sm space-y-3">
          <h4 className="font-black text-xs text-slate-800 uppercase tracking-wide border-b pb-2">Daftar Manajemen Etalase</h4>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {menuList.map((item) => (
              <div key={item.id} className="flex justify-between items-center border p-2 rounded-xl text-xs bg-slate-50">
                <div className="truncate pr-2">
                  <p className="font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{item.category} • Stok: {item.stock}</p>
                </div>
                <button 
                  onClick={() => {
                    if(confirm(`Hapus "${item.name}" dari daftar menu?`)) deleteMenu(item.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Hapus Menu"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2"><PlusCircle size={18} className="text-[#FF6F61]" /> Kontrol Input Produk CMS</h3>
          <span className="text-[10px] bg-red-100 text-red-600 font-black px-2.5 py-0.5 rounded-full">Admin Mode</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="text-slate-500 uppercase block mb-1">Nama Makanan / Minuman</label>
              <input type="text" className="w-full bg-slate-50 border p-3.5 rounded-xl outline-none" placeholder="Contoh: Es Campur Garut" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-slate-500 uppercase block mb-1">Stok Awal</label>
              <input type="number" className="w-full bg-slate-50 border p-3.5 rounded-xl outline-none" placeholder="10" value={stock} onChange={e => setStock(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="text-slate-500 uppercase block mb-1">Harga Jual (Rp)</label>
            <input type="number" className="w-full bg-slate-50 border p-3.5 rounded-xl outline-none" placeholder="Contoh: 15000" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div>
            <label className="text-slate-500 uppercase block mb-1">Kategori Hidangan</label>
            <select className="w-full bg-slate-50 border p-3.5 rounded-xl outline-none font-bold text-slate-700" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>
          <div>
            <label className="text-slate-500 uppercase block mb-1">Deskripsi Kuliner</label>
            <textarea className="w-full bg-slate-50 border p-3.5 rounded-xl h-20 outline-none resize-none" placeholder="Tulis rincian komposisi produk..." value={desc} onChange={e => setDesc(e.target.value)}></textarea>
          </div>
          <button type="submit" className="w-full bg-[#FF6F61] text-white py-3.5 rounded-xl font-bold uppercase shadow-md">Daftarkan ke Etalase Toko</button>
        </form>
      </div>
    </div>
  );
};

// --- APP ENTRY POINT ---
const App = () => {
  const [menuList, setMenuList] = useState(INITIAL_MENU);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  const getMenuStock = (productId) => {
    const item = menuList.find((m) => m.id === productId);
    return item?.stock ?? 0;
  };

  const validateCartStock = (cartItems) => {
    for (const item of cartItems) {
      const available = getMenuStock(item.id);
      if (available <= 0) {
        alert(`"${item.name}" sudah habis. Hapus dari keranjang atau pilih menu lain.`);
        return false;
      }
      if (item.qty > available) {
        alert(`Stok "${item.name}" tidak mencukupi. Tersedia: ${available}, di keranjang: ${item.qty}.`);
        return false;
      }
    }
    return true;
  };

  const reduceStockOnCheckout = (cartItems) => {
    setMenuList((prev) =>
      prev.map((menuItem) => {
        const inCart = cartItems.find((c) => c.id === menuItem.id);
        if (!inCart) return menuItem;
        return { ...menuItem, stock: Math.max(0, menuItem.stock - inCart.qty) };
      })
    );
  };

  const addToCart = (product) => {
    const available = getMenuStock(product.id);
    if (available <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const nextQty = (existing?.qty ?? 0) + 1;
      if (nextQty > available) {
        alert(`Stok maksimal ${available} untuk ${product.name}`);
        return prev;
      }
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) return removeFromCart(id);
    const available = getMenuStock(id);
    if (newQty > available) {
      const item = cart.find((c) => c.id === id);
      alert(`Stok maksimal ${available} untuk ${item?.name ?? 'produk ini'}`);
      return;
    }
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  // Fungsi Hapus Menu dari Etalase Resto (Akses Admin)
  const deleteMenu = (id) => {
    setMenuList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#1A1A1A]">
        <Navbar cartCount={cart.reduce((sum, item) => sum + item.qty, 0)} user={user} />
        <main className="py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage menuList={menuList} addToCart={addToCart} />} />
            <Route path="/auth" element={<AuthPage loginUser={setUser} />} />
            <Route path="/dashboard" element={<DashboardPage user={user} logoutUser={() => { setUser(null); setActiveOrder(null); }} activeOrder={activeOrder} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} user={user} validateCartStock={validateCartStock} reduceStockOnCheckout={reduceStockOnCheckout} triggerActiveOrder={(orderDetail) => { setActiveOrder(orderDetail); setOrderHistory(prev => [...prev, orderDetail]); }} clearCart={() => setCart([])} />} />
            <Route path="/admin" element={<AdminPage user={user} menuList={menuList} addNewMenu={(newProduct) => setMenuList([...menuList, newProduct])} deleteMenu={deleteMenu} orderHistory={orderHistory} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;