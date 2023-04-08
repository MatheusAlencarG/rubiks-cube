import { createContext } from "react";
import { Cube, FacePiece, Initial_State } from "../../types/index";

const facePiece: FacePiece = {
  width: 80,
  height: 80,
  lineHeight: 80,
  translate: {
    x: 0,
    y: 0,
    z: 40
  }
}

const cube: Cube = {
  cube: {
    width: 240,
    height: 240,
    rotate: {
      x: 0,
      y: 0,
      z: 0,
    },
    pieceRadius: 20,
    frontFace: {
      cornerPieces: [
        {
          transformOrigin: {
            x: 120,
            y: 120,
            z: 40,
          },
          colors: [
            "red",
            "yellow",
            "blue",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: 120,
            z: 40,
          },
          colors: [
            "red",
            "yellow",
            "green",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: -40,
            z: 40,
          },
          colors: [
            "red",
            "green",
            "white",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: -40,
            z: 40,
          },
          colors: [
            "red",
            "blue",
            "white",
          ]
        }
      ],
      middlePieces: [
        {
          transformOrigin: {
            x: 40,
            y: 120,
            z: 40,
          },
          colors: [
            "red",
            "yellow",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: 40,
            z: 40,
          },
          colors: [
            "red",
            "green",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: -40,
            z: 40,
          },
          colors: [
            "red",
            "white",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: 40,
            z: 40,
          },
          colors: [
            "red",
            "blue",
          ]
        }
      ],
      centerPieces: [
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: 40,
          },
          colors: [
            "red",
          ]
        }
      ],
      rotateAxle: "z",
      faceColor: {
        hexadecimal: "#ff0000",
        color: "red"
      },
      color: "red",
    },
    backFace: {
      cornerPieces: [
        {
          transformOrigin: {
            x: -40,
            y: 120,
            z: 40,
          },
          colors: [
            "orange",
            "green",
            "yellow",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: 120,
            z: 40,
          },
          colors: [
            "orange",
            "yellow",
            "blue",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: -40,
            z: 40,
          },
          colors: [
            "orange",
            "blue",
            "white",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: -40,
            z: 40,
          },
          colors: [
            "orange",
            "green",
            "white",
          ]
        }
      ],
      middlePieces: [
        {
          transformOrigin: {
            x: 40,
            y: 120,
            z: 40,
          },
          colors: [
            "orange",
            "yellow",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: 40,
            z: 40,
          },
          colors: [
            "orange",
            "blue",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: -40,
            z: 40,
          },
          colors: [
            "orange",
            "white",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: 40,
            z: 40,
          },
          colors: [
            "orange",
            "green",
          ]
        }
      ],
      centerPieces: [
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: 40,
          },
          colors: [
            "orange",
          ]
        }
      ],
      rotateAxle: "z",
      faceColor: {
        hexadecimal: "#ffa500",
        color: "orange"
      },
      color: "orange",
    },
    topFace: {
      cornerPieces: [
        {
          transformOrigin: {
            x: 120,
            y: 40,
            z: -80,
          },
          colors: [
            "yellow",
            "blue",
            "red",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: 40,
            z: -80,
          },
          colors: [
            "yellow",
            "green",
            "red",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: 40,
            z: 80,
          },
          colors: [
            "yellow",
            "green",
            "orange",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: 40,
            z: 80,
          },
          colors: [
            "yellow",
            "orange",
            "blue",
          ]
        }
      ],
      middlePieces: [
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: -80,
          },
          colors: [
            "yellow",
            "red",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: 40,
            z: 0,
          },
          colors: [
            "yellow",
            "green",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: 80,
          },
          colors: [
            "yellow",
            "orange",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: 0,
            z: 0,
          },
          colors: [
            "yellow",
            "blue",
          ]
        }
      ],
      centerPieces: [
        {
          transformOrigin: {
            x: 40,
            y: 0,
            z: 0,
          },
          colors: [
            "yellow",
          ]
        }
      ],
      rotateAxle: "y",
      faceColor: {
        hexadecimal: "#ffff00",
        color: "yellow",
      },
      color: "yellow",
    },
    bottomFace: {
      cornerPieces: [
        {
          transformOrigin: {
            x: -40,
            y: 40,
            z: -80,
          },
          colors: [
            "white",
            "green",
            "red",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: 40,
            z: -80,
          },
          colors: [
            "white",
            "blue",
            "red",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: 40,
            z: 80,
          },
          colors: [
            "white",
            "blue",
            "orange",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: 40,
            z: 80,
          },
          colors: [
            "white",
            "orange",
            "green",
          ]
        }
      ],
      middlePieces: [
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: -80,
          },
          colors: [
            "white",
            "red",
          ]
        },
        {
          transformOrigin: {
            x: 120,
            y: 40,
            z: 0,
          },
          colors: [
            "white",
            "blue",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: 80,
          },
          colors: [
            "white",
            "orange",
          ]
        },
        {
          transformOrigin: {
            x: -40,
            y: 40,
            z: 0,
          },
          colors: [
            "white",
            "green",
          ]
        }
      ],
      centerPieces: [
        {
          transformOrigin: {
            x: 40,
            y: 0,
            z: 0,
          },
          colors: [
            "white",
          ]
        }
      ],
      rotateAxle: "y",
      faceColor: {
        hexadecimal: "#ffffff",
        color: "white",
      },
      color: "white",
    },
    rightFace: {
      cornerPieces: [
        {
          transformOrigin: {
            x: 40,
            y: 120,
            z: -80,
          },
          colors: [
            "green",
            "yellow",
            "red",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: 120,
            z: 80,
          },
          colors: [
            "green",
            "yellow",
            "orange",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: -40,
            z: -80,
          },
          colors: [
            "green",
            "red",
            "white",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: -40,
            z: 80,
          },
          colors: [
            "green",
            "orange",
            "white",
          ]
        }
      ],
      middlePieces: [
        {
          transformOrigin: {
            x: 40,
            y: 120,
            z: 0,
          },
          colors: [
            "green",
            "yellow",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: 80,
          },
          colors: [
            "green",
            "orange",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: -40,
            z: 0,
          },
          colors: [
            "green",
            "white",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: -80,
          },
          colors: [
            "green",
            "red",
          ]
        }
      ],
      centerPieces: [
        {
          transformOrigin: {
            x: 0,
            y: 40,
            z: 0,
          },
          colors: [
            "green",
          ]
        }
      ],
      rotateAxle: "x",
      faceColor: {
        hexadecimal: "#008000",
        color: "green",
      },
      color: "green",
    },
    leftFace: {
      cornerPieces: [
        {
          transformOrigin: {
            x: 40,
            y: 120,
            z: 80,
          },
          colors: [
            "blue",
            "orange",
            "yellow",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: 120,
            z: -80,
          },
          colors: [
            "blue",
            "yellow",
            "red",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: -40,
            z: -80,
          },
          colors: [
            "blue",
            "red",
            "white",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: -40,
            z: 80,
          },
          colors: [
            "blue",
            "orange",
            "white",
          ]
        }
      ],
      middlePieces: [
        {
          transformOrigin: {
            x: 40,
            y: 120,
            z: 0,
          },
          colors: [
            "blue",
            "yellow",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: -80,
          },
          colors: [
            "blue",
            "red",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: -40,
            z: 0,
          },
          colors: [
            "blue",
            "white",
          ]
        },
        {
          transformOrigin: {
            x: 40,
            y: 40,
            z: 80,
          },
          colors: [
            "blue",
            "orange",
          ]
        }
      ],
      centerPieces: [
        {
          transformOrigin: {
            x: 0,
            y: 40,
            z: 0,
          },
          colors: [
            "blue",
          ]
        }
      ],
      rotateAxle: "x",
      faceColor: {
        hexadecimal: "#0000ff",
        color: "blue",
      },
      color: "blue",
    },
    pieces: [
      {
        id: 1,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 160,
          y: 0,
          z: 0
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'corner',
          colors: [
            "yellow",
            "green", 
            "red",
          ],
          faces: [
            "yellow",
            "green", 
            "red",
          ],
        },
      },
      {
        id: 2,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 80,
          y: 0,
          z: 0
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'middle',
          colors: [
            "yellow",
            "red",
          ],
          faces: [
            "yellow",
            "red",
          ],
        }
      },
      {
        id: 3,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 0,
          y: 0,
          z: 0
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'corner',
          colors: [
            "yellow",
            "blue",
            "red",
          ],
          faces: [
            "yellow",
            "blue",
            "red",
          ],
        }
      },
      {
        id: 4,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 160,
          y: 0,
          z: -80
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'middle',
          colors: [
            "green", 
            "yellow",
          ],
          faces: [
            "green", 
            "yellow",
          ],
        }
      },
      {
        id: 5,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 80,
          y: 0,
          z: -80
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'center',
          colors: [
            "yellow",
          ],
          faces: [
            "yellow",
          ],
        },
      },
      {
        id: 6,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 0,
          y: 0,
          z: -80
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'middle',
          colors: [
            "yellow",
            "blue",
          ],
          faces: [
            "yellow",
            "blue",
          ],
        }
      },
      {
        id: 7,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 160,
          y: 0,
          z: -160
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'corner',
          colors: [
            "yellow",
            "green", 
            "orange",
          ],
          faces: [
            "yellow",
            "green", 
            "orange",
          ],
        }
      },
      {
        id: 8,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 80,
          y: 0,
          z: -160
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'middle',
          colors: [
            "yellow",
            "orange",
          ],
          faces: [
            "yellow",
            "orange",
          ],
        }
      },
      {
        id: 9,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 0,
          y: 0,
          z: -160
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'corner',
          colors: [
            "yellow",
            "blue",
            "orange",
          ],
          faces: [
            "yellow",
            "blue",
            "orange",
          ],
        }
      },

      // Layer divisor

      {
        id: 10,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 160,
          y: 80,
          z: 0
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'middle',
          colors: [
            "red",
            "green", 
          ],
          faces: [
            "red",
            "green", 
          ],
        }
      },
      {
        id: 11,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 80,
          y: 80,
          z: 0
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'center',
          colors: [
            "red",
          ],
          faces: [
            "red",
          ],
        }
      },
      {
        id: 12,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 0,
          y: 80,
          z: 0
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'middle',
          colors: [
            "red",
            "blue",
          ],
          faces: [
            "red",
            "blue",
          ],
        }
      },
      {
        id: 13,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 160,
          y: 80,
          z: -80
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'center',
          colors: [
            "green", 
          ],
          faces: [
            "green", 
          ],
        }
      },
      {
        id: 14,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 0,
          y: 80,
          z: -80
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'center',
          colors: [
            "blue",
          ],
          faces: [
            "blue",
          ],
        }
      },
      {
        id: 15,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 160,
          y: 80,
          z: -160
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'middle',
          colors: [
            "green", 
            "orange",
          ],
          faces: [
            "green", 
            "orange",
          ],
        }
      },
      {
        id: 16,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 80,
          y: 80,
          z: -160
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'center',
          colors: [
            "orange",
          ],
          faces: [
            "orange",
          ],
        }
      },
      {
        id: 17,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 0,
          y: 80,
          z: -160
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'middle',
          colors: [
            "orange",
            "blue",
          ],
          faces: [
            "orange",
            "blue",
          ],
        }
      },

      
      // Layer divisor

      {
        id: 18,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 160,
          y: 160,
          z: 0
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'corner',
          colors: [
            "red",
            "white",
            "green", 
          ],
          faces: [
            "red",
            "white",
            "green", 
          ],
        }
      },
      {
        id: 19,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 80,
          y: 160,
          z: 0
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'middle',
          colors: [
            "red",
            "white",
          ],
          faces: [
            "red",
            "white",
          ],
        }
      },
      {
        id: 20,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 0,
          y: 160,
          z: 0
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'corner',
          colors: [
            "red",
            "white",
            "blue",
          ],
          faces: [
            "red",
            "white",
            "blue",
          ],
        }
      },
      {
        id: 21,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 160,
          y: 160,
          z: -80
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'middle',
          colors: [
            "green", 
            "white",
          ],
          faces: [
            "green", 
            "white",
          ],
        }
      },
      {
        id: 22,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 80,
          y: 160,
          z: -80
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'center',
          colors: [
            "white",
          ],
          faces: [
            "white",
          ],
        }
      },
      {
        id: 23,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 0,
          y: 160,
          z: -80
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'middle',
          colors: [
            "blue",
            "white",
          ],
          faces: [
            "blue",
            "white",
          ],
        }
      },
      {
        id: 24,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 160,
          y: 160,
          z: -160
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'corner',
          colors: [
            "orange",
            "white",
            "green", 
          ],
          faces: [
            "orange",
            "white",
            "green", 
          ],
        }
      },
      {
        id: 25,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 80,
          y: 160,
          z: -160
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'middle',
          colors: [
            "orange",
            "white",
          ],
          faces: [
            "orange",
            "white",
          ],
        }
      },
      {
        id: 26,
        width: 80,
        height: 80,
        transformOrigin: {
          x: 0,
          y: 0,
          z: 0
        },
        translate: {
          x: 0,
          y: 160,
          z: -160
        },
        faceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        pieceRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'corner',
          colors: [
            "blue",
            "white",
            "orange",
          ],
          faces: [
            "blue",
            "white",
            "orange",
          ],
        }
      },
    ],
  }
}

export const INITIAL_STATE: Initial_State = {
  rubicksCubeState: cube,
  horizontalCubeMovement: (movementType: string) => {},
  verticalCubeMovement: (movementType: string) => {},
  rightPiecesMovement: (movementType: string) => {},
  leftPiecesMovement: (movementType: string) => {},
  topPiecesMovement: (movementType: string) => {},
  bottomPiecesMovement: (movementType: string) => {},
  frontPiecesMovement: (movementType: string) => {},
  backPiecesMovement: (movementType: string) => {},
}

export const Context = createContext(INITIAL_STATE);