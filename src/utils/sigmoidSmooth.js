import { timeToMinutes } from './minutes';

function sigmoid(x, y0, alpha, delta, step) {
  return {
    x: delta + x,
    y: +(y0 - (step * 1) / (1 + Math.exp(alpha * x)) + step).toFixed(3),
  };
}

function reverseSigmoid(x, y0, alpha, delta, step) {
  return {
    x: delta + x,
    y: +(y0 + (-step * 1) / (1 + Math.exp(alpha * x)) + step).toFixed(3),
  };
}

function smoothStep(x1, x2, x3, y1, y2) {
  const shortest = x2 - x1 < x3 - x2 ? x2 - x1 : x3 - x2;
  const step = +(y2 - y1).toFixed(6);
  if (step == 0) {
    return [{ x: x2, y: y2 }];
  }
  const range = shortest < 120 ? shortest : 120;
  const alpha0 = 0.1;
  const alpha = (alpha0 * 120) / range;
  const delta = x2;
  const half = Math.trunc(range / 2);
  const result = [];

  if (step > 0) {
    // Calculate Sigmoid
    for (let i = 0; i < half * 2 + 1; i++) {
      const x = -half + i;
      result.push(sigmoid(x, y1, alpha, delta, step));
    }
  } else {
    // Calculate Reverse Sigmoid
    for (let i = 0; i < half * 2 + 1; i++) {
      const x = -half + i;
      result.push(reverseSigmoid(x, y1, alpha, delta, step));
    }
  }
  return result;
}

export default function smoothen(coefficients) {
  //   console.log('Initial Data to Sigmoids:', coefficients);

  const baseValue = coefficients[coefficients.length - 1].value;
  const initialData = [{ x: 0, y: baseValue }];
  if (coefficients.length > 1) {
    initialData.push(
      ...coefficients.map((item) => ({
        x: timeToMinutes(item.fromTime),
        y: item.value,
      }))
    );
    initialData.push({ x: 1440, y: baseValue });
  }

  const detailedData = [];
  let stepValue = initialData[0]?.y || 0;
  for (let i = 0; i < 1440 + 1; i++) {
    const stepFound = initialData.find((item) => item.x == i);
    if (stepFound) {
      stepValue = stepFound.y;
    }
    detailedData.push({ x: i, y: stepValue });
  }

  const smoothBlocks = [];
  for (let i = 0; i < initialData.length - 2; i++) {
    smoothBlocks.push(
      smoothStep(
        initialData[i].x,
        initialData[i + 1].x,
        initialData[i + 2].x,
        initialData[i].y,
        initialData[i + 1].y
      )
    );
  }

  const jointSmooth = [].concat.apply([], smoothBlocks);

  const detailedSmoothData = detailedData.map((item) => ({ ...item }));
  for (let i = 0; i < jointSmooth.length; i++) {
    detailedSmoothData[jointSmooth[i].x].y = jointSmooth[i].y;
  }

  //   console.log('Result Smooth', detailedSmoothData);
  return detailedSmoothData;
}
