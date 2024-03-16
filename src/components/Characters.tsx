/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { useQuery } from '@tanstack/react-query'
import CharacterComponent from './CharacterComponent'
import { Audio } from 'react-loader-spinner'
import Pagination from './Pagination'
import React from 'react'

type Props = {}
interface Character {
  name: string
  height: string
  gender: string
  birth_year: string
}


interface Query {
  queryKey: string[]
  signal?: AbortSignal
}

const fetchCharacters = async (obj: Query) => {
  const res = await fetch(`https://swapi.dev/api/people/?page=${obj.queryKey[1]}`)
  return res.json()
}


const Characters = (_props: Props) => {
  const [page, setPage] = React.useState(1)
  const [index, setIndex] = React.useState(0)
  const charactersQuery = useQuery({
    queryKey: ['characters', `${page}`],
    queryFn: fetchCharacters,
  })

  const next = charactersQuery.data?.next
  //console.log(charactersQuery.data)
  if (charactersQuery.status === 'pending') return <Audio color='#00BFFF' height={100} width={100} wrapperClass='loading' />
  return (
    <>
      <h2 className='subtitle'>
        Characters
      </h2>
      <div className='container'>
        {
          charactersQuery.data && charactersQuery.data.results.map((character: Character, ind: number) => (

            <CharacterComponent key={ind} character={character} index={index + ind + 1} />

          ))

        }
      </div>
      {
        charactersQuery.status === 'error' && <div className='error'>Error fetching data</div>
      }
      <Pagination setPage={setPage} page={page} next={next} index={index} setIndex={setIndex} />
    </>
  )
}

export default Characters