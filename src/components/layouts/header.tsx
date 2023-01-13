import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Segment,
  Menu,
  Container,
  Button,
  Sidebar,
  Icon
} from 'semantic-ui-react'

import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { Dropdown } from '@/components/molecules/dropdown';
import { useRouter } from 'next/router';
import { useScroll } from '@/lib/hooks/useScroll';
import { PageRoutes } from '@/lib/routes';

interface Props {
  children?: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  const { data: session } = useSession();
  const { isMobile } = useDeviceWidth();
  const router = useRouter();

  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // todo: move this logic to a hook

  const { showHeader } = useScroll({ isMobile, isMounted });

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
      <Link href={`${PageRoutes.Home}`}>
        <Menu.Item active>Store</Menu.Item>
      </Link>
      <Link href={`${PageRoutes.Cart}`}>
        <Menu.Item>Cart</Menu.Item>
      </Link>
      <Link href={`${PageRoutes.List}`}>
        <Menu.Item>List</Menu.Item>
      </Link>
    </>
  );

  const dropDownOptions = session
    ? [
      { label: 'Account', value: 'account', onClick: () => router.push(PageRoutes.Account) },
      { label: 'Logout', value: 'logout', onClick: () => signOut() },
      // { label: 'Settings', value: 'settings', onClick: () => console.log('settings') },
    ]
    : [{ label: 'Login', value: 'login', onClick: () => router.push(PageRoutes.Login) }];

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

  const renderMobile = () => {
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
                <Link href={`${PageRoutes.Home}`}>
                  <Menu.Item active>Store</Menu.Item>
                </Link>
                <Menu.Item position="right">
                  {/* nextauth login */}
                  {!session ? (
                    <Link href={`${PageRoutes.Login}`}>
                      <Button variant="primary">Login</Button>
                    </Link>
                  ) : (
                    <>
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
  };

  const renderDesktop = () => {
    return (
      <>
        <Menu
          fixed={'top'}
          className={`header ${!showHeader ? 'hidden' : ''}`}
          inverted={false}
          pointing
          secondary
          size="large"
        >
          <Container>
            {menuItems}
            <Menu.Item position="right">
              {/* nextauth login */}
              <Dropdown options={dropDownOptions} trigger={trigger} className={'p-0'} />
            </Menu.Item>
          </Container>
        </Menu>
        <main className="mt-16">{children}</main>
      </>
    );
  };
  return isMobile ? renderMobile() : renderDesktop();
};
