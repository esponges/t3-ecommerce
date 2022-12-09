import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Visibility, Segment, Menu, Container, Button, Sidebar, Icon } from 'semantic-ui-react';
import { useDeviceWidth } from '../../lib/hooks/useDeviceWidth';

// import { Button } from '../atoms/button';

interface Props {
  children?: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  const { data: session } = useSession();
  const { isMobile } = useDeviceWidth();
  // const isMobile = true;

  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleToggleSidebar = () => setSidebarOpened(!sidebarOpened);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // might be usefull in the future
  // const handleHideFixedMenu = () => setFixed(false);
  // const handleShowFixedMenu = () => setFixed(true);
  console.log('isMobile', isMobile);

  if (isMobile) {
    return (
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation="overlay" onHide={handleToggleSidebar} vertical visible={sidebarOpened}>
          <Menu.Item as="a" active>
            <Link href="/">
              <a className="text-2xl font-bold">Store</a>
            </Link>
          </Menu.Item>
          <Menu.Item as="a">
            <Link href="/cart">
              <a className="ml-4 text-2xl font-bold">Cart</a>
            </Link>
          </Menu.Item>
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
                    <Button variant="primary" onClick={() => signIn('discord')}>
                      Login
                    </Button>
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
          <main>
            {children}
          </main>
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
              <Menu.Item as="a" active>
                <Link href="/">
                  <a className="text-2xl font-bold">Store</a>
                </Link>
              </Menu.Item>
              <Menu.Item as="a">
                <Link href="/cart">
                  <a className="ml-4 text-2xl font-bold">Cart</a>
                </Link>
              </Menu.Item>
              <Menu.Item position="right">
                {/* nextauth login */}
                {!session ? (
                  <Button variant="primary" onClick={() => signIn('discord')}>
                    Login
                  </Button>
                ) : (
                  <>
                    <p className="mr-4">Hello —{session.user?.name}—</p>
                    <Button variant="primary" onClick={() => signOut()}>
                      Logout
                    </Button>
                  </>
                )}
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
      </Visibility>
      <main>
        {children}
      </main>
    </>
  );
};
