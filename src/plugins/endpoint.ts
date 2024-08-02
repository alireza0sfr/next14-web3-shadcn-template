import { Endpoints } from "~/consts/endpoints"
import ImplementationException from '~/exceptions/ImplementationException'
import { IEndpoint, TEndpoint } from "~/types/plugins/endpoint"

export class Endpoint implements IEndpoint {
  endpoints: TEndpoint[] = [];

  constructor() {
    for (const [key, value] of Object.entries(Endpoints))
      this.register(key, value)
  }

  register(module: string, _endpoints: TEndpoint[]): void {
    _endpoints.forEach((e: TEndpoint) =>
      this.endpoints.push({
        module: module,
        name: e.name,
        address: e.address,
        noTrailingSlash: true, // Remove trailing slash for all endpoints
      })
    )
  }

  getUrl(name: string, ...args: any[]): string {
    const endpoint = this.endpoints.find((e: TEndpoint) => e.name === name)

    if (!endpoint)
      throw new ImplementationException("[ENDPOINTS] Couldn't find an endpoint with provided name!", { name, ...args })

    return this.prepareAddress(endpoint, ...args)
  }

  prepareAddress(endpoint: TEndpoint, ...args: any[]): string {
    const _endpoint =
      typeof endpoint.address === "function"
        ? `${endpoint.module}/${endpoint.address(...args)}`
        : `${endpoint.module}/${endpoint.address}`
    if (endpoint.noTrailingSlash) {
      return _endpoint.endsWith("/") ? _endpoint.slice(0, -1) : _endpoint
    } else {
      return _endpoint.endsWith("/") ? _endpoint : _endpoint + "/"
    }
  }
}

const _endpoint = new Endpoint()

export default _endpoint
