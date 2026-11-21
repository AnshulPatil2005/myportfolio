// Formerly a scroll-triggered fade. Content now renders in place on first
// paint: nothing waits on JavaScript to become visible, which is what kept
// the largest paint late. The wrapper and its props stay so call sites keep
// their structure.
interface SlideProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Slide = ({ children, className }: SlideProps) => {
  return <div className={className}>{children}</div>;
};
