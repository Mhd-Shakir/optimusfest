/**
 * Client-side poster generator for event results
 * Creates ONE poster showing all three winners using new templates
 */

export interface EventResultData {
    event: string
    category: string
    resultNumber: string
    templatePath: string // e.g. /opt_result_1.png
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
            // Wait for fonts if necessary
            await document.fonts.ready

            // Set canvas size to match template
            canvas.width = img.width
            canvas.height = img.height

            // Draw template image
            ctx.drawImage(img, 0, 0)

            // Layout Constants (based on 1080x1350 template)
            const scaleX = canvas.width / 1080
            const scaleY = canvas.height / 1350

            // 1. RESULT NUMBER (Inside the tab)
            // Tab center X is ~173, Y is ~220
            ctx.fillStyle = '#ffffff'
            // Use Category Font (Montserrat Thin) for Result Number
            ctx.font = `100 ${Math.round(200 * scaleX)}px "MONTSERRAT-THIN", "Montserrat Thin", "Montserrat-Thin", "Montserrat", sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(data.resultNumber, 173 * scaleX, 220 * scaleY)

            // 2. EVENT NAME
            ctx.fillStyle = '#ffffff'
            ctx.font = `${Math.round(55 * scaleX)}px "Nohemi", Arial, sans-serif`
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'

            const titleX = 380 * scaleX
            const titleY = 170 * scaleY
            const maxTitleWidth = 650 * scaleX

            const eventLines = wrapText(ctx, data.event, maxTitleWidth)
            let currentY = titleY
            eventLines.forEach((line) => {
                ctx.fillText(line, titleX, currentY)
                currentY += 65 * scaleY
            })

            // 3. CATEGORY (Huge and thin)
            ctx.fillStyle = '#ffffff'
            // Try explicit Thin family first, then fallback to standard Montserrat with 100 weight
            ctx.font = `${Math.round(140 * scaleX)}px "MONTSERRAT-THIN", "Montserrat Thin", "Montserrat-Thin", sans-serif`
            // If the above doesn't work well, we might need a separate draw call, but let's try strict family names first. 
            // Often "Montserrat Thin" is a distinct family on Windows.
            if (document.fonts.check(`100 10px "Montserrat"`)) {
                ctx.font = `100 ${Math.round(140 * scaleX)}px "Montserrat", sans-serif`
            }
            // Final Override with user request + fallbacks
            ctx.font = `100 ${Math.round(140 * scaleX)}px "MONTSERRAT-THIN", "Montserrat Thin", "Montserrat-Thin", "Montserrat", sans-serif`

            ctx.textAlign = 'left'
            ctx.fillText(data.category, titleX, currentY)

            // 4. WINNERS (Three columns)
            const winnerY = 460 * scaleY
            const colX = [220 * scaleX, 540 * scaleX, 860 * scaleX]

            const positions = [
                { title: '01', winners: data.winners.first },
                { title: '02', winners: data.winners.second },
                { title: '03', winners: data.winners.third }
            ]

            positions.forEach((pos, idx) => {
                const x = colX[idx]
                let y = winnerY

                // Draw number header - Removed
                // ctx.fillStyle = '#1a1a1a'
                // ctx.font = `bold ${Math.round(80 * scaleX)}px Arial, sans-serif`
                // ctx.textAlign = 'center'
                // ctx.fillText(pos.title, x, y)

                // Draw names
                y += 90 * scaleY

                pos.winners.forEach(name => {
                    // Check if name has subtext like "Name (Place)" or "Name - Place"
                    let mainName = name
                    let subText = ""

                    if (name.includes('(')) {
                        const parts = name.split('(')
                        mainName = parts[0].trim()
                        subText = parts[1].replace(')', '').trim()
                    } else if (name.includes('-')) {
                        const parts = name.split('-')
                        mainName = parts[0].trim()
                        subText = parts[1].trim()
                    }

                    // Draw Main Name
                    ctx.fillStyle = '#1a1a1a'
                    ctx.font = `bold ${Math.round(24 * scaleX)}px "Montserrat", sans-serif`
                    const nameLines = wrapText(ctx, mainName, 300 * scaleX)
                    nameLines.forEach(line => {
                        ctx.fillText(line, x, y)
                        y += 42 * scaleY
                    })

                    // Draw Subtext (if any)
                    if (subText) {
                        ctx.fillStyle = '#555555'
                        ctx.font = `${Math.round(20 * scaleX)}px "Montserrat", sans-serif`
                        const subLines = wrapText(ctx, subText, 300 * scaleX)
                        subLines.forEach(line => {
                            ctx.fillText(line, x, y)
                            y += 35 * scaleY
                        })
                    }

                    y += 15 * scaleY // Gap between multiple winners
                })
            })

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
        img.src = data.templatePath
    })
}

/**
 * Generate 3 variations of the FULL poster (using different backgrounds)
 */
export async function generatePosterVariations(
    data: EventResultData,
    templatePaths: string[] = ["/opt_result_1.png", "/opt_result_2.png", "/opt_result_3.png", "/opt_result_4.png"]
): Promise<Blob[]> {
    console.log("generatePosterVariations called with data:", data)

    // Helper to generate one full poster with a specific template
    const createFullPoster = (templatePath: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) return reject(new Error('Canvas not supported'))

            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = async () => {
                await document.fonts.ready
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0)

                // Layout Constants (based on 1080x1350 template)
                const scaleX = canvas.width / 1080
                const scaleY = canvas.height / 1350

                // 1. RESULT NUMBER
                ctx.fillStyle = '#ffffff'
                // Use Category Font (Montserrat Thin) for Result Number
                ctx.font = `100 ${Math.round(200 * scaleX)}px "MONTSERRAT-THIN", "Montserrat Thin", "Montserrat-Thin", "Montserrat", sans-serif`
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(data.resultNumber, 173 * scaleX, 220 * scaleY)

                // 2. EVENT NAME
                ctx.fillStyle = '#ffffff'
                ctx.font = `${Math.round(55 * scaleX)}px "Nohemi", Arial, sans-serif`
                ctx.textAlign = 'left'
                ctx.textBaseline = 'top'

                const titleX = 380 * scaleX
                const titleY = 250 * scaleY
                const maxTitleWidth = 650 * scaleX

                const eventLines = wrapText(ctx, data.event, maxTitleWidth)
                let currentY = titleY
                eventLines.forEach((line) => {
                    ctx.fillText(line, titleX, currentY)
                    currentY += 65 * scaleY
                })

                // 3. CATEGORY
                ctx.fillStyle = '#ffffff'
                ctx.font = `100 ${Math.round(140 * scaleX)}px "MONTSERRAT-THIN", "Montserrat Thin", "Montserrat-Thin", "Montserrat", sans-serif`
                ctx.textAlign = 'left'
                ctx.fillText(data.category, titleX, 345 * scaleY)

                // 4. WINNERS (Three columns)
                const winnerY = 630 * scaleY
                const colX = [170 * scaleX, 490 * scaleX, 810 * scaleX]

                const positions = [
                    { title: '01', winners: data.winners.first },
                    { title: '02', winners: data.winners.second },
                    { title: '03', winners: data.winners.third }
                ]

                positions.forEach((pos, idx) => {
                    const x = colX[idx]
                    let y = winnerY

                    // Draw number header - Removed as per request
                    // ctx.fillStyle = '#1a1a1a'
                    // ctx.font = `bold ${Math.round(80 * scaleX)}px Arial, sans-serif`
                    // ctx.textAlign = 'center'
                    // ctx.fillText(pos.title, x, y)

                    // Draw names (started lower since header is gone)
                    // Draw names (started lower since header is gone)
                    // y += 90 * scaleY - Removed offset to put names just below where digits would be

                    pos.winners.forEach(name => {
                        let mainName = name
                        let subText = ""

                        if (name.includes('(')) {
                            const parts = name.split('(')
                            mainName = parts[0].trim()
                            subText = parts[1].replace(')', '').trim()
                        } else if (name.includes('-')) {
                            const parts = name.split('-')
                            mainName = parts[0].trim()
                            subText = parts[1].trim()
                        }

                        // Draw Main Name
                        ctx.fillStyle = '#1a1a1a'
                        ctx.font = `bold ${Math.round(24 * scaleX)}px "Montserrat", sans-serif`
                        const nameLines = wrapText(ctx, mainName, 300 * scaleX)
                        nameLines.forEach(line => {
                            ctx.fillText(line, x, y)
                            y += 42 * scaleY
                        })

                        // Draw Subtext
                        if (subText) {
                            ctx.fillStyle = '#555555'
                            ctx.font = `${Math.round(20 * scaleX)}px "Montserrat", sans-serif`
                            const subLines = wrapText(ctx, subText, 300 * scaleX)
                            subLines.forEach(line => {
                                ctx.fillText(line, x, y)
                                y += 35 * scaleY
                            })
                        }

                        y += 15 * scaleY
                    })
                })

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob)
                    else reject(new Error('Failed to create blob'))
                }, 'image/png')
            }
            img.onerror = () => reject(new Error('Failed to load template image: ' + templatePath))
            img.src = templatePath
        })
    }

    try {
        const posterPromises = templatePaths.map(path => createFullPoster(path))
        return await Promise.all(posterPromises)
    } catch (error) {
        console.error("Error generating poster variations:", error)
        throw error
    }
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
