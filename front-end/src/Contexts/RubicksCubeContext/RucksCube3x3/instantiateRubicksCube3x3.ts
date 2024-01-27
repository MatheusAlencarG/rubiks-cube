import { Piece } from '../RucksCube3x3/Piece';
import { RubicksCube3x3 } from '../RucksCube3x3/RubicksCube3x3';

const pieces = [];

pieces.push(new Piece({
  id: 1,
  styles: {
    width: 80,
    height: 80,
    translateX: 160,
    translateY: 0,
    translateZ: 80,
  },
  data: {
    layer: 'third',
    type: 'corner',
    colors: ['yellow', 'green', 'red'],
    faces: ['yellow', 'green', 'red'],
  },
  linkedTransformOrigins: {
    frontX: -40,
    frontY: 120,
    frontZ: 40,
    rightX: 40,
    rightY: 120,
    rightZ: -80,
    topX: -40,
    topY: 40,
    topZ: -80,
  }
}))

pieces.push(new Piece({
  id: 2,
  styles: {
    width: 80,
    height: 80,
    translateX: 80,
    translateY: 0,
    translateZ: 80,
  },
  data: {
    layer: 'third',
    type: 'middle',
    colors: ['yellow', 'red'],
    faces: ['yellow', 'red'],
  },
    linkedTransformOrigins: {
    frontX: 40,
    frontY: 120,
    frontZ: 40,
    topX: 40,
    topY: 40,
    topZ: -80,
  }
}))

pieces.push(new Piece({
  id: 3,
  styles: {
    width: 80,
    height: 80,
    translateX: 0,
    translateY: 0,
    translateZ: 80,
  },
  data: {
    layer: 'third',
    type: 'corner',
    colors: ['yellow', 'blue', 'red'],
    faces: ['yellow', 'blue', 'red'],
  },
    linkedTransformOrigins: {
    frontX: 120,
    frontY: 120,
    frontZ: 40,
    leftX: 40,
    leftY: 120,
    leftZ: -80,
    topX: 120,
    topY: 40,
    topZ: -80,
  }
}))

pieces.push(new Piece({
  id: 4,
  styles: {
    width: 80,
    height: 80,
    translateX: 160,
    translateY: 0,
    translateZ: 0,
  },
  data: {
    layer: 'third',
    type: 'middle',
    colors: ['green', 'yellow'],
    faces: ['green', 'yellow'],
  },
    linkedTransformOrigins: {
    rightX: 40,
    rightY: 120,
    rightZ: 0,
    topX: -40,
    topY: 40,
    topZ: 0,
  }
}))

pieces.push(new Piece({
  id: 5,
  styles: {
    width: 80,
    height: 80,
    translateX: 80,
    translateY: 0,
    translateZ: 0,
  },
  data: {
    layer: 'third',
    type: 'center',
    colors: ['yellow'],
    faces: ['yellow'],
  },
    linkedTransformOrigins: {
    topX: 40,
    topY: 40,
    topZ: 0,
  }
}))

pieces.push(new Piece({
  id: 6,
  styles: {
    width: 80,
    height: 80,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
  },
  data: {
    layer: 'third',
    type: 'middle',
    colors: ['yellow', 'blue'],
    faces: ['yellow', 'blue'],
  },
    linkedTransformOrigins: {
    leftX: 40,
    leftY: 120,
    leftZ: 0,
    topX: 120,
    topY: 0,
    topZ: 0,
  }
}))

pieces.push(new Piece({
  id: 7,
  styles: {
    width: 80,
    height: 80,
    translateX: 160,
    translateY: 0,
    translateZ: -80,
  },
  data: {
    layer: 'third',
    type: 'corner',
    colors: ['yellow','green', 'orange'],
    faces: ['yellow','green', 'orange'],
  },
    linkedTransformOrigins: {
    backX: -40,
    backY: 120,
    backZ: 40,
    rightX: 40,
    rightY: 120,
    rightZ: 80,
    topX: -40,
    topY: 40,
    topZ: 80,
  }
}))

pieces.push(new Piece({
  id: 8,
  styles: {
    width: 80,
    height: 80,
    translateX: 80,
    translateY: 0,
    translateZ: -80,
  },
  data: {
    layer: 'third',
    type: 'middle',
    colors: ['yellow', 'orange'],
    faces: ['yellow', 'orange'],
  },
    linkedTransformOrigins: {
    backX: 40,
    backY: 120,
    backZ: 40,
    topX: 40,
    topY: 40,
    topZ: 80,
  }
}))

