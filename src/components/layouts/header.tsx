import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Visibility, Segment, Menu, Container, Button } from 'semantic-ui-react';

// import { Button } from '../atoms/button';

export const Header = () => {
  const { data: session } = useSession();

  // might be usefull in the future
  // const handleHideFixedMenu = () => setFixed(false);
  // const handleShowFixedMenu = () => setFixed(true);

  return (
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
  );
};
