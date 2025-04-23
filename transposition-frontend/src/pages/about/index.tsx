import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getNote, INSTRUMENTS_PITCHES } from '../../utils/notes';
import { LIST_OF_INSTRUMENTS } from '../../utils/instruments';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';
import NotationContext from '../../contexts/NotationContext';
import ContentPage from '../../components/content-page';
import ContentCard from '../../components/content-card';

function AboutPage() {
  const { selectedNotation } = useContext(NotationContext);
  const { t, i18n } = useTranslation();

  useChangePageTitle(t('about.title'));

  function getInstrumentList(keyIndex: number) {
    const instrumentsArray = LIST_OF_INSTRUMENTS[i18n.language]?.[keyIndex];

    if (!instrumentsArray) {
      return null;
    }

    return (
      <li className="my-2">
        <h4 className="text-xl">
          {getNote(keyIndex, selectedNotation, INSTRUMENTS_PITCHES)}:
        </h4>
        <ul className="flex gap-2 flex-wrap">
          {instrumentsArray.map((instrument: string, k: number) => (
            <li key={k}>
              {instrument}
              {`${k === instrumentsArray.length - 1 ? '' : ', '}`}
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <ContentPage className="about-page">
      <ContentCard>
        <h1 className="my-2">{t('about.mainHeading')}</h1>
        <p className="my-2">{t('about.description1')}</p>
        <p className="my-2">{t('about.description2')}</p>
      </ContentCard>
      <ContentCard>
        <h2 className="my-2">
          <Trans
            i18nKey="about.nameHeading"
            components={[<span className="font-bold" />]}
          />
        </h2>
        <p className="my-2">
          <Trans
            i18nKey="about.nameIntro"
            components={[
              <span className="font-bold" />,
              <span className="font-bold" />,
              <span className="font-bold" />,
            ]}
          />
        </p>
        <ul className="list-disc ml-4 my-2">
          <li>
            <Trans
              i18nKey="about.claveMeaning"
              components={[<span className="font-bold" />]}
            />
          </li>
          <li>
            <Trans
              i18nKey="about.shiftMeaning"
              components={[<span className="font-bold" />]}
            />
          </li>
        </ul>
      </ContentCard>
      <ContentCard>
        <p className="my-2">{t('about.instrumentListTitle')}</p>
        <ul className="list-disc ml-4 my-2">
          {Array.from({ length: 12 }, (_, i) => {
            const instrumentList = getInstrumentList(i);
            if (instrumentList) {
              return <div key={i}>{instrumentList}</div>;
            }
            return null;
          })}
        </ul>
      </ContentCard>
    </ContentPage>
  );
}

export default AboutPage;
