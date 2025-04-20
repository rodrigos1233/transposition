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
      className={`content ${className ?? ''} w-full pt-2 md:pt-32 backdrop-blur pr-3 pl-3 pb-3 md:pr-6 md:pb-6 md:pl-6 border-2 border-neutral-400 rounded-b-3xl md:rounded-b-[2.5rem]`}
    >
      <Flex direction={'col'}>{children}</Flex>
    </article>
  );
}

export default ContentPage;
