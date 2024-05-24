import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const FreeVendEvents = ({ freeVendCount, totalVendCount }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Free Vend Events</Typography>
        <Typography variant="h2">{freeVendCount}</Typography>
        <Typography variant="h6">Comparison with Paid Vends</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">Free Vends: {freeVendCount}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Paid Vends: {totalVendCount - freeVendCount}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FreeVendEvents;
