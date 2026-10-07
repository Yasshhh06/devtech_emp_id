"use client";
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Standard configuration options for html-to-image to guarantee smooth rendering without CORS or SecurityError crashes
 */
const getHtmlToImageOptions = () => ({
  quality: 1.0,
  pixelRatio: 2, // High-resolution CR80 sharpness while avoiding browser canvas memory limits
  backgroundColor: '#ffffff',
  skipFonts: true, // IMPORTANT: Avoids SecurityError when browser attempts to read cross-origin Google Font stylesheets
  cacheBust: false, // Reuses already downloaded and decoded in-memory images (Unsplash, avatars, logos) without causing CORS reload failures
  style: {
    transform: 'none',
    margin: '0',
    position: 'static',
    opacity: '1',
    visibility: 'visible',
  },
});

/**
 * Download a DOM element as PNG image with high DPI and zero text distortion
 */
export const downloadElementAsPNG = async (elementId: string, filename: string = 'Employee_ID_Card.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return;
  }

  try {
    const image = await toPng(element, getHtmlToImageOptions());
    const link = document.createElement('a');
    link.href = image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('PNG export failed:', error);
  }
};

/**
 * Download a single ID card or front+back as PDF (CR80 standard credit card size ~85.6mm x 54mm)
 */
export const downloadCardAsPDF = async (frontId: string, backId?: string, filename: string = 'Employee_ID_Card.pdf') => {
  const frontEl = document.getElementById(frontId);
  if (!frontEl) {
    console.error(`Front Element #${frontId} not found`);
    return;
  }

  try {
    // Standard CR80 ID Card dimensions in mm (Landscape orientation)
    const cardWidth = 85.6;
    const cardHeight = 54.0;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [cardWidth, cardHeight],
    });

    // Render Front
    const imgFront = await toPng(frontEl, getHtmlToImageOptions());
    pdf.addImage(imgFront, 'PNG', 0, 0, cardWidth, cardHeight);

    // If back element exists, add page 2
    if (backId) {
      const backEl = document.getElementById(backId);
      if (backEl) {
        const imgBack = await toPng(backEl, getHtmlToImageOptions());
        pdf.addPage([cardWidth, cardHeight], 'landscape');
        pdf.addImage(imgBack, 'PNG', 0, 0, cardWidth, cardHeight);
      }
    }

    pdf.save(filename);
  } catch (error) {
    console.error('PDF export failed:', error);
  }
};

/**
 * Trigger window printing for elements wrapped in printable view
 */
export const triggerPrint = () => {
  window.print();
};

/**
 * Generate a data URL from a direct DOM HTMLElement reference
 */
export const generateImageFromElement = async (element: HTMLElement, options: { scale?: number } = {}): Promise<string> => {
  const baseOpts = getHtmlToImageOptions();
  return await toPng(element, {
    ...baseOpts,
    pixelRatio: options.scale || baseOpts.pixelRatio,
  });
};

/**
 * Generate a multi-page PVC PDF from an array of HTMLElement references (for front/back duplex printing)
 */
export const generatePDFFromElements = async (
  elements: HTMLElement[],
  filename: string = 'DevTech_Badge.pdf',
  options: { orientation?: 'portrait' | 'landscape' } = { orientation: 'landscape' }
): Promise<void> => {
  const isLandscape = options.orientation === 'landscape';
  const width = isLandscape ? 85.6 : 54.0;
  const height = isLandscape ? 54.0 : 85.6;

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [width, height],
  });

  let pagesAdded = 0;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!el) continue;

    try {
      const imgData = await toPng(el, getHtmlToImageOptions());
      if (!imgData || imgData === 'data:,') {
        console.warn(`Skipping empty image rasterization for element:`, el.id);
        continue;
      }

      if (pagesAdded > 0) {
        pdf.addPage([width, height], isLandscape ? 'landscape' : 'portrait');
      }
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pagesAdded++;
    } catch (error) {
      console.error(`Failed to rasterize element #${el.id} for PDF:`, error);
    }
  }

  if (pagesAdded > 0) {
    pdf.save(filename);
  } else {
    throw new Error('No elements could be successfully rendered into the PDF.');
  }
};
