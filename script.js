const state = {
  page: "dashboard",
  products: [
    {id:1,name:"Fotocopy Hitam Putih",price:150,unit:"lembar",icon:"🖨️",category:"Jasa"},
    {id:2,name:"Fotocopy Warna",price:500,unit:"lembar",icon:"🌈",category:"Jasa"},
    {id:3,name:"Print Hitam Putih",price:300,unit:"lembar",icon:"📄",category:"Jasa"},
    {id:4,name:"Print Warna",price:1000,unit:"lembar",icon:"🎨",category:"Jasa"},
    {id:5,name:"Scan Dokumen",price:1000,unit:"file",icon:"📑",category:"Jasa"},
    {id:6,name:"Jilid Spiral",price:5000,unit:"pcs",icon:"📚",category:"Barang"},
    {id:7,name:"Laminating",price:4000,unit:"lembar",icon:"✨",category:"Jasa"},
    {id:8,name:"Kertas A4",price:500,unit:"lembar",icon:"📃",category:"Barang"}
  ],
  cart: [],
  customers: [
    ["C001","Umum","-","Transaksi umum"],
    ["C002","Rina","0812-xxxx-1122","Pelanggan tetap"],
    ["C003","Budi","0813-xxxx-7788","Pelanggan tetap"]
  ],
  transactions: [
    ["INV-260901-001","01 Sep 2026, 10:30","Rina","Rp 75.000","Lunas"],
    ["INV-260901-002","01 Sep 2026, 10:15","Umum","Rp 25.000","Lunas"],
    ["INV-260901-003","01 Sep 2026, 09:45","Budi","Rp 50.000","Lunas"],
    ["INV-260831-021","31 Agu 2026, 17:20","Umum","Rp 120.000","Lunas"]
  ]
};

const content = document.getElementById("content");
const title = document.getElementById("pageTitle");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

const rupiah = n => "Rp " + n.toLocaleString("id-ID");
function showToast(msg){
  toast.textContent=msg; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2200);
}
function openModal(html){modalContent.innerHTML=html;modal.classList.remove("hidden")}
function closeModal(){modal.classList.add("hidden")}
document.getElementById("closeModal").onclick=closeModal;
modal.onclick=e=>{if(e.target===modal)closeModal()};

function dashboard(){
  return `
    <div class="hero">
      <div><p>Selamat datang kembali 👋</p><h3>Kelola hafinzahfotocopy lebih mudah.</h3><p>Catat transaksi, pantau penjualan, dan kelola produk dalam satu aplikasi.</p></div>
      <div class="hero-art">🖨️</div>
    </div>
    <div class="stats">
      ${[
        ["💰","Penjualan Hari Ini","Rp 850.000","+12,5%"],
        ["🧾","Transaksi","24","+8,2%"],
        ["📈","Laba Bersih","Rp 320.000","+15,4%"],
        ["📦","Produk Aktif","8","Stok aman"]
      ].map(x=>`<div class="card stat"><div><small>${x[1]}</small><h3>${x[2]}</h3><span class="trend">${x[3]}</span></div><div class="icon">${x[0]}</div></div>`).join("")}
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="section-head"><h3>Grafik Penjualan</h3><span class="trend">7 hari terakhir</span></div>
        <div class="chart">${[42,58,51,72,62,83,94].map(v=>`<div class="bar" style="height:${v}%"></div>`).join("")}</div>
        <div class="bar-labels">${["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map(x=>`<span>${x}</span>`).join("")}</div>
      </div>
      <div class="card">
        <div class="section-head"><h3>Akses Cepat</h3></div>
        <div class="product-grid" style="grid-template-columns:1fr 1fr">
          ${[["🛒","Kasir","kasir"],["📦","Produk","produk"],["📊","Laporan","laporan"],["💳","Keuangan","keuangan"]].map(x=>`<button class="card" style="text-align:left;border:1px solid var(--line)" onclick="navigate('${x[2]}')"><div class="product-icon">${x[0]}</div><b style="display:block;margin-top:9px">${x[1]}</b></button>`).join("")}
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:18px">
      <div class="section-head"><h3>Transaksi Terbaru</h3><button class="btn secondary" onclick="navigate('laporan')">Lihat Semua</button></div>
      ${transactionTable()}
    </div>`;
}

function transactionTable(){
  return `<div class="table-wrap"><table class="table"><thead><tr><th>No. Invoice</th><th>Waktu</th><th>Pelanggan</th><th>Total</th><th>Status</th></tr></thead><tbody>${state.transactions.map(t=>`<tr><td><b>${t[0]}</b></td><td>${t[1]}</td><td>${t[2]}</td><td><b>${t[3]}</b></td><td><span class="badge">${t[4]}</span></td></tr>`).join("")}</tbody></table></div>`;
}

