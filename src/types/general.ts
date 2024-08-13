export type TPrice = string
export type TId = string

export interface IBaseDto {
  id: TId
}

export interface IErrorResponse {
  message: string[]
  error: string
  statusCode: number
}