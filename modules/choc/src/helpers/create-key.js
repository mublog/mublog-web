// @ts-check
export default function createKey() {
    return (Date.now() + Math.round(Math.random() * 10000)).toString(36)
}