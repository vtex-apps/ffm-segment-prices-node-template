export interface StaleRevalidateData<T> {
  ttl: Date
  data: T
}
