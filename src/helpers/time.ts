export const getDaysTillNow = (dateString: string) => {

  if (!dateString)
    return '0'

  const targetDate = new Date(dateString)
  const currentDate = new Date()

  // Calculate the time difference in milliseconds
  const timeDifference: number = currentDate.getTime() - targetDate.getTime()

  // Calculate the number of days until the target date
  const daysUntil = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  // date between is less than 24hours
  if (daysUntil === 0)
    return '1'

  return daysUntil
}

export const humanReadableDateTime = (dateString: string | null) => {

  if (!dateString)
    return '-'

  const date = new Date(dateString)

  // Extracting individual components
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Adding 1 since months are zero-based
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  // Formatting the date and time
  return `${year}/${day}/${month} ${hours}:${minutes}:${seconds}`
}