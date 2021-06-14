interface IProps {
  version: string;
}

export const UpdateError = ({ version }: IProps) => (
  <span>
    There is a new release 🎉 v{version} <br />
    <a href={process.env.REACT_APP_GITHUB_RELEASE_URL} className="github-link">
      Click here
    </a>{" "}
    to download the update.
  </span>
);
