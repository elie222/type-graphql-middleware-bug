import * as config from 'config'

export const PORT: number = config.get('PORT')
export const TYPEORM_HOST: string = process.env.TYPEORM_HOST
export const ACCOUNTS_SECRET: string = config.get('ACCOUNTS_SECRET')
