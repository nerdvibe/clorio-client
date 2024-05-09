import {IBalanceQueryResult} from './BalanceTypes';
import {toMINA} from '/@/tools';

export const balanceTooltip = (balanceData?: IBalanceQueryResult) => {
  +(balanceData?.accountByKey?.balance?.locked || 0) > 0
    ? `Locked: ${
        balanceData?.accountByKey?.balance?.locked
          ? toMINA(balanceData.accountByKey.balance.locked)
          : 0
      } Mina <br/> Liquid: ${
        balanceData?.accountByKey?.balance?.liquid
          ? toMINA(balanceData.accountByKey.balance.liquid)
          : 0
      } Mina`
    : '';
};
