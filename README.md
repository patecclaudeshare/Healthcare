# Willowbrook Family Clinic

A static, single-page marketing site for a healthcare clinic — hero section, services, patient testimonials, and an appointment enquiry form.

**Live site:** https://patecclaudeshare.github.io/Healthcare/

## Tech stack

No framework, no build step, no package manager — just three hand-written files:

- `index.html` — all markup
- `styles.css` — all styling
- `script.js` — all behavior

## Running locally

Open `index.html` directly in a browser (double-click, or `Start-Process index.html` on Windows). There is no dev server, bundler, or test suite — changes are visible on a page refresh.

## Project structure

The three files are organized into parallel, numbered sections with matching HTML comment headers (e.g. `<!-- ===== HERO SECTION ===== -->` in HTML corresponds to `/* 3. HERO SECTION */` in CSS). When editing a section, check all three files for the corresponding block.

`index.html`, top to bottom: navbar → hero → services → testimonials → enquiry/contact form (`#contact`) → footer. Nav links and the hero's CTA buttons anchor-link to section IDs (`#home`, `#services`, `#testimonials`, `#contact`); smooth scrolling is done via CSS `scroll-behavior: smooth`, not JS.

`styles.css`:
- CSS custom properties for the color palette and shared tokens live under `:root` (`--color-primary`, `--color-accent`, etc.) — change the palette there, not per-component.
- Mobile-first, with `min-width` breakpoints at `640px`, `768px`, and `1024px` added per-section as needed.
- `.fade-in` is a generic scroll-reveal class applied across every section, driven by the `IntersectionObserver` in `script.js`.

`script.js`: mobile nav toggle, scroll fade-in (`IntersectionObserver`), enquiry form validation/submission, footer year injection. The form's `fields` object is the single place field-level validators and error messages are defined.

The enquiry form doesn't POST anywhere yet — on successful validation it `console.log`s the collected `formData`. There's a marked comment block in `script.js` showing where a real `fetch()` call to a backend endpoint would go.

## Deployment

Pushes to `main` are automatically deployed to GitHub Pages via the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
