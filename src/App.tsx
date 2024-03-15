/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
//import { Audio } from 'react-loader-spinner'
//import { useQuery, useMutation, useQueryClient, useInfiniteQuery, useQueries } from '@tanstack/react-query'
import Navbar from './components/Navbar'
import { useState } from 'react'
import Planets from './components/Planets'
import Characters from './components/Characters'


function App() {
  const [page, setPage] = useState('planets')
  return (
    <div className="App">
      <h1>Star Wars Info</h1>
      <Navbar setPage={setPage} />
      <div className="content">
        {
          page === 'planets' ? <Planets /> : <Characters />
        }
      </div>
    </div>
  )
}

export default App
