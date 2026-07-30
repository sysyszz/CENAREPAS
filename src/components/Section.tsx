import { ReactNode } from 'react';

type SectionProps = {
  id?: string;
  bg?: string;
  children: ReactNode;
};

export default function Section({ id, bg = '#FFFFFF', children }: SectionProps) {
  return (
    <section id={id} style={{ background: bg, padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>{children}</div>
    </section>
  );
}
