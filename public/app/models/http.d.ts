interface HttpOptions {
  contentType?: "json" | "text" | "blob"
  body?: any
  init?: RequestInit
}

interface ResponseWrapper<Type> {
  data: Type
  messages: string[]
  isError: boolean
}