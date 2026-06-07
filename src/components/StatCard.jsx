export default function StatCard({ label, value }) {
  return (
    <div style={{
      background: '#E7E1D6',
      border: '1px solid #C2CBBE',
      borderRadius: 16,
      padding: '24px 28px',
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#2F3630', marginBottom: 4, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: '#7C8B74' }}>{label}</div>
      <div style={{
        marginTop: 14,
        height: 3,
        borderRadius: 2,
        background: 'linear-gradient(90deg, #2DD4BF, #3B82F6)',
        width: 40,
      }} />
    </div>
  )
}
