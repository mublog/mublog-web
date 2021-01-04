interface UploadItem {
  key: string
  preview: string
  data: any
  fileName: string
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