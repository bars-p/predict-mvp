import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import Title from '../layout/Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  { x: 0, y: undefined, z: 200 },
  { x: 360, y: 100, z: 260 },
  { x: 420, y: 300, z: 400 },
  { x: 480, y: 400, z: 280 },
  { x: 540, y: 450, z: 500 },
  { x: 600, y: 520, z: 200 },
  { x: 660, y: 600, z: 200 },
  { x: 720, y: 610, z: 260 },
  { x: 780, y: 620, z: 400 },
  { x: 840, y: 660, z: 280 },
  { x: 900, y: 580, z: 500 },
  { x: 960, y: 490, z: 200 },
  { x: 1020, y: 450, z: 200 },
  { x: 1080, y: 390, z: 260 },
  { x: 1140, y: 300, z: 400 },
  { x: 1200, y: 250, z: 280 },
  { x: 1260, y: 100, z: 500 },
  { x: 370, y: 110, z: 260 },
  { x: 410, y: 305, z: 400 },
  { x: 490, y: 410, z: 280 },
  { x: 555, y: 440, z: 500 },
  { x: 610, y: 540, z: 200 },
  { x: 630, y: 650, z: 200 },
  { x: 740, y: 600, z: 260 },
  { x: 790, y: 630, z: 400 },
  { x: 845, y: 670, z: 280 },
  { x: 910, y: 570, z: 500 },
  { x: 950, y: 480, z: 200 },
  { x: 1030, y: 470, z: 200 },
  { x: 1070, y: 380, z: 260 },
  { x: 1150, y: 320, z: 400 },
  { x: 1210, y: 260, z: 280 },
  { x: 1270, y: 110, z: 500 },
  { x: 1140, y: undefined, z: 200 },
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <ScatterChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            type='number'
            dataKey='x'
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            type='number'
            dataKey='y'
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Trip time (min)
            </Label>
          </YAxis>
          <Scatter
            data={data}
            stroke={theme.palette.primary.main}
            dot={true}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
