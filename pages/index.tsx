import { productsQuery } from '@lib/query'
import { urlFor, usePreviewSubscription } from '@lib/sanity'
import { getClient } from '@lib/sanity.server'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useState } from 'react'

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

  if (!router.isFallback && !data.products) {
    return <NotFound statusCode={404} />
  }

  console.log(products)

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
  const productsResponse = await getClient(preview).fetch(productsQuery)

  const products = productsResponse.map((product: any) => ({
    ...product,
    name: product.title ?? '',
    color: product.defaultProductVariant.grams ?? 0,
    price: product.defaultProductVariant.price ?? 0,
    imageSrc: urlFor(product.defaultProductVariant.images[0]).width(200).url(),
    imageAlt: product.defaultProductVariant.images[0]._key ?? '',
  }))
  return {
    props: {
      preview,
      data: { products },
    },
  }
}

export default Home
