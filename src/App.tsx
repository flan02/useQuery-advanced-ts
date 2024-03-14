/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
//import { Audio } from 'react-loader-spinner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'


const getPosts = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const data = await response.json()
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

  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    //refetchInterval: 5000, //* Cada cuanto tiempo se refresca la data.
    //staleTime: 4000, //* Tiempo que se considera que los datos no están desactualizados.
    //gcTime: 10000, //* Tiempo que se mantiene la data en cache.
  })

  const id = data?.map((post: any) => post.id)
  //const id = false  //* Si id es false, no se ejecuta la query. Las estamos vinculando.
  console.log(id);



  const { data: d, error: err, isLoading: load } = useQuery({
    queryKey: ['players'],
    queryFn: getPosts,
    enabled: !!id, //* Si id es true, se ejecuta la query.
  })

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: addPost,
    onSuccess: (newPost) => {
      //queryClient.invalidateQueries({ queryKey: ['posts'] }) //* invalida la cache y vuelve a pedir los datos al servidor.
      queryClient.setQueryData(['posts'], (oldPosts: any) => [...oldPosts, newPost]) //* actualiza la cache sin pedir los datos al servidor. OPTIMISTIC UPDATE
    }
  })

  //console.log(isLoading);
  //console.log('Estado de isSuccess', isSuccess);
  if (error || isError) return <p>There was an error!</p>
  if (isLoading) return <p>Loading...</p>
  return (
    <>
      <h1>useQuery</h1>
      <div className='background'>
        {isPending && <p>Adding post...</p>}
        <button type="button" onClick={() => mutate({
          userId: 5000,
          id: 1000,
          title: 'New Post title using React Query',
        })
        }>Add Post
        </button>

        {
          data && !isLoading ? data.map((post: any, index: number) => (
            <h4 key={index}>{`${post.id} - ${post.title}`}</h4>
          )) : <p>...Loading</p>
        }
        {
          d && !load ? d.map((post: any, index: number) => (
            <h4 key={index}>{`Segunda query con distinto identificador: ${post.id} - ${post.title}`}</h4>
          )) : <p>...Loading</p>
        }

      </div>
    </>
  )
}

export default App
