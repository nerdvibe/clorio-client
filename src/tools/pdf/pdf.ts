// @ts-nocheck
// Type errors to be fixed
import { jsPDF } from "jspdf";
import { IKeypair } from "../../types";
import ClorioLogoB64 from "./ClorioLogoB64.json";

export const downloadPaperWalletPDF = (
  keypair: IKeypair,
  encryption: string
) => {
  const doc = new jsPDF({
    encryption: {
      ownerPassword: encryption,
      userPassword: encryption,
      userPermissions: ["print"],
    },
  });
  doc.addImage(ClorioLogoB64, "PNG", 70, 20);
  doc.setFont("Helvetica");
  doc.setFontSize(10);
  doc.text(
    105,
    65,
    "Access the power of the Mina Protocol Blockchain.",
    "center"
  );
  doc.setFontSize(15);
  doc.text(105, 80, "This is your public key", "center");
  doc.text(105, 90, keypair.publicKey, "center");
  doc.text(105, 100, "This is your private key", "center");
  doc.text(105, 110, keypair.privateKey, "center");
  doc.setFontSize(20);
  doc.text(20, 140, "What to do now?", "left");
  doc.setFontSize(15);
  doc.text(20, 152, "Never ever give to anybody your private key.", "left");
  doc.setFontSize(10);
  doc.text(
    20,
    160,
    "Whoever has this private key can access the Mina tokens contained in this wallet.",
    "left"
  );
  doc.text(
    20,
    165,
    "Make sure that you store this paper wallet carefully and you make a backup of it.",
    "left"
  );
  doc.text(
    20,
    170,
    "If you loose this credentials there is no way to get them back.",
    "left"
  );
  doc.text(
    20,
    185,
    "By using this software you accept the terms and conditions.",
    "left"
  );
  doc.text(
    20,
    190,
    'This software is provided "as is", without warranty of any kind, express or implied,',
    "left"
  );
  doc.text(
    20,
    195,
    "including but not limited to the warranties of merchantability,",
    "left"
  );
  doc.text(
    20,
    200,
    " fitness for a particular purpose and noninfringement.",
    "left"
  );
  doc.text(
    20,
    205,
    "In no event shall the authors or copyright holders be liable for any claim,",
    "left"
  );
  doc.text(
    20,
    210,
    " damages or other liability, whether in an action of contract, tort or otherwise,",
    "left"
  );
  doc.text(
    20,
    215,
    "arising from, out of or in connection with the software or the use or other dealings in the software.",
    "left"
  );
  doc.setFontSize(10);
  doc.text(
    105,
    290,
    "~Clorio is a wallet offered by Carbonara from WeStake.Club and is not developed by O(1)Labs.",
    "center"
  );
  doc.save("Clorio-Paperwallet.pdf");
};
