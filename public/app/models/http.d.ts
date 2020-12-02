declare interface HttpOptions {
  contentType?: "json" | "text" | "blob"
  body?: any
  init?: RequestInit
}

declare interface ResponseWrapper<Type> {
  data: Type
  messages: string[]
  isError: boolean
}

declare interface PostsResponse extends ResponseWrapper<PostModel[]> { }