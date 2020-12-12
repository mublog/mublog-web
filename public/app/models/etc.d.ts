declare interface UploadItem<Type> {
  guid?: string
  data?: Blob


  key: string
  fileName: string
  fileData: Type
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