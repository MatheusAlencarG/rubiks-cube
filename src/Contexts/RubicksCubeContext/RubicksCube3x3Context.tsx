import React, { ReactNode, useState } from "react";

import { Context, INITIAL_STATE } from "./CreateRubicksCube3x3Context";

let LOADING = false;

function RubicksCube3x3Context({ children }: { children: ReactNode }) {
  const [ state, setState ] = useState(INITIAL_STATE)
  const { rubicksCube3x3: { cube } } = state

  function horizontalCubeMovement(movementType: 'left' | 'right') {
    cube.horizontalCubeMovement(movementType)
    
    setState({
      rubicksCube3x3: {
        ...state.rubicksCube3x3
      },
    })
  }

  function verticalCubeMovement(movementType: 'top' | 'bottom') {
    cube.verticalCubeMovement(movementType)

    setState({
      rubicksCube3x3: {
        ...state.rubicksCube3x3
      },
    })
  }

  function topPiecesMovement(movementType?: 'shift') {
    if (LOADING) return

    LOADING = true
    cube.topPiecesMovement(movementType)

    setState({
      rubicksCube3x3: {
        ...state.rubicksCube3x3
      },
    })

    setTimeout(() => {
      LOADING = false
      setState({
        rubicksCube3x3: {
          ...state.rubicksCube3x3
        }
      })
    }, 500);
  }

  function frontPiecesMovement(movementType?: 'shift') {
    if (LOADING) return

    LOADING = true
    cube.frontPiecesMovement(movementType)

    setState({
      rubicksCube3x3: {
        ...state.rubicksCube3x3
      },
    })

    setTimeout(() => {
      LOADING = false
      setState({
        rubicksCube3x3: {
          ...state.rubicksCube3x3
        }
      })
    }, 500);
  }

  function bottomPiecesMovement(movementType?: 'shift') {
    if (LOADING) return

    LOADING = true
    cube.bottomPiecesMovement(movementType)

    setState({
      rubicksCube3x3: {
        ...state.rubicksCube3x3
      },
    })

    setTimeout(() => {
      LOADING = false
      setState({
        rubicksCube3x3: {
          ...state.rubicksCube3x3
        }
      })
    }, 500);
  }

  function rightPiecesMovement(movementType?: 'shift') {
    if (LOADING) return

    LOADING = true
    cube.rightPiecesMovement(movementType)

    setState({
      rubicksCube3x3: {
        ...state.rubicksCube3x3
      },
    })

    setTimeout(() => {
      LOADING = false
      setState({
        rubicksCube3x3: {
          ...state.rubicksCube3x3
        }
      })
    }, 500);
  }

  function leftPiecesMovement(movementType?: 'shift') {
    if (LOADING) return

    LOADING = true
    cube.leftPiecesMovement(movementType)

    setState({
      rubicksCube3x3: {
        ...state.rubicksCube3x3
      },
    })

    setTimeout(() => {
      LOADING = false
      setState({
        rubicksCube3x3: {
          ...state.rubicksCube3x3
        }
      })
    }, 500);
  }

  function backPiecesMovement(movementType?: 'shift') {
    if (LOADING) return

    LOADING = true
    cube.backPiecesMovement(movementType)

    setState({
      rubicksCube3x3: {
        ...state.rubicksCube3x3
      },
    })

    setTimeout(() => {
      LOADING = false
      setState({
        rubicksCube3x3: {
          ...state.rubicksCube3x3
        }
      })
    }, 500);
  }

  return(
    <Context.Provider value={{
      rubicksCube3x3: {
        cube,
        functions: {
          horizontalCubeMovement,
          verticalCubeMovement,
          rightPiecesMovement,
          topPiecesMovement,
          bottomPiecesMovement,
          frontPiecesMovement,
          leftPiecesMovement,
          backPiecesMovement,
        },
      }
    }}>
      {children}
    </Context.Provider>
  )
}

export default RubicksCube3x3Context