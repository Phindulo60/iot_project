import React, { useEffect, useState } from 'react';
import { Grid, LinearProgress } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getMachineStatusData, getAggregateSalesData, getSalesByPaymentTypeData, getFreeVendData, getTotalVendsData, getAverageSalePriceData, getSalesComparisonData, getTemperatureSalesCorrelationData, getVendEventsData } from '../database/timestreamClient';
import Sidebar from './sidebar/Sidebar';
import CustomCard from './Custom/CustomCard';
import CustomChartCard from './Custom/CustomChartCard';
import StatusTable from './Tables/StatusTable';
import MachineHealth from './dashboard/MachineHealth';
import SalesDashboard from './SalesDashboard';
import '../layouts/Dashboard.css';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

const Dashboard = () => {
  const [statusMessages, setStatusMessages] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [latestStatus, setLatestStatus] = useState({ ambient: 'N/A', exhaust: 'N/A', DC: 'N/A' });
  const [aggregateSales, setAggregateSales] = useState([]);
  const [salesByPaymentType, setSalesByPaymentType] = useState([]);
  const [freeVendCount, setFreeVendCount] = useState(0);
  const [totalVendCount, setTotalVendCount] = useState(0);
  const [averageSalePrice, setAverageSalePrice] = useState(0);
  const [salesComparison, setSalesComparison] = useState([]);
  const [temperatureSalesCorrelation, setTemperatureSalesCorrelation] = useState([]);
  const [machineHealth, setMachineHealth] = useState({ message: 'Machine health is good.' });
  const [vendEvents, setVendEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const machineStatusData = await getMachineStatusData();
        if (machineStatusData && machineStatusData.Rows) {
          const formattedData = formatTimestreamData(machineStatusData.Rows, machineStatusData.ColumnInfo);
          setHistoricalData(formattedData);
          setStatusMessages(formattedData);
          updateLatestStatus(formattedData);
        }

        const aggregateSalesData = await getAggregateSalesData();
        if (aggregateSalesData && aggregateSalesData.Rows) {
          setAggregateSales(aggregateSalesData.Rows.map(row => ({
            product: row.Data[1].ScalarValue,
            totalSales: parseFloat(row.Data[0].ScalarValue),
          })));
        }

        const salesByPaymentTypeData = await getSalesByPaymentTypeData();
        if (salesByPaymentTypeData && salesByPaymentTypeData.Rows) {
          setSalesByPaymentType(salesByPaymentTypeData.Rows.map(row => ({
            name: row.Data[0].ScalarValue,
            value: parseInt(row.Data[1].ScalarValue, 10),
          })));
        }

        const freeVendData = await getFreeVendData();
        if (freeVendData && freeVendData.Rows) {
          setFreeVendCount(freeVendData.Rows.length);
        }

        const totalVendsData = await getTotalVendsData();
        if (totalVendsData && totalVendsData.Rows) {
          setTotalVendCount(totalVendsData.Rows.reduce((sum, row) => sum + parseInt(row.Data[0].ScalarValue, 10), 0));
        }

        const averageSalePriceData = await getAverageSalePriceData();
        if (averageSalePriceData && averageSalePriceData.Rows) {
          setAverageSalePrice(parseFloat(averageSalePriceData.Rows[0].Data[0].ScalarValue).toFixed(2));
        }

        const salesComparisonData = await getSalesComparisonData();
        if (salesComparisonData && salesComparisonData.Rows) {
          setSalesComparison(salesComparisonData.Rows.map(row => ({
            period: row.Data[0].ScalarValue,
            sales: parseFloat(row.Data[1].ScalarValue),
          })));
        }

        const temperatureSalesCorrelationData = await getTemperatureSalesCorrelationData();
        if (temperatureSalesCorrelationData && temperatureSalesCorrelationData.Rows) {
          setTemperatureSalesCorrelation(temperatureSalesCorrelationData.Rows.map(row => ({
            temperature: parseFloat(row.Data[0].ScalarValue),
            sales: parseFloat(row.Data[1].ScalarValue),
          })));
        }

        const vendEventsData = await getVendEventsData();
        if (vendEventsData && vendEventsData.Rows) {
          setVendEvents(vendEventsData.Rows.map(row => ({
            time: row.Data[0].ScalarValue,
            product: row.Data[1].ScalarValue,
            paymentType: row.Data[2].ScalarValue,
            price: row.Data[3].ScalarValue
          })));
        }

        const lastHourData = historicalData.filter(item => new Date(item.time) > Date.now() - 3600 * 1000);
        if (lastHourData.some(item => parseFloat(item['measure_value::double']) > 50)) {
          setMachineHealth({ message: 'Warning: High temperature detected in the last hour!' });
        } else if (lastHourData.some(item => parseFloat(item['measure_value::double']) < 10)) {
          setMachineHealth({ message: 'Warning: Low voltage detected in the last hour!' });
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [historicalData]);

  const formatTimestreamData = (rows, columns) => {
    if (!columns || columns.length === 0) {
      return [];
    }
    return rows.map(row => {
      const rowData = {};
      row.Data.forEach((data, index) => {
        const columnName = columns[index].Name;
        if (data.ScalarValue !== undefined) {
          rowData[columnName] = data.ScalarValue;
        } else if (data.NullValue !== undefined) {
          rowData[columnName] = 'NULL';
        }
      });
      return rowData;
    });
  };

  const updateLatestStatus = (data) => {
    const latest = { ambient: 'N/A', exhaust: 'N/A', DC: 'N/A' };
    data.forEach(item => {
      if (item.measure_name === 'ambient') {
        latest.ambient = parseFloat(item['measure_value::double']).toFixed(2);
      } else if (item.measure_name === 'exhaust') {
        latest.exhaust = parseFloat(item['measure_value::double']).toFixed(2);
      } else if (item.measure_name === 'DC') {
        latest.DC = parseFloat(item['measure_value::double']).toFixed(2);
      }
    });
    setLatestStatus(latest);
  };

  const temperatureData = historicalData.map((data) => ({
    time: new Date(data.time).toLocaleTimeString(),
    ambient: data.measure_name === 'ambient' ? parseFloat(data['measure_value::double']) : null,
    exhaust: data.measure_name === 'exhaust' ? parseFloat(data['measure_value::double']) : null,
    DC: data.measure_name === 'DC' ? parseFloat(data['measure_value::double']) : null,
  })).filter(data => data.ambient !== null || data.exhaust !== null || data.DC !== null);

  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            <Grid container spacing={2} padding={2}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <CustomCard
                    icon={<ThermostatIcon />}
                    title="Current Ambient Temperature"
                    value={loading ? <LinearProgress /> : `${latestStatus.ambient}°C`}
                    subText="+1% than last week"
                    sx={{ width: '350px', height: '135px' }}
                  />
                  <CustomCard
                    icon={<ThermostatIcon />}
                    title="Current Exhaust Temperature"
                    value={loading ? <LinearProgress /> : `${latestStatus.exhaust}°C`}
                    subText="+3% than last week"
                    sx={{ width: '350px', height: '135px' }}
                  />
                  <CustomCard
                    icon={<BatteryChargingFullIcon />}
                    title="Current Voltage"
                    value={loading ? <LinearProgress /> : `${latestStatus.DC}V`}
                    subText="+1% than last week"
                    sx={{ width: '350px', height: '135px' }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <MachineHealth healthData={machineHealth} />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomChartCard title="Ambient Temperature Trends" data={temperatureData} dataKey="ambient" stroke="#8884d8" additionalInfo="Last update: a few seconds ago" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomChartCard title="Exhaust Temperature Trends" data={temperatureData} dataKey="exhaust" stroke="#82ca9d" additionalInfo="Last update: a few seconds ago" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomChartCard title="Voltage Trends" data={temperatureData} dataKey="DC" stroke="#8884d8" additionalInfo="Last update: a few seconds ago" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12}>
                <StatusTable data={historicalData} />
              </Grid>
            </Grid>
          } />
          <Route path="/sales-dashboard" element={
            <SalesDashboard
              averageSalePrice={averageSalePrice}
              salesComparison={salesComparison}
              temperatureSalesCorrelation={temperatureSalesCorrelation}
              vendEvents={vendEvents}
            />
          } />
        </Routes>
      </div>
      </LocalizationProvider>
    </Router>
  );
};

export default Dashboard;
