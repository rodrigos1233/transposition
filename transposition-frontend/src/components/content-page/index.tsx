import { ReactNode } from 'react';
import Flex from '../flex';

interface ContentPageProps {
  children: ReactNode;
  className?: string;
}

function ContentPage(props: ContentPageProps) {
  const { children, className } = props;

  return (
    <article
      className={`content ${className ?? ''} w-full pt-4 md:pt-32 px-4 pb-6 md:px-8 md:pb-8`}
    >
      <Flex direction={'col'} gapSize="medium">
        {children}
      </Flex>
    </article>
  );
}

export default ContentPage;
