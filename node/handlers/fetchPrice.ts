import { NotFoundError } from '@vtex/api'

import type { Profile } from '../typings/profileSystem'
import { fetchPriceTables } from './fetchPriceTable'

export async function fetchPrice(ctx: Context, next: Next) {
  const { clients, body } = ctx

  const { pricing } = clients

  const currentProfile: Profile | null = await fetchPriceTables(ctx)

  const price = await pricing.getPrice(
    body.item.skuId,
    currentProfile?.priceTables ?? '1'
  )

  if (!price) {
    const error = new NotFoundError('Price not found')

    ctx.vtex.logger.error({
      message: 'ExternalPriceApp_FetchPrice_Noprice',
      error,
    })

    throw error
  }

  ctx.state.quote = {
    ...price,
    skuId: body.item.skuId,
  }

  await next()
}
