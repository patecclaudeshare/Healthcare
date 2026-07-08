# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A static, single-page healthcare clinic marketing site. No framework, no build step, no package manager — just three hand-written files:

- `index.html` — all markup
- `styles.css` — all styling
- `script.js` — all behavior

## Running / previewing

Open `index.html` directly in a browser (double-click, or `Start-Process index.html` on Windows). There is no dev server, bundler, or test suite — changes are visible on a page refresh.

## Architecture

The three files are organized into parallel, numbered sections with matching HTML comment headers (e.g. `<!-- ===== HERO SECTION ===== -->` in HTML corresponds to `/* 3. HERO SECTION */` in CSS). When editing a section, check all three files for the corresponding block rather than searching blindly.

`index.html` sections, top to bottom: navbar → hero → services → testimonials → enquiry/contact form (`#contact`) → footer. Nav links and the hero's CTA buttons anchor-link to section IDs (`#home`, `#services`, `#testimonials`, `#contact`); smooth scrolling is done via CSS `scroll-behavior: smooth` on `html`, not JS.

`styles.css` conventions:
- CSS custom properties for the color palette and shared tokens are declared once at the top under `:root` (`--color-primary`, `--color-accent`, etc.) — change the palette there, not per-component.
- Mobile-first: base rules target small screens, with `min-width` breakpoints at `640px`, `768px`, and `1024px` added per-section as needed.
- `.fade-in` is a generic scroll-reveal class applied to elements across every section; it's driven by the `IntersectionObserver` in `script.js`, not by CSS alone.

`script.js` sections: mobile nav toggle, scroll fade-in (`IntersectionObserver`), enquiry form validation/submission, footer year injection. The form's `fields` object in the validation section is the single place field-level validators and error messages are defined — add new form fields there rather than writing ad hoc validation logic inline.

The enquiry form does not POST anywhere; on successful validation it `console.log`s the collected `formData` object. There's a clearly marked comment block in `script.js` showing where a real `fetch()` call to a backend endpoint would go.
