type SectionLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function SectionLayout({ title, children }: SectionLayoutProps) {
  return (
    <section className="w-full px-4 sm:px-6 mt-8 sm:mt-10">
      <h2 className="text-base sm:text-lg font-semibold mb-4">{title}</h2>
      {children}
    </section>
  );
}
