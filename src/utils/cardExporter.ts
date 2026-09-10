import { toPng, toJpeg } from 'html-to-image';
import { Customer, CustomerMeasurementRecord } from '../types';

export async function downloadMeasurementCardAsImage(
  element: HTMLElement,
  fileName: string = 'Larre_Luxe_Measurements.png',
  type: 'png' | 'jpeg' = 'png'
): Promise<void> {
  // Ensure all custom fonts (Playfair, Cormorant, Pinyon Script) are completely loaded
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Canonical luxury card desktop width
  const DESKTOP_WIDTH = 680;

  // Create an offscreen staging container at exact desktop dimensions.
  // This guarantees identical, crisp, 2-column desktop output whether exported from mobile, tablet, or desktop.
  const stagingContainer = document.createElement('div');
  stagingContainer.style.position = 'fixed';
  stagingContainer.style.top = '0';
  stagingContainer.style.left = '-9999px';
  stagingContainer.style.width = `${DESKTOP_WIDTH}px`;
  stagingContainer.style.minWidth = `${DESKTOP_WIDTH}px`;
  stagingContainer.style.maxWidth = `${DESKTOP_WIDTH}px`;
  stagingContainer.style.zIndex = '-9999';
  stagingContainer.style.opacity = '1';
  stagingContainer.style.pointerEvents = 'none';

  // Clone the measurement card element
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${DESKTOP_WIDTH}px`;
  clone.style.maxWidth = `${DESKTOP_WIDTH}px`;
  clone.style.minWidth = `${DESKTOP_WIDTH}px`;
  clone.style.margin = '0';
  clone.style.transform = 'none';
  clone.style.boxSizing = 'border-box';

  stagingContainer.appendChild(clone);
  document.body.appendChild(stagingContainer);

  try {
    // Wait for clone to be laid out in DOM
    const measuredHeight = Math.ceil(Math.max(clone.scrollHeight, clone.offsetHeight, 600));
    const pixelRatio = 2.5;

    const options = {
      quality: 0.98,
      pixelRatio: pixelRatio,
      cacheBust: true,
      width: DESKTOP_WIDTH,
      height: measuredHeight,
      canvasWidth: DESKTOP_WIDTH * pixelRatio,
      canvasHeight: measuredHeight * pixelRatio,
      style: {
        margin: '0',
        transform: 'none',
        maxWidth: `${DESKTOP_WIDTH}px`,
        width: `${DESKTOP_WIDTH}px`,
        height: `${measuredHeight}px`,
        boxSizing: 'border-box',
      },
    };

    // Warm-up pass for fonts & foreignObject embedding
    await toPng(clone, options);

    // Final render
    const dataUrl = type === 'png' ? await toPng(clone, options) : await toJpeg(clone, options);

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export measurement card as image:', error);
    throw error;
  } finally {
    if (document.body.contains(stagingContainer)) {
      document.body.removeChild(stagingContainer);
    }
  }
}

export function formatWhatsAppMessage(customer: Customer, record: CustomerMeasurementRecord): string {
  let text = `👑 *LARRÉ LUXE — BESPOKE MEASUREMENTS*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `👤 *Client:* ${customer.name}\n`;
  text += `📅 *Date Ref:* ${record.dateRef || new Date().toLocaleDateString()}\n`;
  text += `✂️ *Style:* ${record.stylePreference || 'Custom Tailoring'}\n`;
  text += `👔 *Fit:* ${record.fitPreference}\n`;
  if (record.fabricType) text += `🧵 *Fabric:* ${record.fabricType}\n`;
  if (record.color) text += `🎨 *Color:* ${record.color}\n`;
  text += `\n`;

  record.garmentSections.forEach(section => {
    const filledFields = section.fields.filter(f => f.value && f.value.trim() !== '');
    if (filledFields.length > 0) {
      text += `*${section.name.toUpperCase()}*\n`;
      filledFields.forEach(f => {
        text += `• ${f.label}: *${f.value}"*\n`;
      });
      text += `\n`;
    }
  });

  if (record.specialNotes && record.specialNotes.trim()) {
    text += `📝 *Special Notes:*\n${record.specialNotes}\n\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `_Crafted by Larré Luxe Haute Couture Studio_`;

  return encodeURIComponent(text);
}

export function shareViaWhatsApp(customer: Customer, record: CustomerMeasurementRecord) {
  const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
  const encodedText = formatWhatsAppMessage(customer, record);
  const url = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
  window.open(url, '_blank');
}
