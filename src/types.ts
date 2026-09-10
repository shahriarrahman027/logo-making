export type ImageSize = '1K' | '2K' | '4K';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3';

export type ExportFormat = 'png' | 'webp' | 'svg';

export interface LogoTheme {
  id: string;
  name: string;
  topColor: string;
  midColor: string;
  botColor: string;
  glowColor: string;
}

export interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  size: ImageSize;
  model: string;
  createdAt: number;
  width: number;
  height: number;
}
