import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { numberWithCommas } from 'utils'

interface ProductListProps {
  data: any
  showQuickView: (product: any) => void
}

// const products = [...Array(10).keys()].map((i) => ({
//   id: i,
//   name: 'Basic Tee',
//   href: '#',
//   imageSrc:
//     'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
//   imageAlt: "Front of men's Basic Tee in black.",
//   price: '$35',
//   color: 'Black',
// }))

const ProductList = ({ data, showQuickView }: ProductListProps) => {
  const router = useRouter()

  const pushProduct = useCallback((product: any) => {
    router.push(`/product/${product.slug.current}`)
  }, [])

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Customers also purchased
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product: any, index: number) => {
            const price = numberWithCommas(
              product?.price +
                product?.colors?.[0]?.price +
                product?.storages?.[0]?.price
            )
            return (
              <div key={`product-${index}`} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                  <img
                    src={product.thumbnailSrc}
                    alt={product.thumbnailAlt}
                    className="w-full h-full object-center object-contain lg:w-full lg:h-full"
                  />
                  <div className="flex items-end p-4">
                    <button
                      // type="button"
                      className="relative z-10 w-full bg-white bg-opacity-75 py-2 px-4 rounded-md text-sm text-gray-900 opacity-0 group-hover:opacity-100"
                      onClick={() => showQuickView(product)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                <div
                  className="mt-4 flex justify-between cursor-pointer"
                  onClick={() => pushProduct(product)}
                >
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a
                      // href={product.href}
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{price}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProductList
