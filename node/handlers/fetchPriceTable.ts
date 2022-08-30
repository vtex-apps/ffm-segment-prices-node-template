import type { Profile } from '../typings/profileSystem'
import { staleFromVBaseWhileRevalidate } from '../utils/staleFromVBaseWhileRevalidate'

export async function fetchPriceTables(ctx: Context) {
  const { clients, body } = ctx

  const { profileSystem } = clients

  let currentProfile: Profile | null = null

  const getPriceTable = async (params: { email: string }) => {
    const { email } = params

    return (await profileSystem.getProfileInfo(
      {
        email,
        userId: email,
      },
      'priceTables'
    )) as Profile
  }

  if (body.context.email) {
    try {
      currentProfile = await staleFromVBaseWhileRevalidate<Profile>(
        clients.vbase,
        'user-price-tables',
        body.context.email,
        getPriceTable,
        { email: body.context.email as string },
        { expirationInMinutes: 60 }
      )
    } catch (e) {
      ctx.vtex.logger.warn({
        message: 'ExternalPriceApp_FetchPriceTables_NoProfile',
        e,
      })

      throw e
    }
  }

  return currentProfile
}
