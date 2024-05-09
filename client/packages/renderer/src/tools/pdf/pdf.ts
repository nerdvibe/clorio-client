// @ts-nocheck
// Type errors to be fixed
import { jsPDF } from 'jspdf';
import type { IKeypair } from '../../types';
import ClorioLogoB64 from './ClorioLogoB64.json';

export const downloadPaperWalletPDF = (
  keypair: IKeypair,
  encryption: string,
) => {
  const doc = new jsPDF({
    encryption: {
      ownerPassword: encryption,
      userPassword: encryption,
      userPermissions: ['print'],
    },
  });
  const additionalSpace = keypair.mnemonic ? 20 : 0;
  doc.addImage(ClorioLogoB64, 'PNG', 70, 20);
  doc.setFont('Helvetica');
  doc.setFontSize(10);
  doc.text(
    105,
    65,
    'Access the power of the Mina Protocol Blockchain.',
    'center',
  );
  doc.setFontSize(15);
  if (additionalSpace) {
    doc.text(105, 80, 'This is your passphrase', 'center');
    doc.text(105, 90, keypair.mnemonic, 'center');
  }
  doc.text(105, 80 + additionalSpace, 'This is your public key', 'center');
  doc.text(105, 90 + additionalSpace, keypair.publicKey, 'center');
  doc.text(105, 100 + additionalSpace, 'This is your private key', 'center');
  doc.text(105, 110 + additionalSpace, keypair.privateKey, 'center');
  doc.setFontSize(20);
  doc.text(20, 140 + additionalSpace, 'What to do now?', 'left');
  doc.setFontSize(15);
  doc.text(
    20,
    152 + additionalSpace,
    'Never ever give to anybody your passphrase or private key.',
    'left',
  );
  doc.setFontSize(10);
  doc.text(
    20,
    160 + additionalSpace,
    'Whoever has this passphrase or private key can access the Mina tokens contained in this wallet.',
    'left',
  );
  doc.text(
    20,
    165 + additionalSpace,
    'Make sure that you store this paper wallet carefully and you make a backup of it.',
    'left',
  );
  doc.text(
    20,
    170 + additionalSpace,
    'If you loose this credentials there is no way to get them back.',
    'left',
  );
  doc.text(
    20,
    185 + additionalSpace,
    'By using this software you accept the terms and conditions.',
    'left',
  );
  doc.text(
    20,
    190 + additionalSpace,
    'This software is provided "as is", without warranty of any kind, express or implied,',
    'left',
  );
  doc.text(
    20,
    195 + additionalSpace,
    'including but not limited to the warranties of merchantability,',
    'left',
  );
  doc.text(
    20,
    200 + additionalSpace,
    ' fitness for a particular purpose and noninfringement.',
    'left',
  );
  doc.text(
    20,
    205 + additionalSpace,
    'In no event shall the authors or copyright holders be liable for any claim,',
    'left',
  );
  doc.text(
    20,
    210 + additionalSpace,
    ' damages or other liability, whether in an action of contract, tort or otherwise,',
    'left',
  );
  doc.text(
    20,
    215 + additionalSpace,
    'arising from, out of or in connection with the software or the use or other dealings in the software.',
    'left',
  );
  doc.setFontSize(10);
  doc.text(
    105,
    290,
    '~Clorio is a wallet offered by Carbonara from WeStake.Club and is not developed by O(1)Labs.',
    'center',
  );
  doc.save('Clorio-Paperwallet.pdf');
};
