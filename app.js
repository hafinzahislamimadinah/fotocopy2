const KEY="hf_printpos_v2";
const defaultProducts=[
 {id:1,name:"Fotocopy BW",category:"Fotocopy",price:200,stock:999,min:0,unit:"lembar"},
 {id:2,name:"Fotocopy Color",category:"Fotocopy",price:1500,stock:999,min:0,unit:"lembar"},
 {id:3,name:"Print BW",category:"Print",price:500,stock:999, min:0,unit:"lembar"},
 {id:4,name:"Print Color",category:"Print",price:3000,stock:999,min:0,unit:"lembar"},
 {id:5,name:"Scan Dokumen",category:"Digital",price:2000,stock:999,min:0,unit:"file"},
 {id:6,name:"Laminating",category:"Finishing",price:5000,stock:25,min:5,unit:"pcs"},
 {id:7,name:"Jilid Spiral",category:"Finishing",price:7000,stock:20,min:5,unit:"pcs"},
 {id:8,name:"Kertas A4 80gsm",category:"Stok",price:65000,stock:12,min:5,unit:"rim"}
];
const defaultCustomers=[
 {id:1,name:"Siti Aulia",phone:"081234567890",note:"Mahasiswa",spent:185000},
 {id:2,name:"Rizky",phone:"082211223344",note:"Pelanggan rutin",spent:92000},
 {id:3,name:"Nabila",phone:"085712345678",note:"",spent:54000}
];
const defaultTransactions=[
 {id:"HF-000003",date:new Date(Date.now()-86400000).toISOString(),customer:"Siti Aulia",items:[{name:"Print Color",qty:3,price:3000},{name:"Jilid Spiral",qty:1,price:7000}],total:16000},
 {id:"HF-000002",date:new Date(Date.now()-172800000).toISOString(),customer:"Rizky",items:[{name:"Fotocopy BW",qty:35,price:200}],total:7000},
 {id:"HF-000001",date:new Date(Date.now()-259200000).toISOString(),customer:"Umum",items:[{name:"Laminating",qty:2,price:5000}],total:10000}
];
let db=loadDB(), cart=[];
function loadDB(){try{const x=JSON.parse(localStorage.getItem(KEY));return x||{products:structuredClone(defaultProducts),customers:structuredClone(defaultCustomers),transactions:structuredClone(defaultTransactions),settings:{shopName:"HafinzahFotocopy",whatsapp:"",address:"Melayani fotocopy, print, scan, jilid, dan kebutuhan cetak."}}}catch{return {products:structuredClone(defaultProducts),customers:structuredClone(defaultCustomers),transactions:structuredClone(defaultTransactions),settings:{shopName:"HafinzahFotocopy",whatsapp:"",address:""}}}}
function saveDB(){localStorage.setItem(KEY,JSON.stringify(db))}
const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n||0);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2200)}
function today(){return new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"})}
document.getElementById("currentDate").textContent=today();

const pageNames={dashboard:["Overview","Dashboard"],transaksi:["Point of Sale","Transaksi"],produk:["Master Data","Produk & Layanan"],pelanggan:["Master Data","Pelanggan"],stok:["Inventory","Stok Barang"],laporan:["Analytics","Laporan"],pengaturan:["System","Pengaturan"]};
function go(page){document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===page));document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.getElementById("page-"+page).classList.add("active");document.getElementById("breadcrumb").textContent=pageNames[page][0];document.getElementById("pageTitle").textContent=pageNames[page][1];if(innerWidth<761)document.getElementById("sidebar").classList.remove("open");renderAll();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>go(b.dataset.page));
document.querySelectorAll("[data-page-jump]").forEach(b=>b.onclick=()=>go(b.dataset.pageJump));
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("hf_dark",document.body.classList.contains("dark")?"1":"0")};
if(localStorage.getItem("hf_dark")==="1")document.body.classList.add("dark");

