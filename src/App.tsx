/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
//import { Audio } from 'react-loader-spinner'
import { useQuery, useMutation } from '@tanstack/react-query'


const getPosts = () => async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const data = await response.json()
  return data
}

const addPost = () => async (newPost: { userId: number; id: number; title: string; }) =>
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((res) => res.json())

function App() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts()
  })

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: addPost(),
  })

  //console.log(isLoading);
  if (error || isError) return <p>There was an error!</p>
  return (
    <>
      <h1>useQuery</h1>
      <div className='background'>
        {isPending && <p>Adding post...</p>}
        <button type="button" onClick={() => mutate({
          userId: 5000,
          id: 1000,
          title: 'New Post title',
        })
        }>Add Post
        </button>

        {
          data && !isLoading ? data.map((post: any, index: number) => (
            <h4 key={index}>{`${post.id} - ${post.title}`}</h4>
          )) : <p>...Loading</p>
        }

      </div>
    </>
  )
}

export default App
