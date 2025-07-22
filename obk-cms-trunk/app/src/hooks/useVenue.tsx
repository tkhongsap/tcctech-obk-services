import { Mappedin, TGetVenueOptions, getVenue } from '@mappedin/mappedin-js'
import { useEffect, useState } from 'react'

const options: TGetVenueOptions = {
  venue: 'tcc-one-bangkok',
  clientId: process.env.VENUE_CLIENT_ID,
  clientSecret: process.env.VENUE_CLIENT_SECRET,
  language: 'en',
}

export default function useVenue() {
  const [venue, setVenue] = useState<Mappedin | undefined>()

  useEffect(() => {
    let ignore = false
    async function fetchData() {
      try {
        const data = await getVenue(options)
        if (!ignore) {
          setVenue(data)
        }
      } catch (e) {
        setVenue(undefined)
      }
    }
    fetchData()

    return () => {
      ignore = true
    }
  }, [options])

  return venue
}
