import { NavigateFunction } from 'react-router-dom';

type RouteHandler = (params: string[], navigate: NavigateFunction) => void;

function parseNoteParams(location: string): string[] {
  const path = location.startsWith('note/') ? location.substring(5) : location;
  return path.split('-');
}

function parseScaleQueryParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

const routeHandlers: Record<string, RouteHandler> = {
  'note/scale': (params, navigate) => {
    const [originKeyString, , targetKeyString] = params;
    navigate(
      `scale?from_key=${originKeyString}&scale=0&to_key=${targetKeyString}&mode=0`
    );
  },
  'scale/note': (_params, navigate) => {
    const searchParams = parseScaleQueryParams();
    const fromKey = searchParams.get('from_key') || '0';
    const toKey = searchParams.get('to_key') || '0';
    navigate(`note/${fromKey}-0-${toKey}`);
  },
};

export function handleNavigate(navigate: NavigateFunction, path: string) {
  const location = window.location.pathname.substring(1);

  // Handle transitions from note page
  if (location.startsWith('note') && path === '/scale') {
    const params = parseNoteParams(location);
    routeHandlers['note/scale'](params, navigate);
    return;
  }

  // Handle transitions from scale page
  if (location.startsWith('scale') && path === '/note') {
    routeHandlers['scale/note']([], navigate);
    return;
  }

  // Default navigation
  navigate(path);
}
