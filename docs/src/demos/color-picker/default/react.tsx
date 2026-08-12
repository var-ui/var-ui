import { ColorPicker, ColorSwatch, HStack } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [color, setColor] = useState('#228be6');
  return (
    <div style={{ display: 'grid', gap: 12, width: 260 }}>
      <ColorPicker value={color} onChange={setColor} />
      <HStack gap="sm">
        <ColorSwatch
          color="#228be6"
          selected={color === '#228be6'}
          aria-label="Blue"
          onClick={() => setColor('#228be6')}
        />
        <ColorSwatch
          color="#40c057"
          selected={color === '#40c057'}
          aria-label="Green"
          onClick={() => setColor('#40c057')}
        />
      </HStack>
    </div>
  );
}
