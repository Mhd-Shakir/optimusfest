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

        console.log("Canvas context created successfully")

        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
            console.log("Template image loaded! Size:", img.width, "x", img.height)

            // Set canvas size to match template
            canvas.width = img.width
            canvas.height = img.height

            console.log("Canvas size set to:", canvas.width, "x", canvas.height)

            // Draw template image
            ctx.drawImage(img, 0, 0)

            const centerX = canvas.width / 2

            // Set text properties
            ctx.textBaseline = 'middle'

            // 1. RESULT NUMBER (centered, just below "RESULT" text)
            ctx.fillStyle = '#1a1a1a' // Dark color for visibility
            ctx.font = 'bold 100px Arial, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(data.resultNumber, centerX, canvas.height * 0.18)

            console.log("Result number drawn:", data.resultNumber)

            // 2. EVENT NAME (left box area, dark text)
            ctx.fillStyle = '#1a1a1a' // Dark color
            ctx.font = 'bold 36px Arial, sans-serif'
            ctx.textAlign = 'left'

            const maxWidth = canvas.width * 0.35
            const words = data.event.split(' ')
            let line = ''
            let y = canvas.height * 0.40

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' '
                const metrics = ctx.measureText(testLine)

                if (metrics.width > maxWidth && n > 0) {
                    ctx.fillText(line, canvas.width * 0.12, y)
                    line = words[n] + ' '
                    y += 40
                } else {
                    line = testLine
                }
            }
            ctx.fillText(line, canvas.width * 0.12, y)

            console.log("Event name drawn:", data.event)

            // 3. CATEGORY (small, just below event name)
            ctx.fillStyle = '#555555' // Medium dark gray
            ctx.font = '24px Arial, sans-serif'
            ctx.textAlign = 'left'
            ctx.fillText(data.category, canvas.width * 0.12, y + 40)

            console.log("Category drawn:", data.category)

            // 4. ALL WINNERS (right box - line by line)
            ctx.fillStyle = '#1a1a1a' // Dark text
            ctx.textAlign = 'left'

            const rightBoxStartX = canvas.width * 0.55
            let boxY = canvas.height * 0.35

            // 1st Place Winners
            if (data.winners.first.length > 0) {
                ctx.font = 'bold 32px Arial, sans-serif'
                ctx.fillText('1st POSITION', rightBoxStartX, boxY)
                boxY += 40

                ctx.font = '28px Arial, sans-serif'
                data.winners.first.forEach(name => {
                    ctx.fillText(name, rightBoxStartX, boxY)
                    boxY += 35
                })
                boxY += 15
                console.log("1st place winners drawn:", data.winners.first)
            }

            // 2nd Place Winners
            if (data.winners.second.length > 0) {
                ctx.font = 'bold 32px Arial, sans-serif'
                ctx.fillText('2nd POSITION', rightBoxStartX, boxY)
                boxY += 40

                ctx.font = '28px Arial, sans-serif'
                data.winners.second.forEach(name => {
                    ctx.fillText(name, rightBoxStartX, boxY)
                    boxY += 35
                })
                boxY += 15
                console.log("2nd place winners drawn:", data.winners.second)
            }

            // 3rd Place Winners
            if (data.winners.third.length > 0) {
                ctx.font = 'bold 32px Arial, sans-serif'
                ctx.fillText('3rd POSITION', rightBoxStartX, boxY)
                boxY += 40

                ctx.font = '28px Arial, sans-serif'
                data.winners.third.forEach(name => {
                    ctx.fillText(name, rightBoxStartX, boxY)
                    boxY += 35
                })
                console.log("3rd place winners drawn:", data.winners.third)
            }

            console.log("All text drawn, converting to blob...")

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    console.log("Blob created successfully! Size:", blob.size, "bytes")
                    resolve(blob)
                } else {
                    console.error("Failed to create blob from canvas")
                    reject(new Error('Failed to create blob'))
                }
            }, 'image/png')
        }

        img.onerror = (error) => {
            console.error("Failed to load template image:", error)
            console.error("Image src:", img.src)
            reject(new Error('Failed to load template image'))
        }

        // Load template
        const templatePath = '/result.png'
        console.log("Loading template from:", templatePath)
        img.src = templatePath
    })
}

/**
 * Generate result number
 */
export function generateResultNumber(count: number): string {
    return count.toString().padStart(2, '0')
}
