/* eslint-disable @next/next/no-img-element -- Payload admin graphics render outside next/image */
export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img src="/quarterly-learnings-logo@3x.png" alt="" width={48} height={48} />
      <span style={{ fontSize: 20, fontWeight: 600 }}>QL Learn</span>
    </div>
  )
}
