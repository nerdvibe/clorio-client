import {jsPDF} from 'jspdf';
import QRCode from 'qrcode';
import type {IKeypair} from '../../types';
import ClorioLogoB64 from './ClorioLogoB64.json';

const PAGE = {width: 210, height: 297, margin: 12};
const COLORS = {
  ink: '#18231d',
  green: '#2d7253',
  muted: '#536158',
  border: '#b8c2bb',
  line: '#89968e',
  warningText: '#68470d',
  warningBorder: '#9c6c16',
  warningBackground: '#fff9e8',
};

export interface PaperWalletLayout {
  name: string;
  publicKey: string;
  mnemonicWords: string[];
  privateKey: string;
}

export const buildPaperWalletLayout = (keypair: IKeypair): PaperWalletLayout => ({
  name: 'Clorio Wallet',
  publicKey: keypair.publicKey,
  mnemonicWords: keypair.mnemonic?.trim()
    ? keypair.mnemonic.trim().split(/\s+/)
    : [],
  privateKey: keypair.privateKey,
});

const setColor = (doc: jsPDF, color: string) => {
  doc.setTextColor(color);
  doc.setDrawColor(color);
  doc.setFillColor(color);
};

const drawText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  color: string,
  font = 'helvetica',
) => {
  doc.setFont(font, 'normal');
  doc.setFontSize(fontSize);
  setColor(doc, color);
  doc.text(doc.splitTextToSize(text, width), x, y, {lineHeightFactor: 1.5});
};

const drawLabel = (doc: jsPDF, text: string, x: number, y: number) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setColor(doc, COLORS.green);
  doc.text(text.toUpperCase(), x, y);
};

const drawCode = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
) => {
  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  setColor(doc, COLORS.ink);
  doc.text(doc.splitTextToSize(text, width), x, y, {lineHeightFactor: 1.6});
};

const drawQrCode = (doc: jsPDF, value: string, x: number, y: number) => {
  const qrData = QRCode.create(value, {errorCorrectionLevel: 'M'});
  const count = qrData.modules.size;
  const moduleSize = 43.2 / count;
  const padding = 2.4;
  const qrColor = COLORS.ink;

  setColor(doc, '#ffffff');
  doc.roundedRect(x, y, 48, 48, 3, 3, 'F');

  const isDark = (row: number, column: number) =>
    !!qrData.modules.data[row * count + column];
  const isFinderPattern = (row: number, column: number) =>
    (row < 7 && column < 7) ||
    (row < 7 && column >= count - 7) ||
    (row >= count - 7 && column < 7);

  setColor(doc, qrColor);
  for (let row = 0; row < count; row += 1) {
    for (let column = 0; column < count; column += 1) {
      if (!isDark(row, column) || isFinderPattern(row, column)) continue;
      doc.circle(
        x + padding + (column + 0.5) * moduleSize,
        y + padding + (row + 0.5) * moduleSize,
        moduleSize * 0.35,
        'F',
      );
    }
  }

  const drawFinderPattern = (row: number, column: number) => {
    const finderX = x + padding + (column + 0.5) * moduleSize;
    const finderY = y + padding + (row + 0.5) * moduleSize;
    doc.setLineWidth(moduleSize);
    doc.roundedRect(
      finderX,
      finderY,
      moduleSize * 6,
      moduleSize * 6,
      moduleSize * 2,
      moduleSize * 2,
      'S',
    );
    doc.roundedRect(
      finderX + moduleSize * 1.5,
      finderY + moduleSize * 1.5,
      moduleSize * 3,
      moduleSize * 3,
      moduleSize,
      moduleSize,
      'F',
    );
  };

  drawFinderPattern(0, 0);
  drawFinderPattern(0, count - 7);
  drawFinderPattern(count - 7, 0);
};

export const downloadPaperWalletPDF = (
  keypair: IKeypair,
  encryption: string,
) => {
  const layout = buildPaperWalletLayout(keypair);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    encryption: {
      ownerPassword: encryption,
      userPassword: encryption,
      userPermissions: ['print'],
    },
  });
  const left = PAGE.margin;
  const right = PAGE.width - PAGE.margin;
  const contentWidth = right - left;

  setColor(doc, '#ffffff');
  doc.roundedRect(left, PAGE.margin, 38, 15, 3, 3, 'F');
  setColor(doc, COLORS.border);
  doc.roundedRect(left, PAGE.margin, 38, 15, 3, 3, 'S');
  doc.addImage(
    ClorioLogoB64,
    'JPEG',
    left + 3,
    PAGE.margin + 0.6,
    32,
    13.9,
  );
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  setColor(doc, COLORS.ink);
  doc.text('Mina Paper Wallet', left, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(layout.name, right, 39, {align: 'right'});

  setColor(doc, COLORS.border);
  doc.setLineWidth(0.25);
  doc.line(left, 47, right, 47);

  drawLabel(doc, 'Public address', left, 57);
  drawText(
    doc,
    'Use this address to receive MINA. It is safe to share.',
    left,
    64,
    116,
    10,
    COLORS.muted,
  );
  drawCode(doc, layout.publicKey, left, 77, 116);
  drawQrCode(doc, layout.publicKey, right - 48, 54);

  setColor(doc, COLORS.line);
  doc.setLineWidth(0.25);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(left, 131, 82, 131);
  doc.line(128, 131, right, 131);
  doc.setLineDashPattern([], 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('FOLD HERE', 105, 132, {align: 'center'});

  const secretTop = 142;
  const columnGap = 12;
  const columnWidth = (contentWidth - columnGap) / 2;
  drawLabel(doc, 'Your Secret Recovery Phrase', left, secretTop);
  drawText(
    doc,
    'Scan or enter this secret to restore the wallet.',
    left,
    secretTop + 7,
    columnWidth,
    10,
    COLORS.muted,
  );
  doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  setColor(doc, COLORS.ink);
  layout.mnemonicWords.forEach((word, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const wordX = left + 7 + column * 26;
    const wordY = secretTop + 18 + row * 6;
    doc.text(`${index + 1}. ${word}`, wordX, wordY);
  });

  const privateKeyX = layout.mnemonicWords.length
    ? left + columnWidth + columnGap
    : left;
  drawLabel(doc, 'Your Private Key', privateKeyX, secretTop);
  drawText(
    doc,
    'Scan or enter this secret to restore the wallet.',
    privateKeyX,
    secretTop + 7,
    columnWidth,
    10,
    COLORS.muted,
  );
  drawCode(doc, layout.privateKey, privateKeyX, secretTop + 18, columnWidth);

  setColor(doc, COLORS.border);
  doc.setLineWidth(0.25);
  doc.line(left, 198, right, 198);

  setColor(doc, COLORS.warningBackground);
  doc.roundedRect(left, 206, contentWidth, 24, 1, 1, 'F');
  setColor(doc, COLORS.warningBorder);
  doc.setLineWidth(0.35);
  doc.roundedRect(left, 206, contentWidth, 24, 1, 1, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setColor(doc, COLORS.warningText);
  doc.text('Warning:', left + 5, 213);
  drawText(
    doc,
    'Anyone with this secret can control your funds. Keep this paper private, offline, and protected from loss. If saving a PDF, use an encrypted offline drive and delete extra copies.',
    left + 5,
    218,
    contentWidth - 10,
    9,
    COLORS.warningText,
  );

  doc.save('Clorio-Paperwallet.pdf');
};
