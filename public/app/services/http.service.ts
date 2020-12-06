export declare interface HttpOptions {
  contentType?: "json" | "text" | "blob"
  init?: RequestInit
}

const token = () => localStorage.getItem("token")

const httpHeaders = (): RequestInit => ({
  headers: {
    "Content-Type": "application/json",
    "Authorize": "Bearer " + token(),
    "Authorization": "Bearer " + token()
  }
})

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

function createHttp(method: string, body: string, options: HttpOptions): [HttpOptions, RequestInit] {
  if (!options) options = {}
  if (!options.contentType) options.contentType = "json"
  let init: RequestInit = { ...httpHeaders(), method, body }
  return [options, init]
}

export async function method<Type>(url: string, method: string, body: any, options?: HttpOptions): Promise<[Type, Response]> {
  let [opt, init] = createHttp(method, body, options)
  let response = await fetch(url, init)
  let data: Type = await toResponseType(response, opt.contentType)
  return [data, response]
}

export async function get<Type>(url: string, options?: HttpOptions): Promise<[Type, Response]> {
  return await method(url, "GET", null, options)
}

export async function post<Type>(url: string, body?: any, options?: HttpOptions): Promise<[Type, Response]> {
  return await method(url, "POST", body, options)
}

export async function put<Type>(url: string, body?: any, options?: HttpOptions): Promise<[Type, Response]> {
  return await method(url, "PUT", body, options)
}

export async function del<Type>(url: string, body?: any, options?: HttpOptions): Promise<[Type, Response]> {
  return await method(url, "DELETE", body, options)
}

export async function patch<Type>(url: string, body?: any, options?: HttpOptions): Promise<[Type, Response]> {
  return await method(url, "PATCH", body, options)
}