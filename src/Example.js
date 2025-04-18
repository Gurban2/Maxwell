import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const calculateZScores = (data, key) => {
  const sum = data.reduce((acc, item) => acc + item[key], 0);
  const mean = sum / data.length;
  
  const sumSquaredDiff = data.reduce((acc, item) => {
    const diff = item[key] - mean;
    return acc + diff * diff;
  }, 0);
  const stdDev = Math.sqrt(sumSquaredDiff / data.length);
  
  const dataWithZScores = data.map(item => {
    const zScore = (item[key] - mean) / stdDev;
    return {
      ...item,
      [`${key}ZScore`]: zScore,
      [`${key}Color`]: Math.abs(zScore) > 1 ? '#ff0000' : key === 'pv' ? '#8884d8' : '#82ca9d'
    };
  });
  
  return dataWithZScores;
};

const enrichedData = data.map(item => ({ ...item }));
const dataWithPvZScores = calculateZScores(enrichedData, 'pv');
const dataWithZScores = calculateZScores(dataWithPvZScores, 'uv');

const CustomizedLine = (props) => {
  const { points, dataKey, stroke } = props;
  
  if (!points || points.length < 2) return null;
  
  const segments = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    const startPoint = points[i];
    const endPoint = points[i + 1];
    
    if (!startPoint || !endPoint) continue;
    
    const colorKey = `${dataKey}Color`;
    const color = startPoint.payload[colorKey] || stroke;
    
    segments.push(
      <line
        key={`line-${i}`}
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke={color}
        strokeWidth={2}
      />
    );
  }
  
  return <g>{segments}</g>;
};

const CustomizedDot = (props) => {
  const { cx, cy, dataKey, payload, stroke } = props;
  
  if (!cx || !cy) return null;
  
  const colorKey = `${dataKey}Color`;
  const color = payload[colorKey] || stroke;
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={color} 
      stroke={color} 
    />
  );
};

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/line-chart-width-xaxis-padding-8v7952';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={dataWithZScores}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value, name, props) => {
              const zScoreKey = `${name}ZScore`;
              const zScore = props.payload[zScoreKey] ? props.payload[zScoreKey].toFixed(2) : 'N/A';
              return [`${value} (z-score: ${zScore})`, name];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="pv" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }}
            dot={<CustomizedDot />}
            strokeWidth={0}
          />
          <Line 
            type="monotone" 
            dataKey="uv" 
            stroke="#82ca9d"
            dot={<CustomizedDot />}
            strokeWidth={0}
          />
          <Line 
            type="monotone" 
            dataKey="pv" 
            stroke="#8884d8"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            shape={<CustomizedLine />}
          />
          <Line 
            type="monotone" 
            dataKey="uv" 
            stroke="#82ca9d"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            shape={<CustomizedLine />}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
} 