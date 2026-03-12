import { toPng } from 'html-to-image';

export async function captureShareCard(element: HTMLElement): Promise<string> {
  const dataUrl = await toPng(element, {
    quality: 0.95,
    pixelRatio: 2,
    backgroundColor: '#0A0A0A',
  });
  return dataUrl;
}

export async function downloadShareCard(element: HTMLElement, filename: string = 'learning-wrapped-2026.png'): Promise<void> {
  const dataUrl = await captureShareCard(element);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function shareCard(element: HTMLElement): Promise<void> {
  try {
    const dataUrl = await captureShareCard(element);
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'learning-wrapped-2026.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'My Learning Wrapped 2026',
        text: 'Check out my learning journey on Coursera!',
        files: [file],
      });
    } else {
      await downloadShareCard(element);
    }
  } catch {
    await downloadShareCard(element);
  }
}
