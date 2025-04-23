import { useContext } from 'react';
import useTranslationLegacy, {
  Language,
  Translations,
} from '../../hooks/useTranslationLegacy.ts';
import { getNote, INSTRUMENTS_PITCHES } from '../../utils/notes';
import { LIST_OF_INSTRUMENTS } from '../../utils/instruments';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';
import LanguageContext from '../../contexts/LanguageContext';
import NotationContext from '../../contexts/NotationContext';
import ContentPage from '../../components/content-page';
import ContentCard from '../../components/content-card';

function AboutPage() {
  const { selectedNotation } = useContext(NotationContext);
  const languageContext = useContext(LanguageContext);
  const selectedLanguage = languageContext.selectedLanguage;

  const translations: Translations = {
    [Language.English]: [
      'About Musical Transposition:',
      'Musical transposition is the process of shifting a collection of notes (such as a melody, harmony, or scale) up or down in pitch by a constant interval. This means that every note in the music is adjusted by the same proportional change in pitch, resulting in a new key. Transposition is commonly used to accommodate different vocal ranges, instrument tunings, or to make a piece easier to read and perform.',
      'This website is a tool designed for quick and easy transposition. It offers a simple interface to transpose a single note from one key to another, as well as a more advanced interface to transpose an entire scale. This feature allows musicians to easily play a piece in the same key when using two instruments with different tunings, for example.',
      <>
        {'About the name '}
        <span className={'font-bold'}>"ClaveShift"</span>
        {':'}
      </>,
      <>
        {'The name '}
        <span className={'font-bold'}>"ClaveShift"</span>
        {' combines two terms: '}
        <span className={'font-bold'}>"clave"</span>
        {' and '}
        <span className={'font-bold'}>"shift"</span>.
      </>,
      <>
        <span className={'font-bold'}>Clave</span>
        {
          ': In Spanish, "clave" means "key", which directly relates to musical keys and transposition. In music theory, changing keys is a core concept, so "Clave" captures the tool\'s focus on key changes.'
        }
      </>,
      <>
        <span className={'font-bold'}>Shift</span>
        {
          ': "Shift" conveys the action of moving from one key to another, which is exactly what this tool does—it shifts notes and scales between keys to make transposition easier for musicians.'
        }
      </>,
    ],
    [Language.French]: [
      'À propos de la transposition musicale',
      "La transposition musicale est le processus de déplacement d'une collection de notes (une mélodie, une harmonie ou une gamme) vers le haut ou vers le bas par un intervalle constant. Cela signifie que chaque note de la pièce est élevée ou abaissée de la même distance, ce qui donne une nouvelle tonalité. La transposition est couramment utilisée en musique pour s'adapter à différentes tessitures vocales, à l'accordage des instruments ou pour rendre une pièce plus facile à lire et à jouer.",
      "Ce site web est un outil conçu pour faciliter des transpositions rapides. Il propose une interface simple pour transposer une note d'une tonalité à une autre, ainsi qu'une interface plus avancée permettant de transposer une gamme complète. Cela permet, par exemple, de jouer rapidement une pièce dans la même tonalité lorsque vous jouez avec deux instruments ayant deux tonalités différentes.",
      <>
        {'À propos du nom '}
        <span className={'font-bold'}>"ClaveShift"</span>
        {' :'}
      </>,
      <>
        {'Le nom '}
        <span className={'font-bold'}>"ClaveShift"</span>
        {' combine deux termes : '}
        <span className={'font-bold'}>"clave"</span>
        {' et '}
        <span className={'font-bold'}>"shift"</span>
        {'.'}
      </>,
      <>
        <span className={'font-bold'}>Clave</span>
        {
          ' : En espagnol, "clave" signifie "tonalité" ou "clé", ce qui se rapporte directement aux tonalités musicales et à la transposition. En théorie musicale, changer de tonalité est un concept clé, et "Clave" reflète l\'objectif de cet outil axé sur les changements de tonalité.'
        }
      </>,
      <>
        <span className={'font-bold'}>Shift</span>
        {
          ' : "Shift" (changement, décalage) exprime l\'action de passer d\'une tonalité à une autre, ce que cet outil fait précisément : il permet de déplacer des notes et des gammes entre tonalités pour faciliter la transposition pour les musiciens.'
        }
      </>,
    ],
    [Language.Spanish]: [
      'Acerca de la Transposición Musical',
      'La transposición musical es el proceso de desplazar una colección de notas (como una melodía, armonía o escala) hacia arriba o hacia abajo en el tono por un intervalo constante. Esto significa que cada nota en la pieza de música se eleva o baja por la misma proporción de cambio en la altura, resultando en una nueva tonalidad. La transposición se utiliza comúnmente en la música para adaptarse a diferentes rangos vocales, afinaciones de instrumentos o para hacer que una pieza sea más fácil de leer y tocar.',
      'Este sitio web es una herramienta diseñada para facilitar transposiciones rápidas. Proporciona una interfaz sencilla para transponer una sola nota de una tonalidad a otra, así como una interfaz más avanzada para transponer una escala completa de una tonalidad a otra. Esto permite, por ejemplo, tocar rápidamente una pieza en la misma tonalidad cuando se tocan dos instrumentos con afinaciones diferentes.',
      <>
        {'Acerca del nombre '}
        <span className={'font-bold'}>"ClaveShift"</span>
        {':'}
      </>,
      <>
        {'El nombre '}
        <span className={'font-bold'}>"ClaveShift"</span>
        {' combina dos términos: '}
        <span className={'font-bold'}>"clave"</span>
        {' y '}
        <span className={'font-bold'}>"shift"</span>
        {'.'}
      </>,
      <>
        <span className={'font-bold'}>Clave</span>
        {
          ': La palabra "clave" hace referencia directamente a las tonalidades musicales y a la transposición. En teoría musical, cambiar de tonalidad es un concepto fundamental, y "Clave" captura el enfoque de esta herramienta en los cambios de tonalidad.'
        }
      </>,
      <>
        <span className={'font-bold'}>Shift</span>
        {
          ': "Shift" (cambio, desplazamiento) sugiere el acto de mover una nota o una escala de una tonalidad a otra, que es exactamente lo que hace esta herramienta—mueve notas y escalas entre tonalidades para facilitar la transposición a los músicos.'
        }
      </>,
    ],
    [Language.German]: [
      'Über die Musikalische Transposition',
      'Die musikalische Transposition ist der Prozess, eine Sammlung von Noten (wie eine Melodie, Harmonie oder Tonleiter) um einen konstanten Intervall nach oben oder unten zu verschieben. Dies bedeutet, dass jede Note im Musikstück proportional um die gleiche Tonhöhe verändert wird, was zu einer neuen Tonart führt. Transposition wird häufig verwendet, um unterschiedliche Stimmumfänge, die Stimmung von Instrumenten oder ein Stück leichter lesbar und spielbar zu machen.',
      'Diese Website ist ein Werkzeug, um schnelle Transpositionen zu ermöglichen. Es bietet eine einfache Oberfläche zum Transponieren einer einzelnen Note von einer Tonart in eine andere sowie eine erweiterte Oberfläche zum Transponieren einer gesamten Tonleiter von einer Tonart in eine andere. Dies ermöglicht es, beispielsweise ein Stück schnell in der gleichen Tonart zu spielen, wenn man mit zwei verschiedenen Instrumenten spielt, die unterschiedliche Stimmungen haben.',
      <>
        {'Über den Namen '}
        <span className={'font-bold'}>"ClaveShift"</span>
        {':'}
      </>,
      <>
        {'Der Name '}
        <span className={'font-bold'}>"ClaveShift"</span>
        {' kombiniert zwei Begriffe: '}
        <span className={'font-bold'}>"clave"</span>
        {' und '}
        <span className={'font-bold'}>"shift"</span>
        {'.'}
      </>,
      <>
        <span className={'font-bold'}>Clave</span>
        {
          ': Im Spanischen bedeutet "clave" "Tonart" oder "Schlüssel", was direkt mit musikalischen Tonarten und Transpositionen zusammenhängt. In der Musiktheorie ist das Wechseln der Tonart ein grundlegendes Konzept, und "Clave" spiegelt den Fokus dieses Tools auf Tonartwechsel wider.'
        }
      </>,
      <>
        <span className={'font-bold'}>Shift</span>
        {
          ': "Shift" (Wechsel, Verschiebung) beschreibt die Aktion, eine Note oder eine Tonleiter von einer Tonart in eine andere zu verschieben, was genau das ist, was dieses Tool tut – es verschiebt Noten und Tonleitern zwischen Tonarten, um Musikern die Transposition zu erleichtern.'
        }
      </>,
    ],
  };

  const listOfInstrumentsTranslationTitle: Translations = {
    [Language.English]: [
      'Here is a non exhaustive list of instruments sorted by their possible key:',
    ],
    [Language.French]: [
      "Voici une liste non exhaustive d'instruments triés par leur tonalité possible:",
    ],
    [Language.German]: [
      'Hier ist eine nicht exhaustive Liste von Instrumenten, sortiert nach ihren möglichen Tonarten:',
    ],
    [Language.Spanish]: [
      'Aquí hay una lista no exhaustiva de instrumentos ordenados por su tonalidad posible:',
    ],
  };

  const translatedText = useTranslationLegacy(selectedLanguage, translations, []);
  const translatedListOfInstruments = useTranslationLegacy(
    selectedLanguage,
    LIST_OF_INSTRUMENTS,
    [selectedNotation]
  );
  const translatedListOfInstrumentsTitle = useTranslationLegacy(
    selectedLanguage,
    listOfInstrumentsTranslationTitle,
    [selectedNotation]
  );

  function getInstrumentList(keyIndex: number) {
    const instrumentsArray = translatedListOfInstruments[keyIndex];

    if (!instrumentsArray) {
      return null;
    }

    return (
      <li className="my-2">
        <h4 className="text-xl">
          {getNote(keyIndex, selectedNotation, INSTRUMENTS_PITCHES)}:
        </h4>
        <ul className="flex gap-2 flex-wrap">
          {instrumentsArray.map((instrument, k) => (
            <li key={k}>
              {instrument}
              {`${k === instrumentsArray.length - 1 ? '' : ', '}`}
            </li>
          ))}
        </ul>
      </li>
    );
  }

  const titleTextTranslations: Translations = {
    [Language.English]: [`About`],
    [Language.French]: [`À propos`],
    [Language.Spanish]: [`Info`],
    [Language.German]: [`Info`],
  };

  const pageTitleText = useTranslationLegacy(
    selectedLanguage,
    titleTextTranslations,
    []
  );
  useChangePageTitle(pageTitleText[0] as unknown as string);

  return (
    <ContentPage className="about-page">
      <ContentCard>
        <h1 className="my-2">{translatedText[0]}</h1>
        <p className="my-2">{translatedText[1]}</p>
        <p className="my-2">{translatedText[2]}</p>
      </ContentCard>
      <ContentCard>
        <h2 className="my-2">{translatedText[3]}</h2>
        <p className="my-2">{translatedText[4]}</p>
        <ul className="list-disc ml-4 my-2">
          <li>{translatedText[5]}</li>
          <li>{translatedText[6]}</li>
        </ul>
      </ContentCard>
      <ContentCard>
        <p className="my-2">{translatedListOfInstrumentsTitle[0]}</p>
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
