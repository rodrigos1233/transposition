import {
    enharmonicGroupTransposer,
    enharmonicGroupTransposerReverse,
} from '../utils/transposer';
import { NavigateFunction } from 'react-router-dom';

type RouteHandler = (params: string[], navigate: NavigateFunction) => void;

const routeHandlers: Record<string, RouteHandler> = {
    'note/scale-cross-instruments': (params, navigate) => {
        const [originKeyString, noteString, targetKeyString] = params;
        const note = Number(noteString);
        const chosenNote = enharmonicGroupTransposerReverse(note, 0);
        navigate(
            `scale-cross-instruments/${originKeyString}-${chosenNote}-${targetKeyString}-0`
        );
    },
    'scale-cross-instruments/note': (params, navigate) => {
        const [originKeyString, noteString, targetKeyString] = params;
        const note = Number(noteString);
        const chosenNote = enharmonicGroupTransposer(note);
        navigate(`note/${originKeyString}-${chosenNote}-${targetKeyString}`);
    },
    'scale-intervals/scale-cross-instruments': (params, navigate) => {
        const [originKeyString, intervalString] = params;
        const interval = Number(intervalString);
        const originKey = Number(originKeyString);
        let targetKey = interval + originKey;
        if (targetKey > 11) {
            targetKey -= 12;
        }
        if (targetKey < 0) {
            targetKey += 12;
        }
        navigate(`scale-cross-instruments/${originKey}-0-${targetKey}-0`);
    },
    'scale-intervals/note': (params, navigate) => {
        const [originKeyString, intervalString, directionString] = params;
        const interval = Number(intervalString);
        const originKey = Number(originKeyString);

        let targetKey =
            directionString === 'up'
                ? originKey + interval
                : originKey - interval;

        if (targetKey > 11) {
            targetKey -= 12;
        }
        if (targetKey < 0) {
            targetKey += 12;
        }
        navigate(`note/${originKey}-0-${targetKey}`);
    },
    'scale-cross-instruments/scale-intervals': (params, navigate) => {
        const [originKeyString, noteString, targetKeyString] = params;
        const originKey = Number(originKeyString);
        const targetKey = Number(targetKeyString);
        let interval = targetKey - originKey;
        if (interval < 0) {
            interval += 12;
        }
        navigate(
            `scale-intervals/${originKey}-${interval}-${
                originKey < targetKey ? 'up' : 'down'
            }`
        );
    },
    'note/scale-intervals': (params, navigate) => {
        const [originKeyString, noteString, targetKeyString] = params;
        const originKey = Number(originKeyString);
        const targetKey = Number(targetKeyString);
        let interval = targetKey - originKey;
        if (interval < 0) {
            interval += 12;
        }
        navigate(
            `scale-intervals/${originKey}-${interval}-${
                originKey < targetKey ? 'up' : 'down'
            }`
        );
    },
};

function parseParams(location: string, prefixLength: number): string[] {
    return location.substring(prefixLength).split('-');
}

export function handleNavigate(navigate: NavigateFunction, path: string) {
    const location = window.location.pathname.substring(1);

    for (const [key, handler] of Object.entries(routeHandlers)) {
        const [currentPath, targetPath] = key.split('/');
        if (location.startsWith(currentPath) && path === `/${targetPath}`) {
            const params = parseParams(location, currentPath.length + 1);
            handler(params, navigate);
            return;
        }
    }

    // Default navigation if no handlers match
    navigate(path);
}
