export default function onScreen(el: HTMLElement) {
  const { top, bottom } = el.getBoundingClientRect()
  if ((top && bottom) === 0) return false
  return top < innerHeight && bottom >= 0
}