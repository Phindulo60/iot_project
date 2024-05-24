import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import CustomCard from './Custom/CustomCard';
import VendEventsTable from './Tables/VendEventsTable';
import ProductSelectCard from './ProductSelectCard';
import {
  getRevenueLastHour,
  getRevenueLastDay,
  getRevenueLastMonth,
  getRevenueLastTwoMonths,
  getRevenueLastThreeMonths,
  getRevenueLastSixMonths,
  getPreviousRevenueLastHour,
  getPreviousRevenueLastDay,
  getPreviousRevenueLastMonth,
  getPreviousRevenueLastTwoMonths,
  getPreviousRevenueLastThreeMonths,
  getPreviousRevenueLastSixMonths,
  getRevenueLastDayForProduct,
  getRevenueLastWeekForProduct,
  getRevenueLastThreeMonthsForProduct,
  getSalesLastDayForProduct,
  getSalesLastWeekForProduct,
  getSalesLastThreeMonthsForProduct,
  getCashSalesLastDay,
  getCashSalesLastWeek,
  getCashSalesLastThreeMonths,
  getCCSalesLastDay,
  getCCSalesLastWeek,
  getCCSalesLastThreeMonths,
} from '../database/timestreamClient';
import { calculatePercentageChange } from './Custom/calculatePercentageChange';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const SalesDashboard = ({ averageSalePrice = 0, vendEvents = [] }) => {
  const [revenueLastHour, setRevenueLastHour] = useState(0);
  const [revenueLastDay, setRevenueLastDay] = useState(0);
  const [revenueLastMonth, setRevenueLastMonth] = useState(0);
  const [revenueLastTwoMonths, setRevenueLastTwoMonths] = useState(0);
  const [revenueLastThreeMonths, setRevenueLastThreeMonths] = useState(0);
  const [revenueLastSixMonths, setRevenueLastSixMonths] = useState(0);

  const [prevRevenueLastHour, setPrevRevenueLastHour] = useState(0);
  const [prevRevenueLastDay, setPrevRevenueLastDay] = useState(0);
  const [prevRevenueLastMonth, setPrevRevenueLastMonth] = useState(0);
  const [prevRevenueLastTwoMonths, setPrevRevenueLastTwoMonths] = useState(0);
  const [prevRevenueLastThreeMonths, setPrevRevenueLastThreeMonths] = useState(0);
  const [prevRevenueLastSixMonths, setPrevRevenueLastSixMonths] = useState(0);

  const [waterRevenueDay, setWaterRevenueDay] = useState(0);
  const [waterRevenueWeek, setWaterRevenueWeek] = useState(0);
  const [waterRevenueThreeMonths, setWaterRevenueThreeMonths] = useState(0);
  const [iceRevenueDay, setIceRevenueDay] = useState(0);
  const [iceRevenueWeek, setIceRevenueWeek] = useState(0);
  const [iceRevenueThreeMonths, setIceRevenueThreeMonths] = useState(0);

  const [waterSalesDay, setWaterSalesDay] = useState(0);
  const [waterSalesWeek, setWaterSalesWeek] = useState(0);
  const [waterSalesThreeMonths, setWaterSalesThreeMonths] = useState(0);
  const [iceSalesDay, setIceSalesDay] = useState(0);
  const [iceSalesWeek, setIceSalesWeek] = useState(0);
  const [iceSalesThreeMonths, setIceSalesThreeMonths] = useState(0);

  const [cashSalesDay, setCashSalesDay] = useState(0);
  const [cashSalesWeek, setCashSalesWeek] = useState(0);
  const [cashSalesThreeMonths, setCashSalesThreeMonths] = useState(0);
  const [ccSalesDay, setCCSalesDay] = useState(0);
  const [ccSalesWeek, setCCSalesWeek] = useState(0);
  const [ccSalesThreeMonths, setCCSalesThreeMonths] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const [
          lastHourData, prevLastHourData, lastDayData, prevLastDayData,
          lastMonthData, prevLastMonthData, lastTwoMonthsData, prevLastTwoMonthsData,
          lastThreeMonthsData, prevLastThreeMonthsData, lastSixMonthsData, prevLastSixMonthsData
        ] = await Promise.all([
          getRevenueLastHour(), getPreviousRevenueLastHour(),
          getRevenueLastDay(), getPreviousRevenueLastDay(),
          getRevenueLastMonth(), getPreviousRevenueLastMonth(),
          getRevenueLastTwoMonths(), getPreviousRevenueLastTwoMonths(),
          getRevenueLastThreeMonths(), getPreviousRevenueLastThreeMonths(),
          getRevenueLastSixMonths(), getPreviousRevenueLastSixMonths()
        ]);

        const [
          waterDay, waterWeek, waterThreeMonths, iceDay, iceWeek, iceThreeMonths
        ] = await Promise.all([
          getRevenueLastDayForProduct('WATER'), getRevenueLastWeekForProduct('WATER'),
          getRevenueLastThreeMonthsForProduct('WATER'), getRevenueLastDayForProduct('ICE'),
          getRevenueLastWeekForProduct('ICE'), getRevenueLastThreeMonthsForProduct('ICE'),
        ]);

        const [
          waterDay_, waterWeek_, waterThreeMonths_, iceDay_, iceWeek_, iceThreeMonths_
        ] = await Promise.all([
          getSalesLastDayForProduct('WATER'), getSalesLastWeekForProduct('WATER'),
          getSalesLastThreeMonthsForProduct('WATER'), getSalesLastDayForProduct('ICE'),
          getSalesLastWeekForProduct('ICE'), getSalesLastThreeMonthsForProduct('ICE')
        ]);

        const [
          cashDay, cashWeek, cashThreeMonths, ccDay, ccWeek, ccThreeMonths
        ] = await Promise.all([
          getCashSalesLastDay(), getCashSalesLastWeek(), getCashSalesLastThreeMonths(),
          getCCSalesLastDay(), getCCSalesLastWeek(), getCCSalesLastThreeMonths()
        ]);

        setRevenueLastHour(parseFloat(lastHourData.Rows[0].Data[0].ScalarValue).toFixed(2));
        setPrevRevenueLastHour(parseFloat(prevLastHourData.Rows[0].Data[0].ScalarValue).toFixed(2));

        setRevenueLastDay(parseFloat(lastDayData.Rows[0].Data[0].ScalarValue).toFixed(2));
        setPrevRevenueLastDay(parseFloat(prevLastDayData.Rows[0].Data[0].ScalarValue).toFixed(2));

        setRevenueLastMonth(parseFloat(lastMonthData.Rows[0].Data[0].ScalarValue).toFixed(2));
        setPrevRevenueLastMonth(parseFloat(prevLastMonthData.Rows[0].Data[0].ScalarValue).toFixed(2));

        setRevenueLastTwoMonths(parseFloat(lastTwoMonthsData.Rows[0].Data[0].ScalarValue).toFixed(2));
        setPrevRevenueLastTwoMonths(parseFloat(prevLastTwoMonthsData.Rows[0].Data[0].ScalarValue).toFixed(2));

        setRevenueLastThreeMonths(parseFloat(lastThreeMonthsData.Rows[0].Data[0].ScalarValue).toFixed(2));
        setPrevRevenueLastThreeMonths(parseFloat(prevLastThreeMonthsData.Rows[0].Data[0].ScalarValue).toFixed(2));

        setRevenueLastSixMonths(parseFloat(lastSixMonthsData.Rows[0].Data[0].ScalarValue).toFixed(2));
        setPrevRevenueLastSixMonths(parseFloat(prevLastSixMonthsData.Rows[0].Data[0].ScalarValue).toFixed(2));

        setWaterRevenueDay(parseFloat(waterDay.Rows[0]?.Data[0]?.ScalarValue || 0).toFixed(2));
        setWaterRevenueWeek(parseFloat(waterWeek.Rows[0]?.Data[0]?.ScalarValue || 0).toFixed(2));
        setWaterRevenueThreeMonths(parseFloat(waterThreeMonths.Rows[0]?.Data[0]?.ScalarValue || 0).toFixed(2));
        setIceRevenueDay(parseFloat(iceDay.Rows[0]?.Data[0]?.ScalarValue || 0).toFixed(2));
        setIceRevenueWeek(parseFloat(iceWeek.Rows[0]?.Data[0]?.ScalarValue || 0).toFixed(2));
        setIceRevenueThreeMonths(parseFloat(iceThreeMonths.Rows[0]?.Data[0]?.ScalarValue || 0).toFixed(2));

        setWaterSalesDay(parseInt(waterDay_.Rows[0]?.Data[0]?.ScalarValue || 0));
        setWaterSalesWeek(parseInt(waterWeek_.Rows[0]?.Data[0]?.ScalarValue || 0));
        setWaterSalesThreeMonths(parseInt(waterThreeMonths_.Rows[0]?.Data[0]?.ScalarValue || 0));
        setIceSalesDay(parseInt(iceDay_.Rows[0]?.Data[0]?.ScalarValue || 0));
        setIceSalesWeek(parseInt(iceWeek.Rows[0]?.Data[0]?.ScalarValue || 0));
        setIceSalesThreeMonths(parseInt(iceThreeMonths_.Rows[0]?.Data[0]?.ScalarValue || 0));

        setCashSalesDay(parseInt(cashDay.Rows[0]?.Data[0]?.ScalarValue || 0));
        setCashSalesWeek(parseInt(cashWeek.Rows[0]?.Data[0]?.ScalarValue || 0));
        setCashSalesThreeMonths(parseInt(cashThreeMonths.Rows[0]?.Data[0]?.ScalarValue || 0));
        setCCSalesDay(parseInt(ccDay.Rows[0]?.Data[0]?.ScalarValue || 0));
        setCCSalesWeek(parseInt(ccWeek.Rows[0]?.Data[0]?.ScalarValue || 0));
        setCCSalesThreeMonths(parseInt(ccThreeMonths.Rows[0]?.Data[0]?.ScalarValue || 0));

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, []);

  const renderValue = (loading, value) => {
    return loading ? <CircularProgress size={24} /> : value;
  };

  return (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={12}>
      </Grid>
      
      <Grid container spacing={3}>
        <CustomCard icon={<CurrencyExchangeIcon />} title="Revenue Last Hour" value={renderValue(loading, `$${revenueLastHour}`)} subText={`${calculatePercentageChange(revenueLastHour, prevRevenueLastHour)}% than last hour`} sx={{ width: '250px', height: '245px' }} />
        <CustomCard icon={<LocalDrinkIcon />} title="WATER Sales Last Day" value={renderValue(loading, `${waterSalesDay} units`)} subText="Sales for WATER in the past day" sx={{ width: '250px', height: '245px' }} />
        <CustomCard icon={<AcUnitIcon />} title="ICE Sales Last Day" value={renderValue(loading, `${iceSalesDay} units`)} subText="Sales for ICE in the past day" sx={{ width: '250px', height: '245px' }} />
        <CustomCard icon={<CreditCardIcon />} title="CC Sales Last Day" value={renderValue(loading, `${ccSalesDay} transactions`)} subText="Transactions paid with CC in the past day" sx={{ width: '250px', height: '245px' }} />
        <CustomCard icon={<CurrencyExchangeIcon />} title="Revenue Last 3 Months" value={renderValue(loading, `$${revenueLastThreeMonths}`)} subText={`${calculatePercentageChange(revenueLastThreeMonths, prevRevenueLastThreeMonths)}% than last 3 months`} sx={{ width: '435px', height: '455px' }}  subTextSx={{ marginLeft:'100px' }}/>
        <Grid item xs={6} sm={2} md={4} lg={3} sx={{ width: '1100px', height: '255px', marginTop:'-220px', marginLeft:'-20px', marginBottom:'20px' }}>
          <CustomCard icon={<CurrencyExchangeIcon />} title="Revenue Last 6 Months" value={renderValue(loading, `$${revenueLastSixMonths}`)} subText={`${calculatePercentageChange(revenueLastSixMonths, prevRevenueLastSixMonths)}% than last 6 months`} sx={{ width: '1100px', height: '175px' }} titleSx={{ marginLeft:'360px' }} valueSx={{ marginLeft:'360px' }} subTextSx={{ marginLeft:'160px' }}/>
        </Grid>      
      </Grid>
      <Grid item xs={12}>
      </Grid>
      <Grid container spacing={3}>
        <CustomCard icon={<CurrencyExchangeIcon />} title="WATER Revenue Last Day" value={renderValue(loading, `$${waterRevenueDay}`)} subText="Revenue for WATER in the past day" sx={{ width: '795px', height: '135px' }} titleSx={{ marginLeft:'190px' }} valueSx={{ marginLeft:'190px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<CurrencyExchangeIcon />} title="WATER Revenue Last Week" value={renderValue(loading, `$${waterRevenueWeek}`)} subText="Revenue for WATER in the past week" sx={{ width: '745px', height: '135px' }} titleSx={{ marginLeft:'170px' }} valueSx={{ marginLeft:'170px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<CurrencyExchangeIcon />} title="WATER Revenue Last 3 Months" value={renderValue(loading, `$${waterRevenueThreeMonths}`)} subText="Revenue for WATER in the past 3 months" sx={{ width: '795px', height: '135px' }} titleSx={{ marginLeft:'170px' }} valueSx={{ marginLeft:'170px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<CurrencyExchangeIcon />} title="ICE Revenue Last Day" value={renderValue(loading, `$${iceRevenueDay}`)} subText="Revenue for ICE in the past day" sx={{ width: '745px', height: '135px' }} titleSx={{ marginLeft:'180px' }} valueSx={{ marginLeft:'180px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<CurrencyExchangeIcon />} title="ICE Revenue Last Week" value={renderValue(loading, `$${iceRevenueWeek}`)} subText="Revenue for ICE in the past week" sx={{ width: '795px', height: '135px' }} titleSx={{ marginLeft:'190px' }} valueSx={{ marginLeft:'190px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<CurrencyExchangeIcon />} title="ICE Revenue Last 3 Months" value={renderValue(loading, `$${iceRevenueThreeMonths}`)} subText="Revenue for ICE in the past 3 months" sx={{ width: '745px', height: '135px' }} titleSx={{ marginLeft:'165px' }} valueSx={{ marginLeft:'165px' }} subTextSx={{ marginLeft:'160px' }}/>
      </Grid>
      <Grid item xs={12}>
      </Grid>
      <Grid container spacing={3}>
        <CustomCard icon={<LocalDrinkIcon />} title="WATER Sales Last Day" value={renderValue(loading, `${waterSalesDay} units`)} subText="Sales for WATER in the past day" sx={{ width: '795px', height: '135px' }} titleSx={{ marginLeft:'200px' }} valueSx={{ marginLeft:'200px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<LocalDrinkIcon />} title="WATER Sales Last Week" value={renderValue(loading, `${waterSalesWeek} units`)} subText="Sales for WATER in the past week" sx={{ width: '745px', height: '135px' }} titleSx={{ marginLeft:'165px' }} valueSx={{ marginLeft:'165px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<LocalDrinkIcon />} title="WATER Sales Last 3 Months" value={renderValue(loading, `${waterSalesThreeMonths} units`)} subText="Sales for WATER in the past 3 months" sx={{ width: '795px', height: '135px' }} titleSx={{ marginLeft:'190px' }} valueSx={{ marginLeft:'190px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<AcUnitIcon />} title="ICE Sales Last Day" value={renderValue(loading, `${iceSalesDay} units`)} subText="Sales for ICE in the past day" sx={{ width: '745px', height: '135px' }} titleSx={{ marginLeft:'190px' }} valueSx={{ marginLeft:'190px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<AcUnitIcon />} title="ICE Sales Last Week" value={renderValue(loading, `${iceSalesWeek} units`)} subText="Sales for ICE in the past week" sx={{ width: '795px', height: '135px' }} titleSx={{ marginLeft:'210px' }} valueSx={{ marginLeft:'210px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<AcUnitIcon />} title="ICE Sales Last 3 Months" value={renderValue(loading, `${iceSalesThreeMonths} units`)} subText="Sales for ICE in the past 3 months" sx={{ width: '745px', height: '135px' }} titleSx={{ marginLeft:'180px' }} valueSx={{ marginLeft:'180px' }} subTextSx={{ marginLeft:'160px' }}/>
      </Grid>
      <Grid item xs={12}>
      </Grid>
      <Grid container spacing={3}>
        <CustomCard icon={<LocalAtmIcon />} title="CASH Sales Last Day" value={renderValue(loading, `${cashSalesDay} transactions`)} subText="Transactions paid with CASH in the past day" sx={{ width: '795px', height: '135px' }} titleSx={{ marginLeft:'200px' }} valueSx={{ marginLeft:'200px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<LocalAtmIcon />} title="CASH Sales Last Week" value={renderValue(loading, `${cashSalesWeek} transactions`)} subText="Transactions paid with CASH in the past week" sx={{ width: '745px', height: '135px' }} titleSx={{ marginLeft:'200px' }} valueSx={{ marginLeft:'200px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<LocalAtmIcon />} title="CASH Sales Last 3 Months" value={renderValue(loading, `${cashSalesThreeMonths} transactions`)} subText="Transactions paid with CASH in the past 3 months" sx={{ width: '795px', height: '135px' }} titleSx={{ marginLeft:'200px' }} valueSx={{ marginLeft:'200px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<CreditCardIcon />} title="Credit Card Sales Last Day" value={renderValue(loading, `${ccSalesDay} transactions`)} subText="Transactions paid with Credit Card in the past day" sx={{ width: '745px', height: '135px' }} titleSx={{ marginLeft:'200px' }} valueSx={{ marginLeft:'200px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<CreditCardIcon />} title="Credit Card Sales Last Week" value={renderValue(loading, `${ccSalesWeek} transactions`)} subText="Transactions paid with Credit Card in the past week" sx={{ width: '795px', height: '135px' }} titleSx={{ marginLeft:'200px' }} valueSx={{ marginLeft:'200px' }} subTextSx={{ marginLeft:'160px' }}/>
        <CustomCard icon={<CreditCardIcon />} title="Credit Card Sales Last 3 Months" value={renderValue(loading, `${ccSalesThreeMonths} transactions`)} subText="Transactions paid with Credit Card in the past 3 months" sx={{ width: '745px', height: '135px' }} titleSx={{ marginLeft:'200px' }} valueSx={{ marginLeft:'200px' }} subTextSx={{ marginLeft:'160px' }}/>
      </Grid>
      <Grid item xs={12}>
        <VendEventsTable data={vendEvents} />
      </Grid>
      <Grid item xs={12}>
        <ProductSelectCard title="Select Product for Free Item" products={['WATER', 'ICE']} sx={{ width: '350px', height: '135px' }} />
      </Grid>
    </Grid>
  );
};

export default SalesDashboard;
