import {Link, useNavigate} from 'react-router-dom';
import {Cpu, LogIn, TrendingUp, Edit3, Check, Code} from 'react-feather';
import Logo from '../logo/Logo';
import {clearAllAccounts, clearSession} from '../../../tools';
import {isRouteActiveClass} from './SidebarHelper';
import {useContext, useState} from 'react';
import type {ILedgerContext} from '../../../contexts/ledger/LedgerTypes';
import {LedgerContext} from '../../../contexts/ledger/LedgerContext';
import type {INetworkData} from '/@/types';
import useSecureStorage from '/@/hooks/useSecureStorage';
import {Menu, Sidebar, MenuItem} from 'react-pro-sidebar';
import './SidebarToggle';
import {createRoot} from 'react-dom/client';
import {SidebarToggle} from './SidebarToggle';
import AppSettings from './AppSettings';
import {useWallet} from '/@/contexts/WalletContext';

interface IProps {
  mnemonic?: boolean;
  network?: INetworkData;
  clearSessionData: () => void;
  toggleLoader: (state?: boolean) => void;
}

export const CustomSidebar = ({network, mnemonic, clearSessionData, toggleLoader}: IProps) => {
  const [toggled, setToggled] = useState(false);
  const {updateWallet} = useWallet();

  /**
   * Show private key backup modal
   */

  const {isLedgerEnabled} = useContext<Partial<ILedgerContext>>(LedgerContext);
  const navigate = useNavigate();
  const {clearData} = useSecureStorage();
  const statusDot = network?.nodeInfo ? (
    <span className="green-dot" />
  ) : (
    <span className="red-dot" />
  );
  /**
   * Clear session data and go back to splashscreen
   */
  const logout = async () => {
    await clearSession();
    await clearData();
    await clearAllAccounts();
    navigate('/');
    clearSessionData();
  };

  /**
   * Clear session data and go back to splashscreen
   */
  const lockSession = async () => {
    await clearSession();
    await updateWallet({});
    clearSessionData();
    navigate('/');
  };

  const root = createRoot(document.getElementById('draggable-bar'));
  root.render(<SidebarToggle setToggled={setToggled} />);

  return (
    <div>
      <Sidebar
        toggled={toggled}
        customBreakPoint="1000px"
        onBackdropClick={setToggled}
      >
        <Menu>
          <MenuItem className="logo-sidebar-item">
            <Logo />
          </MenuItem>
          <hr />
          <Link
            to="/overview"
            className="sidebar-item selected-item"
          >
            <MenuItem className={'sidebar-item-container ' + isRouteActiveClass('overview')}>
              {' '}
              <span>
                <Cpu /> Overview
              </span>
            </MenuItem>
          </Link>
          <Link
            to="/send-tx"
            className="sidebar-item"
          >
            <MenuItem className={'sidebar-item-container ' + isRouteActiveClass('send-tx')}>
              {' '}
              <span>
                <LogIn /> Send TX
              </span>
            </MenuItem>
          </Link>
          <Link
            to="/stake"
            className="sidebar-item"
          >
            <MenuItem className={'sidebar-item-container ' + isRouteActiveClass('stake')}>
              {' '}
              <span>
                <TrendingUp /> Staking Hub
              </span>
            </MenuItem>
          </Link>

          {!isLedgerEnabled && (
            <Link
              to="/sign-message"
              className="sidebar-item"
            >
              <MenuItem className={'sidebar-item-container ' + isRouteActiveClass('sign-message')}>
                {' '}
                <span>
                  <Edit3 /> Sign message
                </span>
              </MenuItem>
            </Link>
          )}
          <Link
            to="/verify-message"
            className="sidebar-item"
          >
            <MenuItem className={'sidebar-item-container ' + isRouteActiveClass('verify-message')}>
              {' '}
              <span>
                <Check /> Verify message
              </span>
            </MenuItem>
          </Link>

          <Link
            to="/zkapps"
            className="sidebar-item"
          >
            <MenuItem
              className={'sidebar-item-container ' + isRouteActiveClass('zkapps')}
              disabled
            >
              {' '}
              <span>
                <Code /> zkApps
              </span>
            </MenuItem>
          </Link>
        </Menu>
        <div className="sidebar-footer-block">
          <div>
            <AppSettings
              toggleLoader={toggleLoader}
              lockSession={lockSession}
              logout={logout}
              network={network}
              statusDot={statusDot}
              isUsingMnemonic={mnemonic}
            />
          </div>
        </div>
      </Sidebar>
    </div>
  );
};
