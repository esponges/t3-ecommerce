import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  const [showHeader, setShowHeader] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(typeof window !== "undefined" ? window.scrollY : 0);
  // todo: move this logic to a hook

  useEffect(() => {
    if (!isMounted || isMobile) {
      return;
    }

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollUp = currentScrollPos < prevScrollPos;

      if (scrollUp) {
        setShowHeader(true);
      } else {
        if (currentScrollPos > 50) {
          setShowHeader(false);
        }
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, isMounted, prevScrollPos]);

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
        { label: 'Account', value: 'account', onClick: () => router.push('/auth/account') },
        { label: 'Logout', value: 'logout', onClick: () => signOut() },
        // { label: 'Settings', value: 'settings', onClick: () => console.log('settings') },
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
