import { colors } from '../styles/colors';

export default function Footer() {
  return (
    <footer style={{ background: colors.blue, padding: '16px 40px', textAlign: 'center' }}>
      <p style={{ color: colors.white, fontSize: 12, margin: 0, fontWeight: 500 }}>
        © 2024 Arepas del Campo
      </p>
    </footer>
  );
}
