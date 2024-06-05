import Jdenticon from 'react-jdenticon';

const Avatar = ({
  address,
  size,
  className,
}: {
  address: string;
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className={className}
      style={{background: '#151a2e', borderRadius: '100px'}}
    >
      <Jdenticon
        size={`${size}` || '80'}
        value={address}
      />
    </div>
  );
};

export default Avatar;
