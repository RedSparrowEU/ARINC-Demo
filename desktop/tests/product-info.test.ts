import { describe, expect, it } from 'vitest'
import { productInfo } from '../src/shared/domain/product-info'

describe('desktop scaffold', () => {
  it('labels the product as non-operational', () => {
    expect(productInfo.operational).toBe(false)
  })
})
