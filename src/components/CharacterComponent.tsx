/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */

type Props = {
  character: Character
}

interface Character {
  name: string
  height: string
  gender: string
  birth_year: string
}


const CharacterComponent = (props: Props) => {
  return (
    <div className="card">

      <h3 className="name">{props.character.name}</h3>
      <p className="subname">Height - {props.character.height}</p>
      <p className="subname">Gender - {props.character.gender}</p>
      <p className="subname">Birth year - {props.character.birth_year}</p>
    </div>
  )
}

export default CharacterComponent