import { groq } from 'next-sanity'

export const productsQuery = groq`
  *[_type == "product"] | order(_createdAt desc)
`
