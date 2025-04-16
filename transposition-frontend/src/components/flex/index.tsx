import { ReactNode } from 'react';

interface FlexProps {
  children: ReactNode;
  direction: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  gapSize?: 'small' | 'medium' | 'large';
}

function Flex(props: FlexProps) {
  const { children, direction, gapSize = 'medium' } = props;
  const gapSizeMap = {
    small: 'gap-2',
    medium: 'gap-5',
    large: 'gap-10',
  };

  return (
    <div className={`flex flex-${direction} ${gapSizeMap[gapSize]}`}>
      {children}
    </div>
  );
}

export default Flex;
