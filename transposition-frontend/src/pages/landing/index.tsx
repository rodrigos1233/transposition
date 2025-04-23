import { useContext } from 'react';
import useTranslationLegacy, {
  Language,
  Translations,
} from '../../hooks/useTranslationLegacy.ts';
import { getNote, SCALES } from '../../utils/notes';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';
import Text from '../../components/text';
import { getModeName } from '../../utils/modes';
import { enharmonicGroupTransposer } from '../../utils/transposer';
import LanguageContext from '../../contexts/LanguageContext';
import NotationContext from '../../contexts/NotationContext';
import ContentPage from '../../components/content-page';
import ContentCard from '../../components/content-card';

function LandingPage() {
  const { selectedNotation } = useContext(NotationContext);

  const languageContext = useContext(LanguageContext);
  const selectedLanguage = languageContext.selectedLanguage;

  const titleTextTranslations: Translations = {
    [Language.English]: [`Transposition`],
    [Language.French]: [`Transposition`],
    [Language.Spanish]: [`Transposición`],
    [Language.German]: [`Transposition`],
  };

  const pageTitleText = useTranslationLegacy(
    selectedLanguage,
    titleTextTranslations,
    []
  );
  useChangePageTitle(pageTitleText[0] as unknown as string);

  const translations: Translations = {
    [Language.English]: [
      'Welcome to ClaveShift.com!',
      'ClaveShift.com, formerly MusicTranspositor.com, is an online transposer tool that allows you to easily transpose a single note from one key to another.',
      <>
        For more detailed information about music transposition, please visit
        the{' '}
        <a className="underline text-lime-700" href={'/about'}>
          About page
        </a>
        .
      </>,
      'Quick Start:',
      `You play an instrument in `,
      ` and want to find out the corresponding scales for an instrument in `,
      `. Here are some common keys:`,
    ],
    [Language.French]: [
      'Bienvenue sur ClaveShift.com!',
      "ClaveShift.com, anciennement MusicTranspositor.com est un outil en ligne de transposition musicale qui vous permet de transposer facilement une note d'une tonalité à une autre.",
      <>
        Pour plus d'informations sur la transposition musicale, veuillez visiter
        la page{' '}
        <a className="underline text-lime-700" href={'/about'}>
          À propos
        </a>
        .
      </>,
      'Prise en main rapide :',
      'Vous jouez d’un instrument en ',
      ' et souhaitez connaître les gammes correspondantes pour un instrument en ',
      '. Voici quelques tonalités courantes:',
    ],
    [Language.Spanish]: [
      'Bienvenido a ClaveShift.com!',
      'ClaveShift.com, antes llamado MusicTranspositor.com, es una herramienta en línea de transposición musical que te permite transponer fácilmente una nota de una tonalidad a otra.',
      <>
        Para más información sobre la transposición musical, por favor visite la
        página{' '}
        <a className="underline text-lime-700" href={'/about'}>
          Acerca de
        </a>
        .
      </>,
      'Inicio rápido:',
      'Tocas un instrumento en ',
      ' y quieres averiguar las escalas correspondientes para un instrumento en ',
      '. Aquí tienes algunas tonalidades comunes:',
    ],
    [Language.German]: [
      'Willkommen bei ClaveShift.com!',
      'ClaveShift.com, früher MusicTranspositor.com, ist ein Online-Transpositionswerkzeug, mit dem Sie einfach eine Note von einer Tonart in eine andere transponieren können.',
      <>
        Für detailliertere Informationen zur Musiktransposition besuchen Sie
        bitte die{' '}
        <a className="underline text-lime-700" href={'/about'}>
          Über-Seite
        </a>
        .
      </>,
      'Schnellstart:',
      'Sie spielen ein Instrument in ',
      ' und möchten die entsprechenden Tonarten für ein Instrument in ',
      ' herausfinden. Hier sind einige gängige Tonarten:',
    ],
  };

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

  const translatedText = useTranslationLegacy(selectedLanguage, translations, [
    selectedNotation,
  ]);

  const commonKeyTranspositions = commonScaleTranspositions.map(
    (transposition, index) => (
      <ContentCard
        level={2}
        key={`${transposition.from}-${transposition.to}-${index}`}
      >
        <p className="mb-2 mt-5">
          <Text size="small">
            {translatedText[4]}
            <span className={'font-bold'}>
              {getNote(transposition.from, selectedNotation, SCALES)}
            </span>
            {translatedText[5]}
            <span className={'font-bold'}>
              {getNote(transposition.to, selectedNotation, SCALES)}
            </span>
            {translatedText[6]}
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
                {getModeName(scale.mode, selectedLanguage)}
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
        <h1 className="my-2">{translatedText[0]}</h1>
        <Text key={'text-1'} size={'small'}>
          {translatedText[1]}
        </Text>

        <Text key={'text-2'} size={'small'}>
          {translatedText[2]}
        </Text>
      </ContentCard>
      <ContentCard>
        <h2 className="quick-start mt-5">
          <Text size={'medium'}>{translatedText[3]}</Text>
        </h2>
        {commonKeyTranspositions}
      </ContentCard>
    </ContentPage>
  );
}

export default LandingPage;
