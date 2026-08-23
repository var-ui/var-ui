# Field parts + native validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compound `Field` parts with validity data attributes, native constraint validation messages, and a React `Form` that focuses the first invalid field — without replacing `@var-ui/form` or `FieldMeta` on TextField.

**Architecture:** `Field` default export stays today's chrome preset. `Field.Root` provides context (ids, invalid, dirty/touched/filled). `Field.Control` clones a **single native-ish child** (input/select/textarea or a component that spreads those DOM props). `Form` is a `<form>` in `@var-ui/react`, not `@var-ui/form`. TextField keeps `label`/`description`/`errorMessage`; docs tell people not to nest TextField-with-label inside `Field.Root`.

**Tech Stack:** React 19, React Aria (unchanged on TextField), Constraint Validation API, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-21-field-parts-validation-design.md`

## Global Constraints

- Do not add `@base-ui/react`. Do not add Zod.
- `Field` default export remains the preset (`label`, `htmlFor`, `errorMessage`, `children`).
- `TextField` / `TextAreaField` / `Select` / `NumberInput` `FieldMeta` props stay.
- Do not rewrite every input to parts-only.
- `Form` lives in `packages/react/src/components/Form.tsx`. `useForm` stays in `@var-ui/form`.
- No `tokens.components.field`. Use existing `field` error color (`t.color.tone.danger.foreground`).
- v1 Control targets native `HTMLInputElement` (and select/textarea). RAC TextField inside `Field.Control` is documented as unsupported for auto id wiring (use FieldMeta instead). Dev-only `console.warn` if `Field.Root` sees a child with a `label` prop.
- Astro: preset markup unchanged; `Form` is React-only (document that).
- Run `vp test run packages/react packages/form` after code tasks.

## File map

| File                                            | Responsibility                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| `packages/react/src/components/Field.tsx`       | Preset + `Field.Root` / `Label` / `Control` / `Description` / `Error` |
| `packages/react/src/components/Field.test.tsx`  | Preset + parts + validity attrs                                       |
| `packages/react/src/components/Form.tsx`        | Native submit + errors map + focus first invalid                      |
| `packages/react/src/components/Form.test.tsx`   | Submit / focus / server errors                                        |
| `packages/react/src/components/index.ts`        | Export Form + Field part types                                        |
| `docs/content/components/field.mdx`             | Parts + preset demos                                                  |
| `docs/content/components/form.mdx`              | New page                                                              |
| `docs/src/data/components.ts`                   | Form entry                                                            |
| `docs/src/demos/field/parts/` + `form/default/` | Demos                                                                 |

---

### Task 1: Field context + compound parts (preset reimplemented)

**Files:**

- Modify: `packages/react/src/components/Field.tsx`
- Modify: `packages/react/src/components/Field.test.tsx`

**Interfaces:**

```ts
type FieldRootProps = {
  name?: string;
  children: ReactNode;
  className?: string;
  invalid?: boolean;
  onInvalidChange?: (invalid: boolean) => void;
};

type FieldLabelProps = { children: ReactNode; className?: string };
type FieldControlProps = { children: ReactElement; className?: string };
type FieldDescriptionProps = { children: ReactNode; className?: string };
type FieldErrorProps = {
  children?: ReactNode;
  className?: string;
  forceMount?: boolean;
};
```

Context (module-private):

```ts
type FieldContextValue = {
  name?: string;
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  setNativeInvalid: (invalid: boolean, message: string) => void;
  describedBy: string | undefined;
};
```

`useId()` for `controlId`. Label: `<label htmlFor={controlId}>`. Control: `cloneElement(children, { id: children.props.id ?? controlId, name: children.props.name ?? name })`. Description/Error: render with their ids; Root sets `aria-describedby` on the cloned control when those nodes exist (`[descriptionId, invalid ? errorId : undefined].filter(Boolean).join(' ')`). Also set `aria-invalid={invalid || undefined}` and `aria-errormessage={invalid ? errorId : undefined}`.

Preset:

```tsx
export function Field({
  label,
  description,
  errorMessage,
  htmlFor,
  className,
  children,
}: FieldProps) {
  return (
    <FieldRoot className={className} invalid={Boolean(errorMessage)}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <FieldControl>
        {isValidElement(children) ? (
          cloneElement(children, { id: htmlFor ?? children.props.id })
        ) : (
          <></>
        )}
      </FieldControl>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </FieldRoot>
  );
}

