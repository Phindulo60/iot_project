import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, FormControl } from '@mui/material';

const VendEventsTable = ({ data }) => {
  const [productFilter, setProductFilter] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('');

  const handleProductFilterChange = (event) => {
    setProductFilter(event.target.value);
  };

  const handlePaymentTypeFilterChange = (event) => {
    setPaymentTypeFilter(event.target.value);
  };

  const uniqueProducts = [...new Set(data.map(event => event.product))];
  const uniquePaymentTypes = [...new Set(data.map(event => event.paymentType))];

  const filteredData = data.filter(event => 
    (productFilter === '' || event.product === productFilter) && 
    (paymentTypeFilter === '' || event.paymentType === paymentTypeFilter)
  ).map(event => ({
    time: new Date(event.time).toLocaleString(),
    product: event.product,
    paymentType: event.paymentType,
    price: parseFloat(event.price).toFixed(2)
  }));

  return (
    <Card
      sx={{
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>Vending Machine Purchases</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  Time
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      displayEmpty
                      value={productFilter}
                      onChange={handleProductFilterChange}
                      renderValue={(selected) => selected === '' ? 'Product' : selected}
                    >
                      <MenuItem value=""><em>All</em></MenuItem>
                      {uniqueProducts.map(product => (
                        <MenuItem key={product} value={product}>{product}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      displayEmpty
                      value={paymentTypeFilter}
                      onChange={handlePaymentTypeFilterChange}
                      renderValue={(selected) => selected === '' ? 'Payment Type' : selected}
                    >
                      <MenuItem value=""><em>All</em></MenuItem>
                      {uniquePaymentTypes.map(paymentType => (
                        <MenuItem key={paymentType} value={paymentType}>{paymentType}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{row.time}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.product}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.paymentType}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default VendEventsTable;
