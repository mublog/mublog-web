interface UploadItem {
  key: string
  preview: string
  fileName: string
}

interface Media {
  guid: string
}

interface JWToken {
  aud: string
  email: string
  exp: number
  iss: string
  jti: string
  nbf: number
  sub: string
}