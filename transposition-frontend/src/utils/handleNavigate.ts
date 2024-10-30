import {
    enharmonicGroupTransposer,
    enharmonicGroupTransposerReverse,
} from '../utils/transposer';
import { NavigateFunction } from 'react-router-dom';

export function handleNavigate(navigate: NavigateFunction, path: string) {
    const location = window.location.pathname.substring(1);

    if (location.startsWith('note/') && path === '/scale') {
        const originParams = location.substring(5);
        const [originKeyString, noteString, targetKeyString, modeString] =
            originParams?.split('-') || [];
        const note = Number(noteString);
        const chosenNote = enharmonicGroupTransposerReverse(note, 0);
        navigate(`scale/${originKeyString}-${chosenNote}-${targetKeyString}-0`);
        return;
    }

    if (location.startsWith('scale/') && path === '/note') {
        const originParams = location.substring(6);
        const [originKeyString, noteString, targetKeyString] =
            originParams?.split('-') || [];
        const note = Number(noteString);
        const chosenNote = enharmonicGroupTransposer(note);
        navigate(`note/${originKeyString}-${chosenNote}-${targetKeyString}`);

        return;
    }

    navigate(path);
}
