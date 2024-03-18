/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Audio } from 'react-loader-spinner'
import Planeta from './Planeta'
import { useInfiniteQuery, useIsFetching, keepPreviousData } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

type Props = {}
interface Planet {
  name: string
  population: string
  terrain: string
}

interface Query {
  queryKey: string[]
  signal?: AbortSignal
  pageParam?: number
}

const Planets = (_props: Props) => {
  const infiniteQuery = useInfiniteQuery({
    queryKey: ['planets'],
    queryFn: fetchPlanets,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      //console.log(lastPage.next.slice(-1));
      return lastPage.next.slice(-1)
    },
    getPreviousPageParam: (firstPage) => {
      //console.log(parseInt(firstPage.next.slice(-1)) - 1);
      if (firstPage <= 1) return undefined
      return parseInt(firstPage.next.slice(-1)) - 1
    }
  });

  async function fetchPlanets(obj: Query) {
    const res = await fetch(`https://swapi.dev/api/planets/?page=${obj.pageParam}`)
    //console.log(res);
    return res.json()
  }

  const isFetching = useIsFetching() // * returns the number of queries that are currently fetching
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      console.log(infiniteQuery.fetchNextPage());
      infiniteQuery.fetchNextPage()
    }
  }, [infiniteQuery.fetchNextPage, inView])



  if (infiniteQuery.status === 'pending') return <Audio color='#00BFFF' height={100} width={100} wrapperClass='loading' />
  console.log(infiniteQuery.hasNextPage);
  return (
    <div>
      <h2 className='subtitle'>Planets</h2>
      {/* isFetching */}
      {
        infiniteQuery.data?.pages.map((group, i) => (
          <div key={i}>
            {
              group.results.map((planet: Planet) => (
                <Planeta key={planet.name} planet={planet} />
              ))
            }
          </div>
        ))
      }
      <div ref={ref}>
        {
          infiniteQuery.isFetchingNextPage
            ? <p className='loading'>Loading more...</p>
            : infiniteQuery.hasNextPage ? null : <p className='loading'>No more planets to fetch</p>
        }



      </div>
      {
        infiniteQuery.status === 'error' && <div className='error'>Error fetching data</div>
      }
    </div>
  )
}

export default Planets