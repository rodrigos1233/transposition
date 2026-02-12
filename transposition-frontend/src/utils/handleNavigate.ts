import { NavigateFunction } from 'react-router-dom';

function parseQueryParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

type RouteHandler = (navigate: NavigateFunction) => void;

const routeHandlers: Record<string, RouteHandler> = {
  'note/scale': (navigate) => {
    const searchParams = parseQueryParams();
    const fromKey = searchParams.get('from_key') || '0';
    const toKey = searchParams.get('to_key') || '0';
    navigate(
      `scale?from_key=${fromKey}&scale=0&to_key=${toKey}&mode=0`
    );
  },
  'scale/note': (navigate) => {
    const searchParams = parseQueryParams();
    const fromKey = searchParams.get('from_key') || '0';
    const toKey = searchParams.get('to_key') || '0';
    navigate(`note?from_key=${fromKey}&note=0&to_key=${toKey}`);
  },
};

export function handleNavigate(navigate: NavigateFunction, path: string) {
  const location = window.location.pathname.substring(1);

  // Handle transitions from note page
  if (location.startsWith('note') && path === '/scale') {
    routeHandlers['note/scale'](navigate);
    return;
  }

  // Handle transitions from scale page
  if (location.startsWith('scale') && path === '/note') {
    routeHandlers['scale/note'](navigate);
    return;
  }

  // Default navigation
  navigate(path);
}
