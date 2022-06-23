import { groq } from 'next-sanity'

export const homeQuery = groq`
  *[_type == "home"]
`

export const productsQuery = groq`
  *[_type == "product"]
`

export const productQuery = groq`
  *[_type == "product" && slug.current == $slug][0]
`

export const definedProductQuery = groq`*[_type == "product" && defined(slug.current)][].slug.current`
