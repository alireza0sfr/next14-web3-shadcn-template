import { TId } from '~/types/general'

export class UserDto {
  id: TId

  constructor(id: TId = '') {
    this.id = id
  }
}