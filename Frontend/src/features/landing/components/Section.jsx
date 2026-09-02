// components/Section.jsx

export const Section = ({ id, bg = '#FFFFFF', children }) => (
  <section id={id} style={{ background: bg, padding: '80px 0' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
      {children}
    </div>
  </section>
);