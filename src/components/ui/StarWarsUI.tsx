/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import './App.css'
import { useState } from 'react'
import Navbar from '../Navbar'
import Planets from '../Planets'
import Characters from '../Characters'

type Props = {}

const StarWarsUI = (_props: Props) => {
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

export default StarWarsUI