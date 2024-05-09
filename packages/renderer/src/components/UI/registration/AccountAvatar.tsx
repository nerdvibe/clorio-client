import {useState} from 'react';
import {useEffect} from 'react';
import Avatar from '../../../tools/avatar/avatar';
import type {IKeypair} from '../../../types';
import Spinner from '../Spinner';
import CustomSkeleton from '../../CustomSkeleton';

interface IProps {
  generateKeypair: () => Promise<IKeypair | undefined>;
  setKeypair: (keypair: IKeypair) => void;
  selectedKeypair?: IKeypair;
}

const AccountAvatar = ({generateKeypair, selectedKeypair, setKeypair: setKeypairProp}: IProps) => {
  const [keypair, setKeypair] = useState<any>();
  const generateKeys = async () => {
    const keypair = await generateKeypair();
    if (keypair) {
      setKeypair(keypair);
    }
  };
  useEffect(() => {
    generateKeys();
  }, []);

  const selectAccount = () => {
    setKeypairProp(keypair);
  };

  const isSelected = selectedKeypair?.publicKey === keypair?.publicKey;

  return (
    <div
      onClick={selectAccount}
      className={`account-avatar-button ml-4 mr-4 cursor-pointer ${
        isSelected ? 'account-avatar-selected' : ''
      }`}
    >
      <CustomSkeleton
        show={keypair?.publicKey}
        deelay={1000}
        altProps={{
          circle: true,
          width: '75px',
          height: '75px',
        }}
      >
        <div style={{width: '75px'}}>
          <Avatar
            address={keypair?.publicKey}
            size={75}
          />
        </div>
      </CustomSkeleton>
    </div>
  );
};

export default AccountAvatar;
