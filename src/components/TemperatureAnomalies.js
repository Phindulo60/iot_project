import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const TemperatureAnomalies = ({ anomalies }) => {
  return (
    <Card
      sx={{
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>Temperature Anomalies</Typography>
        <ul>
          {anomalies.map((anomaly, index) => (
            <li key={index}>{new Date(anomaly.time).toLocaleString()} - {anomaly.measure_name}: {anomaly["measure_value::double"]}°C</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TemperatureAnomalies;
