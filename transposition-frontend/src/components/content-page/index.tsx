import { ReactNode } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import Flex from '../flex';

interface ContentPageProps {
  children: ReactNode;
  className?: string;
}

function ContentPage(props: ContentPageProps) {
  const { children, className } = props;
  const isMobile = useIsMobile();

  return (
    <article
      className={`content ${className ?? ''} w-full ${isMobile ? 'pt-2' : 'pt-32'} backdrop-blur pr-6 pl-6 pb-6 border-2 border-neutral-400 rounded-[2.5rem]`}
    >
      <Flex direction={'col'}>{children}</Flex>
    </article>
  );
}

export default ContentPage;
