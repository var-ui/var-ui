import { Button, Field, Form } from '@var-ui/react';

export default function Preview() {
  return (
    <Form>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input name="email" type="email" required />
        </Field.Control>
        <Field.Error />
      </Field.Root>
      <Field.Root name="name">
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input name="name" required />
        </Field.Control>
        <Field.Error />
      </Field.Root>
      <Button type="submit">Save</Button>
    </Form>
  );
}