export const FieldNamespace = Object.assign(Field, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});
```

Export `Field` as the assigned object (like Accordion) so `Field.Root` works **and** `<Field label>` still works. `FieldProps` stays the preset props.

Existing tests must keep passing (`getByLabelText('Amount')`, description class `var-ui-field__description`, `role="alert"`).

- [ ] **Step 1: Add a parts test** (keep old tests):

```tsx
it('associates Field.Label with Field.Control via generated id', () => {
  render(
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Field.Control>
        <input />
      </Field.Control>
    </Field.Root>,
  );
  expect(screen.getByLabelText('Email')).toBeTruthy();
});
```

- [ ] **Step 2: Run `vp test run packages/react/src/components/Field.test.tsx`** — parts test FAIL.

- [ ] **Step 3: Implement context + parts; preset uses parts.** If `htmlFor` is set on the preset, pass it as `id` on the child (preserve today's explicit id).

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): add Field.Root compound parts while keeping the chrome preset

Custom controls can share label/description/error wiring without copying FieldMeta into every input.
EOF
)"
```

---

### Task 2: Validity data attributes + native `validationMessage`

**Files:**

- Modify: `packages/react/src/components/Field.tsx`
- Modify: `packages/react/src/components/Field.test.tsx`
- Modify: `packages/core/src/components/field.ts`

**Interfaces:**

On `Field.Root` DOM node:

| attr            | when                                                     |
| --------------- | -------------------------------------------------------- |
| `data-invalid`  | controlled `invalid` or native invalid or error children |
| `data-valid`    | touched or dirty, and not invalid                        |
| `data-dirty`    | value changed from defaultValue/defaultChecked           |
| `data-touched`  | blurred once                                             |
| `data-filled`   | non-empty string / checked / selected                    |
| `data-disabled` | child `disabled`                                         |

Control listens to `blur`, `input`/`change`, and `invalid`. On those events, read `el.validity.valid` and `el.validationMessage`. Store `nativeMessage` in context. `Field.Error` renders `children` if provided, else `nativeMessage`. Explicit children always win.

Recipe: in `field` root, add:

```ts
'&[data-invalid]': {
  // no extra color beyond existing error slot — optional:
  // leave empty object omitted; only add if we need a hook for consumers.
},
```

Skip empty `'&[data-invalid]': {}`. Instead document attributes. If we want a visible hook, set label color:

```ts
'&[data-invalid]': {
  // label uses the error var when invalid
},
```

Do **not** break the error slot. Add:

```ts
root: {
  ...chrome.root,
  minWidth: '240px',
  '&[data-invalid]': {
    [`& .${/* cannot reference generated class easily */}`]: {},
  },
},
```

Simplest recipe change that is testable: none required for v1 if attributes are on the DOM. **Still add** a comment-free rule that does not change computed colors — skip recipe change unless we can target `[data-invalid]` without breaking snapshots.

Decision locked: **do not change field recipe colors in v1**; attributes are the styling hook. Skip `field.ts` unless snapshot-safe.

- [ ] **Step 1: Tests**

```tsx
it('sets data-invalid and shows native validationMessage on submit-invalid', async () => {
  render(
    <form>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input required />
        </Field.Control>
        <Field.Error />
      </Field.Root>
      <button type="submit">Go</button>
    </form>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Go' }));
  const root = screen.getByLabelText('Email').closest('[data-invalid], .var-ui-field__root');
  // After invalid event:
  expect(
    screen.getByLabelText('Email').closest('.var-ui-field__root')?.hasAttribute('data-invalid'),
  ).toBe(true);
  expect(screen.getByRole('alert').textContent?.length).toBeGreaterThan(0);
});

it('lets explicit Field.Error children win over native message', async () => {
  render(
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <Field.Control>
        <input required />
      </Field.Control>
      <Field.Error>Taken</Field.Error>
    </Field.Root>,
  );
  expect(screen.getByRole('alert').textContent).toBe('Taken');
});

it('sets data-touched after blur', async () => {
  render(
    <Field.Root>
      <Field.Label>Name</Field.Label>
      <Field.Control>
        <input />
      </Field.Control>
    </Field.Root>,
  );
  const input = screen.getByLabelText('Name');
  await userEvent.click(input);
  await userEvent.tab();
  expect(input.closest('.var-ui-field__root')?.hasAttribute('data-touched')).toBe(true);
});
```

