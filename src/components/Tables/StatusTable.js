import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const StatusTable = ({ data }) => {
  const consolidatedData = data.reduce((acc, curr) => {
    const time = new Date(curr.time).toLocaleString();
    if (!acc[time]) {
      acc[time] = { time, host: curr.host, ambient: 'N/A', exhaust: 'N/A', DC: 'N/A' };
    }
    if (curr.measure_name === 'ambient') {
      acc[time].ambient = parseFloat(curr['measure_value::double']).toFixed(2);
    } else if (curr.measure_name === 'exhaust') {
      acc[time].exhaust = parseFloat(curr['measure_value::double']).toFixed(2);
    } else if (curr.measure_name === 'DC') {
      acc[time].DC = parseFloat(curr['measure_value::double']).toFixed(2);
    }
    return acc;
  }, {});

  const tableData = Object.values(consolidatedData);

  return (
    <Card
      sx={{
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>Machine Status Entries</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Host</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ambient</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Exhaust</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>DC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{row.time}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.host}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.ambient}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.exhaust}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.DC}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default StatusTable;
