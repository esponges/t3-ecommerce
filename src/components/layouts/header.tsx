import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Visibility, Segment, Menu, Container, Button, Sidebar, Icon } from 'semantic-ui-react';

import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { Dropdown } from '@/components/molecules/dropdown';

interface Props {
  children?: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  const { data: session } = useSession();
  const { isMobile } = useDeviceWidth();

  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleToggleSidebar = () => setSidebarOpened(!sidebarOpened);

  // fix hydration issue
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // might be usefull in the future for the desktop header
  // const handleHideFixedMenu = () => setFixed(false);
  // const handleShowFixedMenu = () => setFixed(true);

  const menuItems = (
    <>
      <Link href="/">
        <Menu.Item active>Store</Menu.Item>
      </Link>
      <Link href="/cart">
        <Menu.Item>Cart</Menu.Item>
      </Link>
      <Link href="/d">
        <Menu.Item>Dashboard</Menu.Item>
      </Link>
    </>
  );

  const dropDownOptions = [
    { label: 'Account', value: 'account', onClick: () => console.log('account') },
    { label: 'Settings', value: 'settings', onClick: () => console.log('settings') },
    session
      ? { label: 'Logout', value: 'logout', onClick: () => signOut() }
      : { label: 'Login', value: 'login', onClick: () => console.log('login') },
  ];

  const trigger = (
    <span>
      {session ? (
        <>
          <Icon name="user" /> Hello, {session?.user?.name}
        </>
      ) : (
        <>
          <Icon name="user" /> Hello, Guest
        </>
      )}
    </span>
  );

  if (isMobile) {
    return (
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation="overlay" onHide={handleToggleSidebar} vertical visible={sidebarOpened}>
          {menuItems}
        </Sidebar>
        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment textAlign="center" style={{ /*  minHeight: '100vh',  */ padding: '1em 0em' }} vertical>
            <Container>
              <Menu secondary size="large">
                <Menu.Item onClick={handleToggleSidebar}>
                  <Icon name="sidebar" />
                </Menu.Item>
                <Menu.Item position="right">
                  {/* nextauth login */}
                  {!session ? (
                    <Link href="/auth">
                      <Button variant="primary">Login</Button>
                    </Link>
                  ) : (
                    <>
                      <p className="mr-4">Hello —{session.user?.name}—</p>

                      <Button variant="primary" onClick={() => signOut()}>
                        Logout
                      </Button>
                    </>
                  )}
                </Menu.Item>
              </Menu>
            </Container>
            {/* <HomepageHeading mobile /> */}
          </Segment>
          <main>{children}</main>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
  return (
    <>
      <Visibility
        once={false}
        // onBottomPassed={handleHideFixedMenu}
        // onBottomPassedReverse={handleShowFixedMenu}
      >
        <Segment textAlign="center" vertical>
          <Menu fixed={'top'} inverted={false} pointing secondary size="large">
            <Container>
              {menuItems}
              <Menu.Item position="right">
                {/* nextauth login */}
                <Dropdown options={dropDownOptions} trigger={trigger} className={'p-0'} />
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
      </Visibility>
      <main className="mt-16">{children}</main>
    </>
  );
};
