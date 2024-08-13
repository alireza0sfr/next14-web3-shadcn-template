import env from '~/env'

export const getRPC = () => env.IS_MAINNET ? env.RPC_URL : env.TEST_RPC_URL