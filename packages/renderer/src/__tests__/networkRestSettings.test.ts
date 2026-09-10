import {QueryClient} from '@tanstack/react-query';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {
  getEnvironmentNetworkSettings,
  loadNetworkSettings,
  normalizeNetworkSettings,
  removeOldNetworkQueries,
  saveNetworkSettings,
} from '../hooks/useNetworkSettings';
import {findMatchingNetwork, formatNetworks} from '../contexts/NetworkContext';
import {getCurrentNetConfig} from '../tools/zkapp';
import {createAddChainNetworkData} from '../components/UI/modals/zkAppIntegration/addChainNetworkData';

const mainnet = {
  apiUrl: 'https://api.example.com/v1',
  network: 'mainnet',
  label: 'mainnet',
  name: 'Mainnet',
};

describe('REST network settings', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllEnvs();
  });

  it('normalizes an explicit REST API URL and removes the legacy URL', () => {
    expect(
      normalizeNetworkSettings({
        ...mainnet,
        apiUrl: 'https://api.example.com/v1///',
        url: 'https://graphql.example.com/v1/graphql',
      }),
    ).toEqual(mainnet);
  });

  it('uses only the explicit API environment variable for REST defaults', () => {
    vi.stubEnv('VITE_REACT_APP_NETWORK', 'mainnet');
    vi.stubEnv('VITE_REACT_APP_GQL_SERVER', 'https://graphql.example.com/v1/graphql');
    vi.stubEnv('VITE_REACT_APP_API_SERVER', '');
    expect(getEnvironmentNetworkSettings()).toBeNull();

    vi.stubEnv('VITE_REACT_APP_API_SERVER', 'https://api.example.com/v1/');
    expect(getEnvironmentNetworkSettings()).toEqual({...mainnet, name: 'mainnet'});
  });

  it('migrates a persisted legacy URL to its HTTP origin exactly once', () => {
    localStorage.setItem(
      'networkSettings',
      JSON.stringify({
        url: 'https://legacy.example.com/v1/graphql?network=mainnet',
        network: 'mainnet',
        label: 'mainnet',
        name: 'Mainnet',
      }),
    );

    expect(loadNetworkSettings(localStorage, null)).toEqual({
      apiUrl: 'https://legacy.example.com',
      network: 'mainnet',
      label: 'mainnet',
      name: 'Mainnet',
    });
    const migrated = localStorage.getItem('networkSettings');
    expect(migrated).toBe(
      '{"apiUrl":"https://legacy.example.com","network":"mainnet","label":"mainnet","name":"Mainnet"}',
    );

    expect(loadNetworkSettings(localStorage, null)).toEqual({
      apiUrl: 'https://legacy.example.com',
      network: 'mainnet',
      label: 'mainnet',
      name: 'Mainnet',
    });
    expect(localStorage.getItem('networkSettings')).toBe(migrated);
  });

  it.each([
    undefined,
    {},
    {apiUrl: ''},
    {apiUrl: 'ws://api.example.com'},
    {apiUrl: 'https://user:secret@api.example.com'},
    {url: 'https://legacy.example.com/v1/graphql'},
    {url: '/v1/graphql'},
    {url: 'not a URL'},
  ])('fails closed without a valid explicit REST base: %j', value => {
    expect(normalizeNetworkSettings(value)).toBeNull();
  });

  it('does not infer an API URL while saving a legacy-shaped selection', () => {
    localStorage.setItem('networkSettings', JSON.stringify(mainnet));

    // @ts-expect-error Public save input requires an explicit apiUrl.
    expect(saveNetworkSettings(localStorage, {url: 'https://legacy.example.com/graphql'})).toBeNull();
    expect(JSON.parse(localStorage.getItem('networkSettings') || 'null')).toEqual(mainnet);
  });

  it('saves only settings with an explicit API URL', () => {
    expect(
      saveNetworkSettings(localStorage, {
        apiUrl: 'https://custom.example.com/v1/',
        network: 'custom',
        label: 'custom',
        name: 'Custom',
        epochUrl: 'https://epochs.example.com',
        explorerUrl: 'https://explorer.example.com',
      }),
    ).toEqual({
      apiUrl: 'https://custom.example.com/v1',
      network: 'custom',
      label: 'custom',
      name: 'Custom',
      epochUrl: 'https://epochs.example.com',
      explorerUrl: 'https://explorer.example.com',
    });
    expect(JSON.parse(localStorage.getItem('networkSettings') || 'null')).toEqual({
      apiUrl: 'https://custom.example.com/v1',
      network: 'custom',
      label: 'custom',
      name: 'Custom',
      epochUrl: 'https://epochs.example.com',
      explorerUrl: 'https://explorer.example.com',
    });
  });

  it('preserves the exact Apollo URL while deriving the REST API origin for added chains', () => {
    expect(createAddChainNetworkData('https://node.example/graphql/', 'custom')).toEqual({
      apiUrl: 'https://node.example',
      url: 'https://node.example/graphql/',
      network: 'custom',
      label: 'custom',
      name: 'custom',
    });
  });

  it('rejects remote networks without explicit API URLs or complete identity fields', () => {
    expect(
      formatNetworks({
        mainnet: {
          apiUrl: 'https://api.example.com/v1/',
          url: 'https://graphql.example.com/v1/graphql',
          network: 'mainnet',
          label: 'mainnet',
          name: 'Mainnet',
        },
        legacy: {
          url: 'https://legacy.example.com/graphql',
          network: 'legacy',
          label: 'legacy',
          name: 'Legacy',
        },
        missingNetwork: {
          apiUrl: 'https://missing-network.example.com',
          label: 'missing-network',
          name: 'Missing network',
        },
        blankLabel: {
          apiUrl: 'https://blank-label.example.com',
          network: 'blank-label',
          label: '   ',
          name: 'Blank label',
        },
        missingName: {
          apiUrl: 'https://missing-name.example.com',
          network: 'missing-name',
          label: 'missing-name',
        },
      }),
    ).toEqual([
      {
        ...mainnet,
        url: 'https://graphql.example.com/v1/graphql',
        networkID: 'mina:mainnet',
      },
    ]);
  });

  it.each([
    ['apiUrl', {...mainnet, label: 'other', name: 'Other'}],
    ['label', {...mainnet, apiUrl: 'https://other.example.com', name: 'Other'}],
    ['name', {...mainnet, apiUrl: 'https://other.example.com', label: 'other'}],
  ])('matches an available network by %s', (_field, settings) => {
    const networks = [
      {
        apiUrl: 'https://api.example.com/v1',
        network: 'mainnet',
        label: 'mainnet',
        name: 'Mainnet',
      },
      {
        apiUrl: 'https://dev.example.com/v1',
        network: 'devnet',
        label: 'devnet',
        name: 'Devnet',
      },
    ];

    expect(findMatchingNetwork(networks, settings)).toEqual(networks[0]);
  });

  it('prefers an apiUrl match over an earlier label match', () => {
    const networks = [
      {...mainnet, apiUrl: 'https://wrong.example.com', name: 'Wrong'},
      {...mainnet, label: 'other'},
    ];

    expect(findMatchingNetwork(networks, mainnet)).toEqual(networks[1]);
  });

  it('fails closed when there are no valid selected settings to match', () => {
    expect(findMatchingNetwork([mainnet], null)).toBeNull();
  });

  it('does not match different apiUrls through empty labels or names', () => {
    expect(
      findMatchingNetwork(
        [{...mainnet, apiUrl: 'https://first.example.com', label: '', name: ''}],
        {...mainnet, apiUrl: 'https://second.example.com', label: '', name: ''},
      ),
    ).toBeNull();
  });

  it('removes only old-network queries when apiUrl changes', () => {
    const client = new QueryClient();
    client.setQueryData(['account', 'https://old.example.com', 'B62account'], 'old');
    client.setQueryData(['account', 'https://new.example.com', 'B62account'], 'new');
    client.setQueryData(['global'], 'global');

    removeOldNetworkQueries(client, 'https://old.example.com', 'https://new.example.com');

    expect(client.getQueryData(['account', 'https://old.example.com', 'B62account'])).toBeUndefined();
    expect(client.getQueryData(['account', 'https://new.example.com', 'B62account'])).toBe('new');
    expect(client.getQueryData(['global'])).toBe('global');
  });

  it('keeps current-network queries when apiUrl is unchanged', () => {
    const client = new QueryClient();
    client.setQueryData(['account', mainnet.apiUrl], 'cached');

    removeOldNetworkQueries(client, mainnet.apiUrl, mainnet.apiUrl);

    expect(client.getQueryData(['account', mainnet.apiUrl])).toBe('cached');
  });

  it('preserves the canonical empty-settings Mainnet fallback', () => {
    vi.stubEnv('VITE_REACT_APP_NETWORK', '');

    expect(getCurrentNetConfig()).toEqual({netType: 'mainnet', name: 'Mainnet'});
  });
});
