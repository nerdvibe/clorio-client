export const UpdateError = () => (
  <span>
    There was an error while updating the app. Go to{" "}
    <a href={process.env.REACT_APP_GITHUB_RELEASE_URL} className="github-link">
      github
    </a>{" "}
    and update manually.
  </span>
);
