import { TimestreamQueryClient, QueryCommand } from "@aws-sdk/client-timestream-query";

const client = new TimestreamQueryClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});


const historicalDataQuery = `
  SELECT * FROM "everest"."machineStatus"
  WHERE time > ago(30d)
  ORDER BY time DESC
`;

// Query to fetch anomalies in temperature
const temperatureAnomaliesQuery = `
  SELECT * FROM "everest"."machineStatus"
  WHERE measure_name IN ('ambient', 'exhaust')
  AND "measure_value::double" > 50
  AND time > ago(30d)
  ORDER BY time DESC
`;

// Query to fetch voltage fluctuations
const voltageFluctuationsQuery = `
  SELECT * FROM "everest"."machineStatus"
  WHERE measure_name = 'DC'
  AND ABS("measure_value::double" - LAG("measure_value::double") OVER (ORDER BY time)) > 5
  AND time > ago(30d)
  ORDER BY time DESC
`;

// Query to fetch machine status data
const machineStatusQuery = `
  SELECT * FROM "everest"."machineStatus"
  WHERE time > ago(1d)
  ORDER BY time DESC
  LIMIT 100
`;

// Query to fetch aggregate sales data
const aggregateSalesQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales, product
  FROM "everest"."vendEvents"
  WHERE time > ago(1d)
  AND measure_name = 'price'
  GROUP BY product
`;

// Query to fetch sales by payment type
const salesByPaymentTypeQuery = `
  SELECT paymentType, COUNT(*) AS count
  FROM "everest"."vendEvents"
  WHERE time > ago(1d)
  GROUP BY paymentType
`;

// Query to fetch free vend events
const freeVendQuery = `
  SELECT * FROM "everest"."vendEvents"
  WHERE measure_name = 'freeVend'
  ORDER BY time DESC
  LIMIT 100
`;

// Query to fetch total vends
const totalVendsQuery = `
  SELECT COUNT(*) AS totalVends
  FROM "everest"."vendEvents"
  WHERE time > ago(1d)
`;

// Query to fetch average sale price
const averageSalePriceQuery = `
  SELECT AVG("measure_value::bigint") AS averagePrice
  FROM "everest"."vendEvents"
  WHERE measure_name = 'price'
  AND time > ago(1d)
`;

// Query to fetch sales comparison by time period
const salesComparisonQuery = `
  SELECT date_bin('1d', time, '1970-01-01') AS period, SUM("measure_value::bigint") AS sales
  FROM "everest"."vendEvents"
  WHERE measure_name = 'price'
  GROUP BY period
  ORDER BY period DESC
  LIMIT 30
`;

// Query to fetch temperature vs sales correlation
const temperatureSalesCorrelationQuery = `
  SELECT AVG(t1."measure_value::double") AS temperature, SUM(t2."measure_value::bigint") AS sales
  FROM "everest"."machineStatus" AS t1
  JOIN "everest"."vendEvents" AS t2
  ON t1.time = t2.time
  WHERE t1.measure_name IN ('ambient', 'exhaust')
  AND t2.measure_name = 'price'
  AND t1.time > ago(1d)
  GROUP BY t1.measure_name
`;

// Query to fetch frequent customers
const frequentCustomersQuery = `
  SELECT customer, COUNT(*) AS count
  FROM "everest"."vendEvents"
  WHERE time > ago(1d)
  GROUP BY customer
  ORDER BY count DESC
  LIMIT 10
`;

export const runQuery = async (query) => {
  const params = {
    QueryString: query,
  };

  try {
    const command = new QueryCommand(params);
    const data = await client.send(command);
    console.log(data);
    return data;
  } catch (err) {
    console.error("Error querying Timestream:", err);
  }
};

export const getMachineStatusData = () => runQuery(machineStatusQuery);
export const getAggregateSalesData = () => runQuery(aggregateSalesQuery);
export const getSalesByPaymentTypeData = () => runQuery(salesByPaymentTypeQuery);
export const getFreeVendData = () => runQuery(freeVendQuery);
export const getTotalVendsData = () => runQuery(totalVendsQuery);
export const getAverageSalePriceData = () => runQuery(averageSalePriceQuery);
export const getSalesComparisonData = () => runQuery(salesComparisonQuery);
export const getTemperatureSalesCorrelationData = () => runQuery(temperatureSalesCorrelationQuery);
export const getFrequentCustomersData = () => runQuery(frequentCustomersQuery);
export const getHistoricalData = () => runQuery(historicalDataQuery);
export const getTemperatureAnomalies = () => runQuery(temperatureAnomaliesQuery);
export const getVoltageFluctuations = () => runQuery(voltageFluctuationsQuery);