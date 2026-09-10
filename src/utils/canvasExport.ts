/**
 * Export high-resolution raster and vector formats (4K, 2000x2000px, etc.)
 */

export interface ExportOptions {
  width: number;
  height: number;
  format: 'png' | 'webp' | 'svg';
  transparent: boolean;
  filename?: string;
  backgroundColor?: string;
}

export async function exportSvgElement(
  svgElementId: string,
  options: ExportOptions
): Promise<void> {
  const svgEl = document.getElementById(svgElementId) as unknown as SVGSVGElement | null;
  if (!svgEl) {
    throw new Error(`SVG element #${svgElementId} not found.`);
  }

  // Clone SVG so we can manipulate dimensions and background cleanly
  const clone = svgEl.cloneNode(true) as unknown as SVGSVGElement;
  clone.setAttribute('width', options.width.toString());
  clone.setAttribute('height', options.height.toString());

  // Handle transparency if requested
  if (options.transparent) {
    const bgRect = clone.querySelector('rect');
    if (bgRect) {
      bgRect.setAttribute('fill', 'none');
    }
  } else if (options.backgroundColor) {
    const bgRect = clone.querySelector('rect');
    if (bgRect) {
      bgRect.setAttribute('fill', options.backgroundColor);
    }
  }

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(clone);

  // If SVG format requested, download raw SVG file
  if (options.format === 'svg') {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, options.filename || `logo-vector-${options.width}x${options.height}.svg`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }

  // For raster (PNG/WebP), render to Canvas at exact target resolution (e.g. 2000x2000 or 4096x4096)
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;

    const ctx = canvas.getContext('2d', { alpha: options.transparent });
    if (!ctx) {
      reject(new Error('Failed to obtain 2D canvas context.'));
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (!options.transparent) {
      ctx.fillStyle = options.backgroundColor || '#000000';
      ctx.fillRect(0, 0, options.width, options.height);
    }

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, options.width, options.height);
      URL.revokeObjectURL(blobUrl);

      const mimeType = options.format === 'webp' ? 'image/webp' : 'image/png';
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas export produced empty blob.'));
            return;
          }
          const downloadBlobUrl = URL.createObjectURL(blob);
          const ext = options.format === 'webp' ? 'webp' : 'png';
          downloadUrl(
            downloadBlobUrl,
            options.filename || `logo-${options.width}x${options.height}.${ext}`
          );
          setTimeout(() => URL.revokeObjectURL(downloadBlobUrl), 1000);
          resolve();
        },
        mimeType,
        1.0
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error('Failed to rasterize SVG to image: ' + err));
    };

    img.src = blobUrl;
  });
}

function downloadUrl(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
