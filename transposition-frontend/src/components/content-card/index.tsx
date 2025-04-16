import { ReactNode } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import Flex from '../flex';

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  level?: number;
}

function ContentCard(props: ContentCardProps) {
  const { children, className, level = 1 } = props;

  const levelClassesMap: Record<number, string> = {
    1: 'p-5 rounded-3xl',
    2: 'p-3 rounded-xl',
  };

  return (
    <section
      className={`content-card ${className ?? ''} border-neutral-300 border-2 ${levelClassesMap[level]} bg-neutral-100/70 `}
    >
      <Flex direction={'col'}>{children}</Flex>
    </section>
  );
}

export default ContentCard;
