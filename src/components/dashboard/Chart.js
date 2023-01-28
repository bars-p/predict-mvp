import React from 'react';
import { useTheme } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Tooltip,
  Dot,
} from 'recharts';
import Title from '../layout/Title';
import { timeToMinutes, minutesToTime } from '../../utils/minutes';

function MyDot(props) {
  const { cx, cy, color, volume } = props;
  return <Dot cx={cx} cy={cy} fill={color} r={volume} />;
}

function MyTooltip(props) {
  const { active, payload, label } = props;
  if (active) {
    console.log(
      'Tooltip Data (active, payload, label):',
      active,
      payload,
      label
    );
    return <h4>{minutesToTime(label)}</h4>;
  }
}

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

function smoothen(x1, x2, x3, y1, y2) {
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

export default function Chart(props) {
  const theme = useTheme();

  const { coefficients } = props;

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
      smoothen(
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

  const labelStyle = {
    fontSize: 'medium',
  };

  const payloadStyle = {
    fontSize: 'small',
  };

  return (
    <React.Fragment>
      <Title>Day periods speed coefficients</Title>
      <ResponsiveContainer>
        <LineChart
          margin={{
            top: 16,
            right: 30,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis
            type='number'
            dataKey='x'
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            domain={[0, 1440]}
            tickCount={25}
            tickFormatter={(number) => {
              if (number % 120 == 0) {
                return `${number / 60}:00`;
              } else {
                return '';
              }
            }}
          />
          <YAxis
            type='number'
            dataKey='y'
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            domain={[0, 1]}
            tickCount={6}
          ></YAxis>
          <CartesianGrid vertical={false} opacity={0.5} />
          <Line
            data={detailedData}
            type='stepAfter'
            dataKey='y'
            name='Initial'
            stroke='red'
            opacity={0.5}
            strokeWidth={5}
            dot={false}
          />
          <Line
            data={detailedSmoothData}
            type='linear'
            dataKey='y'
            name='Smooth'
            stroke={indigo[900]}
            opacity={1}
            strokeWidth={3}
            dot={false}
          />
          <Tooltip
            labelStyle={labelStyle}
            labelFormatter={(label) => minutesToTime(label)}
            contentStyle={payloadStyle}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
