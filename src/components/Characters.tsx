/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { useQuery } from '@tanstack/react-query'
import CharacterComponent from './CharacterComponent'

type Props = {}
interface Character {
  name: string
  height: string
  gender: string
  birth_year: string
}

const fetchCharacters = async () => {
  const res = await fetch('https://swapi.dev/api/people/')
  return res.json()
}

const Characters = (props: Props) => {
  const charactersQuery = useQuery({
    queryKey: ['characters'],
    queryFn: fetchCharacters
  })

  //console.log(charactersQuery.data);
  if (charactersQuery.status === 'pending') return <div className='loading'>Loading...</div>
  return (
    <>
      <h2>
        Characters
      </h2>
      {
        charactersQuery.data && charactersQuery.data.results.map((character: Character, index: number) => (
          <CharacterComponent key={index} character={character} />
        ))
      }
      {
        charactersQuery.status === 'error' && <div className='error'>Error fetching data</div>
      }
    </>
  )
}

export default Characters