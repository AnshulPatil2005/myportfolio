// A section number. It used to scramble through random digits when scrolled
// into view; it now simply prints, so it reads the same to everyone.
export default function ScrambleIndex({ target }: { target: string }) {
  return <span>{target}</span>;
}
