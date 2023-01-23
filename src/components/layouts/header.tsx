import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Segment,
  Menu,
  Container,
  Button,
  Sidebar,
  Icon,
  Label
} from 'semantic-ui-react'
import { useRouter } from 'next/router';

import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { useCartItems } from '@/lib/hooks/useCartItems';
import { useScroll } from '@/lib/hooks/useScroll';
import { PageRoutes } from '@/lib/routes';

import { Dropdown } from '@/components/molecules/dropdown';
import { Image } from '@/components/atoms/image';

interface Props {
  children?: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  const { data: session } = useSession();
  const { isMobile } = useDeviceWidth();
  const router = useRouter();
  const { cartCount } = useCartItems();

  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { showHeader } = useScroll({ isMobile, isMounted });

  // fix hydration issue
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const handleToggleSidebar = () => setSidebarOpened(!sidebarOpened);

  const getIsActiveRoute = (route: PageRoutes) => {
    const { pathname } = router;
    return pathname === route || undefined;
  };

  const menuItems = (
    <>
      <Link href={`${PageRoutes.List}`}>
        <Menu.Item active={getIsActiveRoute(PageRoutes.List)}>Categorías</Menu.Item>
      </Link>
      <Link href={`${PageRoutes.ListTable}`}>
        <Menu.Item active={getIsActiveRoute(PageRoutes.ListTable)}>Lista</Menu.Item>
      </Link>
      <Link href={`${PageRoutes.Cart}`}>
        <Menu.Item active={getIsActiveRoute(PageRoutes.Cart)}>
          <Icon name="cart" />
          {'Carrito'}
          {cartCount > 0 ? <Label color="yellow">{cartCount}</Label> : null}
        </Menu.Item>
      </Link>
    </>
  );

  const menuItemsMobile = (
    <>
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
    <span className="pointer-events-auto">
      {session ? (
        <>
          <Icon name="user" /> Hola, {session?.user?.name}
        </>
      ) : (
        <>
          <Icon name="user" /> Hola, Invitado
        </>
      )}
    </span>
  );

  const renderMobile = () => {
    return (
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation="overlay" onHide={handleToggleSidebar} vertical visible={sidebarOpened}>
          {menuItems}
          {menuItemsMobile}
        </Sidebar>
        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment textAlign="center" className="header bg-primary-blue" style={{ padding: '0.25rem 0rem' }} vertical>
            <Container>
              <Menu secondary size="large">
                <Menu.Item onClick={handleToggleSidebar} position="left">
                  <Icon name="sidebar" />
                </Menu.Item>
                <Link href={`${PageRoutes.Home}`}>
                  <Image
                    // eslint-disable-next-line max-len
                    path="https://ik.imagekit.io/5wjtgrwr1/logo-no-slogan.png?ik-sdk-version=javascript-1.4.3&updatedAt=1674056851908"
                    alt="logo-vinoreo-header"
                    width={100}
                    height={100}
                    className="mt-1"
                  />
                </Link>
                {/* searchbar */}
                <Menu.Item position="right">
                  <Link href={PageRoutes.ListTable}>
                    <Icon name="search" />
                  </Link>
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
        <nav className="bg-primary-blue">
          <Menu
            fixed={'top'}
            className={`header ${!showHeader ? 'hidden' : ''}`}
            inverted={false}
            pointing
            secondary
            size="large"
          >
            <Container>
              <Menu className="relative flex w-full" secondary>
                <div className="flex">{menuItems}</div>
                <Link href={`${PageRoutes.Home}`}>
                  <div className="absolute left-[45%]">
                    <Image
                      // eslint-disable-next-line max-len
                      path="https://ik.imagekit.io/5wjtgrwr1/logo-no-slogan.png?ik-sdk-version=javascript-1.4.3&updatedAt=1674056851908"
                      alt="logo-vinoreo-header"
                      width={100}
                      height={100}
                      className="mt-1"
                    />
                  </div>
                </Link>
                <div className="ml-auto">
                  <Menu.Item>
                    {/* nextauth login */}
                    <Dropdown options={dropDownOptions} trigger={trigger} className={'p-0'} />
                  </Menu.Item>
                </div>
              </Menu>
            </Container>
          </Menu>
        </nav>
        <main className="mt-16">{children}</main>
      </>
    );
  };
  return isMobile ? renderMobile() : renderDesktop();
};
