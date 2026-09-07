import {act, type ReactNode} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const mocks = vi.hoisted(() => ({
  context: {
    settings: null as null | {
      apiUrl: string;
      network: string;
      label: string;
      name: string;
      url?: string;
    },
    isInitialized: false,
    saveSettings: vi.fn(),
    setAvailableNetworks: vi.fn(),
  },
  recoilState: {selectedNetwork: undefined, selectedNode: undefined},
  setNetworkState: vi.fn(),
}));

vi.mock('../contexts/NetworkContext', () => ({
  useNetworkSettingsContext: () => mocks.context,
  formatNetworks: (data: unknown) => Object.values(data as Record<string, unknown>),
  findMatchingNetwork: (networks: Array<{label: string}>, settings: {label: string} | null) =>
    networks.find(network => network.label === settings?.label) ?? null,
}));
vi.mock('recoil', () => ({
  useRecoilState: () => [mocks.recoilState, mocks.setNetworkState],
}));
vi.mock('../store', () => ({networkState: {}}));
vi.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({children}: {children: ReactNode}) => children,
}));
vi.mock('@apollo/client', () => ({
  ApolloProvider: ({children}: {children: ReactNode}) => children,
}));
vi.mock('../contexts/balance/BalanceContext', () => ({
  BalanceContextProvider: ({children}: {children: ReactNode}) => children,
}));
vi.mock('../contexts/ledger/LedgerContext', () => ({
  LedgerContextProvider: ({children}: {children: ReactNode}) => children,
}));
vi.mock('react-router-dom', () => ({
  HashRouter: ({children}: {children: ReactNode}) => children,
}));
vi.mock('../Layout', () => ({default: () => <div>Wallet</div>}));
vi.mock('../graphql/api', () => ({apolloClient: vi.fn(() => ({}))}));
vi.mock('../api/queryClient', () => ({queryClient: {}}));
vi.mock('../tools', () => ({clearSession: vi.fn()}));
vi.mock('../dev-tools/DevTools', () => ({default: () => null}));

import App from '../App';

(globalThis as typeof globalThis & {IS_REACT_ACT_ENVIRONMENT: boolean}).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('App network bootstrap', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    mocks.context.settings = null;
    mocks.context.isInitialized = false;
    mocks.context.saveSettings.mockReset().mockReturnValue(true);
    mocks.context.setAvailableNetworks.mockReset();
    mocks.setNetworkState.mockReset();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it('shows configuration guidance only after settings initialization fails closed', async () => {
    await act(async () => root.render(<App />));
    expect(container.querySelector('[role="alert"]')).toBeNull();

    mocks.context.isInitialized = true;
    await act(async () => root.render(<App />));

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Network configuration required');
  });

  it('saves a label match with a changed API URL before selecting it for Apollo', async () => {
    const events: string[] = [];
    const selected = {
      apiUrl: 'https://new-api.example.com',
      url: 'https://graphql.example.com',
      network: 'mainnet',
      label: 'mainnet',
      name: 'Mainnet',
    };
    mocks.context.settings = {
      ...selected,
      apiUrl: 'https://old-api.example.com',
    };
    mocks.context.isInitialized = true;
    mocks.context.saveSettings.mockImplementation(() => {
      events.push('save');
      return true;
    });
    mocks.setNetworkState.mockImplementation(updater => {
      const next = updater(mocks.recoilState);
      if (next.selectedNode) events.push('select');
    });
    vi.mocked(fetch).mockResolvedValue({json: async () => ({mainnet: selected})} as Response);

    await act(async () => {
      root.render(<App />);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mocks.context.saveSettings).toHaveBeenCalledWith(selected);
    expect(events).toEqual(['save', 'select']);
  });
});
