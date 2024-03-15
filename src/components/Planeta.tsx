/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

interface Planet {
  name: string
  population: string
  terrain: string
}

type Props = {
  planet: Planet

}

const Planeta = (props: Props) => {
  return (
    <div className="card">
      <h3 className="name">{props.planet.name}</h3>
      <p className="subname">Population - {props.planet.population}</p>
      <p className="subname">Terrain - {props.planet.terrain}</p>
    </div>
  )
}

export default Planeta