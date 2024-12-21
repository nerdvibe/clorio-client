import {useState} from 'react';
import Hoc from '../Hoc';
import {Check} from 'react-feather';
import Button from '../Button';

interface ISignMessageLedgerScreenProps {
  onProceed: () => void;
}

const SignMessageLedgerScreen = ({onProceed}: ISignMessageLedgerScreenProps) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Hoc>
      <div className="animate__animated animate__fadeIn">
        <div className="glass-card p-4 warning-card">
          <h1>Warning</h1>
          <p>
            This feature is intended for advanced users who fully understand the risks and
            implications. Signing messages on the Mina Protocol using Ledger is not currently
            supported. This workaround allows you to sign messages using your Ledger passphrase.
          </p>
          <p>
            ⚠️ Warning: Entering your 24-word recovery phrase into this tool compromises the
            security model of your hardware wallet. By proceeding, you understand all the risks
            involved. Exercise extreme caution and ensure you are aware of the potential
            consequences before continuing.
          </p>
          <div className="flex flex-row align-center gap-2 mt-4">
            <input
              className="checkbox"
              type="checkbox"
              name="storePassphrase"
              id="storePassphrase"
              onChange={() => setIsChecked(!isChecked)}
              checked={isChecked}
            />
            <label
              className="ml-2 checkbox-label"
              htmlFor="storePassphrase"
            >
              I understand the risks and wish to proceed
            </label>
          </div>
          <Button
            onClick={onProceed}
            text="Proceed"
            style="primary"
            className="mt-4"
            icon={<Check />}
            disabled={!isChecked}
            appendIcon
          />
        </div>
      </div>
    </Hoc>
  );
};

export default SignMessageLedgerScreen;
