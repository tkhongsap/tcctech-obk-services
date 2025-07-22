import axios from 'axios'

export async function getReceiptFetchingTime(): Promise<number> {
  const res = await axios.get('/api/receipt-fetching-time')

  return res.data
}
