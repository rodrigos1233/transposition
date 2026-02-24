import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../button';
import './stepper.css';

interface StepperStepProps {
  stepNumber: number;
  title: string;
  summary?: ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  isLast?: boolean;
  onEdit: () => void;
  onContinue: () => void;
  children: ReactNode;
}

function StepperStep({
  stepNumber,
  title,
  summary,
  isActive,
  isCompleted,
  isDisabled,
  isLast = false,
  onEdit,
  onContinue,
  children,
}: StepperStepProps) {
  const { t } = useTranslation();

  const badgeClasses = isCompleted
    ? 'bg-emerald-500 text-white'
    : isActive
      ? 'bg-sky-500 text-white'
      : 'bg-neutral-200 text-neutral-400';

  return (
    <div className={`stepper-step ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="flex gap-3 md:gap-4">
        {/* Left column: badge + connector line */}
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-300 ${badgeClasses}`}
          >
            {isCompleted && !isActive ? '\u2713' : stepNumber}
          </div>
          {!isLast && (
            <div className="stepper-connector flex-1 w-px bg-neutral-200 my-1" />
          )}
        </div>

        {/* Right column: content */}
        <div className="flex-1 min-w-0 pb-4">
          {/* Header */}
          <div
            className={`flex items-center justify-between min-h-8 ${
              isCompleted && !isActive ? 'cursor-pointer' : ''
            }`}
            onClick={isCompleted && !isActive ? onEdit : undefined}
          >
            <h3
              className={`font-medium text-sm md:text-base ${
                isDisabled ? 'text-neutral-400' : 'text-neutral-800'
              }`}
            >
              {title}
            </h3>
            {isCompleted && !isActive && (
              <div className="flex items-center gap-3 ml-2">
                <span className="text-sm text-neutral-600 flex items-center gap-1 flex-wrap">
                  {summary}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="text-sm text-emerald-600 hover:text-emerald-700 underline shrink-0"
                >
                  {t('stepper.edit')}
                </button>
              </div>
            )}
          </div>

          {/* Collapsible body */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="pt-3">
                {children}
                <div className="mt-4">
                  <Button onClick={onContinue} colour="emerald">
                    {t('stepper.continue')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepperStep;
