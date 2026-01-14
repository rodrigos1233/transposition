import { ReactNode } from 'react';
import Flex from '../flex';

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  level?: number;
}

function ContentCard(props: ContentCardProps) {
  const { children, className, level = 1 } = props;

  const levelClassesMap: Record<number, string> = {
    1: 'p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-soft bg-white/80 backdrop-blur-sm border border-neutral-200',
    2: 'p-3 md:p-4 rounded-xl md:rounded-2xl bg-neutral-50/50 border border-neutral-100',
  };

  return (
    <section
      className={`content-card ${className ?? ''} ${levelClassesMap[level]}`}
    >
      <Flex direction={'col'}>{children}</Flex>
    </section>
  );
}

export default ContentCard;
