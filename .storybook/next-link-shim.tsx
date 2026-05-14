// next/link shim for Storybook — renders a plain <a>.
// Header + Footer components import `next/link` for prefetching + client-side
// routing in a real Next.js app. Storybook runs without a Next.js context,
// so we alias to this stub. Mirrors the Next.js public API surface our
// components actually consume (href, className, children, target, rel).

import { AnchorHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
  // Next.js-specific props that don't matter in Storybook
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
  locale?: string | false;
  as?: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, as, ...rest },
  ref,
) {
  return <a ref={ref} {...rest} />;
});

export default Link;
