/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */

type Props = {
  setPage: (page: string) => void
}

const Navbar = (props: Props) => {
  return (
    <nav>
      <button
        onClick={() => props.setPage('planets')}
        type="button">Planets</button>
      <button
        onClick={() => props.setPage('characters')}
        type="button">Characters</button>
    </nav>
  )
}

export default Navbar