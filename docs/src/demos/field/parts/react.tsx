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
