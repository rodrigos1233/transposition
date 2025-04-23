import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { getNote, SCALES } from '../../utils/notes';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';
import Text from '../../components/text';
import { getModeName } from '../../utils/modes';
import { enharmonicGroupTransposer } from '../../utils/transposer';
import NotationContext from '../../contexts/NotationContext';
import ContentPage from '../../components/content-page';
import ContentCard from '../../components/content-card';

function LandingPage() {
  const { selectedNotation } = useContext(NotationContext);
  const { t } = useTranslation();

  useChangePageTitle(t('landing.title'));

  const commonScaleTranspositions = [
    // B♭ Instrument (e.g., Clarinet, Trumpet) to C Instrument (e.g., Piano, Flute)
    {
      from: 15, // B♭
      to: 0, // C
      scales: [
        { scale: 0, mode: 0 }, // C Major
        { scale: 13, mode: 1 }, // A Minor
      ],
    },
    // E♭ Instrument (e.g., Alto Saxophone) to C Instrument
    // {
    //     from: 5, // E♭
    //     to: 0, // C
    //     scales: [
    //         { scale: 0, mode: 0 }, // C Major
    //         { scale: 13, mode: 1 }, // A Minor
    //     ],
    // },
    // F Instrument (e.g., French Horn) to C Instrument
    {
      from: 7, // F
      to: 0, // C
      scales: [
        { scale: 0, mode: 0 }, // C Major
        { scale: 13, mode: 1 }, // A Minor
      ],
    },
    // C Instrument (e.g., Piano, Flute) to B♭ Instrument (e.g., Trumpet, Clarinet)
    {
      from: 0, // C
      to: 15, // B♭
      scales: [
        { scale: 15, mode: 0 }, // B♭ Major
        { scale: 10, mode: 1 }, // G Minor
      ],
    },
    // C Instrument to E♭ Instrument
    // {
    //     from: 0, // C
    //     to: 5, // E♭
    //     scales: [
    //         { scale: 5, mode: 0 }, // E♭ Major
    //         { scale: 0, mode: 1 }, // C Minor
    //     ],
    // },
    // C Instrument to F Instrument
    // {
    //     from: 0, // C
    //     to: 7, // F
    //     scales: [
    //         { scale: 7, mode: 0 }, // F Major
    //         { scale: 3, mode: 1 }, // D Minor
    //     ],
    // },
    // B♭ Instrument to E♭ Instrument
    // {
    //     from: 15, // B♭
    //     to: 5, // E♭
    //     scales: [
    //         { scale: 3, mode: 0 }, // E♭ Major
    //         { scale: 0, mode: 1 }, // C Minor
    //     ],
    // },
    // B♭ Instrument to F Instrument
    // {
    //     from: 15, // B♭
    //     to: 7, // F
    //     scales: [
    //         { scale: 5, mode: 0 }, // F Major
    //         { scale: 3, mode: 1 }, // D Minor
    //     ],
    // },
    // E♭ Instrument to B♭ Instrument
    // {
    //     from: 5, // E♭
    //     to: 15, // B♭
    //     scales: [
    //         { scale: 15, mode: 0 }, // B♭ Major
    //         { scale: 10, mode: 1 }, // G Minor
    //     ],
    // },
    // F Instrument to B♭ Instrument
    // {
    //     from: 7, // F
    //     to: 15, // B♭
    //     scales: [
    //         { scale: 15, mode: 0 }, // B♭ Major
    //         { scale: 10, mode: 1 }, // G Minor
    //     ],
    // },
    // E♭ Instrument to F Instrument
    // {
    //     from: 5, // E♭
    //     to: 7, // F
    //     scales: [
    //         { scale: 7, mode: 0 }, // F Major
    //         { scale: 3, mode: 1 }, // D Minor
    //     ],
    // },
    // F Instrument to E♭ Instrument
    // {
    //     from: 7, // F
    //     to: 5, // E♭
    //     scales: [
    //         { scale: 5, mode: 0 }, // E♭ Major
    //         { scale: 0, mode: 1 }, // C Minor
    //     ],
    // },
  ];

  const commonKeyTranspositions = commonScaleTranspositions.map(
    (transposition, index) => (
      <ContentCard
        level={2}
        key={`${transposition.from}-${transposition.to}-${index}`}
      >
        <p className="mb-2 mt-5">
          <Text size="small">
            {t('landing.instrumentFrom')}{' '}
            <span className={'font-bold'}>
              {getNote(transposition.from, selectedNotation, SCALES)}
            </span>{' '}
            {t('landing.instrumentTo')}{' '}
            <span className={'font-bold'}>
              {getNote(transposition.to, selectedNotation, SCALES)}
            </span>{' '}
            {t('landing.commonKeys')}
          </Text>
        </p>

        <ul className="common-keys-list mt-2">
          {transposition.scales.map((scale, k) => (
            <li key={`${k}-${scale.scale}-${scale.mode}`}>
              <a
                href={`/scale/${enharmonicGroupTransposer(
                  transposition.from
                )}-${scale.scale}-${enharmonicGroupTransposer(
                  transposition.to
                )}-${scale.mode}`}
                className="underline text-lime-700"
              >
                {getNote(scale.scale, selectedNotation, SCALES)}{' '}
                {getModeName(scale.mode, i18n.language)}
              </a>
            </li>
          ))}
        </ul>
      </ContentCard>
    )
  );

  return (
    <ContentPage className="landing-page">
      <ContentCard>
        <h1 className="my-2">{t('landing.welcome')}</h1>
        <Text key={'text-1'} size={'small'}>
          {t('landing.description')}
        </Text>

        <Text key={'text-2'} size={'small'}>
          <Trans i18nKey="landing.aboutLink" components={[<a className="underline text-lime-700" href="/about" />]} />
        </Text>
      </ContentCard>
      <ContentCard>
        <h2 className="quick-start mt-5">
          <Text size={'medium'}>{t('landing.quickStart')}</Text>
        </h2>
        {commonKeyTranspositions}
      </ContentCard>
    </ContentPage>
  );
}

export default LandingPage;
