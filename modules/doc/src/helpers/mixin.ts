export default function useMixin<Target, Source>(target: Target, source: Source): Target & Source {
    const props = Object.keys(source)
    for (const prop of props) {
        const descriptor = Object.getOwnPropertyDescriptor(source, prop)
        Object.defineProperty(target, prop, descriptor)
    }
    return target as unknown as Target & Source
}