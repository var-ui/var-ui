import { Select } from '@var-ui/react';

export default function Preview() {
  return (
    <Select.Root>
      <Select.Label>Assignee</Select.Label>
      <Select.Trigger placeholder="Select a person…" />
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="ada" textValue="Ada Lovelace">
            <span aria-hidden>A</span>
            Ada Lovelace
          </Select.Item>
          <Select.Item id="grace" textValue="Grace Hopper">
            <span aria-hidden>G</span>
            Grace Hopper
          </Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
  );
}
