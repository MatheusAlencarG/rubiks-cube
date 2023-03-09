import React, { useState } from "react";

import { Context, INITIAL_STATE } from "./Context";
import { RubicksCubeContextProps } from "./RubicksCubeContextTypes";

import { ThreeDType } from "./RubicksCubeContextTypes"; 

function RubicksCubeContext({ children }: RubicksCubeContextProps) {
  const [ rubicksCubeState, setRubicksCubeState ] = useState(INITIAL_STATE.rubicksCubeState);

  function horizontalMovement(movementType: string) {
    const accountValue = 
      movementType === "left" ? 
      rubicksCubeState.cube.rotate.y - 90 : 
      rubicksCubeState.cube.rotate.y + 90
    ;

    const newRotate = {
      x: rubicksCubeState.cube.rotate.x,
      y: accountValue,
      z: rubicksCubeState.cube.rotate.z
    }

    setNewRotateCube(newRotate);
  }

  function verticalMovement(movementType: string) {
    const accountValue = 
      movementType === "top" ? 
      rubicksCubeState.cube.rotate.z - 90 : 
      rubicksCubeState.cube.rotate.z + 90
    ;

    const newRotate = {
      x: rubicksCubeState.cube.rotate.x,
      y: rubicksCubeState.cube.rotate.y,
      z: accountValue
    }

    setNewRotateCube(newRotate);
  }

  function setNewRotateCube(newRotate: ThreeDType) {
    setRubicksCubeState({
      ...rubicksCubeState,
      cube: {
        ...rubicksCubeState.cube,
        rotate: newRotate
      }
    })
  }

  return(
    <Context.Provider value={{
      rubicksCubeState,
      horizontalMovement,
      verticalMovement
    }}>
      {children}
    </Context.Provider>
  )
}

export default RubicksCubeContext;