pieces.push(new Piece({
  id: 9,
  styles: {
    width: 80,
    height: 80,
    translateX: 0,
    translateY: 0,
    translateZ: -80,
  },
  data: {
    layer: 'third',
    type: 'corner',
    colors: ['yellow', 'blue', 'orange'],
    faces: ['yellow', 'blue', 'orange'],
  },
    linkedTransformOrigins: {
    backX: 120,
    backY: 120,
    backZ: 40,
    leftX: 40,
    leftY: 120,
    leftZ: 80,
    topX: 120,
    topY: 40,
    topZ: 80,
  }
}))

pieces.push(new Piece({
  id: 10,
  styles: {
    width: 80,
    height: 80,
    translateX: 160,
    translateY: 80,
    translateZ: 80,
  },
  data: {
    layer: 'second',
    type: 'middle',
    colors: ['red', 'green'],
    faces: ['red', 'green'],
  },
    linkedTransformOrigins: {
    frontX: -40,
    frontY: 40,
    frontZ: 40,
    rightX: 40,
    rightY: 40,
    rightZ: -80,
  }
}))

pieces.push(new Piece({
  id: 11,
  styles: {
    width: 80,
    height: 80,
    translateX: 80,
    translateY: 80,
    translateZ: 80,
  },
  data: {
    layer: 'second',
    type: 'center',
    colors: ['red'],
    faces: ['red'],
  },
    linkedTransformOrigins: {
    frontX: 40,
    frontY: 40,
    frontZ: 0,
  }
}))

pieces.push(new Piece({
  id: 12,
  styles: {
    width: 80,
    height: 80,
    translateX: 0,
    translateY: 80,
    translateZ: 80,
  },
  data: {
    layer: 'second',
    type: 'middle',
    colors: ['red', 'blue'],
    faces: ['red', 'blue'],
  },
    linkedTransformOrigins: {
    frontX: 120,
    frontY: 40,
    frontZ: 40,
    leftX: 40,
    leftY: 40,
    leftZ: -80,
  }
}))

pieces.push(new Piece({
  id: 13,
  styles: {
    width: 80,
    height: 80,
    translateX: 160,
    translateY: 80,
    translateZ: 0,
  },
  data: {
    layer: 'second',
    type: 'center',
    colors: ['green'],
    faces: ['green'],
  },
    linkedTransformOrigins: {
    rightX: 40,
    rightY: 40,
    rightZ: 0,
  }
}))

pieces.push(new Piece({
  id: 14,
  styles: {
    width: 80,
    height: 80,
    translateX: 0,
    translateY: 80,
    translateZ: 0,
  },
  data: {
    layer: 'second',
    type: 'center',
    colors: ['blue'],
    faces: ['blue'],
  },
    linkedTransformOrigins: {
    leftX: 40,
    leftY: 40,
    leftZ: 0,
  }
}))

pieces.push(new Piece({
  id: 15,
  styles: {
    width: 80,
    height: 80,
    translateX: 160,
    translateY: 80,
    translateZ: -80,
  },
  data: {
    layer: 'second',
    type: 'middle',
    colors: ['green', 'orange'],
    faces: ['green', 'orange'],
  },
    linkedTransformOrigins: {
    backX: -40,
    backY: 40,
    backZ: 40,
    rightX: 40,
    rightY: 40,
    rightZ: 80,
  }
}))

pieces.push(new Piece({
  id: 16,
  styles: {
    width: 80,
    height: 80,
    translateX: 80,
    translateY: 80,
    translateZ: -80,
  },
  data: {
    layer: 'second',
    type: 'center',
    colors: ['orange'],
    faces: ['orange'],
  },
    linkedTransformOrigins: {
    backX: 40,
    backY: 40,
    backZ: 0,
  }
}))

pieces.push(new Piece({
  id: 17,
  styles: {
    width: 80,
    height: 80,
    translateX: 0,
    translateY: 80,
    translateZ: -80,
  },
  data: {
    layer: 'second',
    type: 'middle',
    colors: ['orange', 'blue'],
    faces: ['orange', 'blue'],
  },
    linkedTransformOrigins: {
    backX: 120,
    backY: 40,
    backZ: 40,
    leftX: 40,
    leftY: 40,
    leftZ: 80,
  }
}))

pieces.push(new Piece({
  id: 18,
  styles: {
    width: 80,
    height: 80,
    translateX: 160,
    translateY: 160,
    translateZ: 80,
  },
  data: {
    layer: 'first',
    type: 'corner',
    colors: ['red','white', 'green'],
    faces: ['red','white', 'green'],
  },
    linkedTransformOrigins: {
    frontX: -40,
    frontY: -40,
    frontZ: 40,
    rightX: 40,
    rightY: -40,
    rightZ: -80,
    bottomX: -40,
    bottomY: 40,
    bottomZ: -80,
  }
}))

