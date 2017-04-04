import pickBy from 'lodash/pickBy';
import keys from 'lodash/keys';
import identity from 'lodash/identity';
import { getShapeMeta } from './Shape';
import position from './position';
import removeShape from './removeShape';
import getFutureCollidingPoints from './getFutureCollidingPoints';

export default function move(state, shape, [incrementX, incrementY], callback = identity) {
  const { id } = getShapeMeta(shape);
  const currentShape = pickBy(state, point => point.id === id);

  if (keys(currentShape).length === 0) {
    throw new Error('move cannot move a shape that isn\'t in state');
  }

  const stateWithoutShape = removeShape(state, currentShape);
  const collidingPoints = getFutureCollidingPoints(
    stateWithoutShape,
    currentShape,
    [incrementX, incrementY],
  );

  if (collidingPoints.length) {
    return callback(state, collidingPoints);
  }

  return position(stateWithoutShape, currentShape, [incrementX, incrementY]);
}