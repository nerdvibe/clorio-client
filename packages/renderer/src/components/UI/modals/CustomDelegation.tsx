import {useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import {ArrowLeft, ArrowRight} from 'react-feather';
import Button from '../Button';
import Input from '../input/Input';
import {ModalContainer} from './ModalContainer';
import AddressBook from './AddressBook';

interface IProps {
  closeModal: () => void;
  confirmCustomDelegate: (customDelegate: string) => void;
}

export const ConfirmCustomDelegation = ({closeModal, confirmCustomDelegate}: IProps) => {
  const [customDelegate, setCustomDelegate] = useState<string>('');
  const [showAddressBookModal, setShowAddressBookModal] = useState(false);

  const toggleAddressBookModal = () => setShowAddressBookModal(!showAddressBookModal);

  return (
    <div className="min-width-500">
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">Custom delegation </h1>
          <p className="text-center mt-1 mb-1">Delegate to someone that is not in the list</p>
          <div className="divider w-100" />
        </div>
      </div>

      <div className="align-left mt-1 mb-2 label">
        <div className="flex flex-row justify-between">
          <strong>Public key</strong>
          <Button
            className="link-button custom-delegate-button purple-text align-end  no-padding"
            text="Address book"
            onClick={toggleAddressBookModal}
          />
        </div>
      </div>
      <Input
        value={customDelegate}
        inputHandler={e => {
          setCustomDelegate(e.currentTarget.value);
        }}
        placeholder="Insert public key"
      />
      <Row>
        <Col xs={6}>
          <Button
            className="big-icon-button"
            icon={<ArrowLeft />}
            text="Cancel"
            onClick={closeModal}
          />
        </Col>
        <Col xs={6}>
          <Button
            text="Confirm"
            style="primary"
            icon={<ArrowRight />}
            appendIcon
            onClick={() => confirmCustomDelegate(customDelegate)}
            disabled={!customDelegate}
          />
        </Col>
      </Row>
      <ModalContainer
        show={showAddressBookModal}
        close={toggleAddressBookModal}
        closeOnBackgroundClick
      >
        <AddressBook
          selectable
          onSelect={address => {
            setCustomDelegate(address);
            toggleAddressBookModal();
          }}
        />
      </ModalContainer>
    </div>
  );
};
