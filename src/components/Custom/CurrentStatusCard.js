import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const CurrentStatusCard = ({ title, value }) => {
  return (
    <Grid item xs={12} sm={4}>
      <Card>
        <CardContent>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="h2">{value}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CurrentStatusCard;
