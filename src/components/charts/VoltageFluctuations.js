import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const VoltageFluctuations = ({ fluctuations }) => {
  return (
    <Card
      sx={{
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>Voltage Fluctuations</Typography>
        <ul>
          {fluctuations.map((fluctuation, index) => (
            <li key={index}>{new Date(fluctuation.time).toLocaleString()} - DC: {fluctuation["measure_value::double"]}V</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default VoltageFluctuations;
