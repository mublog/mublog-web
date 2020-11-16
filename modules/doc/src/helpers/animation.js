// @ts-check

const styleElement = document.createElement("style")
document.head.appendChild(styleElement)
const CSSSheet = styleElement.sheet

/**
 * @typedef KeyframeOptions
 * @property {number} duration
 * @property {string} [timingFunction]
 * @property {number} [delay]
 * @property {number | "infinite"} [iterationCount]
 * @property {"normal" | "alternate" | "reverse" | "alternate-reverse"} [direction]
 * @property {"none" | "forwards" | "backwards" | "both"} [fillMode]
 */

/**
 * @param {Partial<CSSStyleDeclaration>[]} keyframes 
 * @param {KeyframeOptions} options
 */
export default function createAnimation(keyframes, options) {
    return useKeyframes(keyframes, options)
}

/**
 * @param {Partial<CSSStyleDeclaration>[]} cssStyleDeclarations
 * @param {KeyframeOptions} options
 */
function useKeyframes(cssStyleDeclarations, options) {
    const { duration, delay, direction, fillMode, iterationCount, timingFunction } = options
    const name = "a-" + (Date.now() + Math.round(Math.random() * 10000)).toString(36)
    let rule = ""
    let keyframes = ""
    let animationRule = ""
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