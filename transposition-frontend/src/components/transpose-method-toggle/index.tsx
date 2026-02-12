import Button from '../button';
import { useTranslation } from 'react-i18next';

type TransposeMethodToggleProps = {
  method: 'key' | 'interval';
  onChange: (method: 'key' | 'interval') => void;
};

function TransposeMethodToggle({ method, onChange }: TransposeMethodToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm font-medium text-neutral-600">
        {t('stepper.transposeBy')}
      </span>
      <div className="flex gap-2">
        <Button
          onClick={() => onChange('key')}
          disabled={method === 'key'}
          className="bg-neutral-100"
        >
          {t('stepper.byKey')}
        </Button>
        <Button
          onClick={() => onChange('interval')}
          disabled={method === 'interval'}
          className="bg-neutral-100"
        >
          {t('stepper.byInterval')}
        </Button>
      </div>
    </div>
  );
}

export default TransposeMethodToggle;
