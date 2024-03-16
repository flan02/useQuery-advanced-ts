/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Audio } from 'react-loader-spinner'
import { useQuery } from '@tanstack/react-query'
import Planeta from './Planeta'
import React from 'react'
import Pagination from './Pagination'

type Props = {}
interface Planet {
  name: string
  population: string
  terrain: string
}

interface Query {
  queryKey: string[]
  signal?: AbortSignal
}

const fetchPlanets = async (obj: Query) => {
  //console.log(obj.queryKey);
  const res = await fetch(`https://swapi.dev/api/planets/?page=${obj.queryKey[1]}`)
  return res.json()
}

const Planets = (_props: Props) => {
  const [page, setPage] = React.useState(1)
  const [index, setIndex] = React.useState(0)
  const planetsQuery = useQuery({
    queryKey: ['planets', `${page}`],
    queryFn: fetchPlanets,
    staleTime: 0,
    gcTime: 5000, // * Garbage collection time

  })

  //console.log(planetsQuery.status);
  const next = planetsQuery.data?.next
  /*
  planetsQuery.data && planetsQuery.data.results.map((planet: Planet, index: number) => (
    console.log(planet)
  ))
*/
  if (planetsQuery.status === 'pending') return <Audio color='#00BFFF' height={100} width={100} wrapperClass='loading' />
  return (
    <>
      <h2>Planets</h2>
      {
        planetsQuery.data && planetsQuery.data.results.map((planet: Planet, index: number) => (
          <Planeta key={index} planet={planet} />
        ))
      }
      {
        planetsQuery.status === 'error' && <div className='error'>Error fetching data</div>
      }
      <Pagination setPage={setPage} page={page} next={next} index={index} setIndex={setIndex} />
    </>
  )
}

export default Planets