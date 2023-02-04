import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { indigo, red, blue } from '@mui/material/colors';
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
  LabelList,
  Legend,
} from 'recharts';
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
    // console.log(
    //   'Tooltip Data (active, payload, label):',
    //   active,
    //   payload,
    //   label
    // );
    return <span>{(payload[1].value * 100).toFixed()}%</span>;
  }
}

export default function Chart(props) {
  const theme = useTheme();

  const { data, timeLeft, layover, minLayover, setArrive, setDepart } = props;

  const timeNext = timeLeft + layover;
  const minDelay = minLayover;

  const labelStyle = {
    fontSize: 'medium',
  };

  const payloadStyle = {
    fontSize: 'small',
  };

  const calculateY = (moment) => {
    if (moment <= data.at(0).x) {
      return 0;
    }
    if (moment >= data.at(-1).x) {
      return 1;
    }
    for (let i = 1; i < data.length - 1; i++) {
      if (moment == data[i].x) {
        return data[i].y;
      }
    }
    let lineDots = [{}, {}];
    for (let i = 1; i < data.length; i++) {
      if (moment < data[i].x) {
        lineDots[0] = { ...data[i - 1] };
        lineDots[1] = { ...data[i] };
        break;
      }
    }
    // console.log('Line Found:', moment, lineDots);
    const stepY =
      (lineDots[1].y - lineDots[0].y) / (lineDots[1].x - lineDots[0].x);
    const resultY = (moment - lineDots[0].x) * stepY + lineDots[0].y;
    return resultY;
  };

  const getTimeProbabilityLine = (moment) => {
    return [
      {
        x: moment,
        y: 0,
      },
      {
        x: moment,
        y: calculateY(moment),
      },
    ];
  };

  const timeLeftLine = getTimeProbabilityLine(timeLeft);
  const timeNextLine = getTimeProbabilityLine(timeNext);
  const timeNextDelayedLine = getTimeProbabilityLine(timeNext - minDelay);

  setArrive(timeLeftLine[1].y);
  setDepart(timeNextDelayedLine[1].y);

  const preLine = [
    { x: data.at(0).x - 2, y: 0 },
    { x: data.at(0).x, y: 0 },
  ];
  const postLine = [
    { x: data.at(-1).x, y: 1 },
    { x: data.at(-1).x + 2, y: 1 },
  ];

  return (
    <React.Fragment>
      <ResponsiveContainer>
        <ScatterChart
          margin={{
            top: 10,
            right: 10,
            bottom: 0,
            left: 10,
          }}
        >
          <XAxis
            type='number'
            domain={[preLine.at(0).x, postLine.at(-1).x]}
            tickCount={postLine.at(-1).x - preLine.at(0).x + 1}
            dataKey='x'
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            type='number'
            dataKey='y'
            domain={[0, 1]}
            tickCount={6}
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position='left'
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body2,
              }}
            >
              Probability
            </Label>
          </YAxis>
          <CartesianGrid vertical={false} opacity={0.5} />
          <Scatter
            legendType='none'
            data={data}
            line
            fill={indigo[500]}
            strokeWidth={3}
          ></Scatter>
          <Scatter
            legendType='none'
            data={preLine}
            shape={false}
            tooltipType='none'
            line
            fill={indigo[400]}
            strokeWidth={3}
          />
          <Scatter
            legendType='none'
            data={postLine}
            shape={false}
            dot={false}
            tooltipType='none'
            line
            fill={indigo[400]}
            strokeWidth={3}
          />

          <Scatter
            name='Arrival Time'
            data={timeLeftLine}
            line
            fill={blue[300]}
            strokeWidth={3}
          />
          <Scatter
            legendType='none'
            data={timeNextLine}
            line
            fill='lightgrey'
            strokeWidth={3}
          />
          <Scatter
            name='Departure Time'
            data={timeNextDelayedLine}
            line
            fill={blue[700]}
            strokeWidth={3}
          />
          <Tooltip
            labelStyle={labelStyle}
            labelFormatter={(label) => minutesToTime(label)}
            contentStyle={payloadStyle}
            content={<MyTooltip />}
          />
          <Legend verticalAlign='bottom' height={0} iconSize='8' />
        </ScatterChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
