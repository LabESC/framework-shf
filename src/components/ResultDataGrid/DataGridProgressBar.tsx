import * as React from 'react';
import clsx from 'clsx';
import { styled, useTheme } from '@mui/material/styles';

interface ProgressBarProps {
  value: number;
  colors: boolean;
}

export const BarDiv = styled('div')({
  height: '100%',
  '&.low': {
    backgroundColor: '#f44336',
  },
  '&.medium': {
    backgroundColor: '#efbb5aa3',
  },
  '&.high': {
    backgroundColor: '#088208a3',
  },
  '&.normal':{
    backgroundColor: 'gray'
  }
});


export const ProgressBar = React.memo(function ProgressBar(props: ProgressBarProps) {
  const { value, colors } = props;
  const valueInPercent = value * 100;

  const theme = useTheme();

  return (
    <div style={{
      border: `1px solid ${theme.palette.divider}`,
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: 26,
      borderRadius: 2,
    }}>
      <div style={{
          position: 'absolute',
          lineHeight: '24px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
      }}>{`${valueInPercent.toLocaleString()} %`}</div>
      <BarDiv
        className={clsx({
          low: valueInPercent < 60,
          medium: valueInPercent >= 60 && valueInPercent <= 79,
          high: valueInPercent > 80,
          normal: !colors
        })}
        style={{ maxWidth: `${valueInPercent}%`}}
      />
    </div>
  );
});