import {HeaderQuery} from 'storefrontapi.generated';
import {HeaderProps} from './types/HeaderProps';
import {Viewport} from './types/Viewport';
import {useRootLoaderData} from '~/lib/root-data';
import {NavLink} from '@remix-run/react';
import {activeLinkStyle} from './functions/activeLinkStyle';
import {FALLBACK_HEADER_MENU} from './graphql/fallbackHeaderMenu';

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="text-red-500"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            // style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}
