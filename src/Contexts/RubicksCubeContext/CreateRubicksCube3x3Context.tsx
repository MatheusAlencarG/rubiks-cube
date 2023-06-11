import { createContext } from "react";

import rubicksCube3x3 from "./RucksCube3x3/instantiateRubicksCube3x3";

export const INITIAL_STATE = {
  rubicksCube3x3: {
    cube: rubicksCube3x3,
    functions: {
      horizontalCubeMovement: (movementType: 'left' | 'right') => {},
      verticalCubeMovement:  (movementType: 'top' | 'bottom') => {},
      rightPiecesMovement:  (movementType?: 'shift') => {},
      topPiecesMovement:  (movementType?: 'shift') => {},
      bottomPiecesMovement:  (movementType?: 'shift') => {},
      frontPiecesMovement:  (movementType?: 'shift') => {},
      leftPiecesMovement:  (movementType?: 'shift') => {},
      backPiecesMovement:  (movementType?: 'shift') => {},
    },
  }
}

export const Context = createContext(INITIAL_STATE);