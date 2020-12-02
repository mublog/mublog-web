export declare interface HttpOptions {
  contentType?: "json" | "text" | "blob"
  body?: any
  init?: RequestInit
}

async function toResponseType(response: Response, type: "json" | "text" | "blob") {
  switch (type) {
    case "blob":
      return await response.blob()
    case "json":
      return await response.json()
    case "text":
    default:
      return await response.text()
  }
}

function createInit(method: string, body?: any, options?: HttpOptions): RequestInit {
  if (!options) {
    options = {}
  }
  return { ...options.init, method, body }
}

export async function get<Type>(url: string, options?: HttpOptions): Promise<[Type, Response]> {
  let response = await fetch(url, options.init)
  let data: Type = await toResponseType(response, options.contentType)
  return [data, response]
}

export async function post<Type>(url: string, body?: any, options?: HttpOptions): Promise<[Type, Response]> {
  let init = createInit("POST", body, options)
  let response = await fetch(url, init)
  let data: Type = await toResponseType(response, options.contentType)
  return [data, response]
}

export async function put<Type>(url: string, body?: any, options?: HttpOptions): Promise<[Type, Response]> {
  let init = createInit("PUT", body, options)
  let response = await fetch(url, init)
  let data: Type = await toResponseType(response, options.contentType)
  return [data, response]
}

export async function del<Type>(url: string, body?: any, options?: HttpOptions): Promise<[Type, Response]> {
  let init = createInit("DELETE", body, options)
  let response = await fetch(url, init)
  let data: Type = await toResponseType(response, options.contentType)
  return [data, response]
}

export async function patch<Type>(url: string, body?: any, options?: HttpOptions): Promise<[Type, Response]> {
  let init = createInit("PATCH", body, options)
  let response = await fetch(url, init)
  let data: Type = await toResponseType(response, options.contentType)
  return [data, response]
}