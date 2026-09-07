/** Mock service boundary - replace fetchProducts with the 1Fi catalogue API. */
const catalogue = [
  { id:"iphone15", category:"Mobiles", brand:"Apple", name:"iPhone 15 128 GB", price:66900, image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=90", plans:[3,6,9,12] },
  { id:"samsung-s24", category:"Mobiles", brand:"Samsung", name:"Galaxy S24 5G", price:74999, image:"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=85", plans:[3,6,9,12,18] },
  { id:"hp-pavilion", category:"Laptops", brand:"HP", name:"Pavilion Plus 14", price:82999, image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=85", plans:[3,6,9,12] },
  { id:"sony", category:"Electronics", brand:"Sony", name:"WH-1000XM5 Headphones", price:29990, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=85", plans:[3,6,9] },
  { id:"bose", category:"Electronics", brand:"Bose", name:"QuietComfort Ultra", price:35900, image:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=85", plans:[3,6,9,12] },
  { id:"samsung-tv", category:"TVs", brand:"Samsung", name:"55-inch Crystal 4K TV", price:48990, image:"https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=85", plans:[3,6,9,12] },
  { id:"lg-tv", category:"TVs", brand:"LG", name:"43-inch UHD Smart TV", price:34990, image:"https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&w=600&q=85", plans:[3,6,9] },
  { id:"watch", category:"Wearables", brand:"Apple", name:"Watch SE GPS", price:29900, image:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=85", plans:[3,6,9] },
  { id:"camera", category:"Cameras", brand:"Canon", name:"EOS R50 Mirrorless Camera", price:67995, image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=85", plans:[3,6,9,12] },
  { id:"dyson", category:"Home", brand:"Dyson", name:"V8 Absolute Vacuum", price:32900, image:"https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=85", plans:[3,6,9,12] },
  { id:"coffee", category:"Home", brand:"Philips", name:"LatteGo Espresso Machine", price:45995, image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=85", plans:[3,6,9,12] },
];
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const brands = [{ name:"Air India", term:"No-cost EMIs upto 18 months", logo:"AIR INDIA", color:"#df1029" },{ name:"Apple Premium Reseller", term:"No-cost EMIs upto 24 months", logo:"●", color:"#050505" },{ name:"CaratLane", term:"No-cost EMIs upto 6 months", logo:"CARATLANE", color:"#950a9b" },{ name:"Croma", term:"No-cost EMIs upto 12 months", logo:"croma", color:"#fff", ink:"#198e8c" }];
const nearbyStores = [{ name:"TripBouquet", address:"241, Tower B, Spazedge, near Dmart, Gurugram, Haryana, 122018", distance:"1700 KM", logo:"Tℬ", tone:"#d92939" },{ name:"Charger On Wheels", address:"Orchid Business Park, Near Subhash Chowk, Gurugram, Haryana, 122101", distance:"1701 KM", logo:"COW", tone:"#121212" },{ name:"Pacholi Suzuki Hayatpur", address:"RAKBA 12, KANAL 11, MARLA 0, Hayatpur, SARSAI, Gurugram, Haryana, 122001", distance:"1701 KM", logo:"S", tone:"#d71d29" },{ name:"Ashoka Suzuki", address:"Sector 14, Gurugram, Haryana, 122001", distance:"1702 KM", logo:"S", tone:"#d71d29" }];
const state = { products: [], selectedCategory: "All", search: "", storeSearch: "", activeTab: "brands", product: null, plan: null };
const $ = (selector) => document.querySelector(selector);
const shopView = $("#shopView"), productView = $("#productView"), successView = $("#successView");

async function fetchProducts() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return catalogue;
}
function filteredProducts() { return state.products.filter(p => (state.selectedCategory === "All" || p.category === state.selectedCategory) && `${p.name} ${p.brand}`.toLowerCase().includes(state.search.toLowerCase())); }
function renderCategories() {
  const categories = ["All", ...new Set(state.products.map(p => p.category))];
  $("#categoryRow").innerHTML = categories.map(category => `<button class="${state.selectedCategory === category ? "active" : ""}" data-category="${category}">${category}</button>`).join("");
  document.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => { state.selectedCategory = button.dataset.category; renderCategories(); renderProducts(); }));
}
function renderProducts() {
  const products = filteredProducts(), grid = $("#productGrid"), status = $("#statusMessage");
  grid.setAttribute("aria-busy", "false");
  status.textContent = products.length ? `${products.length} product${products.length === 1 ? "" : "s"} available with no-cost EMI` : "No products match your search.";
  $("#clearFilter").hidden = !state.search && state.selectedCategory === "All";
  grid.innerHTML = "";
  if (!products.length) { grid.innerHTML = '<p class="empty">Try another product or category.</p>'; return; }
  const template = $("#productCardTemplate");
  products.forEach(product => { const card = template.content.cloneNode(true); const image = document.createElement("img"); image.src = product.image; image.alt = product.name; image.loading = "lazy"; image.decoding = "async"; image.addEventListener("error", () => card.querySelector(".product-image").classList.add("image-unavailable")); card.querySelector(".product-image").append(image); card.querySelector(".brand").textContent = product.brand; card.querySelector("h3").textContent = product.name; card.querySelector(".price").textContent = money.format(product.price); card.querySelector(".emi-copy").textContent = `From ${money.format(Math.ceil(product.price / Math.max(...product.plans)))}/mo • 0% interest`; card.querySelector("button").addEventListener("click", () => showProduct(product)); grid.append(card); });
}
function renderBrands() { const query = $("#brandSearchInput").value.toLowerCase(); $("#brandList").innerHTML = brands.filter(b => b.name.toLowerCase().includes(query)).map(b => `<article class="brand-row"><div class="brand-logo" style="background:${b.color};color:${b.ink || '#fff'}">${b.logo}</div><div><h3>${b.name}</h3><p>${b.term}</p></div></article>`).join("") || '<p class="empty">No brands match your search.</p>'; }
function renderNearbyStores() { const query = state.storeSearch.toLowerCase(); const stores = nearbyStores.filter(store => `${store.name} ${store.address}`.toLowerCase().includes(query)); $("#nearbyList").innerHTML = stores.map(store => `<article class="nearby-row"><div class="nearby-logo" style="color:${store.tone}">${store.logo}</div><div class="nearby-copy"><h3>${store.name}</h3><p>${store.address}</p></div><span class="distance">${store.distance}</span></article>`).join("") || '<p class="empty">No nearby stores match your search.</p>'; }
function selectShopTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll("[data-shop-tab]").forEach(button => { const active = button.dataset.shopTab === tab; button.classList.toggle("active", active); button.setAttribute("aria-selected", active); button.tabIndex = active ? 0 : -1; });
  $("#brandsPanel").hidden = tab !== "brands"; $("#nearbyPanel").hidden = tab !== "nearby"; $("#marketplacePanel").hidden = tab !== "marketplace";
}
function showProduct(product) {
  state.product = product; state.plan = product.plans.includes(12) ? 12 : product.plans[product.plans.length - 1];
  $("#pageTitle").textContent = "Product details"; $("#backButton").hidden = false; shopView.hidden = true; successView.hidden = true; productView.hidden = false; renderProduct(); window.scrollTo(0, 0);
}
function returnToShop() {
  $("#pageTitle").textContent = "Shop";
  $("#backButton").hidden = true;
  productView.hidden = true;
  successView.hidden = true;
  shopView.hidden = false;
  selectShopTab("marketplace");
  window.scrollTo(0, 0);
}
function renderProduct() {
  const p = state.product, monthly = Math.ceil(p.price / state.plan);
  productView.innerHTML = `<button class="detail-back" id="productBack" type="button" aria-label="Back to Marketplace"><span aria-hidden="true">←</span> Back to Marketplace</button><div class="detail-image"><img src="${p.image}" alt="${p.name}"></div><p class="product-detail-brand">${p.brand.toUpperCase()}</p><h2 class="product-detail-title">${p.name}</h2><p class="detail-price">${money.format(p.price)}</p><p class="detail-note">Inclusive of taxes • Free delivery • Eligible for no-cost EMI</p><section class="plan-box"><h2>Choose an EMI plan</h2><p>You repay exactly the product price. No interest, no hidden charges.</p>${p.plans.map(term => `<button class="plan-option ${term === state.plan ? "active" : ""}" data-plan="${term}"><span><span class="plan-term">${term} months</span><span class="plan-total">0% interest • No processing fee</span></span><span class="plan-monthly">${money.format(Math.ceil(p.price / term))}/mo</span></button>`).join("")}<button class="primary-button" id="proceedButton">Proceed with ${state.plan}-month plan</button></section>`;
  $("#productBack").addEventListener("click", returnToShop);
  document.querySelectorAll("[data-plan]").forEach(button => button.addEventListener("click", () => { state.plan = Number(button.dataset.plan); renderProduct(); }));
  $("#proceedButton").addEventListener("click", () => { $("#pageTitle").textContent = "Plan selected"; $("#backButton").hidden = true; productView.hidden = true; successView.hidden = false; $("#successText").textContent = `${p.name} is reserved at ${money.format(monthly)} per month for ${state.plan} months.`; });
}
$("#backButton").addEventListener("click", returnToShop);
$("#shopMore").addEventListener("click", () => { $("#pageTitle").textContent = "Shop"; successView.hidden = true; shopView.hidden = false; });
$("#searchInput").addEventListener("input", event => { state.search = event.target.value.trim(); renderProducts(); });
$("#clearFilter").addEventListener("click", () => { state.selectedCategory = "All"; state.search = ""; $("#searchInput").value = ""; renderCategories(); renderProducts(); });
$("#brandSearchInput").addEventListener("input", renderBrands);
$("#storeSearchInput").addEventListener("input", event => { state.storeSearch = event.target.value.trim(); renderNearbyStores(); });
document.querySelectorAll("[data-shop-tab]").forEach((button, index, tabs) => { button.addEventListener("click", () => selectShopTab(button.dataset.shopTab)); button.addEventListener("keydown", event => { if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return; event.preventDefault(); const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length]; next.focus(); selectShopTab(next.dataset.shopTab); }); });
async function loadProducts() { const grid = $("#productGrid"), status = $("#statusMessage"); grid.setAttribute("aria-busy", "true"); status.textContent = "Finding the best offers for you…"; try { state.products = await fetchProducts(); renderCategories(); renderProducts(); } catch { grid.setAttribute("aria-busy", "false"); grid.innerHTML = '<p class="empty">We couldn\'t load products. <button class="text-button" id="retryProducts" type="button">Try again</button></p>'; status.textContent = "Product offers are temporarily unavailable."; $("#retryProducts").addEventListener("click", loadProducts); } }
(function initialise() { renderBrands(); renderNearbyStores(); loadProducts(); })();
