import { Combobox, IconProvider } from '@var-ui/react';

const FRUIT_OPTIONS = [
  { id: 'apple', label: 'Apple' },
  { id: 'plum', label: 'Plum' },
  { id: 'orange', label: 'Orange' },
];

export default function Preview() {
  return (
    <IconProvider icons={{}}>
      <Combobox.Root aria-label="Favorite fruit">
        <Combobox.Label>Favorite fruit</Combobox.Label>
        <Combobox.Input placeholder="Search fruits…" clearable />
        <Combobox.Popover>
          <Combobox.ListBox items={FRUIT_OPTIONS}>
            {(option) => (
              <Combobox.Item id={option.id} textValue={option.label}>
                {option.label}
              </Combobox.Item>
            )}
          </Combobox.ListBox>
        </Combobox.Popover>
      </Combobox.Root>
    </IconProvider>
  );
}
