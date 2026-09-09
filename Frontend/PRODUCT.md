# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, corrected by the user (2026-09-03) after an earlier session mis-modeled this — see Positioning Correction below:

- **Internal staff of a CENAREPAS pilot client** (Masarepas, a real arepa factory, not a demo/fictional business): use the admin panel to run day-to-day operations — ventas, producción, insumos, proveedores, clientes, roles, usuarios, categorías, pedidos, configuración.
- **Prospective B2B customers of CENAREPAS** (owners/operators of other food-production factories evaluating the software): browse the public landing page to understand what the management system does and request a demo. They are not consumers shopping for arepas.

## Product Purpose

CENAREPAS is a management system (gestión/ERP-style back office) for food-production factories — pedidos, producción, inventario, ventas, and trazabilidad in one place. **CENAREPAS is the software product being marketed on the landing page; it is not an arepa brand.** Masarepas is a real arepa factory that runs its operations on CENAREPAS today, and the landing uses it as the illustrative case study/example tenant (e.g. "Masarepas ya usa CENAREPAS para..."), not as the landing's own identity.

## Positioning Correction (2026-09-03)

An earlier session modeled this product backwards: it treated "Cenarepas" as the arepa-factory brand itself (landing copy read as a storefront selling arepas — "Pedir al por mayor", a product search bar, prices). The user corrected this explicitly: CENAREPAS is the B2B software; the arepa factory that uses it is a separate entity, **Masarepas**. The landing was rewritten accordingly (Hero, Nosotros) to pitch the system with Masarepas as a named example, CTAs changed to "Solicitar demo" / "Ver el sistema en acción". **Not yet rewritten as of this note: Productos, Ventajas, Contacto, and Footer/CTA sections still carry storefront-era copy/structure** (Productos shows arepa product cards with prices) and need the same correction — pick this up before treating the landing as finished.

## Positioning

Bespoke B2B operations software, currently proven on one real pilot client (Masarepas), not (yet) a generalized multi-tenant product marketed to many factories simultaneously — though the landing now pitches it *as if* prospecting new factory customers, with Masarepas as proof. The differentiator that matters here is coverage: one system spans the full operational loop (insumos → producción → productos → ventas/pedidos → clientes/proveedores), rather than stitching together separate tools.

## Operating Context

- Admin panel (internal, behind `/admin/login`): CRUD-heavy screens for Ventas, Productos, Clientes, Proveedores, Insumos, Roles, Usuarios, Produccion, Categorias, Pedidos, Configuracion. This is what a pilot client like Masarepas actually runs their factory on.
- Public landing page (`/`): marketing site for the CENAREPAS software product — Hero, Nosotros (About), Stats, Productos, Ventajas (Why/Process), Contacto, CTA, Footer. Pitches the system to prospective factory customers; uses Masarepas as its case study, not as the site's own brand identity.
- Configuración feeds shared branding data (nombre del proyecto, logo, sede, banner images, hero video) into both the landing and the admin shell via `ConfiguracionContext`.

## Capabilities and Constraints

- Stack: React 19 + Vite + Tailwind CSS v4 + framer-motion + lucide-react (existing codebase; not asked, already evidenced).
- Landing brand tokens (terracota/maíz/verde hoja palette, Poppins + Playfair Display + Dancing Script) are already established in `src/features/landing/styles/landing.css` and `src/shared/styles/theme.css`.
- Undecided/open: whether CENAREPAS will later become a generalized multi-tenant product marketed to many factories, or stay proven-on-one-client — treat as out of scope until the user confirms.

## Brand Commitments

- Name: **CENAREPAS**, a management-system product. Tagline: "SISTEMA DE GESTIÓN" (baked into the current logo wordmark, `src/assets/cenarepas-logo-dark.svg` / `cenarepas-logo-light.svg`; icon-only mark at `cenarepas-icon.svg`). The header's previous tagline "FÁBRICA DE AREPAS" is retired — that described the old, incorrect storefront framing.
- Established palette: terracota (`--landing-brand` #c1502d), maíz/oro (`--landing-accent-gold` #e8b23d), verde hoja (`--landing-accent-green` #5a7a3a), plus a warm "masa" tostada scale for the hero.
- Fonts: Poppins (sans, body/UI), Playfair Display (serif italic, headline accent), Dancing Script (script, decorative).

## Evidence on Hand

- Contact details currently in `ContactSection.jsx` and `SiteFooter.jsx` (phone `+57 300 123 4567`, email `ventas@arepasdelcampo.com`, addresses in Bello Oriente and Aranjuez, Medellín) are **placeholders** — real contact/location data has not been confirmed, and they read as arepa-storefront contact info rather than a software company's. Future work must not present these as confirmed facts and should flag them for replacement (including a full Contacto-section rewrite to a demo-request framing) before launch.
- No testimonials, press, certifications, pricing/plans for CENAREPAS itself, or claimed customer counts exist; do not fabricate any. Masarepas is the one confirmed, real example — do not invent additional example customers.
- `ProductsSection.jsx`'s illustrative arepa product cards (with prices) describe Masarepas's own product catalog, not something CENAREPAS sells — this section still needs to be reframed as part of the Positioning Correction above (e.g., as a demonstration of what a factory's Productos module looks like, rather than a shop window).

## Product Principles

1. One system, one source of truth: sales, production, inventory, customers, and the public marketing site all stay consistent — don't let the landing drift into fictional/demo content now that Masarepas represents a real client.
2. Internal (admin) and public (landing) surfaces serve different jobs — operate vs. persuade — and should be judged by different standards (scanability/consistency vs. clarity/trust/conversion).
3. Preserve the established terracota/maíz/verde-hoja identity and existing landing structure when refining; treat it as incumbent authority, not a blank slate.
4. Never present placeholder contact/location data as real; surface it as a known gap instead.
5. CENAREPAS is the software being sold; Masarepas is the example customer. Copy should read like a B2B product site citing a real case study, never like an arepa storefront.

## Accessibility & Inclusion

No product-specific requirement established yet; default to WCAG 2.2 AA as the working bar (contrast, touch targets, keyboard/focus, form errors) per the review skills in use on this project.