function kasir(){
  return `<div class="kasir-layout">
    <div>
      <div class="category-row"><button class="category active">Semua</button><button class="category">Jasa</button><button class="category">Barang</button></div>
      <div class="product-grid">${state.products.map(p=>`<div class="card product-card"><div class="product-icon">${p.icon}</div><h4>${p.name}</h4><p>${rupiah(p.price)} / ${p.unit}</p><div style="display:flex;justify-content:space-between;align-items:center;margin-top:13px"><span class="price">${rupiah(p.price)}</span><button class="btn" onclick="addToCart(${p.id})">+ Tambah</button></div></div>`).join("")}</div>
    </div>
    <div class="card cart"><div class="section-head"><h3>Keranjang</h3><span>${state.cart.reduce((a,x)=>a+x.qty,0)} item</span></div>
      ${state.cart.length ? state.cart.map(x=>`<div class="cart-row"><div><b>${x.name}</b><small style="display:block;color:#999">${rupiah(x.price)} × ${x.qty}</small></div><div class="qty"><button onclick="changeQty(${x.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${x.id},1)">+</button></div></div>`).join("") : `<div class="empty">Keranjang masih kosong.<br>Pilih produk untuk memulai transaksi.</div>`}
      <div class="total"><span>Total</span><span>${rupiah(state.cart.reduce((a,x)=>a+x.price*x.qty,0))}</span></div>
      <button class="btn" style="width:100%" onclick="checkout()" ${state.cart.length?"":"disabled"}>Bayar Sekarang</button>
    </div>
  </div>`;
}
function addToCart(id){
  const p=state.products.find(x=>x.id===id), found=state.cart.find(x=>x.id===id);
  found?found.qty++:state.cart.push({...p,qty:1});
  render();showToast(`${p.name} ditambahkan`);
}
function changeQty(id,d){
  const x=state.cart.find(x=>x.id===id); if(!x)return;
  x.qty+=d;if(x.qty<=0)state.cart=state.cart.filter(a=>a.id!==id);render();
}
function checkout(){
  const total=state.cart.reduce((a,x)=>a+x.price*x.qty,0);
  if(!total)return;
  openModal(`<h3>Pembayaran</h3><p>Total yang harus dibayar:</p><h2 style="color:var(--primary-dark)">${rupiah(total)}</h2><div class="form-group"><label>Nominal Bayar</label><input class="form-input" id="payInput" type="number" value="${total}" style="width:100%"></div><button class="btn" style="width:100%;margin-top:15px" onclick="finishPayment()">Konfirmasi Pembayaran</button>`);
}
function finishPayment(){
  const pay=Number(document.getElementById("payInput").value), total=state.cart.reduce((a,x)=>a+x.price*x.qty,0);
  if(pay<total){showToast("Nominal pembayaran kurang");return}
  const inv="INV-"+Date.now().toString().slice(-8);
  state.transactions.unshift([inv,"01 Sep 2026, "+new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}),"Umum",rupiah(total),"Lunas"]);
  state.cart=[];closeModal();render();showToast("Transaksi berhasil disimpan");
}

function produk(){
  return `<div class="section-head page-title"><div><h3>Produk & Jasa</h3><small style="color:#999">Kelola daftar layanan dan barang hafinzahfotocopy</small></div><button class="btn" onclick="addProduct()">+ Tambah Produk</button></div>
  <div class="toolbar"><input id="productSearch" placeholder="Cari produk..." oninput="filterProducts()"></div>
  <div id="productList" class="product-grid">${productCards(state.products)}</div>`;
}
function productCards(arr){return arr.map(p=>`<div class="card product-card"><div style="display:flex;justify-content:space-between"><div class="product-icon">${p.icon}</div><span class="badge">${p.category}</span></div><h4>${p.name}</h4><p>${rupiah(p.price)} / ${p.unit}</p><div style="display:flex;gap:8px;margin-top:13px"><button class="btn secondary" onclick="editProduct(${p.id})">Edit</button><button class="btn" onclick="addToCart(${p.id});navigate('kasir')">Jual</button></div></div>`).join("")}
function filterProducts(){const q=document.getElementById("productSearch").value.toLowerCase();document.getElementById("productList").innerHTML=productCards(state.products.filter(p=>p.name.toLowerCase().includes(q)))}
function addProduct(){
  openModal(`<h3>Tambah Produk</h3><div class="form-grid"><div class="form-group"><label>Nama Produk</label><input id="pn" class="form-input"></div><div class="form-group"><label>Harga</label><input id="pp" type="number" class="form-input"></div><div class="form-group"><label>Satuan</label><input id="pu" class="form-input" value="pcs"></div><div class="form-group"><label>Kategori</label><select id="pc" class="form-input"><option>Jasa</option><option>Barang</option></select></div></div><button class="btn" style="margin-top:15px" onclick="saveProduct()">Simpan</button>`);
}
function saveProduct(){const n=document.getElementById("pn").value,p=Number(document.getElementById("pp").value),u=document.getElementById("pu").value,c=document.getElementById("pc").value;if(!n||!p){showToast("Lengkapi data produk");return}state.products.push({id:Date.now(),name:n,price:p,unit:u,icon:"📦",category:c});closeModal();render();showToast("Produk berhasil ditambahkan")}
function editProduct(id){const p=state.products.find(x=>x.id===id);openModal(`<h3>Edit Produk</h3><div class="form-group"><label>Nama</label><input id="en" class="form-input" style="width:100%" value="${p.name}"></div><div class="form-group" style="margin-top:10px"><label>Harga</label><input id="ep" type="number" class="form-input" style="width:100%" value="${p.price}"></div><button class="btn" style="margin-top:15px" onclick="updateProduct(${id})">Simpan Perubahan</button>`)}
function updateProduct(id){const p=state.products.find(x=>x.id===id);p.name=document.getElementById("en").value;p.price=Number(document.getElementById("ep").value);closeModal();render();showToast("Produk diperbarui")}

