import ImplementationException from '~/exceptions/ImplementationException'

export const getEnvSafely = (envVal: string | undefined, envKey: string) => {

  if (!envVal)
    throw new ImplementationException(`Missing variable ${envKey}!`, { envKey, envVal })

  return envVal
}
