import { homeQuery, productsQuery } from '@lib/query'
import { urlFor, usePreviewSubscription } from '@lib/sanity'
import { getClient } from '@lib/sanity.server'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { numberWithCommas } from 'utils'
import _ from 'lodash'

import Collection from '../components/Collection'
import Footer from '../components/Footer'
import Incentives from '../components/Incentives'
import ProductFeature from '../components/ProductFeature'
import ProductList from '../components/ProductList'
import ProductQuickView from '../components/ProductQuickView'
import PromoSection from '../components/PromoSection'
import NotFound from './404'

interface HomeProps {
  data: any
  review: boolean
}

const Home = ({ data, review }: HomeProps) => {
  const router = useRouter()
  const [quickViewOpen, setQuickViewOpen] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [state, setState] = useState<any>({
    products: [],
    loading: false,
    err: '',
  })

  const handleOpenQuickView = useCallback((product: any) => {
    setSelectedProduct(product)
    setTimeout(() => {
      setQuickViewOpen(true)
    }, 200)
  }, [])

  const handleCloseQuickView = useCallback(() => {
    setQuickViewOpen(false)
    setTimeout(() => {
      setSelectedProduct(null)
    }, 200)
  }, [])

  const handleAddToCart = useCallback(() => {
    handleCloseQuickView()
  }, [handleCloseQuickView])

  // const { data: products } = usePreviewSubscription(productsQuery, {
  //   // params: { slug: data.post?.slug },
  //   initialData: data.products,
  //   // enabled: preview && data.post?.slug,
  // })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await getClient().fetch(productsQuery)
        const products = productsResponse.map((product: any) => {
          const colors = product?.colors?.map((color: any) => ({
            ...color,
            price: _.get(color, ['price']) ?? 0,
            images: color?.images?.map((image: any) => ({
              id: _.get(image, ['_key']) ?? '',
              src: image ? urlFor(image).url() : '',
              alt: _.get(image, ['_key']),
            })),
          }))

          // const defaultPrice = _.get(product, ['price']) ?? 0
          // const storagePrice = _.get(product, ['storages', 0, 'price']) ?? 0
          // const colorPrice = _.get(product, ['colors', 0, 'price'])
          // const price = numberWithCommas(
          //   defaultPrice + storagePrice + colorPrice ?? 0
          // )

          return {
            ...product,
            name: _.get(product, ['name']) ?? '',
            colors,
            price: _.get(product, ['price']) ?? 0,
            thumbnailSrc: _.get(product, ['colors', 0, 'images', 0])
              ? urlFor(_.get(product, ['colors', 0, 'images', 0])).url()
              : '',
            thumbnailAlt:
              _.get(product, ['colors', 0, 'images', 0, '_key']) ?? '',
          }
        })
        setState((s: any) => ({ ...s, products }))
      } catch (error: any) {
        setState((s: any) => ({ ...s, err: error.message }))
      } finally {
        setState((s: any) => ({ ...s, loading: false }))
      }
    }

    fetchData()
  }, [])

  const { products } = state

  // if (!router.isFallback && !data.products && !data.home) {
  //   return <NotFound statusCode={404} />
  // }

  return (
    <Fragment>
      <div className="pt-16">
        <PromoSection />
        <ProductFeature />
        <Collection />
        <ProductList data={products} showQuickView={handleOpenQuickView} />
        <ProductQuickView
          show={quickViewOpen}
          selectedProduct={selectedProduct}
          onClose={handleCloseQuickView}
          addToCart={handleAddToCart}
        />
        <Incentives />
        <Footer />
      </div>
    </Fragment>
  )
}

// export async function getStaticProps({ params, preview = false }: any) {
//   const productsResponse = await getClient(preview).fetch(productsQuery)
//   const products = productsResponse.map((product: any) => ({
//     ...product,
//     name: _.get(product, ['name']) ?? '',
//     colors: _.get(product, ['colors']) ?? '',
//     price: numberWithCommas(_.get(product, ['price']) ?? 0),
//     thumbnailSrc: _.get(product, ['colors', 0, 'images', 0])
//       ? urlFor(_.get(product, ['colors', 0, 'images', 0])).url()
//       : '',
//     thumbnailAlt: _.get(product, ['colors', 0, 'images', 0, '_key']) ?? '',
//   }))

//   return {
//     props: {
//       preview,
//       data: {
//         products,
//       },
//     },
//   }
// }

export default Home
