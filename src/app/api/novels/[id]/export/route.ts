import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NovelExport } from '@/lib/export'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'md'

    const novel = await db.novel.findUnique({
      where: { id: params.id }
    })

    if (!novel) {
      return NextResponse.json(
        { error: 'Novel not found' },
        { status: 404 }
      )
    }

    let content: string
    let mimeType: string
    let filename: string

    switch (format) {
      case 'md':
      case 'markdown':
        content = await NovelExport.exportMarkdown(params.id)
        mimeType = 'text/markdown'
        filename = NovelExport.generateFilename(novel, 'md')
        break

      case 'txt':
      case 'text':
        content = await NovelExport.exportText(params.id)
        mimeType = 'text/plain'
        filename = NovelExport.generateFilename(novel, 'txt')
        break

      default:
        return NextResponse.json(
          { error: 'Unsupported format. Use md, txt, docx, or pdf' },
          { status: 400 }
        )
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Failed to export novel:', error)
    return NextResponse.json(
      { error: 'Failed to export novel' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { format } = body

    // Placeholder for future DOCX and PDF export
    // These would require additional packages or mini-services

    return NextResponse.json(
      { message: `${format} export will be implemented with docx/pdf skills` },
      { status: 501 }
    )
  } catch (error) {
    console.error('Failed to export novel:', error)
    return NextResponse.json(
      { error: 'Failed to export novel' },
      { status: 500 }
    )
  }
}
