import { Typeahead, IconProvider } from '@var-ui/react';

const FRUIT_OPTIONS = [
  { id: 'apple', label: 'Apple' },
  { id: 'plum', label: 'Plum' },
  { id: 'orange', label: 'Orange' },
];

export default function Preview() {
  return (
    <IconProvider icons={{}}>
      <Typeahead
        label="Fruit"
        description="Start typing to filter the list."
        errorMessage="Choose a fruit to continue."
        options={FRUIT_OPTIONS}
      />
    </IconProvider>
  );
}
