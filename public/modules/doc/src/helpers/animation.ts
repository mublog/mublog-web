export interface KeyframeOptions {
    duration: number
    timingFunction?: string
    delay?: number
    iterationCount?: number | "infinite"
    direction?: "normal" | "alternate" | "reverse" | "alternate-reverse"
    fillMode?: "none" | "forwards" | "backwards" | "both"
}

const styleElement: HTMLStyleElement = document.createElement("style")
document.head.appendChild(styleElement)
const CSSSheet: CSSStyleSheet = styleElement.sheet

export default function createAnimation(
    keyframes: Partial<CSSStyleDeclaration>[],
    options: KeyframeOptions
): string {
    return useKeyframes(keyframes, options)
}

function useKeyframes(
    cssStyleDeclarations: Partial<CSSStyleDeclaration>[], 
    options: KeyframeOptions
): string {
    const { duration, delay, direction, fillMode, iterationCount, timingFunction } = options
    const name = "a-" + (Date.now() + Math.round(Math.random() * 10000)).toString(36)
    let rule: string
    let keyframes = ""
    let animationRule: string
    const keyframeLength = cssStyleDeclarations.length
    cssStyleDeclarations.forEach((cssStyleDeclaration, i) => {
        let keyframe = ""
        for (let rule in cssStyleDeclaration) {
            let property = rule.replace(/([A-Z])/g, "-$1").toLowerCase()
            keyframe += `${property}: ${cssStyleDeclaration[rule]};`
        }
        keyframes += `${((i/keyframeLength)*100)}% { ${keyframe} }`
    })
    rule = `@keyframes ${name} { ${keyframes} }`
    animationRule = `.${name} { animation: ${name} ${duration}ms ${timingFunction || "linear"} ${delay || 0}ms ${iterationCount || 1} ${direction || "normal"} ${fillMode || "none"} }`
    CSSSheet.insertRule(rule, CSSSheet.rules.length)
    CSSSheet.insertRule(animationRule, CSSSheet.rules.length)
    return name
}