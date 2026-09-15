import {describe, expect, it, vi} from 'vitest';

const pdfState = vi.hoisted(() => ({
  saved: false,
  imageAdded: false,
}));

vi.mock('jspdf', () => {
  class MockJsPDF {
    setTextColor() {}
    setDrawColor() {}
    setFillColor() {}
    setFont() {}
    setFontSize() {}
    text() {}
    splitTextToSize(text: string) {
      return [text];
    }
    roundedRect() {}
    setLineWidth() {}
    setLineDashPattern() {}
    line() {}
    circle() {}
    addImage() {
      pdfState.imageAdded = true;
    }
    save() {
      pdfState.saved = true;
    }
  }

  return {jsPDF: MockJsPDF};
});

import {
  buildPaperWalletLayout,
  downloadPaperWalletPDF,
} from '../tools/pdf/pdf';

const keypair = {
  publicKey: 'B62q-public-key',
  privateKey: 'EKF-private-key',
  mnemonic: 'alpha beta gamma',
};

describe('buildPaperWalletLayout', () => {
  it('maps a keypair to the extension paper wallet sections', () => {
    expect(buildPaperWalletLayout(keypair)).toEqual({
      name: 'Clorio Wallet',
      publicKey: keypair.publicKey,
      mnemonicWords: ['alpha', 'beta', 'gamma'],
      privateKey: keypair.privateKey,
    });
  });

  it('does not create an empty mnemonic section', () => {
    expect(
      buildPaperWalletLayout({
        publicKey: keypair.publicKey,
        privateKey: keypair.privateKey,
        mnemonic: '   ',
      }).mnemonicWords,
    ).toEqual([]);
  });

  it('adds the dark logo as a raster image before saving the PDF', () => {
    pdfState.saved = false;
    pdfState.imageAdded = false;

    downloadPaperWalletPDF(keypair, 'password');

    expect(pdfState.imageAdded).toBe(true);
    expect(pdfState.saved).toBe(true);
  });
});
