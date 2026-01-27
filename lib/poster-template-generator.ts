/**
 * Client-side poster generator for event results
 * Creates ONE poster showing all three winners
 */

export interface EventResultData {
    event: string
    category: string
    resultNumber: string
    winners: {
        first: string[]   // 1st place winners
        second: string[]  // 2nd place winners
        third: string[]   // 3rd place winners
    }
}

/**
 * Generate poster showing all winners for an event
 */
export async function generateEventPoster(
    data: EventResultData
): Promise<Blob> {
    console.log("generateEventPoster called with data:", data)

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            console.error("Canvas context not available!")
            reject(new Error('Canvas not supported'))
            return
        }

        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = async () => {
            // Wait for fonts if necessary (optional, but good practice)
            await document.fonts.ready

            // Set canvas size to match template
            canvas.width = img.width
            canvas.height = img.height

            // Draw template image
            ctx.drawImage(img, 0, 0)

            const centerX = canvas.width / 2

            // Colors
            const darkColor = '#1a1a1a'
            const grayColor = '#555555'

            // Set text properties common baseline
            ctx.textBaseline = 'middle'

            // 1. RESULT NUMBER (centered)
            ctx.fillStyle = darkColor
            ctx.font = 'bold 100px Arial, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(data.resultNumber, centerX, canvas.height * 0.18)

            // 2. EVENT NAME (left box area)
            ctx.fillStyle = darkColor
            ctx.font = 'bold 36px Arial, sans-serif'
            ctx.textAlign = 'left'

            const leftBoxX = canvas.width * 0.12
            const maxEventWidth = canvas.width * 0.35
            let currentY = canvas.height * 0.40

            const eventLines = wrapText(ctx, data.event, maxEventWidth)
            eventLines.forEach((line) => {
                ctx.fillText(line, leftBoxX, currentY)
                currentY += 45 // Line height
            })

            // 3. CATEGORY (below event name)
            ctx.fillStyle = grayColor
            ctx.font = '24px Arial, sans-serif'
            ctx.textAlign = 'left'
            ctx.fillText(data.category, leftBoxX, currentY + 10) // Small padding after event name

            // 4. ALL WINNERS (right box)
            ctx.fillStyle = darkColor
            ctx.textAlign = 'left'

            const rightBoxX = canvas.width * 0.55
            let rightBoxY = canvas.height * 0.35
            const lineHeight = 35
            const positionGap = 45 // Gap between 1st/2nd/3rd blocks

            // Helper to draw a position block
            const drawPositionBlock = (title: string, names: string[]) => {
                if (names.length === 0) return

                ctx.font = 'bold 32px Arial, sans-serif'
                ctx.fillText(title, rightBoxX, rightBoxY)
                rightBoxY += 40

                ctx.font = '28px Arial, sans-serif'
                names.forEach(name => {
                    ctx.fillText(name, rightBoxX, rightBoxY)
                    rightBoxY += lineHeight
                })
                rightBoxY += positionGap
            }

            drawPositionBlock('1st POSITION', data.winners.first)
            drawPositionBlock('2nd POSITION', data.winners.second)
            drawPositionBlock('3rd POSITION', data.winners.third)

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob)
                } else {
                    reject(new Error('Failed to create blob'))
                }
            }, 'image/png')
        }

        img.onerror = () => reject(new Error('Failed to load template image'))
        img.src = '/result.png'
    })
}

/**
 * Helper to wrap text into lines
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ')
    const lines = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
        const word = words[i]
        const width = ctx.measureText(currentLine + " " + word).width
        if (width < maxWidth) {
            currentLine += " " + word
        } else {
            lines.push(currentLine)
            currentLine = word
        }
    }
    lines.push(currentLine)
    return lines
}

/**
 * Generate result number
 */
export function generateResultNumber(count: number): string {
    return count.toString().padStart(2, '0')
}
