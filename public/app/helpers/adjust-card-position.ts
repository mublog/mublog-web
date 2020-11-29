export default function adjustCardPosition(top: number, left: number) {
  top -= 50
  left -= 50
  if (top < 0) {
    top = 0
  }
  if ((innerHeight - top) < 200) {
    top = innerHeight - 200
  }
  return [top, left]
}