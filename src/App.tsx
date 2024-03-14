/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
//import { Audio } from 'react-loader-spinner'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery, useQueries } from '@tanstack/react-query'


const getPosts = async ({ queryKey }: any) => { // (obj: any)
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const data = await response.json()
  console.log(queryKey); //* Si paso por param (obj) me devuelve el objeto entero, sino me devuelve el array.
  return data
}


const addPost = async (newPost: { userId: number; id: number; title: string; }) =>
  await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((res) => res.json())


function App() {
  const queryClient = useQueryClient()

  const postQuery = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    placeholderData: [{ // * Si no hay data, se muestra esto hasta que se resuelva la query. InitialData muestra un valor fijo de entrada para los usuarios.
      id: 0, title: "Praise the Sun!"
    }]
    //refetchInterval: 5000, //* Cada cuanto tiempo se refresca la data.
    //staleTime: 4000, //* Tiempo que se considera que los datos no están desactualizados.
    //gcTime: 10000, //* Tiempo que se mantiene la data en cache.
  })

  const id = postQuery.data?.map((post: any) => post.id)
  //const id = false  //* Si id es false, no se ejecuta la query. Las estamos vinculando.
  //console.log(id);

  // * Podemos desestructurar el objeto que devuelve useQuery. Si hay varias queries mejor guardar todo en una variable.
  const { data: d, error: err, isLoading: load } = useQuery({
    queryKey: ['players'],
    queryFn: getPosts,
    enabled: !!id, //* Si id es true, se ejecuta la query.
  })

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: addPost,
    onSuccess: (newPost, variables, context) => {
      //queryClient.invalidateQueries({ queryKey: ['posts'] }) //* invalida la cache y vuelve a pedir los datos al servidor.
      console.log(context);
      //console.log(variables);
      queryClient.setQueryData(['posts'], (oldPosts: any) => [...oldPosts, newPost]) //* actualiza la cache sin pedir los datos al servidor. OPTIMISTIC UPDATE
    },
    onMutate: (variables) => { //* Se ejecuta antes de la mutación. OPTIMISTIC UPDATE
      //console.log(variables);
      return { msg: "Definimos contexto" }
    },
    onError: (oldPosts) => {
      queryClient.setQueryData(['posts'], oldPosts) //* Si hay un error, volvemos a la data anterior.
    },/*
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }) //* invalida the cache and fetches the data from the server again.
    }*/
  })

  const userQuery = useQuery({
    queryKey: ['users', postQuery.data?.[0]?.userId],
    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/users/${postQuery.data?.[0]?.userId}`).then((res) => res.json()),
    enabled: !!id
  })


  // * Concepto avanzado un puñado de queries a la vez dentro de un array.
  const queries = useQueries({
    queries: (postQuery.data || []).map((post: any) => {
      return {
        queryKey: ['users', post.userId],
        queryFn: () => fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`).then((res) => res.json())
      }
    }
    ),
  })
  //console.log(queries);

  //console.log(userQuery.data);

  const onHoverPostOneLink = () => {
    queryClient.prefetchQuery({
      queryKey: ['posts', 1],
      queryFn: () => getPosts
    })
  }

  if (postQuery.status === "error" || isError === true) return <p>There was an error!</p>
  if (postQuery.status === "pending") return <p>Loading...</p>
  return (
    <>
      <h1>useQuery</h1>
      <div className='background'>
        <div className='addbutton'>
          <button
            onMouseEnter={onHoverPostOneLink}
            type="button">First Post</button>
          <button type="button"
            disabled={isPending}
            onClick={() => mutate({
              userId: 5000,
              id: 1000,
              title: 'New Post title using React Query',
            })
            }>Add Post
          </button>
          {isPending && <p className='msg-add'>Adding post...</p>}
        </div>

        {
          postQuery.data && postQuery.status == "success" ? postQuery.data.map((post: any, index: number) => (
            <h4 key={index}>{`${post.id} - ${post.title}`}</h4>
          )) : <p>...Loading</p>
        }
        {
          d && !load ? d.map((post: any, index: number) => (
            <h4 key={index}>{`Segunda query con distinto identificador: ${post.id} - ${post.title}`}</h4>
          )) : <p>...Loading</p>
        }
        {
          userQuery.data && !userQuery.isLoading ? <h4>{`User: ${userQuery.data.name}`}</h4> : <p>...Loading</p>
        }

      </div>
    </>
  )
}

export default App
