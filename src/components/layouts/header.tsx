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
} from 'semantic-ui-react';
import { useRouter } from 'next/router';

import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { useCartItems } from '@/lib/hooks/useCartItems';
import { useScroll } from '@/lib/hooks/useScroll';
import { PageRoutes } from '@/lib/routes';

import { Dropdown } from '@/components/molecules/dropdown';
import { Image } from '@/components/atoms/image';
import { env } from '@/env/client.mjs';

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
        <a>
          <Menu.Item active={getIsActiveRoute(PageRoutes.List)}>Products</Menu.Item>
        </a>
      </Link>
      <Link href={`${PageRoutes.ListTable}`}>
        <a>
          <Menu.Item active={getIsActiveRoute(PageRoutes.ListTable)}>Full List</Menu.Item>
        </a>
      </Link>
      <Link href={`${PageRoutes.Cart}`}>
        <a>
          <Menu.Item active={getIsActiveRoute(PageRoutes.Cart)}>
            <Icon name="cart" />
            Cart
            {cartCount > 0 ? <Label color="yellow">{cartCount}</Label> : null}
          </Menu.Item>
        </a>
      </Link>
    </>
  );

  const menuItemsMobile = !session ? (
    <>
      <Menu.Item position="right">
        <Link href={`${PageRoutes.Login}`}>
          <a>
            <Button variant="primary">Log In</Button>
          </a>
        </Link>
      </Menu.Item>
    </>
  ) : (
    <>
      <Menu.Item>
        <a>
          <Button variant="primary" onClick={() => signOut()}>
            Log Out
          </Button>
        </a>
      </Menu.Item>
      <Link href={`${PageRoutes.Account}`}>
        <a>
          <Menu.Item>
            <Button variant="primary">Welcome {session?.user?.name}</Button>
          </Menu.Item>
        </a>
      </Link>
    </>
  );

  const dropDownOptions = session
    ? [
      { label: 'Account', value: 'account', onClick: () => router.push(PageRoutes.Account) },
      { label: 'Log out', value: 'logout', onClick: () => signOut() },
      // { label: 'Settings', value: 'settings', onClick: () => console.log('settings') },
    ]
    : [{ label: 'Log out', value: 'login', onClick: () => router.push(PageRoutes.Login) }];

  const trigger = (
    <span className="cursor-pointer">
      <Icon name="user" />
      Hello {session?.user?.name || ', guest'}
    </span>
  );

  const renderSearchLink = () => {
    return (
      <Menu.Item position="right">
        <Link href={PageRoutes.ListTable}>
          <Icon name="search" />
        </Link>
      </Menu.Item>
    );
  };

  if (isMobile) {
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
                  <a>
                    <Image
                      // eslint-disable-next-line max-len
                      // pokemon api logo
                      src="raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
                      alt="logo-vinoreo-header"
                      width={100}
                      height={45}
                      className="mt-1"
                    />
                  </a>
                </Link>
                {renderSearchLink()}
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
                <div className="absolute left-[42%] hover:cursor-pointer">
                  <Image
                    // eslint-disable-next-line max-len
                    // src="/store-logo.png"
                    src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
                    alt={`logo-${env.NEXT_PUBLIC_STORE_NAME}-header`}
                    width={150}
                    height={45}
                    className="mt-1"
                  />
                </div>
              </Link>
              <div className="ml-auto flex">
                {renderSearchLink()}
                <Menu.Item>
                  {/* nextauth login */}
                  <Dropdown options={dropDownOptions} trigger={trigger} className='p-0 cursor-pointer' />
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
