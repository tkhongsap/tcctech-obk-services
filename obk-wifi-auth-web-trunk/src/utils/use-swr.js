import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

export function logger(useSWRNext) {
  return (key, fetcher, config) => {
    // Add logger to the original fetcher.
    const extendedFetcher = (...args) => {
      return fetcher(...args)
    }

    // Execute the hook with the new fetcher.
    return useSWRNext(key, extendedFetcher, config)
  }
}

export default function useCustomSWR(url, fetcher, config = {}) {
  return useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...config,
  })
}

export function useCustomImmutableSWR(url, fetcher, config = {}) {
  return useSWRImmutable(url, fetcher, config)
}

export const mapResponse = ({ data, error, mutate, isValidating }) => {
  return {
    res: data,
    isLoading: isValidating,
    mutate,
    error,
  }
}