Native submit may show a browser bubble and **not** fire React submit in jsdom. Prefer dispatching `invalid` via `input.checkValidity()` / `form.reportValidity()` in the test:

```ts
screen.getByLabelText('Email').checkValidity();
```

jsdom implements `checkValidity` and fires `invalid` if `required` and empty.

- [ ] **Step 2: FAIL then implement dirty/touched/filled/invalid state in Root.** `defaultValue` captured on mount for dirty.

- [ ] **Step 3: PASS + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): expose Field validity data attributes and native constraint messages

Root publishes data-invalid/dirty/touched so CSS can style chrome; Field.Error falls back to validationMessage.
EOF
)"
```

---

### Task 3: `Form` component

**Files:**

- Create: `packages/react/src/components/Form.tsx`
- Create: `packages/react/src/components/Form.test.tsx`
- Modify: `packages/react/src/components/index.ts`

**Interfaces:**

```ts
type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  onSubmit?: (event: FormEvent<HTMLFormElement>, data: FormData) => void | Promise<void>;
  errors?: Record<string, string | undefined>;
};
```

```tsx
export const FormErrorsContext = createContext<Record<string, string | undefined>>({});
```

`Field.Root` reads `FormErrorsContext[name]` and treats it as an explicit error (sets invalid, feeds `Field.Error` when Error has no children).

Submit:

```ts
function onSubmitInternal(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = event.currentTarget;
  const valid = form.checkValidity();
  if (!valid) {
    const first =
      form.querySelector<HTMLElement>('[aria-invalid="true"]') ??
      form.querySelector<HTMLElement>(':invalid');
    first?.focus();
    return;
  }
  void onSubmit?.(event, new FormData(form));
}
```

Also treat `errors` keys: if `errors.email` is set, invalid even when native-valid; on submit, focus `[name="email"]`.

- [ ] **Step 1: Tests**

```tsx
it('does not call onSubmit when required input is empty and focuses the control', async () => {
  const onSubmit = vi.fn();
  render(
    <Form onSubmit={onSubmit}>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input name="email" required />
        </Field.Control>
        <Field.Error />
      </Field.Root>
      <button type="submit">Save</button>
    </Form>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(onSubmit).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(screen.getByLabelText('Email'));
});

it('calls onSubmit with FormData when valid', async () => {
  const onSubmit = vi.fn();
  render(
    <Form onSubmit={onSubmit}>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input name="email" defaultValue="ada@example.com" />
        </Field.Control>
      </Field.Root>
      <button type="submit">Save</button>
    </Form>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(onSubmit).toHaveBeenCalled();
  const data = onSubmit.mock.calls[0][1] as FormData;
  expect(data.get('email')).toBe('ada@example.com');
});

it('shows Form errors map on the matching Field', () => {
  render(
    <Form errors={{ email: 'Taken' }}>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input name="email" />
        </Field.Control>
        <Field.Error />
      </Field.Root>
    </Form>,
  );
  expect(screen.getByRole('alert').textContent).toBe('Taken');
});
```

- [ ] **Step 2: FAIL then implement Form + consume errors in Field.Root** (Task 1 Root must read context; add that in this task if missing).

- [ ] **Step 3: PASS**

- [ ] **Step 4: Add `packages/form` integration test** in `packages/form/src/useForm.test.ts` **or** a react test that imports both:

```tsx
it('useForm errors work with Form errors prop', async () => {
  // renderHook useForm, Form errors={result.current.errors}, change email to invalid, submit
});
```

Keep it in `packages/react/src/components/Form.test.tsx` to avoid a new form↔react test dependency direction. `@var-ui/form` is a peer-less package; react tests can import `useForm` from `@var-ui/form` if the react package can see it in the workspace. If `packages/react` does not depend on `@var-ui/form`, **do not add the dependency**. Skip the integration test and document composition in mdx only.

Check `packages/react/package.json` — if `@var-ui/form` is not a dependency, skip the integration test (constraint).

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): add Form with native validity and server error map

Prevent submit when checkValidity fails, focus the first invalid control, and push errors into Field.Root by name.
EOF
)"
```

---

### Task 4: Docs — Field parts demo + Form page

**Files:**

- Create: `docs/src/demos/field/parts/react.tsx`
- Create: `docs/src/demos/field/parts/snippets.ts` (follow `docs/src/demos/field/default/snippets.ts`)
- Create: `docs/src/demos/form/default/react.tsx`
- Modify: `docs/src/demos/types.ts` — add `'field.parts' | 'form.default'`
- Modify: `docs/src/demos/registry.ts`, `reactDemoMap.ts`, `reactOnlyDemoIds.ts` (both React-only)
- Modify: `docs/content/components/field.mdx` — add “Parts” demo; note do not pass `label` on TextField inside `Field.Root`
- Create: `docs/content/components/form.mdx`
- Modify: `docs/src/data/components.ts` — Form entry (`slug: 'form'`, category: data input / overlay adjacent — use **data input** if that category exists, else same category as Field)
- Modify: `docs/src/data/navigation.test.ts` if it snapshots component lists

Field parts demo:

```tsx
import { Button, Field } from '@var-ui/react';

export default function Preview() {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Field.Root name="amount">
        <Field.Label>Amount</Field.Label>
        <Field.Control>
          <input name="amount" required />
        </Field.Control>
        <Field.Description>In USD</Field.Description>
        <Field.Error />
      </Field.Root>
      <Button type="submit">Save</Button>
    </form>
  );
}
```

Form demo uses `<Form>` + two fields + submit.

Accessibility blurb: Form is React-only; native `required` works in Astro without `Form`.

- [ ] **Step 1: Add demos + mdx + registry.** Run `vp test run docs/src/demos/completeness.test.ts docs/src/data/navigation.test.ts`.

- [ ] **Step 2: Fix whatever completeness/navigation tests fail** (update snapshots with `vp test run docs/src/data/navigation.test.ts -u` only if the test is snapshot-based and the new link is correct).

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: add Field parts and Form component pages

Show compound Field chrome and native-constraint Form next to the existing preset demo.
EOF
)"
```

---

### Task 5: Changeset + check

**Files:**

- Create: `.changeset/field-form.md`

```md
---
'@var-ui/react': minor
---

Add compound `Field.Root` / `Label` / `Control` / `Description` / `Error` (preset `Field` unchanged) with validity data attributes and native `validationMessage`. New `Form` component focuses the first invalid field and accepts a server `errors` map. `@var-ui/form` `useForm` is unchanged.
```

If Task 2 changed `@var-ui/core` after all, add `'@var-ui/core': patch`.

- [ ] **Step 1: Changeset**

- [ ] **Step 2: `vp check` && `vp test run packages/react packages/form docs`**

- [ ] **Step 3: Commit changeset**

---

## Spec coverage

| Spec item                     | Task                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| Compound Field parts          | 1                                                                                                       |
| Preset Field unchanged        | 1                                                                                                       |
| Validity attrs                | 2                                                                                                       |
| Native constraint message     | 2                                                                                                       |
| Explicit Error wins           | 2                                                                                                       |
| Form + focus first invalid    | 3                                                                                                       |
| Form `errors` map             | 3                                                                                                       |
| FieldMeta / useForm unchanged | constraint                                                                                              |
| Docs                          | 4                                                                                                       |
| No Zod / Fieldset             | constraint                                                                                              |
| Double-label warning          | Task 1: `console.warn` in development when `Field.Root` children include an element with a `label` prop |
