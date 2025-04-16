import { useEffect } from 'react';

export function useChangePageTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} - ClaveShift.com`;

    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
      ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleTag);
    }
    ogTitleTag.setAttribute('content', pageTitle);
  }, [pageTitle]);

  return 1;
}
