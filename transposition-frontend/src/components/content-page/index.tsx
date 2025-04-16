import { ReactNode } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface ContentPageProps {
  children: ReactNode;
  className?: string;
}

function ContentPage(props: ContentPageProps) {
  const { children, className } = props;
  const isMobile = useIsMobile();

  return (
    <article
      className={`content ${className ?? ''} w-full ${isMobile ? 'pt-2' : 'pt-32'}`}
    >
      {children}
    </article>
  );
}

export default ContentPage;
