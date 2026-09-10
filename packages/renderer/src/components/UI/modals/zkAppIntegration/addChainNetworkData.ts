import {normalizeApiUrl} from '../../../../api/http';
import {INetworkOption, normalizeNetworkSettings} from '../../../../hooks/useNetworkSettings';

export function createAddChainNetworkData(url: string, name: string): INetworkOption {
  const legacyUrl = normalizeApiUrl(url);
  const restSettings = normalizeNetworkSettings({
    apiUrl: new URL(legacyUrl).origin,
    network: name,
    name,
    label: name,
  });
  if (!restSettings) {
    throw new Error('A valid HTTP(S) REST base is required');
  }
  return {...restSettings, url};
}
