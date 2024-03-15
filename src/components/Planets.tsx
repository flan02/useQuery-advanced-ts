/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Audio } from 'react-loader-spinner'
import { useQuery } from '@tanstack/react-query'
import Planeta from './Planeta'

type Props = {}
interface Planet {
  name: string
  population: string
  terrain: string
}
const fetchPlanets = async () => {
  const res = await fetch('https://swapi.dev/api/planets/')
  return res.json()
}

const Planets = (props: Props) => {
  const planetsQuery = useQuery({
    queryKey: ['planets'],
    queryFn: fetchPlanets,
    staleTime: 0,
    gcTime: 5000, // * Garbage collection time

  })

  //console.log(planetsQuery.status);
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
    </>
  )
}

export default Planets