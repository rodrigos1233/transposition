import './header.css';

export function HamburgerMenu({
  isOpen,
  toggleOpen,
}: {
  isOpen: boolean;
  toggleOpen: () => void;
}) {
  return (
    <div className="hamburger" onClick={toggleOpen}>
      <div className={`line ${isOpen ? 'active' : ''}`} />
      <div className={`line ${isOpen ? 'active' : ''}`} />
      <div className={`line ${isOpen ? 'active' : ''}`} />
    </div>
  );
}
