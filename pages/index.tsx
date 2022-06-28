import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/outline'
import { ChevronDownIcon, FilterIcon, StarIcon } from '@heroicons/react/solid'
import { getClient } from '@lib/sanity.server'
import _ from 'lodash'
import { numberWithCommas } from 'utils'
import { urlFor } from '@lib/sanity'
import { useRouter } from 'next/router'

const filters = {
  price: [
    {
      value: '0',
      label: '$0 - $25',
      filter: 'price > 0 && price <= 25',
    },
    {
      value: '25',
      label: '$25 - $50',
      filter: 'price > 25 && price <= 50',
    },
    {
      value: '50',
      label: '$50 - $75',
      filter: 'price > 50 && price <= 75',
    },
    {
      value: '75',
      label: '$75+',
      filter: 'price > 75',
    },
  ],
  color: [
    { value: 'white', label: 'White', filter: 'color == "white"' },
    { value: 'beige', label: 'Beige', filter: 'color == "beige"' },
    { value: 'blue', label: 'Blue', filter: 'color == "blue"' },
    { value: 'brown', label: 'Brown', filter: 'color == "brown"' },
    { value: 'green', label: 'Green', filter: 'color == "green"' },
    { value: 'purple', label: 'Purple', filter: 'color == "purple"' },
    { value: 'black', label: 'Black', filter: 'color == "black"' },
  ],
  size: [
    { value: 'xs', label: 'XS', filter: 'size == "xs"' },
    { value: 's', label: 'S', filter: 'size == "s"' },
    { value: 'm', label: 'M', filter: 'size == "m"' },
    { value: 'l', label: 'L', filter: 'size == "l"' },
    { value: 'xl', label: 'XL', filter: 'size == "xl"' },
    { value: '2xl', label: '2XL', filter: 'size == "2xl"' },
  ],
  category: [
    // { value: 'all-new-arrivals', label: 'All New Arrivals', checked: false },
    { value: 'set', label: 'Set', filter: '"set" in tags' },
    { value: 'holder', label: 'Holder', filter: '"holder" in tags' },
    { value: 'ring', label: 'Ring', filter: '"ring" in tags' },
    { value: 'pack', label: 'Pack', filter: '"pack" in tags' },
    { value: 'bottle', label: 'Bottle', filter: '"bottle" in tags' },
    { value: 'tray', label: 'Tray', filter: '"tray" in tags' },
  ],
}
const sortOptions = [
  { name: 'Most Popular' },
  { name: 'Best Rating' },
  { name: 'Newest' },
  { name: 'Price: Low to High' },
  { name: 'Price: High to Low' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Home = () => {
  const router = useRouter()
  const [productList, setProductList] = useState<[] | null>(null)
  const [totalPage, setTotalPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(8)
  const [sortOption, setSortOption] = useState(sortOptions[0])
  const [search, setSearch] = useState('')
  const [filterList, setFilterList] = useState([])

  const handlePrevious = useCallback(() => {
    setOffset((prev) => Math.max(prev - limit, 0))
  }, [])

  const handleNext = useCallback(() => {
    setOffset((prev) =>
      prev + limit < totalPage * limit ? prev + limit : prev
    )
  }, [offset, totalPage])

  const handlePage = useCallback(
    (offsetInput: any) => {
      setOffset(Math.min(offsetInput * limit, totalPage * limit))
    },
    [totalPage]
  )

  const handleClear = useCallback(() => {
    setFilterList([])
  }, [])

  const handlePushProduct = useCallback((product: any) => {
    router.push(`/product/${product.slug}`)
  }, [])

  const findFilter = useCallback(
    (filterInput: any) => {
      const foundFilter = filterList.find(
        (filter: any) => filter.label === filterInput.label
      )
      return foundFilter
    },
    [filterList]
  )

  const handleFilter = useCallback(
    (option: any) => {
      const foundFilter = findFilter(option)
      if (foundFilter) {
        setFilterList((prev) =>
          prev.filter((f: any) => f.label !== option.label)
        )
      } else {
        setFilterList((prev) => prev.concat(option))
      }
    },
    [findFilter]
  )

  useEffect(() => {
    const fetchData = async () => {
      const otherFilters =
        filterList.length > 0
          ? '&& (' +
            filterList.map((f: any) => f.filter ?? '').join(' || ') +
            ')'
          : ''
      const selection = {
        _type: 'product1',
      }
      const filters = Object.entries(selection)
        .reduce((result, entry): any => {
          const [key, value] = entry
          return [...result, `${key} == "${value}"`]
        }, [])
        .join(' && ')
      const match = search.length > 0 ? `&& name match "*${search}*"` : ''
      const params = {
        start: offset,
        end: offset + (limit - 1),
      }
      const orders: any = {
        'Most Popular': {
          sortKey: 'reviewCount',
          sortDirection: 'desc',
        },
        'Best Rating': {
          sortKey: 'rating',
          sortDirection: 'desc',
        },
        Newest: {
          sortKey: '_createdAt',
          sortDirection: 'desc',
        },
        'Price: Low to High': {
          sortKey: 'price',
          sortDirection: 'asc',
        },
        'Price: High to Low': {
          sortKey: 'price',
          sortDirection: 'desc',
        },
      }
      const order = sortOption
        ? `| order(${orders[sortOption.name].sortKey} ${
            orders[sortOption.name].sortDirection
          })`
        : ''
      const productsResponse = await getClient().fetch(
        `
          { 
            "items": *[${filters} ${otherFilters} ${match}] ${order} [$start..$end],
            "total": count(*[${filters} ${otherFilters} ${match}])
          }
        `,
        params
      )
      const itemsResponse = _.get(productsResponse, ['items']) ?? []
      const totalResponse = _.get(productsResponse, ['total']) ?? 0
      const products = itemsResponse.map((product: any) => {
        return {
          ...product,
          id: _.get(product, ['_id']) ?? '',
          imageSrc: _.get(product, ['image'])
            ? urlFor(_.get(product, ['image'])).url()
            : '',
          imageAlt: _.get(product, ['image', '_key']) ?? '',
          href: '',
          name: _.get(product, ['name']) ?? 0,
          rating: _.get(product, ['rating']) ?? 0,
          reviewCount: _.get(product, ['reviewCount']) ?? 0,
          price: _.get(product, ['price']) ?? 0,
          slug: _.get(product, ['slug', 'current']) ?? '',
        }
      })
      setTotalPage(Math.ceil(totalResponse / limit))
      setProductList(products)
    }

    fetchData()
  }, [offset, limit, sortOption, search, filterList])

  const currentPage = useMemo(() => offset / limit + 1, [offset, limit])

  if (!productList) return null

  return (
    <main className="pb-24 w-screen pt-16">
      <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Workspace
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">
          The secret to a tidy desk? Don't get rid of anything, just put it in
          really really nice looking containers.
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative z-10 border-t border-b border-gray-200 grid items-center"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 py-4">
          <div className="max-w-7xl mx-auto flex space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
            <div>
              <Disclosure.Button className="group text-gray-700 font-medium flex items-center">
                <FilterIcon
                  className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {filterList.length} Filters
              </Disclosure.Button>
            </div>
            <div className="pl-6">
              <button className="text-gray-500" onClick={handleClear}>
                Clear all
              </button>
            </div>
          </div>
        </div>
        <Disclosure.Panel className="border-t border-gray-200 py-10">
          <div className="max-w-7xl mx-auto grid grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
            <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
              <fieldset>
                <legend className="block font-medium">Price</legend>
                <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                  {filters.price.map((option, optionIdx) => (
                    <div
                      key={option.value}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        id={`price-${optionIdx}`}
                        name="price[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        checked={!!findFilter(option)}
                        onChange={() => handleFilter(option)}
                      />
                      <label
                        htmlFor={`price-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-gray-600"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="block font-medium">Color</legend>
                <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                  {filters.color.map((option, optionIdx) => (
                    <div
                      key={option.value}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        id={`color-${optionIdx}`}
                        name="color[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        checked={!!findFilter(option)}
                        onChange={() => handleFilter(option)}
                      />
                      <label
                        htmlFor={`color-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-gray-600"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-2 md:gap-x-6">
              <fieldset>
                <legend className="block font-medium">Size</legend>
                <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                  {filters.size.map((option, optionIdx) => (
                    <div
                      key={option.value}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        id={`size-${optionIdx}`}
                        name="size[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        checked={!!findFilter(option)}
                        onChange={() => handleFilter(option)}
                      />
                      <label
                        htmlFor={`size-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-gray-600"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="block font-medium">Category</legend>
                <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                  {filters.category.map((option, optionIdx) => (
                    <div
                      key={option.value}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        id={`category-${optionIdx}`}
                        name="category[]"
                        defaultValue={option.value}
                        type="checkbox"
                        className="flex-shrink-0 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        checked={!!findFilter(option)}
                        onChange={() => handleFilter(option)}
                      />
                      <label
                        htmlFor={`category-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-gray-600"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </Disclosure.Panel>
        <div className="col-start-1 row-start-1 py-4">
          <div className="flex justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Menu as="div" className="relative inline-block">
              <div className="flex">
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            // href={option.href}
                            className={classNames(
                              sortOption?.name === option?.name
                                ? 'font-medium text-gray-900'
                                : 'text-gray-500',
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={() => setSortOption(option)}
                          >
                            {option.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </Disclosure>

      {/* Product grid */}
      <section
        aria-labelledby="products-heading"
        className="max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8"
      >
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="-mx-px border-l border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {productList.length > 0 &&
            productList.map((product: any) => (
              <div
                key={product.id}
                className="group relative p-4 border-r border-b border-gray-200 sm:p-6"
              >
                <div className="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="pt-10 pb-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    <a
                      // href={product.href}
                      onClick={() => handlePushProduct(product)}
                    >
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <div className="mt-3 flex flex-col items-center">
                    <p className="sr-only">{product.rating} out of 5 stars</p>
                    <div className="flex items-center">
                      {[...Array(5).keys()].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            product.rating > rating
                              ? 'text-yellow-400'
                              : 'text-gray-200',
                            'flex-shrink-0 h-5 w-5'
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.reviewCount} reviews
                    </p>
                  </div>
                  <p className="mt-4 text-base font-medium text-gray-900">
                    {numberWithCommas(product.price)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Pagination */}
      <nav
        aria-label="Pagination"
        className="max-w-7xl mx-auto px-4 mt-6 flex justify-between text-sm font-medium text-gray-700 sm:px-6 lg:px-8"
      >
        <div className="min-w-0 flex-1">
          <a
            // href="#"
            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
            onClick={handlePrevious}
          >
            Previous
          </a>
        </div>
        <div className="hidden space-x-2 sm:flex">
          {/* Current: "border-indigo-600 ring-1 ring-indigo-600", Default: "border-gray-300" */}
          {[...Array(totalPage).keys()].map((p, pi) => {
            if (currentPage - 1 === p) {
              return (
                <a
                  key={pi}
                  // href="#"
                  className="inline-flex items-center px-4 h-10 border border-indigo-600 ring-1 ring-indigo-600 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                  onClick={() => handlePage(p)}
                >
                  {p + 1}
                </a>
              )
            }
            return (
              <a
                key={pi}
                // href="#"
                className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
                onClick={() => handlePage(p)}
              >
                {p + 1}
              </a>
            )
          })}
        </div>
        <div className="min-w-0 flex-1 flex justify-end">
          <a
            // href="#"
            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
            onClick={handleNext}
          >
            Next
          </a>
        </div>
      </nav>
    </main>
  )
}

export default Home
