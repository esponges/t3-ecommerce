import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Segment, Menu, Container, Button, Sidebar, Icon } from 'semantic-ui-react';

import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { Dropdown } from '@/components/molecules/dropdown';
import { useRouter } from 'next/router';

interface Props {
  children?: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  const { data: session } = useSession();
  const { isMobile } = useDeviceWidth();
  const router = useRouter();

  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const ref = useRef(null);

  const handleToggleSidebar = () => setSidebarOpened(!sidebarOpened);

  // fix hydration issue
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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

  const dropDownOptions = session
    ? [
        { label: 'Logout', value: 'logout', onClick: () => signOut() },
        { label: 'Account', value: 'account', onClick: () => router.push('/auth/account') },
        { label: 'Settings', value: 'settings', onClick: () => console.log('settings') },
      ]
    : [{ label: 'Login', value: 'login', onClick: () => router.push('/auth') }];

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
      <Segment textAlign="center" vertical>
        <Menu fixed={'top'} ref={ref} inverted={false} pointing secondary size="large">
          <Container>
            {menuItems}
            <Menu.Item position="right">
              {/* nextauth login */}
              <Dropdown options={dropDownOptions} trigger={trigger} className={'p-0'} />
            </Menu.Item>
          </Container>
        </Menu>
      </Segment>
      <main className="mt-16">{children}</main>
    </>
  );
};
