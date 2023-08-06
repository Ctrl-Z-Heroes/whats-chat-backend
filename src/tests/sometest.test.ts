import { describe, expect, it } from 'vitest'

export function add(a: number, b: number) {
  return a + b
}

describe('Some test', () => {
  it('should pass', () => {
    expect(add(1, 2)).toBe(3)
  })
})
