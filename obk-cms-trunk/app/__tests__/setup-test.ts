import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from '../__mocks__/server'
import { cleanup } from '@testing-library/react'

vi.mock('*.svg', () => {
  // Return a mock React component for SVG imports
  return {
    ReactComponent: () => null,
  }
})

// mock api calls
beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => {
  server.close()
})
