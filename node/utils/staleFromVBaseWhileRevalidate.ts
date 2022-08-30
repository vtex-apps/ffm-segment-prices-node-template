/* eslint-disable max-params */
import { createHash } from 'crypto'

import type { VBase } from '@vtex/api'

import type { StaleRevalidateData } from '../typings/staleFromVBaseWhileRevalidate'

const getTTL = (expirationInMinutes?: number) => {
  const ttl = new Date()

  ttl.setMinutes(ttl.getMinutes() + (expirationInMinutes ?? 30))

  return ttl
}

const revalidate = async <T>(
  vbase: VBase,
  bucket: string,
  filePath: string,
  endDate: Date,
  validateFunction: (params?: unknown) => Promise<T>,
  params?: unknown
) => {
  const data = await validateFunction(params)
  const revalidatedData = { data, ttl: endDate }

  vbase
    .saveJSON<StaleRevalidateData<T>>(bucket, filePath, revalidatedData)
    .catch()

  return data
}

const normalizedJSONFile = (filePath: string) =>
  `${createHash('md5').update(filePath).digest('hex')}.json`

export const staleFromVBaseWhileRevalidate = async <T>(
  vbase: VBase,
  bucket: string,
  filePath: string,
  validateFunction: (params?: any) => Promise<T>,
  params?: unknown,
  options?: { expirationInMinutes?: number }
): Promise<T> => {
  const normalizedFilePath = normalizedJSONFile(filePath)
  const cachedData = (await vbase
    .getJSON<StaleRevalidateData<T>>(bucket, normalizedFilePath, true)
    .catch()) as StaleRevalidateData<T>

  if (!cachedData) {
    const endDate = getTTL(options?.expirationInMinutes)

    // eslint-disable-next-line no-return-await
    return await revalidate<T>(
      vbase,
      bucket,
      normalizedFilePath,
      endDate,
      validateFunction,
      params
    )
  }

  const { data, ttl } = cachedData as StaleRevalidateData<T>

  const today = new Date()
  const ttlDate = new Date(ttl)

  if (today < ttlDate) {
    return data
  }

  const endDate = getTTL(options?.expirationInMinutes)

  revalidate<T>(
    vbase,
    bucket,
    normalizedFilePath,
    endDate,
    validateFunction,
    params
  )

  return data
}
