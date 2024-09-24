import { useTranslation } from 'react-i18next';

interface IProps {
  version: string;
}

export const UpdateError = ({ version }: IProps) => {
  const { t } = useTranslation();

  return (
    <span>
      {t('update_error.there_is_a_new_release')} {version} <br />
      <a
        href={import.meta.env.VITE_REACT_APP_GITHUB_RELEASE_URL}
        target="_blank"
        rel="noreferrer"
        className="github-link"
      >
        {t('update_error.click_here')}
      </a>{' '}
      {t('update_error.to_download_the_update')}
    </span>
  );
};
