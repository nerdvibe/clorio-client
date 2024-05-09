import type CSS from 'csstype';

interface IProps {
  text: string;
  progress: number;
}

const ProgressBar = ({ text, progress }: IProps) => {
  /**
   * Set progressbar color based on progress percentage
   * @returns color
   */
  const progressColor = () => {
    if (progress > 75) {
      return '#2A9D8F';
    }
    if (progress > 25) {
      return '#E9C46A';
    }
    return '#AA0000';
  };

  const containerStyles = {
    height: 50,
    width: '90%',
    backgroundColor: '#e0e0de',
    borderRadius: 20,
    margin: 50,
  };

  const fillerStyles: CSS.Properties = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: progressColor(),
    borderRadius: 'inherit',
    textAlign: 'right',
    padding: '10px',
    transition: '1s',
    maxWidth: '100%',
  };

  const labelStyles: CSS.Properties = {
    padding: '5 px',
    color: 'white',
    fontWeight: 'bold',
  };

  return (
    <div>
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles} className="my-auto">
            {' '}
            {text}{' '}
          </span>{' '}
        </div>{' '}
      </div>
    </div>
  );
};

export default ProgressBar;
