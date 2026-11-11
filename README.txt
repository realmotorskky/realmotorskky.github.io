REAL MOTORS V13 — CLOUD CONNECTED WEBSITE

This build connects the storefront and Admin Dashboard to the existing REAL MOTORS Supabase project.
Project URL: https://zvskrxsekozhvvwqhmht.supabase.co
The browser uses only the Supabase publishable key. No service-role key is included.

WHAT IS CONNECTED
- Products, product prices, part numbers, compatible bike models, descriptions, stock status and images.
- Brands and brand logo images.
- Bike models and their photos.
- Categories.
- About/footer information and WhatsApp number.
- Product, brand and model images upload to the existing public product-images Storage bucket.
- Admin changes are stored in Supabase and therefore are shared across devices/browsers.

DEMO CLEANUP
- The old hard-coded demo products have been removed from app.js.
- Existing browser demo Local Storage keys are cleared when the new storefront loads.
- Supabase products table was verified to contain 0 products before use.
- Six real brand names, four categories and twelve bike models were seeded into the database. These are catalogue reference data, not demo products.

ADMIN LOGIN
- Open admin.html.
- Sign in with the authorised REAL MOTORS admin account (realmotorsms@gmail.com) and its existing password.
- Admin access is checked against public.store_admins. The account must already be listed there.
- Do not share the admin password.

HOW TO ADD PRODUCTS
- Select a brand and category.
- Select compatible bike models (use Ctrl-click to select multiple on desktop).
- Enter product name, part number, price and description.
- Upload an image or paste an image URL.
- Save Product to Cloud. It will appear on every device after refresh.

IMPORTANT
- This ZIP is now wired to Supabase. Host the full folder on your website hosting with internet access.
- Admin requires the existing authorised Supabase Auth account.
- Customers order through WhatsApp. This does not create a store_orders row; the customer sends the pre-filled WhatsApp message.
- Keep the Supabase publishable key in the frontend only; never place a service-role key in website files.

V21: HOME (index.html), CATEGORIES (categories.html), BIKE BRANDS (brands.html), BIKE MODELS (models.html) are separate HTML pages. Existing cloud and animation scripts retained.