function renderDashboard(){
 const now=new Date(), start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 const todays=db.transactions.filter(t=>new Date(t.date)>=start);
 const sales=todays.reduce((a,t)=>a+t.total,0);
 document.getElementById("statSales").textContent=rupiah(sales);
 document.getElementById("statTransactions").textContent=todays.length;
 document.getElementById("statProducts").textContent=db.products.length;
 document.getElementById("statCustomers").textContent=db.customers.length;
 const days=Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()-(6-i));return d});
 const max=Math.max(1,...days.map(d=>db.transactions.filter(t=>{const x=new Date(t.date);return x.toDateString()===d.toDateString()}).reduce((a,t)=>a+t.total,0)));
 document.getElementById("salesChart").innerHTML=days.map(d=>{const val=db.transactions.filter(t=>new Date(t.date).toDateString()===d.toDateString()).reduce((a,t)=>a+t.total,0);return `<div class="bar-col"><div class="bar" style="height:${Math.max(5,val/max*92)}%"></div><span class="bar-label">${d.toLocaleDateString("id-ID",{weekday:"short"}).slice(0,3)}</span></div>`}).join("");
 const counts={};db.transactions.forEach(t=>t.items.forEach(i=>counts[i.name]=(counts[i.name]||0)+i.qty));const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
 document.getElementById("bestSellers").innerHTML=ranked.length?ranked.map((x,i)=>`<div class="rank-item"><span class="rank-num">${i+1}</span><div><strong>${esc(x[0])}</strong><small>${x[1]} item terjual</small></div><b>${rupiah((db.products.find(p=>p.name===x[0])||{}).price||0)}</b></div>`).join(""):`<div class="empty-state">Belum ada data penjualan.</div>`;
 document.getElementById("recentTable").innerHTML=db.transactions.slice(0,6).map(t=>`<tr><td><b>${t.id}</b></td><td>${esc(t.customer||"Umum")}</td><td>${esc(t.items.map(i=>i.name).join(", "))}</td><td><b>${rupiah(t.total)}</b></td><td><span class="status">Selesai</span></td></tr>`).join("")||`<tr><td colspan="5">Belum ada transaksi.</td></tr>`;
}
function renderProducts(){
 const cat=document.getElementById("categoryFilter"), current=cat.value;
 const cats=[...new Set(db.products.map(p=>p.category))];cat.innerHTML=`<option value="all">Semua kategori</option>`+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");if(cats.includes(current))cat.value=current;
 const q=(document.getElementById("productSearch").value||"").toLowerCase(), filter=cat.value;
 const list=db.products.filter(p=>(filter==="all"||p.category===filter)&&p.name.toLowerCase().includes(q));
 document.getElementById("productGrid").innerHTML=list.map(p=>`<button class="product-card" data-add="${p.id}"><div class="p-icon">${p.category==="Print"?"P":p.category==="Fotocopy"?"F":p.category==="Finishing"?"J":"S"}</div><strong>${esc(p.name)}</strong><small>${esc(p.category)} • ${esc(p.unit||"item")}</small><b>${rupiah(p.price)}</b></button>`).join("")||`<div class="empty-state">Produk tidak ditemukan.</div>`;
 document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addCart(+b.dataset.add));
 document.getElementById("productsTable").innerHTML=db.products.map(p=>`<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.category)}</td><td>${rupiah(p.price)}</td><td>${p.stock>=900?"∞":p.stock}</td><td><button class="text-btn" onclick="editProduct(${p.id})">Edit</button></td></tr>`).join("");
}
document.getElementById("productSearch").oninput=renderProducts;document.getElementById("categoryFilter").onchange=renderProducts;
function addCart(id){const p=db.products.find(x=>x.id===id);if(!p)return;const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id:p.id,name:p.name,price:p.price,qty:1});renderCart();toast(p.name+" ditambahkan")}
function renderCart(){
 document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0)+" item";
 document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><div><strong>${esc(x.name)}</strong><small>${rupiah(x.price)} / item</small><div class="qty"><button onclick="changeQty(${x.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${x.id},1)">＋</button></div></div><b>${rupiah(x.price*x.qty)}</b></div>`).join(""):`<div class="empty-state">Belum ada item.<br><small>Pilih layanan di sebelah kiri.</small></div>`;
 const sub=cart.reduce((a,x)=>a+x.price*x.qty,0);document.getElementById("cartSubtotal").textContent=rupiah(sub);document.getElementById("cartDiscount").textContent=rupiah(0);document.getElementById("cartTotal").textContent=rupiah(sub);
}
function changeQty(id,n){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=n;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);renderCart()}
document.getElementById("clearCart").onclick=()=>{cart=[];renderCart();toast("Keranjang dikosongkan")};
function renderCustomers(){
 const sel=document.getElementById("customerSelect");sel.innerHTML=`<option value="">Umum / tanpa nama</option>`+db.customers.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");
 document.getElementById("customersTable").innerHTML=db.customers.map(c=>`<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.phone||"-")}</td><td>${esc(c.note||"-")}</td><td>${rupiah(c.spent||0)}</td><td><button class="text-btn" onclick="editCustomer(${c.id})">Edit</button></td></tr>`).join("")||`<tr><td colspan="5">Belum ada pelanggan.</td></tr>`;
}
function renderStock(){
 const stock=db.products.filter(p=>p.stock<900);document.getElementById("stockTotal").textContent=stock.reduce((a,p)=>a+p.stock,0);document.getElementById("lowStock").textContent=stock.filter(p=>p.stock<=p.min).length;
 document.getElementById("stockTable").innerHTML=stock.map(p=>{const low=p.stock<=p.min;return `<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.category)}</td><td>${p.stock}</td><td>${p.min}</td><td><span class="status ${p.stock===0?"out":low?"low":""}">${p.stock===0?"Habis":low?"Menipis":"Aman"}</span></td></tr>`}).join("")||`<tr><td colspan="5">Tidak ada barang berstok.</td></tr>`;
}
function renderReports(){
 const total=db.transactions.reduce((a,t)=>a+t.total,0), count=db.transactions.length;
 document.getElementById("reportSales").textContent=rupiah(total);document.getElementById("reportCount").textContent=count;document.getElementById("reportAvg").textContent=rupiah(count?total/count:0);
 document.getElementById("reportTable").innerHTML=db.transactions.map(t=>`<tr><td><b>${t.id}</b></td><td>${new Date(t.date).toLocaleString("id-ID")}</td><td>${esc(t.customer||"Umum")}</td><td>${esc(t.items.map(i=>`${i.name} ×${i.qty}`).join(", "))}</td><td><b>${rupiah(t.total)}</b></td></tr>`).join("")||`<tr><td colspan="5">Belum ada transaksi.</td></tr>`;
}
function renderSettings(){document.getElementById("shopName").value=db.settings.shopName||"";document.getElementById("shopWhatsapp").value=db.settings.whatsapp||"";document.getElementById("shopAddress").value=db.settings.address||""}
function renderAll(){renderDashboard();renderProducts();renderCustomers();renderStock();renderReports();renderSettings();renderCart()}
document.getElementById("checkoutBtn").onclick=()=>{
 if(!cart.length){toast("Keranjang masih kosong");return}
 const total=cart.reduce((a,x)=>a+x.price*x.qty,0), c=db.customers.find(x=>x.id==document.getElementById("customerSelect").value);
 const id="HF-"+String((db.transactions.length?Math.max(...db.transactions.map(t=>parseInt(t.id.split("-")[1])||0)):0)+1).padStart(6,"0");
 db.transactions.unshift({id,date:new Date().toISOString(),customer:c?c.name:"Umum",items:cart.map(x=>({name:x.name,qty:x.qty,price:x.price})),total});
 if(c)c.spent=(c.spent||0)+total;
 cart=[];saveDB();renderAll();document.getElementById("orderId").textContent="#"+id;toast("Transaksi "+id+" berhasil disimpan");
};
function openModal(html,onSave){const back=document.getElementById("modalBackdrop"),m=document.getElementById("modal");m.innerHTML=html;back.classList.add("show");m.querySelector("[data-close]")?.addEventListener("click",()=>back.classList.remove("show"));m.querySelector("form")?.addEventListener("submit",e=>{e.preventDefault();onSave(new FormData(e.target));back.classList.remove("show")})}
document.getElementById("addProductBtn").onclick=()=>openModal(`<h3>Tambah Produk</h3><form><label>Nama<input name="name" required></label><label>Kategori<input name="category" required></label><label>Harga<input name="price" type="number" min="0" required></label><label>Stok<input name="stock" type="number" min="0" value="10"></label><label>Minimum stok<input name="min" type="number" min="0" value="3"></label><div class="modal-actions"><button type="button" class="btn soft" data-close>Batal</button><button class="btn primary">Simpan</button></div></form>`,f=>{db.products.push({id:Date.now(),name:f.get("name"),category:f.get("category"),price:+f.get("price"),stock:+f.get("stock"),min:+f.get("min"),unit:"item"});saveDB();renderAll();toast("Produk ditambahkan")});
window.editProduct=id=>{const p=db.products.find(x=>x.id===id);if(!p)return;openModal(`<h3>Edit Produk</h3><form><label>Nama<input name="name" value="${esc(p.name)}" required></label><label>Kategori<input name="category" value="${esc(p.category)}" required></label><label>Harga<input name="price" type="number" value="${p.price}" required></label><label>Stok<input name="stock" type="number" value="${p.stock}"></label><label>Minimum<input name="min" type="number" value="${p.min}"></label><div class="modal-actions"><button type="button" class="btn soft" data-close>Batal</button><button class="btn primary">Simpan</button></div></form>`,f=>{Object.assign(p,{name:f.get("name"),category:f.get("category"),price:+f.get("price"),stock:+f.get("stock"),min:+f.get("min")});saveDB();renderAll();toast("Produk diperbarui")})};
document.getElementById("addCustomerBtn").onclick=()=>openModal(`<h3>Tambah Pelanggan</h3><form><label>Nama<input name="name" required></label><label>No. HP<input name="phone"></label><label>Catatan<input name="note"></label><div class="modal-actions"><button type="button" class="btn soft" data-close>Batal</button><button class="btn primary">Simpan</button></div></form>`,f=>{db.customers.push({id:Date.now(),name:f.get("name"),phone:f.get("phone"),note:f.get("note"),spent:0});saveDB();renderAll();toast("Pelanggan ditambahkan")});
window.editCustomer=id=>{const c=db.customers.find(x=>x.id===id);if(!c)return;openModal(`<h3>Edit Pelanggan</h3><form><label>Nama<input name="name" value="${esc(c.name)}" required></label><label>No. HP<input name="phone" value="${esc(c.phone||"")}"></label><label>Catatan<input name="note" value="${esc(c.note||"")}"></label><div class="modal-actions"><button type="button" class="btn soft" data-close>Batal</button><button class="btn primary">Simpan</button></div></form>`,f=>{c.name=f.get("name");c.phone=f.get("phone");c.note=f.get("note");saveDB();renderAll();toast("Pelanggan diperbarui")})};
document.getElementById("saveSettings").onclick=()=>{db.settings={shopName:document.getElementById("shopName").value,whatsapp:document.getElementById("shopWhatsapp").value,address:document.getElementById("shopAddress").value};saveDB();toast("Pengaturan disimpan")};
document.getElementById("seedBtn").onclick=()=>{db={products:structuredClone(defaultProducts),customers:structuredClone(defaultCustomers),transactions:structuredClone(defaultTransactions),settings:{shopName:"HafinzahFotocopy",whatsapp:"",address:"Melayani fotocopy, print, scan, jilid, dan kebutuhan cetak."}};saveDB();renderAll();toast("Data contoh dipulihkan")};
document.getElementById("resetBtn").onclick=()=>{if(confirm("Yakin ingin menghapus semua data transaksi, produk, dan pelanggan?")){db={products:[],customers:[],transactions:[],settings:db.settings};saveDB();renderAll();toast("Semua data direset")}};
document.getElementById("exportBtn").onclick=()=>{let csv="ID,Tanggal,Pelanggan,Item,Total\n"+db.transactions.map(t=>[t.id,new Date(t.date).toLocaleString("id-ID"),t.customer,t.items.map(i=>`${i.name} x${i.qty}`).join(" | "),t.total].map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="laporan-hafinzahfotocopy.csv";a.click();URL.revokeObjectURL(a.href);toast("CSV berhasil dibuat")};
document.getElementById("printReport").onclick=()=>window.print();
document.getElementById("profileBtn").onclick=()=>go("pengaturan");
renderAll();
