import Lottie from 'lottie-react';
import Animation from '../assets/connection-lost.json';

export default function LedgerSignError({message}: {message: string}) {
  return (
    <>
      <div style={{width: '50%', height: '200px'}}>
        <Lottie
          animationData={Animation}
          loop={2}
          rendererSettings={{
            className: 'ledger-sign-error-animation',
          }}
        />
      </div>
      <p
        className="w-75 text-center"
        style={{fontWeight: 200, fontSize: '16px'}}
      >
        {message}
        <br />
        Try again later
      </p>
    </>
  );
}
