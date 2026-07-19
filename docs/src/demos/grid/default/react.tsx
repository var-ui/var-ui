import { Card, Grid } from '@var-ui/react';

export default function Preview() {
  return (
    <Grid columns={2} gap="md">
      <Card title="Static card">Plain content surface.</Card>
      <Card title="Another card">Second grid cell.</Card>
    </Grid>
  );
}
