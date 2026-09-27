export default function SectionHeading({ children }) {
  return (
    <div className="text-center mb-8 sm:mb-10 px-2">
      <span className="inline-block w-10 h-1 bg-cyan rounded-full mb-3" />
      <h2 className="text-xl sm:text-2xl font-bold text-navy">{children}</h2>
    </div>
  );
}