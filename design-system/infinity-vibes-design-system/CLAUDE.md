# Infinity Vibes design system

This folder is the brand's design system. Before building or styling any UI:

1. Read `README.md` (brand rules: colours, type, logo, do/don't).
2. Use the tokens in `tokens.css` (CSS variables + type classes). Never hard-code hex values, font sizes or radii; use `var(--blue)`, `var(--radius-pill)`, `.display-xl`, etc. `tokens.json` is the same data for tooling (e.g. a Tailwind theme).
3. Only the five brand colours (blue, lime, white, light-grey, black) plus the semantic tokens built on them.
4. Fonts: Galano Grotesque (titles, licensed, not included yet, falls back to Poppins 800) and Poppins (everything else), self-hosted from `fonts/`.
5. Logo: `logos/badge-main.png` everywhere; black/outline versions only for one-colour use. Never add shadows or glows, never stretch or recolour.
6. Flat UI: no drop shadows, no gradients. Rounded corners (radius-lg cards, radius-pill buttons and date pills).
7. `components/reference-components.css` and `reference-props.d.ts` describe the Headline, Button, DatePill and DateCard patterns; rebuild them as real components in the site's framework.
