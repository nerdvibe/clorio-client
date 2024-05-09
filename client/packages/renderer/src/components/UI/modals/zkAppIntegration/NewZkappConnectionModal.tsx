import {useState} from 'react';
import Input from '../../input/Input';
import Button from '../../Button';
import {ModalContainer} from '../ModalContainer';
import {toast} from 'react-toastify';
import {AlertOctagon} from 'react-feather';

const initialZkappData = {
  name: '',
  url: '',
};

export default function NewZkappConnectionModal({
  showNewZkapp,
  setShowNewZkapp,
  openLink,
}: {
  showNewZkapp: boolean;
  setShowNewZkapp: (show: boolean) => void;
  openLink: (url: string) => void;
}) {
  const [newZkapp, setNewZkapp] = useState(initialZkappData);

  const isValidUrl = () => {
    try {
      new URL(newZkapp.url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onSubmit = () => {
    if (!isValidUrl()) {
      toast.info('Invalid URL');
      return;
    }
    openLink(newZkapp.url);
    setNewZkapp(initialZkappData);
    setShowNewZkapp(false);
  };

  return (
    <ModalContainer
      show={showNewZkapp}
      close={() => setShowNewZkapp(false)}
      closeOnBackgroundClick={true}
    >
      <div className="min-w-500">
        <div className="w-100 ">
          <div className="flex flex-col flex-vertical-center">
            <h1>Open Zkapp</h1>
          </div>
        </div>
        <div className="divider w-100" />
        <div className="pb-4">
          <h5>Zkapp URL</h5>
          <Input
            type="text"
            placeholder="Enter URL"
            className="input"
            inputHandler={e => {
              setNewZkapp({...newZkapp, url: e.target.value});
            }}
          />
          <div
            className="alert alert-warning flex flex-row items-center justify-start gap-2"
            role="alert"
          >
            <AlertOctagon />
            <p className="small m-0">
              Connect only to trusted zkapps. <br />
              Do not enter your private keys on untrusted sites.
            </p>
          </div>
        </div>
        <Button
          text="Open"
          style="primary"
          onClick={onSubmit}
        />
      </div>
    </ModalContainer>
  );
}
