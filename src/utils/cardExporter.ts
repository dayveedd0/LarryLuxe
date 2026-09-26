import { toPng, toJpeg } from 'html-to-image';
import { Customer, CustomerMeasurementRecord } from '../types';

export async function downloadMeasurementCardAsImage(
  customerOrElement: Customer | HTMLElement,
  recordOrFileName?: CustomerMeasurementRecord | string,
  variantOrType: 'light' | 'dark' | 'png' | 'jpeg' = 'light',
  fileName: string = 'Larre_Luxe_Measurements.png',
  formatType: 'png' | 'jpeg' = 'png'
): Promise<void> {
  // Ensure all custom fonts (Playfair, Cormorant, Pinyon Script) are completely loaded
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Check if called with (customer, record, variant, fileName, formatType)
  let exportElement: HTMLElement;
  let targetFileName = fileName;
  let exportFormat: 'png' | 'jpeg' = formatType;

  const isCustomerObject = (obj: any): obj is Customer => {
    return obj && typeof obj === 'object' && 'name' in obj && 'measurements' in obj;
  };

  const isMeasurementRecord = (obj: any): obj is CustomerMeasurementRecord => {
    return obj && typeof obj === 'object' && 'garmentSections' in obj;
  };

  // Canonical luxury card standard master width (780px)
  const STANDARD_WIDTH = 780;

  // Staging container placed offscreen to guarantee 100% viewport-independent standard rendering
  const stagingContainer = document.createElement('div');
  stagingContainer.style.position = 'fixed';
  stagingContainer.style.top = '0';
  stagingContainer.style.left = '-9999px';
  stagingContainer.style.width = `${STANDARD_WIDTH}px`;
  stagingContainer.style.minWidth = `${STANDARD_WIDTH}px`;
  stagingContainer.style.maxWidth = `${STANDARD_WIDTH}px`;
  stagingContainer.style.zIndex = '-9999';
  stagingContainer.style.opacity = '1';
  stagingContainer.style.pointerEvents = 'none';

  if (isCustomerObject(customerOrElement) && isMeasurementRecord(recordOrFileName)) {
    const customer = customerOrElement;
    const record = recordOrFileName;
    const variant = (variantOrType === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    targetFileName = fileName;
    exportFormat = formatType;

    // Build the pristine standard desktop master measurement slip DOM
    exportElement = buildStandardMasterCardElement(customer, record, variant, STANDARD_WIDTH);
  } else if (customerOrElement instanceof HTMLElement) {
    // Clone existing element and normalize to standard width
    exportElement = customerOrElement.cloneNode(true) as HTMLElement;
    exportElement.style.width = `${STANDARD_WIDTH}px`;
    exportElement.style.maxWidth = `${STANDARD_WIDTH}px`;
    exportElement.style.minWidth = `${STANDARD_WIDTH}px`;
    exportElement.style.margin = '0';
    exportElement.style.transform = 'none';
    exportElement.style.boxSizing = 'border-box';

    if (typeof recordOrFileName === 'string') {
      targetFileName = recordOrFileName;
    }
    if (variantOrType === 'png' || variantOrType === 'jpeg') {
      exportFormat = variantOrType;
    }
  } else {
    throw new Error('Invalid arguments provided to downloadMeasurementCardAsImage');
  }

  stagingContainer.appendChild(exportElement);
  document.body.appendChild(stagingContainer);

  try {
    // Let DOM layout calculate true natural height at standard 780px width
    const measuredHeight = Math.ceil(Math.max(exportElement.scrollHeight, exportElement.offsetHeight, 650));
    const pixelRatio = 2.5;

    const options = {
      quality: 0.98,
      pixelRatio: pixelRatio,
      cacheBust: true,
      width: STANDARD_WIDTH,
      height: measuredHeight,
      canvasWidth: STANDARD_WIDTH * pixelRatio,
      canvasHeight: measuredHeight * pixelRatio,
      style: {
        margin: '0',
        transform: 'none',
        maxWidth: `${STANDARD_WIDTH}px`,
        width: `${STANDARD_WIDTH}px`,
        height: `${measuredHeight}px`,
        boxSizing: 'border-box',
      },
    };

    // Warm-up pass for fonts & SVG foreignObject embedding
    await toPng(exportElement, options);

    // Final rasterization
    const dataUrl = exportFormat === 'png' ? await toPng(exportElement, options) : await toJpeg(exportElement, options);

    // Trigger file download
    const link = document.createElement('a');
    link.download = targetFileName;
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

/**
 * Builds the canonical standard haute couture measurement card DOM structure
 * with fixed 780px desktop dimensions, guaranteed identical on all devices.
 */
function buildStandardMasterCardElement(
  customer: Customer,
  record: CustomerMeasurementRecord,
  variant: 'light' | 'dark',
  width: number
): HTMLElement {
  const isDark = variant === 'dark';

  const card = document.createElement('div');
  card.style.width = `${width}px`;
  card.style.minWidth = `${width}px`;
  card.style.maxWidth = `${width}px`;
  card.style.boxSizing = 'border-box';
  card.style.padding = '34px 38px';
  card.style.borderRadius = '24px';
  card.style.position = 'relative';
  card.style.overflow = 'hidden';
  card.style.fontFamily = "'Plus Jakarta Sans', -apple-system, sans-serif";

  if (isDark) {
    card.style.backgroundColor = '#0C0E14';
    card.style.color = '#FFFFFF';
    card.style.border = '2px solid rgba(197, 160, 89, 0.45)';
    card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.9), inset 0 0 35px rgba(197, 160, 89, 0.08)';
  } else {
    card.style.backgroundColor = '#FCFBF7';
    card.style.color = '#171717';
    card.style.border = '2px solid rgba(197, 160, 89, 0.5)';
    card.style.boxShadow = '0 20px 40px -10px rgba(197, 160, 89, 0.25), inset 0 0 45px rgba(245, 236, 219, 0.6)';
  }

  // Corner Filigree Borders
  const cornerTl = document.createElement('div');
  cornerTl.style.cssText = 'position:absolute;top:10px;left:10px;width:30px;height:30px;border-top:2px solid #C5A059;border-left:2px solid #C5A059;border-top-left-radius:12px;pointer-events:none;';
  const cornerTr = document.createElement('div');
  cornerTr.style.cssText = 'position:absolute;top:10px;right:10px;width:30px;height:30px;border-top:2px solid #C5A059;border-right:2px solid #C5A059;border-top-right-radius:12px;pointer-events:none;';
  const cornerBl = document.createElement('div');
  cornerBl.style.cssText = 'position:absolute;bottom:10px;left:10px;width:30px;height:30px;border-bottom:2px solid #C5A059;border-left:2px solid #C5A059;border-bottom-left-radius:12px;pointer-events:none;';
  const cornerBr = document.createElement('div');
  cornerBr.style.cssText = 'position:absolute;bottom:10px;right:10px;width:30px;height:30px;border-bottom:2px solid #C5A059;border-right:2px solid #C5A059;border-bottom-right-radius:12px;pointer-events:none;';
  card.appendChild(cornerTl);
  card.appendChild(cornerTr);
  card.appendChild(cornerBl);
  card.appendChild(cornerBr);

  // Background Watermark Crest
  const watermark = document.createElement('div');
  watermark.style.cssText = `position:absolute;right:20px;bottom:30px;width:280px;height:280px;opacity:${isDark ? '0.04' : '0.035'};pointer-events:none;`;
  watermark.innerHTML = `<img src="/assets/logo.png" style="width:100%;height:100%;object-fit:contain;" alt="" />`;
  card.appendChild(watermark);

  // Find TOP and TROUSER sections
  const topSection = record.garmentSections.find(s => s.name.toUpperCase().includes('TOP') || s.name.toUpperCase().includes('SHIRT') || s.name.toUpperCase().includes('JACKET'));
  const trouserSection = record.garmentSections.find(s => s.name.toUpperCase().includes('TROUSER') || s.name.toUpperCase().includes('PANT') || s.name.toUpperCase().includes('SOKOTO'));
  const otherSections = record.garmentSections.filter(s => s !== topSection && s !== trouserSection);

  // Card Header
  const headerHtml = `
    <div style="text-align: center; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid rgba(197, 160, 89, 0.25); position: relative;">
      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 8px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #DFB76C, #C5A059, #996515); padding: 2px; box-shadow: 0 4px 12px rgba(197, 160, 89, 0.35);">
          <div style="width: 100%; height: 100%; border-radius: 10px; background: ${isDark ? '#0C0E14' : '#FCFBF7'}; display: flex; align-items: center; justify-content: center; padding: 2px;">
            <img src="/assets/logo-icon.png" style="width: 100%; height: 100%; object-fit: contain;" alt="Crest" />
          </div>
        </div>
      </div>

      <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin: 0; line-height: 1.2;">
        <span style="background: linear-gradient(135deg, #F5D77F 0%, #C5A059 50%, #B38728 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">LARRÉ</span>
        <span style="color: ${isDark ? '#FFFFFF' : '#171717'}; font-weight: 300;"> LUXE</span>
      </h2>

      <p style="font-family: 'Pinyon Script', cursive; font-size: 24px; color: ${isDark ? '#DFB76C' : '#B38728'}; margin: 4px 0 8px 0; font-weight: normal;">
        Customer Measurements & Atelier Record
      </p>

      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: ${isDark ? '#F5D77F' : '#8C671E'};">
        <span style="height: 1px; width: 40px; background: linear-gradient(to right, transparent, rgba(197, 160, 89, 0.5));"></span>
        <span>• Haute Couture • Bespoke Tailoring •</span>
        <span style="height: 1px; width: 40px; background: linear-gradient(to left, transparent, rgba(197, 160, 89, 0.5));"></span>
      </div>
    </div>
  `;

  // Customer Information Box (Fixed 2 Columns)
  const metaBoxBg = isDark ? '#12151D' : '#FFFFFF';
  const metaLabelColor = isDark ? '#F5D77F' : '#8C671E';
  const metaValColor = isDark ? '#FFFFFF' : '#0A0A0A';

  const metadataHtml = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px; margin-bottom: 22px; padding: 16px 20px; border-radius: 16px; background: ${metaBoxBg}; border: 1px solid rgba(197, 160, 89, 0.3); box-shadow: 0 2px 8px rgba(0,0,0,${isDark ? '0.4' : '0.04'});">
      <div style="display: flex; align-items: center; overflow: hidden;">
        <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${metaLabelColor}; width: 130px; flex-shrink: 0;">Customer Name :</span>
        <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; color: ${metaValColor}; flex: 1; border-bottom: 1px dashed rgba(197, 160, 89, 0.4); padding-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${customer.name || '—'}</span>
      </div>

      <div style="display: flex; align-items: center; overflow: hidden;">
        <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${metaLabelColor}; width: 95px; flex-shrink: 0;">Date Ref :</span>
        <span style="font-family: monospace; font-size: 14px; font-weight: 700; color: ${metaValColor}; flex: 1; border-bottom: 1px dashed rgba(197, 160, 89, 0.4); padding-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${record.dateRef || new Date().toLocaleDateString()}</span>
      </div>

      <div style="display: flex; align-items: center; overflow: hidden;">
        <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${metaLabelColor}; width: 130px; flex-shrink: 0;">Style Preference :</span>
        <span style="font-size: 14px; font-weight: 600; color: ${metaValColor}; flex: 1; border-bottom: 1px dashed rgba(197, 160, 89, 0.4); padding-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${record.stylePreference || 'Custom Bespoke Fitting'}</span>
      </div>

      <div style="display: flex; align-items: center; overflow: hidden;">
        <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${metaLabelColor}; width: 95px; flex-shrink: 0;">Phone nō :</span>
        <span style="font-family: monospace; font-size: 14px; font-weight: 700; color: ${metaValColor}; flex: 1; border-bottom: 1px dashed rgba(197, 160, 89, 0.4); padding-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${customer.phone || '—'}</span>
      </div>
    </div>
  `;

  // Main Measurements (Side-by-Side 2 Columns)
  const sectionBg = isDark ? '#12151D' : '#FFFFFF';
  const badgeBg = isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.16)';
  const badgeTextColor = isDark ? '#F5D77F' : '#0A0A0A';
  const badgeBorder = isDark ? 'rgba(245, 215, 127, 0.45)' : 'rgba(197, 160, 89, 0.4)';

  const renderFieldsList = (fields: { id: string; label: string; value: string }[]) => {
    return fields.map(f => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(197, 160, 89, 0.12);">
        <span style="font-size: 13px; font-weight: 600; color: ${isDark ? '#E5E5E5' : '#262626'}; display: flex; align-items: center;">
          <span style="color: #C5A059; margin-right: 6px; font-size: 14px;">•</span>
          ${f.label}:
        </span>
        <span style="font-family: monospace; font-size: 15px; font-weight: 800; color: ${badgeTextColor}; background: ${badgeBg}; border: 1px solid ${badgeBorder}; padding: 2px 10px; border-radius: 8px; min-width: 52px; text-align: right;">
          ${f.value ? `${f.value}″` : '—'}
        </span>
      </div>
    `).join('');
  };

  const topHtml = topSection ? `
    <div style="background: ${sectionBg}; border: 1px solid rgba(197, 160, 89, 0.32); border-radius: 18px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,${isDark ? '0.3' : '0.04'});">
      <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid rgba(197, 160, 89, 0.25);">
        <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${metaLabelColor}; margin: 0;">
          ✂ ${topSection.name}
        </h3>
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: ${isDark ? '#A3A3A3' : '#737373'};">Inches (″)</span>
      </div>
      <div>
        ${renderFieldsList(topSection.fields)}
      </div>
    </div>
  ` : '';

  const trouserHtml = trouserSection ? `
    <div style="background: ${sectionBg}; border: 1px solid rgba(197, 160, 89, 0.32); border-radius: 18px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,${isDark ? '0.3' : '0.04'});">
      <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid rgba(197, 160, 89, 0.25);">
        <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${metaLabelColor}; margin: 0;">
          ✂ ${trouserSection.name}
        </h3>
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: ${isDark ? '#A3A3A3' : '#737373'};">Inches (″)</span>
      </div>
      <div>
        ${renderFieldsList(trouserSection.fields)}
      </div>
    </div>
  ` : '';

  const mainMeasurementsHtml = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 22px;">
      ${topHtml}
      ${trouserHtml}
    </div>
  `;

  // Other Custom Garment Sections
  const otherSectionsHtml = otherSections.length > 0 ? `
    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 22px;">
      ${otherSections.map(sec => `
        <div style="background: ${sectionBg}; border: 1px solid rgba(197, 160, 89, 0.32); border-radius: 18px; padding: 16px 20px;">
          <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${metaLabelColor}; margin: 0 0 10px 0; padding-bottom: 8px; border-bottom: 1px solid rgba(197, 160, 89, 0.2);">
            ✂ ${sec.name}
          </h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            ${sec.fields.map(f => `
              <div style="display: flex; align-items: center; justify-content: space-between; background: ${isDark ? '#181C26' : 'rgba(197, 160, 89, 0.08)'}; padding: 6px 10px; border-radius: 10px; border: 1px solid rgba(197, 160, 89, 0.2);">
                <span style="font-size: 12px; font-weight: 600; color: ${isDark ? '#E5E5E5' : '#262626'}; margin-right: 6px;">${f.label}:</span>
                <span style="font-family: monospace; font-size: 14px; font-weight: 800; color: ${badgeTextColor};">${f.value ? `${f.value}″` : '—'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  ` : '';

  // Bespoke Attributes (3 Columns)
  const tileBg = isDark ? '#151922' : 'rgba(197, 160, 89, 0.06)';
  const tileBorder = '1px solid rgba(197, 160, 89, 0.28)';

  const bespokeAttributesHtml = `
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 22px; padding: 16px 18px; background: ${sectionBg}; border: 1px solid rgba(197, 160, 89, 0.32); border-radius: 18px;">
      <div style="background: ${tileBg}; border: ${tileBorder}; padding: 10px 14px; border-radius: 12px;">
        <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${metaLabelColor}; margin-bottom: 4px;">Preferred Fit</span>
        <div style="font-size: 14px; font-weight: 700; color: ${metaValColor}; display: flex; align-items: center; gap: 6px;">
          <span style="color: #C5A059;">✓</span>
          <span>${record.fitPreference || 'Tailored Bespoke'}</span>
        </div>
      </div>

      <div style="background: ${tileBg}; border: ${tileBorder}; padding: 10px 14px; border-radius: 12px;">
        <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${metaLabelColor}; margin-bottom: 4px;">Fabric Type</span>
        <div style="font-size: 14px; font-weight: 700; color: ${metaValColor}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${record.fabricType || 'Client Choice Fabric'}
        </div>
      </div>

      <div style="background: ${tileBg}; border: ${tileBorder}; padding: 10px 14px; border-radius: 12px;">
        <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${metaLabelColor}; margin-bottom: 4px;">Color Tone</span>
        <div style="font-size: 14px; font-weight: 700; color: ${metaValColor}; display: flex; align-items: center; gap: 8px;">
          ${record.colorHex ? `<span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background-color: ${record.colorHex}; border: 1px solid rgba(197,160,89,0.5); flex-shrink: 0;"></span>` : ''}
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${record.color || 'Bespoke Palette'}</span>
        </div>
      </div>
    </div>
  `;

  // Special Notes Box
  const specialNotesHtml = `
    <div style="background: ${sectionBg}; border: 1px solid rgba(197, 160, 89, 0.32); border-radius: 18px; padding: 14px 18px; margin-bottom: 22px;">
      <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${metaLabelColor}; margin-bottom: 6px;">
        Special Notes & Atelier Instructions:
      </span>
      <p style="font-size: 13.5px; line-height: 1.5; font-style: italic; color: ${isDark ? '#F3F4F6' : '#1F2937'}; margin: 0; font-weight: 500;">
        ${record.specialNotes || 'No specific alterations requested. Standard master tailor precision apply.'}
      </p>
    </div>
  `;

  // Artisan Footer
  const footerHtml = `
    <div style="padding-top: 16px; border-top: 1px solid rgba(197, 160, 89, 0.25); display: flex; align-items: center; justify-content: space-between;">
      <div>
        <p style="font-family: 'Pinyon Script', cursive; font-size: 20px; color: ${isDark ? '#DFB76C' : '#996515'}; margin: 0 0 2px 0;">
          Larré Luxe Master Tailor Signature
        </p>
        <div style="width: 140px; height: 1px; background: rgba(197, 160, 89, 0.45);"></div>
      </div>

      <div style="font-family: monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${isDark ? '#A3A3A3' : '#737373'};">
        REF #${record.id.slice(-6).toUpperCase()} • CONFIDENTIAL CLIENT RECORD
      </div>
    </div>
  `;

  card.innerHTML = `
    ${headerHtml}
    ${metadataHtml}
    ${mainMeasurementsHtml}
    ${otherSectionsHtml}
    ${bespokeAttributesHtml}
    ${specialNotesHtml}
    ${footerHtml}
  `;

  return card;
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
