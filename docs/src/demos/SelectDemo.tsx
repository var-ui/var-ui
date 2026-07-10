'use client';

import { Grid, Select } from '@var-ui/react';

const FRUIT_OPTIONS = [
  { id: 'apple', label: 'Apple' },
  { id: 'plum', label: 'Plum' },
  { id: 'orange', label: 'Orange' },
  { id: 'grape', label: 'Grape' },
];

export function SelectDemo() {
  return (
    <Select
      label="Fruit"
      options={[
        { id: 'apple', label: 'Apple' },
        { id: 'plum', label: 'Plum' },
      ]}
    />
  );
}

export function SelectOptionsDemo() {
  return (
    <Grid columns={2} gap="lg">
      <Select label="Fruit" options={FRUIT_OPTIONS} />
      <Select label="Favorite fruit" placeholder="Choose a fruit…" options={FRUIT_OPTIONS} />
    </Grid>
  );
}
