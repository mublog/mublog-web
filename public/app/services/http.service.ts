export declare interface HttpOptions {
  responseType?: "json" | "text" | "blob"
  init?: Omit<RequestInit, "body" | "method">
}

export declare type HtttpResponse<Type> = Promise<[Type, Response, Error]>

const token = () => localStorage.getItem("token")

const httpHeaders = (): RequestInit["headers"] => {
  const localToken = token()
  const headers = {
    "Content-Type": "application/json"
  }
  if (localToken) {
    headers["Authorize"] = "Bearer " + localToken
    headers["Authorization"] = "Bearer " + localToken
  }
  return headers
}

function createHttp(method: string, body: string, options: HttpOptions): [HttpOptions, RequestInit] {
  if (!options) options = {}
  if (!options.responseType) options.responseType = "json"
  let init: RequestInit = { headers: httpHeaders(), method, body }
  return [options, init]
}

export async function method<Type>(url: string, method: string, body: any, options?: HttpOptions): HtttpResponse<Type> {
  try {
    let [opt, init] = createHttp(method, body, options)
    let response = await fetch(url, init)
    let data: Type = await response[opt.responseType]()
    return [data, response, null]
  }
  catch (error) {
    return [null, null, error]
  }
}

export function get<Type>(url: string, options?: HttpOptions): HtttpResponse<Type> {
  return method(url, "GET", null, options)
}

export function post<Type>(url: string, body?: any, options?: HttpOptions): HtttpResponse<Type> {
  return method(url, "POST", body, options)
}

export function put<Type>(url: string, body?: any, options?: HttpOptions): HtttpResponse<Type> {
  return method(url, "PUT", body, options)
}

export function del<Type>(url: string, body?: any, options?: HttpOptions): HtttpResponse<Type> {
  return method(url, "DELETE", body, options)
}

export function patch<Type>(url: string, body?: any, options?: HttpOptions): HtttpResponse<Type> {
  return method(url, "PATCH", body, options)
}