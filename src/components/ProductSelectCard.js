import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sendMessage } from '../protocol/mqttClient';

const ProductSelectCard = ({ title, products, sx }) => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const handleSendFreeVend = () => {
    sendMessage('reactTest/freeVend', { product: selectedProduct });
  };

  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '8px',
        ...sx,
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="product-select-label">Product</InputLabel>
            <Select
              labelId="product-select-label"
              value={selectedProduct}
              label="Product"
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map((product, index) => (
                <MenuItem key={index} value={product}>{product}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendFreeVend}
        >
          Send Free Vend
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductSelectCard;
