declare interface HttpOptions {
  contentType?: "json" | "text" | "blob"
  body?: any
  init?: RequestInit
}