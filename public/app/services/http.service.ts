export declare interface HttpOptions {
  contentType?: "json" | "text" | "blob"
  init?: RequestInit
}

export declare type CustomResponse<Type> = [Type, Response, Error]

const token = () => localStorage.getItem("token")

const httpHeaders = (): RequestInit => ({
  headers: {
    "Content-Type": "application/json",
    "Authorize": "Bearer " + token(),
    "Authorization": "Bearer " + token()
  }
})

function createHttp(method: string, body: string, options: HttpOptions): [HttpOptions, RequestInit] {
  if (!options) options = {}
  if (!options.contentType) options.contentType = "json"
  let init: RequestInit = { ...httpHeaders(), method, body }
  return [options, init]
}

export async function method<Type>(url: string, method: string, body: any, options?: HttpOptions): Promise<CustomResponse<Type>> {
  try {
    let [opt, init] = createHttp(method, body, options)
    let response = await fetch(url, init)
    let data: Type = await response[opt.contentType]()
    return [data, response, null]
  }
  catch (error) {
    return [null, null, error]
  }
}

export async function get<Type>(url: string, options?: HttpOptions): Promise<CustomResponse<Type>> {
  return await method(url, "GET", null, options)
}

export async function post<Type>(url: string, body?: any, options?: HttpOptions): Promise<CustomResponse<Type>> {
  return await method(url, "POST", body, options)
}

export async function put<Type>(url: string, body?: any, options?: HttpOptions): Promise<CustomResponse<Type>> {
  return await method(url, "PUT", body, options)
}

export async function del<Type>(url: string, body?: any, options?: HttpOptions): Promise<CustomResponse<Type>> {
  return await method(url, "DELETE", body, options)
}

export async function patch<Type>(url: string, body?: any, options?: HttpOptions): Promise<CustomResponse<Type>> {
  return await method(url, "PATCH", body, options)
}