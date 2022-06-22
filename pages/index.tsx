import type { NextPage } from 'next'
import { Fragment, useCallback, useState } from 'react'

import Collection from '../components/Collection'
import Footer from '../components/Footer'
import Incentives from '../components/Incentives'
import ProductFeature from '../components/ProductFeature'
import ProductList from '../components/ProductList'
import ProductQuickView from '../components/ProductQuickView'
import PromoSection from '../components/PromoSection'

const Home: NextPage = () => {
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

  return (
    <Fragment>
      <div className="pt-16">
        <PromoSection />
        <ProductFeature />
        <Collection />
        <ProductList showQuickView={handleOpenQuickView} />
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

export default Home
