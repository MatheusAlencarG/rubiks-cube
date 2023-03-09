import { createContext } from "react";

const facePiece = {
  width: 80,
  height: 80,
  lineHeight: 80,
  translate: {
    x: 0,
    y: 0,
    z: 40
  }
}

const cube = {
  cube: {
    width: 240,
    height: 240,
    rotate: {
      x: 0,
      y: 0,
      z: 0,
    },
    pieceRadius: 20,
    firstFace: "#ffff00",
    secondFace: "#ffffff",
    thirdFace: "#ff0000",
    fourthFace: "#ffa500",
    fivethFace: "#0000ff",
    sixthFace: "#008000",
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'corner',
          colors: {
            firstColor: {
              color: "yellow",
              face: "yellow"
            },
            secondColor: {
              color: "green",
              face: "green"
            },
            thirdColor: {
              color: "red",
              face: "red"
            }
          }
        }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'middle',
          colors: {
            firstColor: {
              color: "yellow",
              face: "yellow"
            },
            secondColor: {
              color: "red",
              face: "red"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'corner',
          colors: {
            firstColor: {
              color: "yellow",
              face: "yellow"
            },
            secondColor: {
              color: "blue",
              face: "blue"
            },
            thirdColor: {
              color: "red",
              face: "red"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'middle',
          colors: {
            firstColor: {
              color: "green",
              face: "green"
            },
            secondColor: {
              color: "yellow",
              face: "yellow"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'center',
          colors: {
            firstColor: {
              color: "yellow",
              face: "yellow"
            }
          }
        }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'middle',
          colors: {
            firstColor: {
              color: "yellow",
              face: "yellow"
            },
            secondColor: {
              color: "blue",
              face: "blue"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'corner',
          colors: {
            firstColor: {
              color: "yellow",
              face: "yellow"
            },
            secondColor: {
              color: "green",
              face: "green"
            },
            thirdColor: {
              color: "orange",
              face: "orange"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'middle',
          colors: {
            firstColor: {
              color: "yellow",
              face: "yellow"
            },
            secondColor: {
              color: "orange",
              face: "orange"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'third',
          type: 'corner',
          colors: {
            firstColor: {
              color: "yellow",
              face: "yellow"
            },
            secondColor: {
              color: "blue",
              face: "blue"
            },
            thirdColor: {
              color: "orange",
              face: "orange"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'middle',
          colors: {
            firstColor: {
              color: "red",
              face: "red"
            },
            secondColor: {
              color: "green",
              face: "green"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'center',
          colors: {
            firstColor: {
              color: "red",
              face: "red"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'middle',
          colors: {
            firstColor: {
              color: "red",
              face: "red"
            },
            secondColor: {
              color: "blue",
              face: "blue"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'center',
          colors: {
            firstColor: {
              color: "green",
              face: "green"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'center',
          colors: {
            firstColor: {
              color: "blue",
              face: "blue"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'middle',
          colors: {
            firstColor: {
              color: "green",
              face: "green"
            },
            secondColor: {
              color: "orange",
              face: "orange"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'center',
          colors: {
            firstColor: {
              color: "orange",
              face: "orange"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'second',
          type: 'middle',
          colors: {
            firstColor: {
              color: "orange",
              face: "orange"
            },
            secondColor: {
              color: "blue",
              face: "blue"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'corner',
          colors: {
            firstColor: {
              color: "red",
              face: "red"
            },
            secondColor: {
              color: "white",
              face: "white"
            },
            thirdColor: {
              color: "green",
              face: "green"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'middle',
          colors: {
            firstColor: {
              color: "red",
              face: "red"
            },
            secondColor: {
              color: "white",
              face: "white"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'corner',
          colors: {
            firstColor: {
              color: "red",
              face: "red"
            },
            secondColor: {
              color: "white",
              face: "white"
            },
            thirdColor: {
              color: "blue",
              face: "blue"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'middle',
          colors: {
            firstColor: {
              color: "green",
              face: "green"
            },
            secondColor: {
              color: "white",
              face: "white"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'center',
          colors: {
            firstColor: {
              color: "white",
              face: "white"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'middle',
          colors: {
            firstColor: {
              color: "blue",
              face: "blue"
            },
            secondColor: {
              color: "white",
              face: "white"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'corner',
          colors: {
            firstColor: {
              color: "orange",
              face: "orange"
            },
            secondColor: {
              color: "white",
              face: "white"
            },
            thirdColor: {
              color: "green",
              face: "green"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'middle',
          colors: {
            firstColor: {
              color: "orange",
              face: "orange"
            },
            secondColor: {
              color: "white",
              face: "white"
            }
          }
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
        rotate: {
          x: 0,
          y: 0,
          z: 0
        },
        faces: facePiece,
        data: {
          layer: 'first',
          type: 'corner',
          colors: {
            firstColor: {
              color: "blue",
              face: "blue"
            },
            secondColor: {
              color: "white",
              face: "white"
            },
            thirdColor: {
              color: "orange",
              face: "orange"
            }
          }
        }
      },
    ],
  }
}

export const INITIAL_STATE = {
  rubicksCubeState: cube,
  horizontalMovement: (movementType: string) => {},
  verticalMovement: (movementType: string) => {},
}

export const Context = createContext(INITIAL_STATE);