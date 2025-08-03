export type ImagePosition = {
  readonly percentX: number;
  readonly percentY: number;
};

export type ImageItem = {
  readonly id: string;
  readonly label: string;
  readonly rectangle: [ImagePosition, ImagePosition];
  readonly linkedWorldItemId: string | null | undefined;
};
