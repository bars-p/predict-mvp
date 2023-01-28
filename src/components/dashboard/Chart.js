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

//FIXME: Custom Dot Draft
function MyDot(props) {
  const { cx, cy, color, volume } = props;
  return <Dot cx={cx} cy={cy} fill={color} r={volume} />;
}

// FIXME: Custom Tooltip Draft
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

export default function Chart(props) {
  const theme = useTheme();

  const { coefficients, smoothCoefs } = props;

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
            data={smoothCoefs}
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
