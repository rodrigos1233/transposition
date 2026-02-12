import { Navigate, useParams } from 'react-router-dom';

export function NoteRedirect() {
  const { linkParams } = useParams();
  const [originKey, note, targetKey] = linkParams?.split('-') || [];

  const from = Number(originKey) || 0;
  const n = Number(note) || 0;
  const to = Number(targetKey) || 0;

  return (
    <Navigate
      to={`/note?from_key=${from}&note=${n}&to_key=${to}`}
      replace
    />
  );
}
