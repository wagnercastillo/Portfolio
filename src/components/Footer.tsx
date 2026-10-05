export function Footer() {
  return (
    <footer className="mono" style={{ padding: '16px 4px 8px', fontSize: 12, color: 'var(--muted)', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
      <span>© {new Date().getFullYear()} Cristhoper Castillo</span>
      <span aria-label="Pista: código Konami">
        psst · {['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'].map((k, i) => <kbd key={i}>{k}</kbd>)}
      </span>
    </footer>
  );
}
