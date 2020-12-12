export declare interface HttpOptions {
  responseType?: "json" | "text" | "blob"
  init?: Omit<RequestInit, "body" | "method">
}

export declare type HttpResponse<Type> = Promise<[Type, Response, Error]>

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

async function f<T>(url: string, method: string, body: any, options?: HttpOptions): HttpResponse<T> {
  try {
    let [opt, init] = createHttp(method, body, options)
    let response = await fetch(url, init)
    let data: T = await response[opt.responseType]()
    return [data, response, null]
  }
  catch (error) {
    return [null, null, error]
  }
}

export const get = <T>(url: string, opt?: HttpOptions): HttpResponse<T> => f(url, "GET", null, opt)
export const post = <T>(url: string, body?: any, opt?: HttpOptions): HttpResponse<T> => f(url, "POST", body, opt)
export const put = <T>(url: string, body?: any, opt?: HttpOptions): HttpResponse<T> => f(url, "PUT", body, opt)
export const del = <T>(url: string, body?: any, opt?: HttpOptions): HttpResponse<T> => f(url, "DELETE", body, opt)
export const patch = <T>(url: string, body?: any, opt?: HttpOptions): HttpResponse<T> => f(url, "PATCH", body, opt)