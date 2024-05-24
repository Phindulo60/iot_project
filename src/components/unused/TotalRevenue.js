import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const TotalRevenue = ({ totalRevenue, revenueByProduct }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Total Revenue</Typography>
        <Typography variant="h2">${totalRevenue}</Typography>
        <Typography variant="h6">Revenue by Product</Typography>
        <Grid container spacing={2}>
          {revenueByProduct.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="body1">{item.product}: ${item.totalSales}</Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalRevenue;
