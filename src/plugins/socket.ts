import ImplementationException from '~/exceptions/ImplementationException'

export default class Socket {
  private static connection: any | null = null

  constructor() {

    if (!Socket.connection)
      this.createSocket()
  }

  private createSocket(): void {
    throw new ImplementationException('[Socket] createSocket Not Implmented')
  }

  public disconnect(): void {
    Socket.connection = null
  }
}
