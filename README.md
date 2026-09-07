# 1Fi Marketplace - SDE Intern Assignment

A self-contained responsive implementation that preserves the existing 1Fi Shop page and adds 1Fi Marketplace as its third tab. Open `index.html` in a modern browser to run it; no installation is required.

## Included flow

- Existing-style three-option Shop control: Top Brands, Nearby Stores, and Marketplace, all using the same segmented-pill navigation treatment from the supplied app screen; keyboard navigation is supported
- Marketplace product catalogue, category filters, and search
- Product details with pricing and product-specific EMI options
- Selection state and a plan confirmation CTA
- Data separated in a mock service boundary (`fetchProducts` / `catalogue`) to make backend replacement straightforward
- Responsive mobile-first styling informed by the supplied 1Fi reference screens
- Loading, empty, retry, and image-fallback UI states
- Search for Top Brands, Nearby Stores, and Marketplace products

## Production integration notes

Replace `fetchProducts()` with the catalogue endpoint and map the API response to the product shape used by the UI. Keep payment/plan reservation as a server-authoritative operation before showing confirmation.
