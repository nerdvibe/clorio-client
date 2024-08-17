import Jdenticon from 'react-jdenticon';

const Avatar = ({
  address,
  size,
  className,
  radius,
}: {
  address: string;
  size?: number;
  className?: string;
  radius?: number;
}) => {
  return (
    <div
      className={`avatar ${className}`}
      style={{
        background: '#151a2e',
        borderRadius: radius ? `${radius}px` : '100px',
      }}
    >
      <Jdenticon
        size={`${size}` || '80'}
        value={address}
      />
    </div>
  );
};

export default Avatar;
