interface IProps {
  version: string;
}

export const UpdateError = ({ version }: IProps) => (
  <span>
    There is a new release 🎉 v{version} <br />
    <a
      href={import.meta.env.VITE_REACT_APP_GITHUB_RELEASE_URL}
      target="_blank"
      rel="noreferrer"
      className="github-link"
    >
      Click here
    </a>{' '}
    to download the update.
  </span>
);
