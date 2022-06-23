import { homeQuery, productsQuery } from '@lib/query'
import { urlFor, usePreviewSubscription } from '@lib/sanity'
import { getClient } from '@lib/sanity.server'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useState } from 'react'
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
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const handleOpenQuickView = useCallback(() => {
    setQuickViewOpen(true)
  }, [])

  const handleCloseQuickView = useCallback(() => {
    setQuickViewOpen(false)
  }, [])

  const handleAddToCart = useCallback(() => {
    handleCloseQuickView()
  }, [handleCloseQuickView])

  const { data: products } = usePreviewSubscription(productsQuery, {
    // params: { slug: data.post?.slug },
    initialData: data.products,
    // enabled: preview && data.post?.slug,
  })

  if (!router.isFallback && !data.products && !data.home) {
    return <NotFound statusCode={404} />
  }

  return (
    <Fragment>
      <div className="pt-16">
        <PromoSection />
        <ProductFeature />
        <Collection />
        <ProductList data={products} showQuickView={handleOpenQuickView} />
        <ProductQuickView
          show={quickViewOpen}
          onClose={handleCloseQuickView}
          addToCart={handleAddToCart}
        />
        <Incentives />
        <Footer />
      </div>
    </Fragment>
  )
}

export async function getStaticProps({ params, preview = false }: any) {
  // const homeResponse = await getClient(preview).fetch(homeQuery)
  const productsResponse = await getClient(preview).fetch(productsQuery)
  // const home = {
  //   ...homeResponse,
  //   logo: _.get(homeResponse, [0, 'logo'])
  //     ? urlFor(_.get(homeResponse, [0, 'logo'])).url()
  //     : '',
  // }
  const products = productsResponse.map((product: any) => ({
    ...product,
    name: _.get(product, ['name']) ?? '',
    colors: _.get(product, ['colors']) ?? '',
    price: numberWithCommas(_.get(product, ['price']) ?? 0),
    thumbnailSrc: _.get(product, ['colors', 0, 'images', 0])
      ? urlFor(_.get(product, ['colors', 0, 'images', 0])).url()
      : '',
    thumbnailAlt: _.get(product, ['colors', 0, 'images', 0, '_key']) ?? '',
  }))

  return {
    props: {
      preview,
      data: {
        // home,
        products,
      },
    },
  }
}

export default Home
