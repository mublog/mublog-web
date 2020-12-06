export default function fullUrl(): string {
  return location.pathname + location.search + location.hash
}

export function getURLParams(url: string) {
  let paramObj = {},
    params = new URLSearchParams(url)
  params.forEach((val, key) => {
    if (paramObj[key]) {
      if (Array.isArray(paramObj[key])) {
        paramObj[key] = [...paramObj[key], val]
      }
      else {
        paramObj[key] = [paramObj[key], val]
      }
    }
    else {
      paramObj[key] = val
    }
  })
  return paramObj
}