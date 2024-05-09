import {Menu} from 'react-feather';

export const SidebarToggle = ({setToggled}: {setToggled: (value: boolean) => void}) => {
  return (
    <Menu
      className="toggle-menu-button"
      onClick={() => setToggled(true)}
      height={30}
      width={30}
    />
  );
};
