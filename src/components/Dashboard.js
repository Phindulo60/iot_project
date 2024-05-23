import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getMachineStatusData, getAggregateSalesData, getSalesByPaymentTypeData, getFreeVendData, getTotalVendsData, getAverageSalePriceData, getSalesComparisonData, getTemperatureSalesCorrelationData, getFrequentCustomersData, getHistoricalData, getTemperatureAnomalies, getVoltageFluctuations } from '../database/timestreamClient';
import TotalRevenue from './TotalRevenue';
import ProductSalesDistribution from './ProductSalesDistribution';
import SalesByPaymentType from './SalesByPaymentType';
import FreeVendEvents from './FreeVendEvents';
import Sidebar from './Sidebar';
import CustomCard from './CustomCard';
import CustomChartCard from './CustomChartCard';
import StatusTable from './StatusTable';
import MachineHealth from './MachineHealth';
import TemperatureAnomalies from './TemperatureAnomalies';
import VoltageFluctuations from './VoltageFluctuations';
import '../layouts/Dashboard.css';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';

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
  const [frequentCustomers, setFrequentCustomers] = useState([]);
  const [temperatureAnomalies, setTemperatureAnomalies] = useState([]);
  const [voltageFluctuations, setVoltageFluctuations] = useState([]);
  const [machineHealth, setMachineHealth] = useState({ message: 'Machine health is good.' });

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

        const frequentCustomersData = await getFrequentCustomersData();
        if (frequentCustomersData && frequentCustomersData.Rows) {
          setFrequentCustomers(frequentCustomersData.Rows.map(row => ({
            customer: row.Data[0].ScalarValue,
            count: parseInt(row.Data[1].ScalarValue, 10),
          })));
        }

        const temperatureAnomaliesData = await getTemperatureAnomalies();
        if (temperatureAnomaliesData && temperatureAnomaliesData.Rows) {
          setTemperatureAnomalies(formatTimestreamData(temperatureAnomaliesData.Rows, temperatureAnomaliesData.ColumnInfo));
        }

        const voltageFluctuationsData = await getVoltageFluctuations();
        if (voltageFluctuationsData && voltageFluctuationsData.Rows) {
          setVoltageFluctuations(formatTimestreamData(voltageFluctuationsData.Rows, voltageFluctuationsData.ColumnInfo));
        }

        // Simple machine health assessment
        const lastHourData = historicalData.filter(item => new Date(item.time) > Date.now() - 3600 * 1000);
        if (lastHourData.some(item => parseFloat(item['measure_value::double']) > 50)) {
          setMachineHealth({ message: 'Warning: High temperature detected in the last hour!' });
        } else if (lastHourData.some(item => parseFloat(item['measure_value::double']) < 10)) {
          setMachineHealth({ message: 'Warning: Low voltage detected in the last hour!' });
        }

      } catch (error) {
        console.error('Error fetching data:', error);
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

  const totalRevenue = aggregateSales.reduce((sum, item) => sum + item.totalSales, 0);

  return (
    <Router>
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={
            <Grid container spacing={2} padding={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <CustomCard icon={<ThermostatIcon />} title="Current Ambient Temperature" value={`${latestStatus.ambient}°C`} subText="+1% than last week" sx={{ width: '100%', height: 'auto' }} />
                  <CustomCard icon={<ThermostatIcon />} title="Current Exhaust Temperature" value={`${latestStatus.exhaust}°C`} subText="+3% than last week" sx={{ width: '100%', height: 'auto' }} />
                  <CustomCard icon={<BatteryChargingFullIcon />} title="Current DC Voltage" value={`${latestStatus.DC}V`} subText="+1% than last week" sx={{ width: '100%', height: 'auto' }} />
                  <CustomCard icon={<LocalAtmIcon />} title="Total Revenue" value={`$${totalRevenue}`} subText="Updated today" sx={{ width: '100%', height: 'auto' }} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomChartCard title="Ambient Temperature Trends" data={temperatureData} dataKey="ambient" stroke="#8884d8" additionalInfo="Last update: a few seconds ago" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomChartCard title="Exhaust Temperature Trends" data={temperatureData} dataKey="exhaust" stroke="#82ca9d" additionalInfo="Last update: a few seconds ago" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomChartCard title="DC Voltage Trends" data={temperatureData} dataKey="DC" stroke="#8884d8" additionalInfo="Last update: a few seconds ago" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TotalRevenue totalRevenue={totalRevenue} revenueByProduct={aggregateSales} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProductSalesDistribution data={aggregateSales.map(item => ({ name: item.product, value: item.totalSales }))} />
              </Grid>
              <Grid item xs={12} md={6}>
                <SalesByPaymentType data={salesByPaymentType} />
              </Grid>
              <Grid item xs={12}>
                <FreeVendEvents freeVendCount={freeVendCount} totalVendCount={totalVendCount} />
              </Grid>
              <Grid item xs={12}>
                <StatusTable data={historicalData} />
              </Grid>
              <Grid item xs={12}>
                <CustomCard title="Average Sale Price" value={`$${averageSalePrice}`} subText="Updated today" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomChartCard title="Sales Comparison" data={salesComparison} dataKey="sales" stroke="#82ca9d" additionalInfo="Comparison with previous periods" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomChartCard title="Temperature vs Sales Correlation" data={temperatureSalesCorrelation} dataKey="sales" stroke="#8884d8" additionalInfo="Correlation analysis" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12}>
                <CustomChartCard title="Frequent Customers" data={frequentCustomers} dataKey="count" stroke="#8884d8" additionalInfo="Frequent customer analysis" sx={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12}>
                <MachineHealth healthData={machineHealth} />
              </Grid>
              <Grid item xs={12}>
                <TemperatureAnomalies anomalies={temperatureAnomalies} />
              </Grid>
              <Grid item xs={12}>
                <VoltageFluctuations fluctuations={voltageFluctuations} />
              </Grid>
            </Grid>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default Dashboard;
