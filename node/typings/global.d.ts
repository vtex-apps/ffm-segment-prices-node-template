import type { RecorderState, ServiceContext } from '@vtex/api'
import type { Clients } from '../clients'
import type { Quote, ExternalPriceInput } from './externalPrice'

declare global {
  type Context<TState extends State = State> = ServiceContext<Clients, TState>

  interface State extends RecorderState {
    quote?: Quote
    body: ExternalPriceInput
    pricingAccount: string
  }

  type Next = () => Promise<void>
}
