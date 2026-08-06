export type MarkupTileProps = {
  className?: string;
  html: string;
};

export function MarkupTile({ className, html }: MarkupTileProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
