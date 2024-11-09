import React from 'react';
import Button from '../UI/Button';
import {parseDeeplink} from '../../hooks/useDeeplinkHandler';

interface IProps {
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const labels = {
  'send-tx': 'Send Transaction',
  stake: 'Delegation',
  'verify-message': 'Verify Message',
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const QrCodeResult: React.FC<IProps> = ({url, onConfirm, onCancel}) => {
  let formattedData: any;
  try {
    const parsedData = parseDeeplink(url);
    formattedData = parsedData;
  } catch (error) {
    formattedData = 'Invalid deeplink';
  }

  return (
    <div className="qr-code-result">
      <h1>Summary - {labels[formattedData?.type]}</h1>
      <div className='mb-4'>
        {formattedData &&
          typeof formattedData === 'object' &&
          formattedData.data &&
          Object.keys(formattedData.data).map(key => (
            <React.Fragment key={key}>
              <hr />
              <div className="flex flex-row justify-between qr-code-data-row">
                <h5>{capitalizeFirstLetter(key)}</h5>
                <p>{formattedData.data[key]}</p>
              </div>
            </React.Fragment>
          ))}
      </div>
      <div className="flex flex-row">
        <Button
          className="w-100"
          text="Cancel"
          style="standard"
          variant="outlined"
          onClick={onCancel}
        />
        <Button
          onClick={onConfirm}
          text="Open link"
          style="primary"
        />
      </div>
    </div>
  );
};

export default QrCodeResult;