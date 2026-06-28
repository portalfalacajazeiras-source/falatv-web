import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-bg">
      <div className="w-20 h-20 rounded-full bg-bg-surface flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-10 h-10 text-text-muted">
          <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-text mb-2">Sem conexão</h1>
      <p className="text-text-muted mb-8">
        Verifique sua internet e tente novamente.
      </p>
      <Link href="/" className="btn-primary px-8 py-3">
        Tentar novamente
      </Link>
    </div>
  )
}
