export type TEndpoint = {
  name: string;
  address: string | ((...args: any[]) => string);
  module?: string;
  noTrailingSlash?: boolean;
};

export interface IEndpoint {
  endpoints: TEndpoint[];

  register(module: string, _endpoints: TEndpoint[]): void;
  getUrl(name: string): string;
}
