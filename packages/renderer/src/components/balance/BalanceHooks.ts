import {useEffect, useContext, useMemo, useRef, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {useQuery as useRestQuery} from '@tanstack/react-query';
import {walletState} from '/@/store';
import {BalanceContext} from '../../contexts/balance/BalanceContext';
import {IBalanceContext} from '../../contexts/balance/BalanceTypes';
import {getTicker} from '../../api/content';
import {getAccount, AccountData} from '../../api/account';
import {useNetworkSettingsContext} from '../../contexts/NetworkContext';
import {DEFAULT_QUERY_REFRESH_INTERVAL} from '../../tools';
import {IBalanceQueryResult, ITicker} from './BalanceTypes';

export const useElementWidth = (offset = 150) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width - offset);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [offset]);

  return {ref, width};
};

export const toBalanceQueryResult = (account: AccountData): IBalanceQueryResult => ({
  accountByKey: {
    balance: {
      total: Number(account.balance.total),
      liquid: Number(account.balance.liquid),
      locked: Number(account.balance.locked),
      liquidUnconfirmed: Number(account.balance.liquidUnconfirmed),
      unconfirmedTotal: Number(account.balance.unconfirmedTotal),
    },
  },
});

export const useBalanceData = () => {
  const wallet = useRecoilValue(walletState);
  const {address} = wallet;
  const {settings} = useNetworkSettingsContext();

  const {
    addBalance,
    setBalanceContext,
    shouldBalanceUpdate,
    setShouldBalanceUpdate,
    balanceData: balance,
  } = useContext<Partial<IBalanceContext>>(BalanceContext);

  const {
    data: tickerData,
    isLoading: tickerLoading,
    error: tickerError,
  } = useRestQuery<ITicker>({
    queryKey: ['ticker', settings?.apiUrl],
    queryFn: () => getTicker(settings!.apiUrl),
    enabled: Boolean(settings),
  });

  const formatBalanceForContext = (balance: any) => ({
    liquid: String(balance.liquid),
    liquidUnconfirmed: String(balance.liquidUnconfirmed),
    locked: String(balance.locked),
    total: String(balance.total),
    unconfirmedTotal: String(balance.unconfirmedTotal),
  });

  const {
    data: accountData,
    isLoading: accountLoading,
    isFetching: accountFetching,
    error: accountError,
    refetch: balanceRefetch,
  } = useRestQuery({
    queryKey: ['account', settings?.apiUrl, address],
    queryFn: () => getAccount(settings!.apiUrl, address),
    enabled: Boolean(settings && address),
    refetchInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });
  const balanceData = useMemo(
    () => (accountData ? toBalanceQueryResult(accountData) : undefined),
    [accountData],
  );
  const balanceLoading = accountLoading || accountFetching;
  const balanceError = accountError;

  useEffect(() => {
    const refetchBalance = async () => {
      if (shouldBalanceUpdate) {
        await balanceRefetch();
        if (setShouldBalanceUpdate) {
          setShouldBalanceUpdate(false);
        }
      }
    };
    refetchBalance();
  }, [shouldBalanceUpdate, balanceRefetch, address, setShouldBalanceUpdate]);

  useEffect(() => {
    // If balance is available set it inside the component state and the balance context
    if (balanceData?.accountByKey?.balance) {
      if (setBalanceContext && addBalance) {
        addBalance(address, formatBalanceForContext(balanceData.accountByKey.balance));
      }
    }
  }, [balanceData, addBalance, setBalanceContext, address]);

  const storedUserBalance =
    (balance?.balances[address] && balance?.balances[address].unconfirmedTotal) || 0;
  const userBalance =
    Number(balanceData?.accountByKey?.balance?.unconfirmedTotal) ||
    Number(storedUserBalance) ||
    0;

  return {
    address,
    tickerData,
    tickerLoading,
    tickerError,
    balanceData,
    balanceLoading,
    balanceError,
    userBalance,
  };
};
