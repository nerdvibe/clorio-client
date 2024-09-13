import {useEffect, useState} from 'react';
import Button from '../Button';
import {getAddresses, removeAddress, saveNewAddress, trimMiddle} from '/@/tools';
import {toast} from 'react-toastify';
import Input from '../input/Input';

export default function AddressBook({
  editable,
  selectable,
  onSelect,
}: {
  editable?: boolean;
  selectable?: boolean;
  onSelect?: (address: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [address, setAddress] = useState('');
  const [alias, setAlias] = useState('');
  const [addressBook, setAddressBook] = useState([]);

  useEffect(() => {
    readFromStorage();
  }, []);

  const readFromStorage = () => {
    const addresses = getAddresses();
    setAddressBook(addresses);
  };

  const saveAddress = () => {
    if (!address) {
      return toast.error('Please enter address and alias');
    }
    saveNewAddress(address, alias);
    setShowAdd(false);
    readFromStorage();
  };

  const deleteAddress = (address: string) => {
    removeAddress(address);
    readFromStorage();
  };

  return (
    <div style={{width: '500px'}}>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">Address book</h1>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="address-book-container">
        {addressBook.length > 0 ? (
          addressBook.map(({address, alias}) => (
            <div
              key={address}
              className="address-book-item"
            >
              <div className="flex flex-row justify-between ">
                <div className="flex flex-col">
                  <p className="mb-0">{alias}</p>
                  <p className="small-text">{trimMiddle(address, 30)}</p>
                </div>
                {selectable && (
                  <Button
                    text="Select"
                    onClick={() => {
                      onSelect && onSelect(address);
                    }}
                  />
                )}
                {editable && (
                  <div className="flex flex-row gap-2">
                    <Button
                      text="Delete"
                      onClick={() => deleteAddress(address)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="address-book-item">
            <div>No addresses</div>
          </div>
        )}
      </div>
      {editable ? (
        showAdd ? (
          <div className="address-book-item">
            <p>Address</p>
            <Input
              type="text"
              value={address}
              inputHandler={e => {
                setAddress(e.target.value);
              }}
            />
            <p>Alias</p>
            <Input
              type="text"
              value={alias}
              inputHandler={e => {
                setAlias(e.target.value);
              }}
            />
            <Button
              style="primary"
              text="Save"
              onClick={saveAddress}
            />
          </div>
        ) : (
          <Button
            style="primary"
            text="Add new"
            onClick={() => setShowAdd(true)}
          />
        )
      ) : null}
    </div>
  );
}
