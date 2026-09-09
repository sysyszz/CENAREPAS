# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, confirmed by the user:

- **Internal staff** of the arepa factory (this is a real pilot client, not a demo/fictional business): use the admin panel to run day-to-day operations — ventas, producción, insumos, proveedores, clientes, roles, usuarios, categorías, pedidos, configuración.
- **Public customers** of the arepa factory: browse the public landing page to learn about the products and place an order (via the contact/order form and WhatsApp-style contact channels).

## Product Purpose

Cenarepas is a management system (gestión/ERP-style back office) built for a real pilot client: an arepa factory. It gives the factory a single system to run its operations (sales, production, inventory/insumos, suppliers, customers, staff roles/users, categories, orders) and a public-facing landing page so customers can discover the products and place orders. Cenarepas (the software) is not itself an arepa producer — it is the system this pilot client runs their business on.

## Positioning

Bespoke operations software for this specific pilot client, not (yet) a generalized multi-tenant product for other food producers. The differentiator that matters here is coverage: one system spans the full operational loop (insumos → producción → productos → ventas/pedidos → clientes/proveedores) plus the client-facing storefront, rather than stitching together separate tools.

## Operating Context

- Admin panel (internal, behind `/admin/login`): CRUD-heavy screens for Ventas, Productos, Clientes, Proveedores, Insumos, Roles, Usuarios, Produccion, Categorias, Pedidos, Configuracion.
- Public landing page (`/`): marketing/storefront for the arepa factory — Hero, Nosotros (About), Stats, Productos, Ventajas (Why/Process), Contacto, CTA, Footer.
- Configuración feeds shared branding data (nombre del proyecto, logo, sede, banner images, hero video) into both the landing and the admin shell via `ConfiguracionContext`.

## Capabilities and Constraints

- Stack: React 19 + Vite + Tailwind CSS v4 + framer-motion + lucide-react (existing codebase; not asked, already evidenced).
- Landing brand tokens (terracota/maíz/verde hoja palette, Poppins + Playfair Display + Dancing Script) are already established in `src/features/landing/styles/landing.css` and `src/shared/styles/theme.css`.
- Undecided/open: whether Cenarepas will later become a multi-tenant product for other factories, or stay bespoke to this client — treat as out of scope until the user confirms.

## Brand Commitments

- Name: **CENAREPAS**. Tagline used in the header: "FÁBRICA DE AREPAS".
- Established palette: terracota (`--landing-brand` #c1502d), maíz/oro (`--landing-accent-gold` #e8b23d), verde hoja (`--landing-accent-green` #5a7a3a), plus a warm "masa" tostada scale for the hero.
- Fonts: Poppins (sans, body/UI), Playfair Display (serif italic, headline accent), Dancing Script (script, decorative).

## Evidence on Hand

- Contact details currently in `ContactSection.jsx` and `SiteFooter.jsx` (phone `+57 300 123 4567`, email `ventas@arepasdelcampo.com`, addresses in Bello Oriente and Aranjuez, Medellín) are **placeholders** — the client's real contact/location data has not been confirmed yet. Future work must not present these as confirmed facts and should flag them for replacement with real data before launch.
- No testimonials, press, certifications, or pricing beyond the illustrative product cards already in `ProductsSection.jsx` exist; do not fabricate any.

## Product Principles

1. One system, one source of truth: sales, production, inventory, customers, and the public storefront all read from the same operational data — don't let the landing drift into fictional/demo content now that it represents a real client.
2. Internal (admin) and public (landing) surfaces serve different jobs — operate vs. persuade — and should be judged by different standards (scanability/consistency vs. clarity/trust/conversion).
3. Preserve the established terracota/maíz/verde-hoja identity and existing landing structure when refining; treat it as incumbent authority, not a blank slate.
4. Never present placeholder contact/location data as real; surface it as a known gap instead.

## Accessibility & Inclusion

No product-specific requirement established yet; default to WCAG 2.2 AA as the working bar (contrast, touch targets, keyboard/focus, form errors) per the review skills in use on this project.
