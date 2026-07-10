'use client';

import { AspectRatio, Card, Carousel, designTokens as t, Text, VStack } from '@var-ui/react';

const SLIDES = ['Onboarding', 'Billing', 'Reports', 'Integrations', 'Security'];

export type CarouselStripTileProps = {
  className?: string;
};

export function CarouselStripTile({ className }: CarouselStripTileProps) {
  return (
    <div className={className}>
      <Carousel itemWidth="180px" label="Product tour">
        {SLIDES.map((slide) => (
          <Card key={slide} title={slide}>
            <VStack gap="xs">
              <AspectRatio ratio={16 / 9} style={{ background: t.color.background.subtle }} />
              <Text size="sm" tone="secondary">
                Scroll-snap slide.
              </Text>
            </VStack>
          </Card>
        ))}
      </Carousel>
    </div>
  );
}
