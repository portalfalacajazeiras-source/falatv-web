import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET ?? ''

/**
 * POST /api/revalidate
 *
 * Webhook chamado pelo plugin WordPress (IsrRevalidator) após cada sync
 * que adiciona ou atualiza vídeos. Invalida o cache ISR das rotas afetadas.
 *
 * Headers:
 *   X-Revalidation-Secret: <secret>
 *
 * Body:
 *   { path?: string, type?: 'video' | 'playlist' | 'all' }
 */
export async function POST(request: NextRequest) {
  // Verifica o secret de autenticação
  const secret = request.headers.get('X-Revalidation-Secret')

  if (!REVALIDATION_SECRET || secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'invalid_secret' },
      { status: 401 },
    )
  }

  let body: { path?: string; type?: string } = {}

  try {
    body = await request.json()
  } catch {
    // Body vazio — revalida tudo
  }

  const path = body.path ?? '/'
  const type = body.type ?? 'all'

  try {
    // Revalida rotas conforme o tipo de conteúdo alterado
    if (type === 'all' || type === 'video') {
      revalidatePath('/')
      revalidatePath('/videos')
      revalidatePath('/videos', 'layout')
    }

    if (type === 'playlist') {
      revalidatePath('/playlists')
    }

    // Revalida o path específico se fornecido
    if (path && path !== '/') {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      path,
      type,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Revalidation failed', details: String(error) },
      { status: 500 },
    )
  }
}

// OPTIONS para preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Revalidation-Secret',
    },
  })
}
