const SUPABASE_URL="https://zvskrxsekozhvvwqhmht.supabase.co";
const SUPABASE_KEY="sb_publishable_0y3AitMJu4DIJ9d7nKAmfw_7f6leJr7";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const money=n=>"LKR "+Number(n||0).toLocaleString("en-LK");
let products=[],brands=[],categories=[],models=[],siteInfo={},cart=JSON.parse(sessionStorage.getItem("rm-cart")||"[]");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function clearOldDemoData(){["rm_demo_admin_products_v1","rm_demo_brands_v1","rm_demo_models_v1","rm_demo_categories_v1","rm_demo_site_info_v1","rm_demo_defaults_migrated_v8"].forEach(k=>localStorage.removeItem(k))}
function mapProduct(p){return {...p,id:p.id,part:p.part_number,brand:p.brands?.name||"",category:p.categories?.name||"",models:p.compatible_models||[],price:Number(p.price_lkr||0),desc:p.description||"",image:p.image_url||"",inStock:p.in_stock!==false}}
async function loadCloudData(){
 const [pr,br,cr,mr,sr]=await Promise.all([
  sb.from("products").select("*,brands(name),categories(name)").order("created_at",{ascending:false}),
  sb.from("brands").select("*").order("name"),
  sb.from("categories").select("*").order("name"),
  sb.from("bike_models").select("*,brands(name)").order("name"),
  sb.from("site_settings").select("*").eq("id",1).maybeSingle()
 ]);
 if(pr.error)console.error(pr.error);products=(pr.data||[]).map(mapProduct);
 brands=br.data||[];categories=cr.data||[];models=mr.data||[];siteInfo=sr.data||{};
}
function renderProducts(){
 const q=(document.querySelector("#search")?.value||"").toLowerCase(),b=document.querySelector("#filter-brand")?.value||"",c=document.querySelector("#filter-category")?.value||"";
 const list=products.filter(p=>(!q||[p.name,p.part,p.brand,p.category,...p.models].join(" ").toLowerCase().includes(q))&&(!b||p.brand===b)&&(!c||p.category===c));
 const el=document.querySelector("#products");if(!el)return;
 el.innerHTML=list.map(p=>`<article class="product-card" onclick="location.href='product.html?id=${encodeURIComponent(p.id)}'"><div class="product-img"><img src="${esc(p.image||'assets/real-motors-logo.png')}" alt="${esc(p.name)}" loading="lazy" decoding="async"><span>${p.inStock?'GENUINE PART':'OUT OF STOCK'}</span><button aria-label="View product">↗</button></div><div class="product-info"><small>${esc(p.brand)} / ${esc(p.category)}</small><h3>${esc(p.name)}</h3><p>FITS: ${esc(p.models.join(", ")||"Confirm with shop")}</p><div><b>${money(p.price)}</b><span>VIEW DETAILS ↗</span></div></div></article>`).join("")||'<p class="empty">No products available yet. Please check back soon.</p>';
}
function renderFilters(){
 const bs=document.querySelector("#filter-brand"),cs=document.querySelector("#filter-category");
 if(bs)bs.innerHTML='<option value="">ALL BRANDS</option>'+brands.map(x=>`<option>${esc(x.name)}</option>`).join("");
 if(cs)cs.innerHTML='<option value="">ALL CATEGORIES</option>'+categories.map(x=>`<option>${esc(x.name)}</option>`).join("");
 const cg=document.querySelector("#category-grid");
 if(cg){
  cg.innerHTML=categories.map((x,i)=>`<button type="button" class="category-card" data-category="${esc(x.name)}"><small>${String(i+1).padStart(2,"0")}</small><strong>${esc(x.name)}</strong><span>EXPLORE ↗</span></button>`).join("")||'<p class="category-empty">No categories have been added yet.</p>';
  cg.querySelectorAll(".category-card").forEach(card=>card.addEventListener("click",()=>{
   const filter=document.querySelector("#filter-category");
   if(filter){filter.value=card.dataset.category;renderProducts();}
   document.querySelector("#shop")?.scrollIntoView({behavior:"smooth"});
  }));
 }
 const br=document.querySelector("#brand-row");
 if(br)br.innerHTML=brands.map((x,i)=>{const logoSrc=x.image_url|| (String(x.name||'').trim().toUpperCase()==='BAJAJ'?'assets/BAJAJ-symbol-transparent-clean.png':'');return `<button onclick="document.querySelector('#filter-brand').value='${esc(x.name)}';renderProducts();document.querySelector('#shop').scrollIntoView({behavior:'smooth'})">${logoSrc?`<span class="brand-logo-frame"><img class="brand-tile-photo" src="${esc(logoSrc)}" alt="${esc(x.name)}"></span>`:''}<small>${String(i+1).padStart(2,'0')}</small><b>${esc(x.name)}</b><span>EXPLORE ↗</span></button>`}).join("");
 const mp=document.querySelector("#model-pills");
 if(mp)mp.innerHTML=models.map(x=>`<button class="model-card" onclick="document.querySelector('#search').value='${esc(x.name)}';renderProducts();document.querySelector('#shop').scrollIntoView({behavior:'smooth'})">${x.image_url?`<img src="${esc(x.image_url)}" alt="${esc(x.name)}" loading="lazy">`:''}<span class="model-shade"></span><span class="model-name">${esc(x.name)}</span><span class="model-arrow">↗</span></button>`).join("");
 const fc=document.querySelector("#footer-categories");if(fc)fc.innerHTML=categories.map(x=>`<a href="categories.html#shop" onclick="sessionStorage.setItem('rm-selected-category',this.dataset.category)" data-category="${esc(x.name)}">${esc(x.name)}</a>`).join("");
}
function renderSiteInfo(){
 const d={about_title:"ABOUT REAL MOTORS",about_text:"Your trusted destination for genuine and second quality motorcycle spare parts in Kattankudy.",phone:"",email:"",address:"Kattankudy, Sri Lanka",instagram_url:"",facebook_url:"",whatsapp:"",...siteInfo};
 const put=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v||""};
 put("about-title",d.about_title);put("about-body",d.about_text);put("footer-about-text",d.about_text);put("footer-phone",d.phone);put("footer-email",d.email);put("footer-address",d.address);put("footer-instagram-name",d.instagram_url?d.instagram_url.replace(/^https?:\/\/(www\.)?instagram\.com\//,"@").replace(/\/$/,""):"Instagram");
 const em=document.getElementById("footer-email-link");if(em)em.href=d.email?"mailto:"+d.email:"#";
 for(const [id,url] of [["footer-instagram",d.instagram_url],["footer-facebook",d.facebook_url]]){const el=document.getElementById(id);if(el){el.href=url||"#";el.style.display=url?"grid":"none"}}
 const wa=document.getElementById("hero-whatsapp");if(wa)wa.href=shopWhatsApp()?"https://wa.me/"+shopWhatsApp():"#";
}
function shopWhatsApp(){let raw=(siteInfo.whatsapp||siteInfo.phone||"").trim(),n=raw.replace(/\D/g,"");if(n.startsWith("0"))n="94"+n.slice(1);return n}
function renderProduct(id){
 const p=products.find(x=>String(x.id)===String(id)),el=document.querySelector("#product-page");if(!el)return;
 if(!p){el.innerHTML="<h2>Product not found</h2>";return}
 el.innerHTML=`<div class="crumb"><a href="index.html">HOME</a> / <a href="index.html#shop">PARTS</a> / ${esc(p.name.toUpperCase())}</div><div class="detail-grid"><div class="detail-image"><img src="${esc(p.image||'assets/real-motors-logo.png')}" alt="${esc(p.name)}" loading="lazy" decoding="async"></div><div class="detail-copy"><p class="eyebrow">${esc(p.brand)} / ${esc(p.category)}</p><h1>${esc(p.name)}</h1><p class="partno">PART NUMBER: ${esc(p.part)}</p><div class="detail-price">${money(p.price)}</div><p class="detail-desc">${esc(p.desc)}</p><div class="fit-box"><small>COMPATIBLE BIKE MODELS</small><b>${esc(p.models.join(" · ")||"Confirm with shop")}</b></div><button class="primary" onclick="addToCart('${p.id}')">ADD TO CART <b>＋</b></button><a class="back-link" href="index.html#shop">← BACK TO PARTS</a></div></div>`;
}
function renderCart(){
 const count=cart.reduce((a,p)=>a+p.qty,0),badge=document.querySelector("#cart-count");if(badge)badge.textContent=count;
 const items=document.querySelector("#cart-items");if(items)items.innerHTML=cart.length?cart.map(p=>`<div class="cart-item"><span>${esc(p.name)}<small>${p.qty} × ${money(p.price)}</small></span><button onclick="removeCart('${p.id}')">REMOVE</button></div>`).join(""):'<p class="empty">Your cart is empty.</p>';
 const total=document.querySelector("#cart-total");if(total)total.textContent=money(cart.reduce((a,p)=>a+p.qty*p.price,0));
}
function addToCart(id){let p=products.find(x=>String(x.id)===String(id)),old=cart.find(x=>String(x.id)===String(id));if(!p)return;if(old)old.qty++;else cart.push({...p,qty:1});sessionStorage.setItem("rm-cart",JSON.stringify(cart));renderCart();toggleCart(true)}
function removeCart(id){cart=cart.filter(p=>String(p.id)!==String(id));sessionStorage.setItem("rm-cart",JSON.stringify(cart));renderCart()}
function toggleCart(force){
 let e=document.querySelector("#cart-overlay");
 if(!e)return;
 const opening=force===true||!e.classList.contains("open");
 e.classList.toggle("open",opening);
 if(opening){
  e.querySelectorAll(".cart-head,.cart-item,.empty,.cart-foot>*").forEach((el,i)=>{
   el.style.setProperty("--rm-cart-delay",`${Math.min(i,8)*55}ms`);
   el.classList.remove("rm-cart-enter");
   void el.offsetWidth;
   el.classList.add("rm-cart-enter");
  });
 }
}
function setCategory(c){const s=document.querySelector("#filter-category");if(s)s.value=c;renderProducts()}
function restoreCategoryNavigation(){const c=sessionStorage.getItem("rm-selected-category");if(!c)return;sessionStorage.removeItem("rm-selected-category");const s=document.querySelector("#filter-category");if(s){s.value=c;renderProducts()}}
function clearFilters(){["#search","#filter-brand","#filter-category"].forEach(s=>{const e=document.querySelector(s);if(e)e.value=""});renderProducts()}
function checkoutWhatsApp(){
 if(!cart.length)return alert("Your cart is empty.");
 const name=document.getElementById("order-customer-name")?.value.trim()||"",phone=document.getElementById("order-customer-phone")?.value.trim()||"",method=document.getElementById("order-delivery-method")?.value||"Shop Pickup",address=document.getElementById("order-customer-address")?.value.trim()||"";
 if(!name||!phone)return alert("Please enter your name and phone number.");
 if(method!=="Shop Pickup"&&!address)return alert("Please enter your delivery address.");
 const number=shopWhatsApp();if(!number)return alert("Please set the shop WhatsApp number in Admin → About & Footer.");
 const subtotal=cart.reduce((s,p)=>s+p.qty*p.price,0);
 const lines=cart.map((p,i)=>`${i+1}. ${p.name}\nPart No: ${p.part}\nBike: ${p.models.join(", ")}\nQty: ${p.qty} × ${money(p.price)} = ${money(p.qty*p.price)}`).join("\n\n");
 const msg=`*NEW ORDER REQUEST – REAL MOTORS*\nName: ${name}\nPhone: ${phone}\nDelivery: ${method}\nAddress: ${method==="Shop Pickup"?"Shop Pickup":address}\n\n*ITEMS*\n${lines}\n\n*SUBTOTAL: ${money(subtotal)}*\nPlease confirm availability and delivery fee.`;
 window.open("https://wa.me/"+number+"?text="+encodeURIComponent(msg),"_blank","noopener");
}
async function init(){
 clearOldDemoData();
 await loadCloudData();renderFilters();renderSiteInfo();renderProducts();renderCart();
 const id=new URLSearchParams(location.search).get("id");if(id)renderProduct(id);
 const method=document.getElementById("order-delivery-method"),wrap=document.getElementById("order-address-wrap");if(method&&wrap){const upd=()=>wrap.style.display=method.value==="Shop Pickup"?"none":"grid";method.addEventListener("change",upd);upd()}
}
document.addEventListener("DOMContentLoaded",()=>init().catch(e=>{console.error(e);const el=document.querySelector("#products");if(el)el.innerHTML='<p class="empty">Could not load the catalogue. Please refresh and try again.</p>'}));


/* V36 PERFORMANCE MOTION SYSTEM — frame-coalesced pointer work */
(function(){
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches;
 if(reduced)return;
 const selectors='.section,.section-head,.category-grid,.category-card,.brand-row,.model-pills,.tools,.product-grid,.product-card,.demo-note,.delivery,.about-section,.footer-grid,.footer-bottom,.hero-trust,.hero-cta,.ticker,.detail-grid,.detail-copy,.detail-image';
 let observer=null;
 if('IntersectionObserver'in window){
  observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('rm-visible');observer.unobserve(entry.target);}
  },{threshold:.06,rootMargin:'0px 0px -4% 0px'});
 }
 function reveal(root=document){
  const nodes=root.nodeType===1&&root.matches(selectors)?[root]:root.querySelectorAll(selectors);
  nodes.forEach(el=>{
   if(el.dataset.rmReveal==='1')return;
   el.dataset.rmReveal='1';el.classList.add('rm-reveal');
   if(observer)observer.observe(el);else el.classList.add('rm-visible');
  });
 }
 function progress(){
  if(document.querySelector('.rm-scroll-progress'))return;
  const bar=document.createElement('div');bar.className='rm-scroll-progress';bar.innerHTML='<span></span>';document.body.appendChild(bar);
  const fill=bar.firstElementChild;let queued=false;
  const update=()=>{
   const max=document.documentElement.scrollHeight-innerHeight;
   fill.style.transform=`scaleX(${max>0?scrollY/max:0})`;
   document.body.classList.toggle('rm-scrolled',scrollY>30);queued=false;
  };
  const queue=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});update();
 }
 function loader(){
  if(document.querySelector('.rm-cinema-loader'))return;
  const el=document.createElement('div');el.className='rm-cinema-loader';el.setAttribute('aria-hidden','true');
  el.innerHTML='<div class="rm-loader-core">REAL MOTORS<span>PRECISION • PERFORMANCE • TRUST</span><div class="rm-loader-line"></div></div>';
  document.body.appendChild(el);
  let done=false;const dismiss=()=>{if(done)return;done=true;setTimeout(()=>el.classList.add('rm-loaded'),180);setTimeout(()=>el.remove(),850)};
  if(document.readyState==='complete')dismiss();else addEventListener('load',dismiss,{once:true});
  setTimeout(dismiss,1200);
 }
 function init(){
  reveal();progress();loader();
  document.querySelectorAll('.section-head,.brand-row,.model-pills,.footer-grid,.category-grid,.tools').forEach(el=>el.classList.add('rm-stagger'));
  document.querySelectorAll('.primary,.cart-button,.hero-cta a').forEach(el=>el.classList.add('rm-magnetic'));
  ['#products','#brand-row','#model-pills'].forEach(sel=>{
   const area=document.querySelector(sel);
   if(area&&'MutationObserver'in window){
    new MutationObserver(records=>records.forEach(rec=>rec.addedNodes.forEach(node=>{if(node.nodeType===1)reveal(node)}))).observe(area,{childList:true});
   }
  });
  if(!fine)return;
  const aura=document.createElement('div');aura.className='rm-cursor-aura';document.body.append(aura);
  document.body.classList.add('rm-motion-ready');
  let px=innerWidth/2,py=innerHeight/2,ax=px,ay=py,raf=0,lastCard=null,lastMagnetic=null;
  function paint(){
   ax+=(px-ax)*.22;ay+=(py-ay)*.22;
   aura.style.transform=`translate3d(${ax}px,${ay}px,0) translate(-50%,-50%)`;
   if(Math.abs(px-ax)+Math.abs(py-ay)>.5)raf=requestAnimationFrame(paint);else raf=0;
  }
  function processPointer(e){
   px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(paint);
   const target=document.elementFromPoint(px,py);if(!target)return;
   const hero=target.closest('.hero');
   if(hero){
    const r=hero.getBoundingClientRect();
    hero.style.setProperty('--rm-hero-x',((px-r.left)/Math.max(1,r.width)*100)+'%');
    hero.style.setProperty('--rm-hero-y',((py-r.top)/Math.max(1,r.height)*100)+'%');
   }
   const card=target.closest('.product-card');
   if(card){
    const r=card.getBoundingClientRect(),x=(px-r.left)/Math.max(1,r.width),y=(py-r.top)/Math.max(1,r.height);
    card.style.setProperty('--rm-tilt-x',`${(0.5-y)*3}deg`);
    card.style.setProperty('--rm-tilt-y',`${(x-.5)*4}deg`);
    card.style.setProperty('--rm-card-x',`${x*100}%`);card.style.setProperty('--rm-card-y',`${y*100}%`);
   }
   const magnetic=target.closest('.rm-magnetic');
   if(lastMagnetic&&lastMagnetic!==magnetic){
    lastMagnetic.style.transform='';lastMagnetic.classList.remove('rm-magnetic-active');lastMagnetic=null;
   }
   if(magnetic){
    const r=magnetic.getBoundingClientRect(),dx=px-(r.left+r.width/2),dy=py-(r.top+r.height/2);
    magnetic.style.transform=`translate3d(${dx*.055}px,${dy*.065}px,0)`;
    magnetic.classList.add('rm-magnetic-active');lastMagnetic=magnetic;
   }
   if(lastCard&&lastCard!==card){
    lastCard.style.removeProperty('--rm-tilt-x');lastCard.style.removeProperty('--rm-tilt-y');
   }
   lastCard=card||null;
  }
  let pending=null,queued=false;
  document.addEventListener('pointermove',e=>{
   pending=e;
   if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;if(pending)processPointer(pending)})}
  },{passive:true});
  document.addEventListener('pointerout',e=>{
   const card=e.target.closest('.product-card');
   if(card&&!card.contains(e.relatedTarget)){card.style.removeProperty('--rm-tilt-x');card.style.removeProperty('--rm-tilt-y');if(lastCard===card)lastCard=null}
   const magnetic=e.target.closest('.rm-magnetic');
   if(magnetic&&!magnetic.contains(e.relatedTarget)){magnetic.style.transform='';magnetic.classList.remove('rm-magnetic-active');if(lastMagnetic===magnetic)lastMagnetic=null}
  },{passive:true});
  addEventListener('pointerleave',()=>document.body.classList.remove('rm-motion-ready'));
  addEventListener('pointerenter',()=>document.body.classList.add('rm-motion-ready'));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
