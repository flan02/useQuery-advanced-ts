/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Audio } from 'react-loader-spinner'
import Planeta from './Planeta'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import React, { useEffect } from 'react'

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

const fetchPlanets = async (obj: Query) => {
  const res = await fetch(`https://swapi.dev/api/planets/`)
  return res.json()
}

const Planets = (_props: Props) => {

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['planets'],
    queryFn: fetchPlanets,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      console.log(lastPage.next);
      return lastPage.next
    }
  });

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {

      //console.log(infiniteQuery.fetchNextPage());
      infiniteQuery.fetchNextPage()
    }
  }, [infiniteQuery.fetchNextPage, inView])



  if (infiniteQuery.status === 'pending') return <Audio color='#00BFFF' height={100} width={100} wrapperClass='loading' />
  return (
    <div>
      <h2 className='subtitle'>Planets</h2>
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
          infiniteQuery.isFetchingNextPage ? <p className='loading'>Loading more...</p> : null
        }
      </div>
      {
        infiniteQuery.status === 'error' && <div className='error'>Error fetching data</div>
      }
    </div>
  )
}

export default Planets