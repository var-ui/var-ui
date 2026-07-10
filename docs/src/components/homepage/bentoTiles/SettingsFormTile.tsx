'use client';

import { Button, Checkbox, Field, Heading, RadioGroup, Switch, VStack } from '@var-ui/react';

export type SettingsFormTileProps = {
  className?: string;
};

export function SettingsFormTile({ className }: SettingsFormTileProps) {
  return (
    <div className={className}>
      <VStack gap="md">
        <Heading level={3} size="sm">
          Notification preferences
        </Heading>
        <Switch>Email digest</Switch>
        <Checkbox>Push notifications</Checkbox>
        <RadioGroup
          label="Frequency"
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
          ]}
        />
        <Field description="Applies instantly." htmlFor="quiet-hours-volume" label="Alert volume">
          <input id="quiet-hours-volume" type="range" />
        </Field>
        <Button intent="primary">Save preferences</Button>
      </VStack>
    </div>
  );
}
