export interface ProductInfo {
  name: string
  operational: false
}

export const productInfo: ProductInfo = Object.freeze({
  name: 'AeroNav Update Console',
  operational: false
})
