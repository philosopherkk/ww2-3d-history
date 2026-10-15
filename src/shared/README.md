# Shared classroom modules

`src/shared/` does not import WWII data, components, geography, or app state. Copy these three folders into another lab and keep that boundary:

- `i18n/` — English and Traditional Chinese catalogs, `t(key, vars?)`, `useLocale`, `formatNumber`, `formatDate`, `formatRange`, and `pickText` for `{ en, zhHant?, zhHantReviewed? }`.
- `evidence/` — `EvidenceBadge` and `SourcePanel`. Pass a `Measured` value. Display levels are `sourced`, `estimated`, `disputed`, `order_of_magnitude`, `unverified`, plus the stored word `unsure` when a dataset still uses it.
- `urlState/` — generic query-string codec and `history` helpers (`replaceState` while scrubbing, `pushState` on selection). The atlas binding lives in `src/state/urlSync.ts` and is not part of the copy.

Styles for badges are in `evidence/evidence.css`. Locale catalogs satisfy `typeof en`, so a missing Traditional Chinese key fails the typecheck.

## Physics example

An energy figure that is only a classroom scale uses `order_of_magnitude`, not `sourced`:

```tsx
import { EvidenceBadge } from './evidence'

<EvidenceBadge
  level="order_of_magnitude"
  onClick={() => {
    /* open SourcePanel with method: '≈10¹⁴ J' */
  }}
/>
```

```ts
const yieldScale = {
  value: 1e14,
  unit: 'J',
  level: 'order_of_magnitude' as const,
  method: '≈10¹⁴ J, classroom scale only',
}
```
