import {Collapse} from 'react-bootstrap';
import {useState} from 'react';
import {Menu, Plus, X} from 'react-feather';
import Hoc from '../../Hoc';
import Button from '../../Button';
import {useRecoilValue} from 'recoil';
import {connectedSitesState} from '/@/store';
import NewZkappConnectionModal from './NewZkappConnectionModal';

export const ZkappSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNewZkapp, setShowNewZkapp] = useState(false);
  const {sites} = useRecoilValue(connectedSitesState);

  const openLink = (url: string) => {
    (window.ipcBridge as any).invoke('open-win', JSON.stringify({url}));
  };

  return (
    <Hoc className=" p-0 flex flex-row mt-4">
      <div style={{minWidth: '50px', maxWidth: '200px'}}>
        {!showSidebar ? (
          <Menu
            onClick={() => setShowSidebar(true)}
            className="cursor-pointer"
          />
        ) : (
          <div className="flex">
            <p className="mb-0">Connected Zkapps</p>
            <X
              onClick={() => setShowSidebar(false)}
              className="cursor-pointer"
            />
          </div>
        )}
        <Collapse
          dimension="width"
          in={showSidebar}
          style={{maxHeight: '80vh', overflowY: 'auto'}}
        >
          <div className="flex flex-col justify-start gap-2 mt-4">
            <div className="divider w-100 mt-0 mb-2" />
            <div className="glass-card py-2 px-4">
              <Button
                text="Open Zkapp"
                icon={<Plus />}
                onClick={() => setShowNewZkapp(!showNewZkapp)}
              />
            </div>
            <div className="divider w-100" />
            {sites.map(({source, title}: {source: string; title: string}) => (
              <div
                key={source}
                className="glass-card py-2 px-4"
              >
                <Button
                  text={title}
                  onClick={() => openLink(source)}
                />
              </div>
            ))}
          </div>
        </Collapse>
      </div>
      <NewZkappConnectionModal
        openLink={openLink}
        setShowNewZkapp={setShowNewZkapp}
        showNewZkapp={showNewZkapp}
      />
    </Hoc>
  );
};
