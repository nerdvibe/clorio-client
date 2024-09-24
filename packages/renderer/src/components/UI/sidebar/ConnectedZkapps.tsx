import {useRecoilState} from 'recoil';
import {connectedSitesState} from '/@/store';
import {ModalContainer} from '../modals';
import {useState} from 'react';
import Button from '../Button';
import {Trash} from 'react-feather';
import {useTranslation} from 'react-i18next';

export const ConnectedZkapps = () => {
  const {t} = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [connectedSites, setConnectedSites] = useRecoilState(connectedSitesState);
  const onClose = (site: string) => {
    setConnectedSites(prev => ({
      ...prev,
      sites: prev.sites.filter(({source}: {source: string}) => source !== site),
    }));
  };

  return (
    <>
      <Button
        text={t('connected_zkapps.show_button_text')}
        onClick={() => setShowModal(true)}
        className="link-button custom-delegate-button purple-text align-end  no-padding"
      />
      <ModalContainer
        show={showModal}
        close={() => setShowModal(false)}
      >
        <div className="connected-zkapps">
          <h1>{t('connected_zkapps.modal_title')}</h1>
          <hr />
          <div className="connected-sites">
            {connectedSites.sites.length ? (
              connectedSites.sites.map(({source}: {source: string}) => (
                <>
                  <div
                    key={source}
                    className="connected-site flex flex-row justify-between items-center gap-4"
                  >
                    <span>{source}</span>
                    <Trash
                      cursor={'pointer'}
                      onClick={() => onClose(source)}
                      color="rgb(209, 117, 122)"
                      width={20}
                      height={20}
                      style={{minWidth: '20px', minHeight: '20px'}}
                    />
                  </div>
                  <hr />
                </>
              ))
            ) : (
              <p className="pt-3">{t('connected_zkapps.no_connected_zkapps')}</p>
            )}
          </div>
        </div>
      </ModalContainer>
    </>
  );
};
