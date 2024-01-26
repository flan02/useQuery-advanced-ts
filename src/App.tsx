/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useMemo, useRef, useState } from 'react'
import { useMemo, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { SortBy, type User } from './types.d'
import { Audio } from 'react-loader-spinner'
import { useQuery } from '@tanstack/react-query'

// ! Las funciones Fetch no tienen que actualizar el estado dentro, ni recibir param con variables de estado. Los estados manejarlos con el useEffect cuando se carga el componente
// TODO Solo debe devolver la informacion que necesitamos de la API
const fetchUsers = async (page: number) => {
  return await fetch(`https://randomuser.me/api?results=20&seed=midudev&page=${page}`)
    .then(async res => {
      //console.log(res.ok, res.status, res.statusText);
      if (!res.ok) throw new Error('Request Error!') // * Forma correcta con Fetch de ver si fallo la peticion asincrona. Axios lo gestiona con el catch
      return await res.json()
    })
    .then(res => res.results)
}


function App() {
  // TODO Las querys se cachean por defecto y se mantienen en un estado global
  // TODO Gracias al array de ID, puedo recuperar la info desde cualquier sitio. Si no lo pongo, la info solo se guarda en el componente
  // TODO Ademas de la ID, le tenemos que indicar como tiene que recuperar la informacion pasandole un METODO
  const { isLoading, isError, data: users = [], refetch } = useQuery<User[]>({ // lo tipamos como un array de User
    queryKey: ['users'], // la key de la informacion o de la query
    queryFn: async () => await fetchUsers(1) // como traer la info
  });

  {
    /*
    * Gracias a nuestro useQuery podemos desactivar estos 3 estados, internamente los maneja useQuery
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [users, setUsers] = useState<User[]>([])
  */}

  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)

  //const originalUsers = useRef<User[]>([])
  // useRef -> para guardar un valor
  // que queremos que se comparta entre renderizados
  // pero que al cambiar, no vuelva a renderizar el componente

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleReset = async () => {
    //setUsers(originalUsers.current)
    await refetch() // vuelve a pedir los datos a la API
  }

  const handleDelete = (email: string) => {
    console.log(email)
    // const filteredUsers = users.filter((user: User) => user.email !== email)
    // setUsers(filteredUsers)
  }


  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  // * Fetch convencional no declaramos funcion async-await asi que podemos correr todo el codigo en el useEffect
  /*
  ! Si usamos useQuery, no necesitamos este useEffect porque el fetch lo manejamos internamente.
  useEffect(() => { // TODO la primera vez que se ejecuta es al montarse el componente
    setLoading(true)
    setError(false)

    fetchUsers(currentPage)
      .then(users => {
        setUsers(prevUsers => {
          // setUsers(res.results) // ! Esto es una mala practica porque si el componente se vuelve a renderizar, se vuelve a ejecutar el useEffect y se vuelve a hacer la peticion pisando el estado anterior
          const newUsers = prevUsers.concat(users) // * Esta es la forma correcta de hacerlo para que la paginacion no pise el estado anterior
          originalUsers.current = newUsers // concatenamos los usuarios antiguos con los nuevos
          return newUsers
        })
      })
      .catch(err => { // ! Esta forma se usa para captar errores durante la promesa, no para manejarlos
        setError(err)
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage]) // TODO ejecutamos el useEffect cada vez que cambie la pagina
  */

  const filteredUsers = useMemo(() => {
    console.log('calculate filteredUsers')
    return filterCountry != null && filterCountry.length > 0
      ? users.filter((user) => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
      })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    console.log('calculate sortedUsers')

    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  // const filteredUsers = (() => {
  //   console.log('calculate filteredUsers')
  //   return filterCountry != null && filterCountry.length > 0
  //     ? users.filter(user => {
  //       return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
  //     })
  //     : users
  // })()

  // const sortedUsers = (() => {
  //   console.log('calculate sortedUsers')

  //   return sortByCountry
  //     ? filteredUsers.toSorted(
  //       (a, b) => a.location.country.localeCompare(b.location.country)
  //     )
  //     : filteredUsers
  // })()

  return (
    <div className="App">
      <h1>World Champions </h1>
      <header>
        <button onClick={toggleColors}>
          Colorear files
        </button>

        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
        </button>

        <button onClick={handleReset}>
          Resetear estado
        </button>

        <input placeholder='Filtra por país' onChange={(e) => {
          setFilterCountry(e.target.value)
        }} />

      </header>
      <main>
        {/* El componente UsersList no se desmonta nunca aunque cambie el estado */}
        {
          (users.length > 0)
            ? <UsersList changeSorting={handleChangeSort} deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
            : null
        }
        {isLoading ?
          <Audio
            height="100"
            width="100"
            color="green"
            ariaLabel="loading"
            wrapperStyle={{ backgroundColor: 'transparent' }}
            wrapperClass="loader"
          />
          : null
        }
        {isError ? <p>There was an error</p> : null}
        {(!isLoading && !isError && users.length === 0) ? <p>No Users Found.</p> : null}
        {
          (!isLoading && !isError && users.length > 0)
            ? <button type="button" onClick={() => setCurrentPage(currentPage + 1)}>Show more</button>
            : null
        }
      </main>
    </div>
  )
}

export default App
