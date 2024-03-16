/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */


type Props = {
  setPage: (page: number) => void
  page: number
  next: string | null
  index: number
  setIndex: (index: number) => void
}

const Pagination = (props: Props) => {

  return (
    <div className="pagination">
      <p>Showing page: {props.page}</p>
      <button
        disabled={props.page === 1}
        className={`${props.page === 1 ? 'disabled' : ''}`}
        onClick={() => {
          props.setIndex(props.index - 10)
          props.setPage(props.page - 1)
        }}
        type="button">prev</button>
      <button
        disabled={props.next == null}
        className={`${props.next == null ? 'disabled' : ''}`}
        onClick={() => {
          props.setIndex(props.index + 10)
          props.setPage(props.page + 1)
        }}
        type="button">next
      </button>

    </div>
  )
}

export default Pagination