pieces.push(new Piece({
  id: 19,
  styles: {
    width: 80,
    height: 80,
    translateX: 80,
    translateY: 160,
    translateZ: 80,
  },
  data: {
    layer: 'first',
    type: 'middle',
    colors: ['red', 'white'],
    faces: ['red', 'white'],
  },
    linkedTransformOrigins: {
    frontX: 40,
    frontY: -40,
    frontZ: 40,
    bottomX: 40,
    bottomY: 40,
    bottomZ: -80,
  }
}))

pieces.push(new Piece({
  id: 20,
  styles: {
    width: 80,
    height: 80,
    translateX: 0,
    translateY: 160,
    translateZ: 80,
  },
  data: {
    layer: 'first',
    type: 'corner',
    colors: ['red', 'white', 'blue'],
    faces: ['red', 'white', 'blue'],
  },
    linkedTransformOrigins: {
    frontX: 120,
    frontY: -40,
    frontZ: 40,
    leftX: 40,
    leftY: -40,
    leftZ: -80,
    bottomX: 120,
    bottomY: 40,
    bottomZ: -80,
  }
}))

pieces.push(new Piece({
  id: 21,
  styles: {
    width: 80,
    height: 80,
    translateX: 160,
    translateY: 160,
    translateZ: 0,
  },
  data: {
    layer: 'first',
    type: 'middle',
    colors: ['green', 'white'],
    faces: ['green', 'white'],
  },
    linkedTransformOrigins: {
    rightX: 40,
    rightY: -40,
    rightZ: 0,
    bottomX: -40,
    bottomY: 40,
    bottomZ: 0,
  }
}))

pieces.push(new Piece({
  id: 22,
  styles: {
    width: 80,
    height: 80,
    translateX: 80,
    translateY: 160,
    translateZ: 0,
  },
  data: {
    layer: 'first',
    type: 'center',
    colors: ['white'],
    faces: ['white'],
  },
    linkedTransformOrigins: {
    bottomX: 40,
    bottomY: 40,
    bottomZ: 0,
  }
}))

pieces.push(new Piece({
  id: 23,
  styles: {
    width: 80,
    height: 80,
    translateX: 0,
    translateY: 160,
    translateZ: 0,
  },
  data: {
    layer: 'first',
    type: 'middle',
    colors: ['blue', 'white'],
    faces: ['blue', 'white'],
  },
    linkedTransformOrigins: {
    leftX: 40,
    leftY: -40,
    leftZ: 0,
    bottomX: 120,
    bottomY: 40,
    bottomZ: 0,
  }
}))

pieces.push(new Piece({
  id: 24,
  styles: {
    width: 80,
    height: 80,
    translateX: 160,
    translateY: 160,
    translateZ: -80,
  },
  data: {
    layer: 'first',
    type: 'corner',
    colors: ['orange', 'white', 'green'],
    faces: ['orange', 'white', 'green'],
  },
    linkedTransformOrigins: {
    backX: -40,
    backY: -40,
    backZ: 40,
    rightX: 40,
    rightY: -40,
    rightZ: 80,
    bottomX: -40,
    bottomY: 40,
    bottomZ: 80,
  }
}))

pieces.push(new Piece({
  id: 25,
  styles: {
    width: 80,
    height: 80,
    translateX: 80,
    translateY: 160,
    translateZ: -80,
  },
  data: {
    layer: 'first',
    type: 'middle',
    colors: ['orange', 'white'],
    faces: ['orange', 'white'],
  },
    linkedTransformOrigins: {
    backX: 40,
    backY: -40,
    backZ: 40,
    bottomX: 40,
    bottomY: 40,
    bottomZ: 80,
  }
}))

pieces.push(new Piece({
  id: 26,
  styles: {
    width: 80,
    height: 80,
    translateX: 0,
    translateY: 160,
    translateZ: -80,
  },
  data: {
    layer: 'first',
    type: 'corner',
    colors: ['blue','white', 'orange'],
    faces: ['blue','white', 'orange'],
  },
    linkedTransformOrigins: {
    backX: 120,
    backY: -40,
    backZ: 40,
    leftX: 40,
    leftY: -40,
    leftZ: 80,
    bottomX: 120,
    bottomY: 40,
    bottomZ: 80,
  }
}))

const rubicksCube3x3 = new RubicksCube3x3({
  colors: {
    frontColor: '#ff0000', 
    backColor: '#ffa500', 
    leftColor: '#0000ff', 
    rightColor: '#008000', 
    topColor: '#ffff00', 
    bottomColor: '#ffffff',
  },
  styles: {
    width: 240,
    height: 240,
    pieceRadius: 20,
    transition: 0,
  },
  rotateAxle: {
    frontFace: 'z',
    backFace: 'z',
    leftFace: 'x',
    rightFace: 'x',
    topFace: 'y',
    bottomFace: 'y'
  }
});

rubicksCube3x3.setPieces(pieces);

export default rubicksCube3x3