function pelanggan(){
  return `<div class="section-head page-title"><div><h3>Data Pelanggan</h3><small style="color:#999">Simpan data pelanggan agar transaksi lebih rapi</small></div><button class="btn" onclick="addCustomer()">+ Tambah Pelanggan</button></div>
  <div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Nama</th><th>No. Telepon</th><th>Keterangan</th></tr></thead><tbody>${state.customers.map(x=>`<tr><td>${x[0]}</td><td><b>${x[1]}</b></td><td>${x[2]}</td><td>${x[3]}</td></tr>`).join("")}</tbody></table></div></div>`;
}
function addCustomer(){openModal(`<h3>Tambah Pelanggan</h3><div class="form-group"><label>Nama</label><input id="cn" class="form-input" style="width:100%"></div><div class="form-group" style="margin-top:10px"><label>No. Telepon</label><input id="ct" class="form-input" style="width:100%"></div><button class="btn" style="margin-top:15px" onclick="saveCustomer()">Simpan</button>`)}
function saveCustomer(){const n=document.getElementById("cn").value,t=document.getElementById("ct").value;if(!n){showToast("Nama belum diisi");return}state.customers.push(["C"+String(state.customers.length+1).padStart(3,"0"),n,t||"-","Pelanggan"]);closeModal();render();showToast("Pelanggan ditambahkan")}

function laporan(){return `<div class="stats"><div class="card stat"><div><small>Total Penjualan</small><h3>Rp 8.450.000</h3><span class="trend">Bulan ini</span></div><div class="icon">💰</div></div><div class="card stat"><div><small>Total Transaksi</small><h3>247</h3><span class="trend">+18%</span></div><div class="icon">🧾</div></div><div class="card stat"><div><small>Rata-rata Transaksi</small><h3>Rp 34.200</h3></div><div class="icon">📊</div></div><div class="card stat"><div><small>Produk Terlaris</small><h3>Print Warna</h3></div><div class="icon">🏆</div></div></div><div class="card" style="margin-top:18px"><div class="section-head"><h3>Riwayat Penjualan</h3><button class="btn secondary" onclick="showToast('Laporan siap dicetak')">🖨️ Cetak</button></div>${transactionTable()}</div>`}
function keuangan(){return `<div class="stats"><div class="card stat"><div><small>Saldo Kas</small><h3>Rp 1.250.000</h3></div><div class="icon">💳</div></div><div class="card stat"><div><small>Pemasukan</small><h3>Rp 2.000.000</h3><span class="trend">Bulan ini</span></div><div class="icon">↗️</div></div><div class="card stat"><div><small>Pengeluaran</small><h3>Rp 750.000</h3></div><div class="icon">↘️</div></div></div><div class="card" style="margin-top:18px"><div class="section-head"><h3>Catatan Keuangan</h3><button class="btn" onclick="showToast('Fitur pencatatan dibuka')">+ Catat</button></div><div class="empty">Belum ada catatan pengeluaran baru.</div></div>`}
function pengaturan(){return `<div class="card"><h3>Pengaturan Toko</h3><p style="color:#888;font-size:12px">Atur informasi dasar aplikasi hafinzahfotocopy.</p><div class="form-grid"><div class="form-group"><label>Nama Usaha</label><input class="form-input" style="width:100%" value="hafinzahfotocopy"></div><div class="form-group"><label>Jenis Usaha</label><input class="form-input" style="width:100%" value="Fotocopy & Print Center"></div><div class="form-group"><label>Nomor Telepon</label><input class="form-input" style="width:100%" placeholder="08xxxxxxxxxx"></div><div class="form-group"><label>Alamat</label><input class="form-input" style="width:100%" placeholder="Alamat toko"></div></div><button class="btn" style="margin-top:16px" onclick="showToast('Pengaturan disimpan')">Simpan Pengaturan</button></div>`}

function render(){
  const pages={dashboard,kasir,produk,pelanggan,laporan,keuangan,pengaturan};
  const names={dashboard:"Beranda",kasir:"Kasir",produk:"Produk & Jasa",pelanggan:"Pelanggan",laporan:"Laporan Penjualan",keuangan:"Keuangan",pengaturan:"Pengaturan"};
  title.textContent=names[state.page];content.innerHTML=pages[state.page]();
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===state.page));
}
function navigate(page){state.page=page;render();document.querySelector(".sidebar").classList.remove("open");window.scrollTo(0,0)}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>navigate(b.dataset.page));
document.getElementById("menuBtn").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
document.getElementById("globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter" && e.target.value.trim()){showToast("Pencarian: "+e.target.value)}});

render();
