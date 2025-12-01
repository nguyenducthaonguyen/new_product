# Healthcheck User Web Development Guideline

This document captures the conventions that govern the current codebase. Keep it close when planning features or reviewing pull requests.

## 1. Project Snapshot

- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript strict mode.
- **Styling**: Tailwind CSS 4 tokens defined in `src/styles/globals.css` and documented in `src/styles/DESIGN_SYSTEM.md`; UI primitives wrap Radix UI through shadcn-style components under `src/components/ui`.
- **State & Data**: Server Actions for mutations, a persisted vanilla Zustand store exposed via `src/providers/auth-store-provider.tsx`, and the shared HTTP client in `src/lib/http-client.ts`.
- **Internationalization**: `next-intl` with locale-aware routing (`src/lib/i18n-routing.ts`) and message bundles in `public/locales`.
- **Tooling**: ESLint (Antfu flat config) as the formatter, Vitest + Testing Library for unit tests, Playwright for e2e, Sentry instrumentation in `src/instrumentation*.ts`.

## 2. Environment & Daily Workflow

### Prerequisites
- Node.js **>= 22.16.0** (enforced through `package.json`).
- npm **>= 10.9.x**.

### Setup
```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` using the validated schema in `src/lib/env.ts`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
# NEXT_PUBLIC_DOCS_DISABLED=true  # set to false to expose docs locally
```

### Common scripts
```bash
npm run dev            # Turbopack dev server
npm run build          # Production build
npm run start          # Serve the production bundle
npm run lint           # ESLint (also formats code)
npm run check-types    # TypeScript project check
npm run test:unit      # Vitest suites
npm run test:e2e       # Playwright (install browsers once via npx playwright install)
```

Husky hooks run lint-staged on commit; keep the tree clean before pushing.

## 3. Project Structure Reference

- `src/app/[locale]/` – App Router entry point. Locale is the top-level segment and groups are split into `(guest)` and `(auth)`. Documentation pages live under `docs/` and can be toggled with `NEXT_PUBLIC_DOCS_DISABLED`.
- `src/actions/` – Server Actions invoked from Client Components (e.g. auth flows). Keep them thin and pure; use shared utilities from `src/lib`.
- `src/components/` – Feature components organised by domain. Reusable primitives belong in `src/components/ui`, demos in `src/components/styleguide`, and compositional layouts in `src/components/templates`.
- `src/providers/` – Client providers (e.g. `AuthStoreProvider`) wired in `src/app/[locale]/layout.tsx`.
- `src/stores/` – Vanilla Zustand stores; export factory functions to support SSR-safe instantiation.
- `src/lib/` – Cross-cutting helpers (`env`, `http-client`, `i18n-navigation`, `utils`, logging, code highlighting).
- `src/config/` – Static app configuration shared across modules.
- `public/assets/` – Design-approved images and icons; always serve through Next.js `Image` when possible.
- `docs/` – Fumadocs-powered component documentation that mirrors the styleguide.
- `tests/` – Vitest unit suites under `tests/unit`, Playwright specs under `tests/e2e`, placeholders ready for expansion.

## 4. Application Architecture

- **Locale-aware layout**: `src/app/[locale]/layout.tsx` applies the Inter font, wraps the tree with `NextIntlClientProvider`, `ThemeProvider`, and `AuthStoreProvider`, and mounts the global `Toaster`.
- **Routing helpers**: Use `routing` from `src/lib/i18n-routing.ts` when generating static params or locale links, and helpers in `src/lib/i18n-navigation.ts` for client-side navigation.
- **Auth flow**: Forms live under `src/components/authentication`, share schemas from `src/entities/user`, and invoke server actions in `src/actions/auth-action.ts`. Auth state persists via `AuthStoreProvider`.
- **HTTP client**: Instantiate `new HttpClient()` or reuse the default export to standardize headers, timeouts, query params, and error handling through `ApiError`.
- **Instrumentation**: Sentry is initialised by `src/instrumentation.ts`/`instrumentation-client.ts`. Do not bypass these entry points when adding monitoring.
- **Route guards**: `src/middleware.ts` coordinates locale-aware auth redirects with `createRouteMatcher`. Update its allow/deny lists whenever you add protected or guest-only paths.
- **Docs rendering**: MDX overrides and code previews are handled by `src/components/styleguide/*`; prefer extending existing demos before creating new primitives.

## 5. Styling & Design Tokens

- Tailwind CSS 4 with `@theme` variables is the single source of truth. Extend tokens in `src/styles/globals.css` and document additions in `src/styles/DESIGN_SYSTEM.md`.
- Use the `cn` helper (`@/lib/utils`) to merge class names, and `class-variance-authority` to define variantable components (`src/components/ui/button.tsx` pattern).
- Keep class usage semantic: prefer `bg-primary` over raw hex values, leverage spacing scales instead of arbitrary values, and follow the typography scale from the design system.
- All components that wrap Radix primitives live in `src/components/ui`; reuse them instead of introducing ad-hoc elements.
- Assets must originate from the design source. Store images in `public/assets/images` and provide descriptive `alt` text.
- When a primitive should render another element (e.g. `Button` with `next/link`), pass `asChild` to reuse the existing styling instead of recreating variants inline.


**DO** keep class names token-driven and reusable:

```tsx
// DO: use semantic tokens and shared primitives
import { Button } from '@/components/ui/button';

export function SubmitButton() {
  return (
    <Button variant="secondary" className="w-full sm:w-auto">
      Save changes
    </Button>
  );
}
```

**DON'T** hard-code measurements or duplicate existing primitives:

```tsx
// DON'T: avoid ad-hoc classes and raw elements
export function SubmitButton() {
  return (
    <button className="bg-[#2E6C38] px-[18px] py-[9px] rounded-md text-white">
      Save changes
    </button>
  );
}
```

### Form Component Patterns

**DO** implement consistent form patterns with proper error handling:

```tsx
// DO: consistent form structure with proper error handling
export function LoginForm() {
  const t = useTranslations();
  const { setUser } = useAuthStore((state) => state);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = (payload: LoginFormData) => {
    startTransition(async () => {
      const { success, data, errorCode } = await loginAction(payload);

      if (success) {
        setUser(data as User);
        router.push('/');
        return;
      }

      form.setError('root', {
        message: t(`errors.${errorCode ?? 'somethingWentWrong'}`)
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {form.formState.errors.root && (
          <Alert className="bg-red-lightest border-none">
            <AlertDescription className="text-red-darkest">
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

**DON'T** use inconsistent error handling or hard-coded messages:

```tsx
// DON'T: inconsistent error handling
export function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginAction(data);
      if (!result.success) {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };
}
```

## 6. Coding Standards

- **TypeScript first**: Strict mode is enabled. Reuse domain types from `src/entities/*` and derive form schemas with Zod (`createLoginSchema` pattern). Export types when they are consumed across modules.
- **Formatting**: ESLint with `@antfu/eslint-config` is the code formatter. Semicolons are required, indentation is 2 spaces, trailing commas follow ESLint defaults. Run `npm run lint` before committing.
- **Imports**: Use `@/` for modules inside `src`, `@/public/` for static assets, and `~` for root-level tooling. Keep relative imports for deep siblings only when it improves clarity.
- **Naming**:
  - Components and classes: `PascalCase` (`LoginForm`).
  - Files and directories: kebab-case (`reset-password-form.tsx`, `forgot-password/`).
  - Variables, functions, hooks: `camelCase`, with hooks prefixed by `use`.
  - Constants and env keys: `UPPER_CASE`.
- **React practices**: Prefer Client Components only when required (`'use client'` marker). Co-locate hook logic in `src/hooks`. Clean up effects, memoize heavy computations, and rely on `startTransition` for async form submits.
- **Error handling**: Surface API errors using translated messages (`useTranslations`) and the shared alert components. Throw `ApiError` from server actions when the client needs to branch on error codes.
- **Accessibility**: Follow Radix semantics, label inputs with `FormLabel`, ensure interactive elements have focus states, and use `aria-*` props provided by UI primitives.
- **Logging**: Create namespaced loggers via `Logger.create('module')`. Log success paths at `info`, capture recoverable issues with `warn`, and forward caught exceptions together with the original error to `logger.error`.
- **Environment-sensitive checks**: Use `useMemo`/`useEffect` when deriving values from `searchParams` (see `LoginForm`) to avoid repeated parsing and to enforce guard rails (e.g. allow only same-origin `redirect_uri`).

## 7. Forms & Validation

- Compose forms with `react-hook-form` components from `src/components/ui/form.tsx`.
- Validation schemas live alongside entities (`src/entities/user.ts`) and rely on Zod; pass translations in schema factories to keep messages locale-aware.
- Provide optimistic feedback with `useTransition` (spinners, disabled buttons) and surface field-level errors through `FormMessage`.
- Default `useForm` to `mode: 'onChange'` so validations fire consistently with the existing UX.
- Prefer shared inputs such as `PasswordField`, `DatePicker`, `RadioGroup`, and propagate `required` to `FormLabel` so the asterisk renders automatically.
- When the backend returns field errors, map them with `useFormErrors(setError, t, visibleFields)` and fall back to `form.setError('root', ...)` paired with `<Alert>` for non-field failures.

**DO** co-locate schema, translations, and feedback:

```tsx
// DO: connect react-hook-form with translated Zod schema
const form = useForm<LoginFormData>({
  resolver: zodResolver(createLoginSchema(t)),
  defaultValues: { identifier: '', password: '' },
});
```

**DON'T** skip validation layers or localisation:

```tsx
// DON'T: avoid manual validation and hard-coded copy
const form = useForm({
  resolver: async values => {
    if (!values.identifier) throw new Error('Identifier is required');
    return { values, errors: {} };
  },
});
```

**DO** pipe server validation back into the form:

```tsx
const { setFormErrors } = useFormErrors(
  form.setError,
  tErrors,
  ['email', 'phone', 'password'],
);

const { success, errorCode, errors } = await signUpAction(payload);
const hasFieldErrors = setFormErrors(errors);
if (!hasFieldErrors) {
  form.setError('root', { message: errorCode ? tErrors(errorCode) : t('errors.somethingWentWrong') });
}
```

## 8. Internationalization & Content

- Locale data resides in `public/locales/<locale>/`. JSON files cover UI copy, while markdown files (`terms.md`, `privacy.md`) supply long-form content.
- Any new route or component copy should add keys to the locale JSON and re-export them from `public/locales/index.ts`.
- Use `useTranslations()` with fully qualified namespaces (`t('login.submit.text')`) to avoid collisions.
- The locale segment is mandatory for navigation. Use helpers in `src/lib/i18n-navigation.ts` (`createLocalizedPathname`) rather than hard-coded paths.

## 9. State, Data Fetching & Side Effects

- Keep server mutations in `src/actions/*`. They run on the server by default; guard them with input schemas and revalidate caches explicitly if needed.
- Client state beyond transient UI belongs in Zustand stores housed in `src/stores`. Expose selectors through provider hooks (see `useAuthStore`).
- Prefer `fetch` through `HttpClient` instead of ad-hoc calls to ensure shared timeout, headers, and error-normalisation.
- Treat async flows as progressive enhancement: show loading placeholders, handle `ApiError.status` cases, and translate error codes via `next-intl`.
- Server actions should return `{ success, data?, errorCode?, errors? }` and catch `ApiError` to expose `error.data?.error_code` and `error.data?.errors`. Propagate authentication tokens through `setAuthTokens` when responses contain them.
- Use the shared `Logger` inside actions (`logger.error('context', error)`) to keep server logs structured.
- `HttpClient` exposes `get/post/...` plus helpers such as `setAuthToken`; prefer these over manual `fetch` to inherit timeouts, JSON parsing, and consistent logging.
- Persisted stores (`createAuthStore`) must be accessed through providers—call `useAuthStore(selector)` instead of importing the vanilla store directly to stay SSR-safe.

## 10. Testing & Quality Gates

- Unit tests (`*.test.tsx`) belong next to the code they cover or under `tests/unit`. Use Vitest with Testing Library and the custom `vitest-fail-on-console` setup to catch console noise.
- Playwright specs live in `tests/e2e`; reuse the locale helpers to keep scenarios language-agnostic.
- Mandatory pre-merge checks: `npm run lint`, `npm run check-types`, `npm run test:unit`. Run `npm run test:e2e` when modifying flows covered by e2e specs.
- Snapshot usage should be deliberate; prefer explicit assertions over broad snapshots.

## 11. Documentation & Knowledge Sharing

- Update `docs/components` when adding or altering UI primitives so the styleguide stays trustworthy.
- Keep this guideline in sync with structural or tooling changes. When deviating from the established pattern, document the rationale in the corresponding section.

## 12. Shipping Checklist

1. **Code Quality**: Confirm lint, type, and unit test suites pass locally.
2. **Internationalization**: Verify locale coverage (copy and routing) for both English and Japanese.
3. **Design System**: Validate the UI against design tokens and ensure assets are sourced correctly.
4. **Routing**: Confirm new routes are wired into navigation and respect auth guards.
5. **Error Handling**: Verify error messages are properly localized and user-friendly.
6. **Security**: Ensure no sensitive data is exposed in error messages or client state.
7. **Accessibility**: Test keyboard navigation and screen reader compatibility.
8. **Performance**: Check Core Web Vitals and bundle size impact.
9. **Cross-browser**: Test on Chrome, Firefox, Safari, and Edge.
