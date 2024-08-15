import {GET_HOME_NEWS, GET_VALIDATORS_NEWS} from '../graphql/query';
import {IHomeNewsQuery, IValidatorsNewsQuery} from '../types';
import {useQuery} from '@apollo/client';
import NewsBanner from './UI/NewsBanner';
import {useLocation} from 'react-router-dom';

export default function NewsSelector() {
  const location = useLocation();
  const {data: validatorsData} = useQuery<IValidatorsNewsQuery>(GET_VALIDATORS_NEWS);
  const {data: newsData} = useQuery<IHomeNewsQuery>(GET_HOME_NEWS);
  const news = newsData?.newsHome && newsData?.newsHome.length > 0 && newsData?.newsHome[0];
  const validators =
    validatorsData && validatorsData?.newsValidators.length > 0
      ? validatorsData?.newsValidators[0]
      : {};
  const showValidators = location.pathname.includes('stake');
  return (
    <>
      {!showValidators
        ? news && <NewsBanner {...news} />
        : validators && <NewsBanner {...validators} />}
    </>
  );
}
