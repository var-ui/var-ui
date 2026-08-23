# Field parts + native validation

**Date:** 2026-08-21  
**Status:** Proposal  
**Inspired by:** [Base UI Field](https://base-ui.com/react/components/field.md), [Forms handbook](https://base-ui.com/react/handbook/forms.md)  
**Related:** `@var-ui/form` `useForm`; `FieldMeta`; RAC `TextField` / `FieldError`; [base-ui-comparison](../../base-ui-comparison.md)

## Summary

Split `Field` into **compound parts** that associate label, control, description, and error, and that expose **validity data attributes** for CSS. Add a thin `Form` that uses the native Constraint Validation API (focus first invalid field on submit) without replacing `@var-ui/form`.

Keep `FieldMeta` (`label` / `description` / `errorMessage`) on TextField, TextAreaField, Select, NumberInput, etc. Those become convenience wrappers around the same parts.

## Problem

Today:

```tsx
<Field label="Amount" description="In USD" htmlFor="amount" errorMessage={err}>
  <MyCurrencyInput id="amount" />
</Field>
```

```tsx
<TextField label="Email" description="Work email" errorMessage={errors.email} />
```

| Gap                          | Detail                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| **No shared context**        | `Field` does not wire `aria-describedby` / `aria-invalid` onto arbitrary children  |
| **Duplicated chrome**        | Every input reimplements Label + description + FieldError                          |
| **String-only errors**       | `errorMessage` is a React prop; native `required` / `minLength` do not populate it |
| **No validity attrs**        | Recipes cannot style `[data-invalid]` / `[data-dirty]` consistently                |
| **`useForm` is values-only** | `@var-ui/form` does not talk to Constraint Validation or focus-first-invalid       |
| **No Form primitive**        | Submit handlers are ad hoc; no consolidated server-error map like Base UI `Form`   |

Base UI Field is a context:

```tsx
<Field.Root name="email" required>
  <Field.Label>Email</Field.Label>
  <Field.Control type="email" />
  <Field.Description>Work email</Field.Description>
  <Field.Error />
</Field.Root>
```

RAC already does most of this inside `TextField` (`Label`, `Input`, `FieldError`, `Text slot="description"`). The gap is (1) the same chrome for _custom_ controls, (2) a public attribute contract, (3) a Form that plays with native validity.

## Goals

| Goal                    | Detail                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| **Compound Field**      | `Field.Root`, `Field.Label`, `Field.Control`, `Field.Description`, `Field.Error`                    |
| **Keep FieldMeta**      | Existing TextField props unchanged; implemented via parts internally                                |
| **Native constraints**  | `required`, `minLength`, `maxLength`, `pattern`, `type="email"` surface through Field.Error         |
| **Validity attributes** | `data-invalid`, `data-valid`, `data-dirty`, `data-touched`, `data-filled` on Root                   |
| **Form primitive**      | `<Form onSubmit>` prevents native submit, focuses first invalid, supports `errors` map              |
| **useForm stays**       | `@var-ui/form` remains the values/touched/validators helper; Form composes with it                  |
| **Recipes**             | `field` slots already exist (`root`, `label`, `description`, `error`); Control uses control recipes |

## Non-goals (v1)

- Replacing RAC field components with Base UI Field
- Zod/Yup `schemaResolver` (Mantine-style) — `useForm` validators are enough; schema adapters later
- Fieldset / legend component (add when a consumer needs it; `field` recipe can wait)
- Rewriting every input to _only_ expose parts (convenience props stay)
- Async / server validation beyond an `errors` map on Form
- `match` / `min` / `max` for date fields beyond what RAC already does

## Proposed API

### Field parts

```tsx
<Field.Root name="email" invalid={Boolean(errors.email)}>
  <Field.Label>Email</Field.Label>
  <Field.Control>
    <TextField /* or a raw input / RAC control */ />
  </Field.Control>
  <Field.Description>Work email</Field.Description>
  <Field.Error>{errors.email}</Field.Error>
</Field.Root>
```

When `Field.Control` wraps a var-ui `TextField`, **do not** double-render labels. Rule:

- **Either** use `Field.*` chrome around a control that has `label`/`description`/`errorMessage` omitted,
- **Or** use TextField's `FieldMeta` and skip `Field.*`.

`Field.Control` clones the single child and sets `id`, `aria-describedby`, `aria-invalid`, `aria-errormessage` from context. If the child is a var-ui TextField, prefer passing those as props (`id`, `isInvalid`, `errorMessage`) rather than DOM aria on the wrapper.

Simpler v1 that avoids double chrome: **`Field.Control` renders `children` only** (no extra DOM required). Root provides React context. Label's `htmlFor` matches Control's registered id (auto-generated if missing).

```ts
type FieldRootProps = {
  name?: string;
  children: ReactNode;
  className?: string;
  /** Controlled invalid. If omitted, derived from Field.Error presence or native validity. */
  invalid?: boolean;
  /** Called when native validity or child isInvalid changes. */
  onInvalidChange?: (invalid: boolean) => void;
};

type FieldLabelProps = {
  children: ReactNode;
  className?: string;
};

type FieldControlProps = {
  children: ReactElement;
  className?: string;
};

type FieldDescriptionProps = { children: ReactNode; className?: string };

type FieldErrorProps = {
  children?: ReactNode;
  className?: string;
  /** When true, render even if children are empty (reserve space). @default false */
  forceMount?: boolean;
};
```

`Field` default export: keep today's chrome API (`label`, `description`, `errorMessage`, `htmlFor`, `children`) as a **preset** implemented with parts. That avoids breaking `Field` call sites.

```tsx
// Preset (current) — stays
<Field label="Amount" htmlFor="amount" errorMessage={err}>
  <input id="amount" />
</Field>

// Canonical
<Field.Root>
  <Field.Label>Amount</Field.Label>
  <Field.Control>
    <input />
  </Field.Control>
  <Field.Error>{err}</Field.Error>
</Field.Root>
```

Unlike Dialog, **Field default export remains the preset** (it is already a chrome wrapper, not a fake “complete widget”). `Field.Root` is the compound entry. Callable `Field` + `Field.Root` together is OK here because the preset does not collide with Root props (`label` vs `name`/`children` only).

### Validity attributes

On `Field.Root` (and optionally the control element if we own it):

| Attribute       | Meaning                                           |
| --------------- | ------------------------------------------------- |
| `data-invalid`  | Current value fails native or provided invalid    |
| `data-valid`    | Touched/dirty and not invalid (avoid on pristine) |
| `data-dirty`    | Value ≠ default / initial                         |
| `data-touched`  | Blurred at least once                             |
| `data-filled`   | Non-empty (checkbox: checked; select: non-null)   |
| `data-disabled` | Disabled                                          |

Recipes: `field` root may style `&[data-invalid] .error` (already have error slot). Input recipes (`textField`) should style `&[data-invalid] input` / `[aria-invalid=true]` consistently. Prefer **one** hook: `aria-invalid` is already set by RAC; add `data-invalid` on Root for chrome (label color, etc.).

Do not require consumers to className-function-from-state (Base UI). Attributes are enough.

### Native constraint validation

`Field.Control` registers the underlying input with Root via ref / `form` association.

On `invalid` / `change` / `blur` of that input:

1. `input.validity.valid` + `validationMessage`
2. If `Field.Error` has no explicit `children`, show `validationMessage`
3. Explicit `children` on `Field.Error` win (app / `useForm` errors)

RAC TextField already maps `isInvalid` + `FieldError`. For RAC-backed TextField used _without_ Field.Root, no change.

For custom `<input>` inside Field.Control, Root listens to native `invalid` (prevent default bubble if Form handles it).

### Form

```tsx
<Form
  onSubmit={(event, formData) => {
    // only called when native validity passes (or no constraints)
  }}
  errors={{ email: serverError }}
>
  <Field.Root name="email">
    <Field.Label>Email</Field.Label>
    <Field.Control>
      <input name="email" type="email" required />
    </Field.Control>
    <Field.Error />
  </Field.Root>
  <Button type="submit">Save</Button>
</Form>
```

```ts
type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  /** Native submit after preventDefault, only if `form.checkValidity()`. */
  onSubmit?: (event: FormEvent<HTMLFormElement>, data: FormData) => void | Promise<void>;
  /**
   * External / server errors keyed by `name`.
   * Merged into matching Field.Root via context; focuses first matching field.
   */
  errors?: Record<string, string | undefined>;
};
```

Submit handler:

1. `event.preventDefault()`
2. `form.reportValidity()` — browser UI is acceptable; we also sync Field.Error
3. If invalid: focus first `:invalid` (or first Field.Root with `data-invalid`)
4. If valid: `onSubmit(event, new FormData(form))`

`errors` prop: for each key, set that Field's error (overrides native message until the control changes). Same idea as Base UI Form.

Location: `packages/react/src/components/Form.tsx`. Not `@var-ui/form` — Form is a DOM component; `useForm` is state.

### Composition with `useForm`

```tsx
const form = useForm({
  initialValues: { email: '' },
  validate: { email: isEmail('Enter a valid email') },
});

<Form onSubmit={() => void form.handleSubmit(save)()} errors={form.errors}>
  <TextField {...form.getInputProps('email')} label="Email" />
</Form>;
```

No requirement to use Field parts with `useForm`. `getInputProps` already returns `errorMessage` / `isInvalid`. Form's focus-first-invalid still works if fields are native-invalid **or** `aria-invalid="true"`.

Optional later: `getInputProps` also sets `name` and native `required` from rules — **not v1**.

## Recipe / core

`field` recipe already has `root`, `label`, `description`, `error`. Add:

```ts
root: {
  '&[data-invalid]': { /* optional label/error emphasis — keep light */ },
}
```

Do **not** add `tokens.components.field`. Use existing `color.border.danger` / `color.text.danger` if those tokens exist; otherwise current error slot color.

`textField` / `select` / `numberInput`: ensure `[aria-invalid=true]` and RAC `isInvalid` paint the same as Field Root `data-invalid`. Audit once; fix outliers.

## Migration

| Old                                | New                                       |
| ---------------------------------- | ----------------------------------------- |
| `<Field label htmlFor>`            | Unchanged (preset)                        |
| `<TextField label errorMessage>`   | Unchanged                                 |
| Custom control needing aria wiring | `<Field.Root>` + parts                    |
| `<form onSubmit>`                  | Optional `<Form>` for focus-first-invalid |

No breaking change to TextField or `useForm`.

## Tests

- Field preset: `htmlFor` still associates label and input
- Field.Root: auto `id` on control, label `htmlFor` matches, description id on `aria-describedby`
- Native `required` empty submit: `Field.Error` shows `validationMessage`; `data-invalid` on Root
- Explicit `Field.Error` children override native message
- `data-touched` after blur; `data-dirty` after change from default
- Form: invalid submit focuses first invalid control; valid submit calls `onSubmit` with `FormData`
- Form `errors={{ email: 'Taken' }}` appears in that Field.Error
- TextField `FieldMeta` snapshot/behavior unchanged
- `useForm` + Form: existing `getInputProps` tests still pass; add one submit-focus test

## Docs

- `docs/content/components/field.mdx`: parts demo + preset demo
- New `Form` component page (short)
- Handbook **Forms**: native constraints, `useForm`, RHF/TanStack as “spread `getInputProps` / Controller onto TextField” (no first-class adapters in v1)
- Do not promise Zod until someone asks

## Open questions

1. **Field.Control + TextField:** wrapping TextField inside Field.Root is easy to misuse (two labels). Docs should show one pattern per example; consider `dev`-only warning if TextField `label` is set inside Field.Root.
2. **Checkbox / Switch / RadioGroup:** validity attrs on Root still apply; Control child is the RAC root. Confirm `name` grouping for radios with native FormData.
3. **Astro:** Field preset markup can stay; native `required` works without React. Form focus-first-invalid is React-only (document that).
