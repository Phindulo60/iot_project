import { TimestreamQueryClient, QueryCommand } from "@aws-sdk/client-timestream-query";

const client = new TimestreamQueryClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});


// Query to fetch all vend events
const vendEventsQuery = `
  SELECT time, product, paymentType, measure_value::bigint AS price
  FROM "everest"."vendEvents"
  WHERE measure_name = 'price'
  ORDER BY time DESC
  LIMIT 100
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


const revenueLastHourQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time > ago(1h)
  AND measure_name = 'price'
`;

const revenueLastDayQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time > ago(1d)
  AND measure_name = 'price'
`;

const revenueLastMonthQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time > ago(30d)
  AND measure_name = 'price'
`;

const revenueLastTwoMonthsQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time > ago(60d)
  AND measure_name = 'price'
`;

const revenueLastThreeMonthsQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time > ago(90d)
  AND measure_name = 'price'
`;

const revenueLastSixMonthsQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time > ago(180d)
  AND measure_name = 'price'
`;

// Query to fetch revenue for a specific date
const revenueByDateQuery = (date) => `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE measure_name = 'price'
  AND time >= '${date}T00:00:00Z'
  AND time <= '${date}T23:59:59Z'
`;

const previousRevenueLastHourQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time BETWEEN ago(2h) AND ago(1h)
  AND measure_name = 'price'
`;

const previousRevenueLastDayQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time BETWEEN ago(2d) AND ago(1d)
  AND measure_name = 'price'
`;

const previousRevenueLastMonthQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time BETWEEN ago(60d) AND ago(30d)
  AND measure_name = 'price'
`;

const previousRevenueLastTwoMonthsQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time BETWEEN ago(120d) AND ago(60d)
  AND measure_name = 'price'
`;

const previousRevenueLastThreeMonthsQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time BETWEEN ago(180d) AND ago(90d)
  AND measure_name = 'price'
`;

const previousRevenueLastSixMonthsQuery = `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time BETWEEN ago(360d) AND ago(180d)
  AND measure_name = 'price'
`;

// Query templates to fetch revenue for specific products over specified periods
const productRevenueQuery = (product, period) => `
  SELECT SUM("measure_value::bigint") AS totalSales
  FROM "everest"."vendEvents"
  WHERE time > ago(${period})
  AND measure_name = 'price'
  AND product = '${product}'
`;

const productSalesQuery = (product, period) => `
SELECT COUNT(*) AS totalSales
FROM "everest"."vendEvents"
WHERE time > ago(${period})
AND product = '${product}'
`;

const paymentTypeSalesQuery = (paymentType, period) => `
  SELECT COUNT(*) AS totalSales
  FROM "everest"."vendEvents"
  WHERE time > ago(${period})
  AND paymentType = '${paymentType}'
`;

const getProductRevenue = async (product, period) => {
  const query = productRevenueQuery(product, period);
  return runQuery(query);
};
const getProductSales = async (product, period) => {
  const query = productSalesQuery(product, period);
  return runQuery(query);
};

const getPaymentTypeSales = async (paymentType, period) => {
  const query = paymentTypeSalesQuery(paymentType, period);
  return runQuery(query);
};

export const runQuery = async (query) => {
  const params = {
    QueryString: query,
  };

  try {
    const command = new QueryCommand(params);
    const data = await client.send(command);
    // console.log(data);
    return data;
  } catch (err) {
    console.error("Error querying Timestream:", err);
  }
};

export const getMachineStatusData = () => runQuery(machineStatusQuery);
export const getVendEventsData = () => runQuery(vendEventsQuery);
export const getAggregateSalesData = () => runQuery(aggregateSalesQuery);
export const getSalesByPaymentTypeData = () => runQuery(salesByPaymentTypeQuery);
export const getFreeVendData = () => runQuery(freeVendQuery);
export const getTotalVendsData = () => runQuery(totalVendsQuery);
export const getAverageSalePriceData = () => runQuery(averageSalePriceQuery);
export const getSalesComparisonData = () => runQuery(salesComparisonQuery);
export const getTemperatureSalesCorrelationData = () => runQuery(temperatureSalesCorrelationQuery);
export const getRevenueData = (timePeriodQuery) => runQuery(timePeriodQuery);
export const getRevenueLastHour = () => getRevenueData(revenueLastHourQuery);
export const getRevenueLastDay = () => getRevenueData(revenueLastDayQuery);
export const getRevenueLastMonth = () => getRevenueData(revenueLastMonthQuery);
export const getRevenueLastTwoMonths = () => getRevenueData(revenueLastTwoMonthsQuery);
export const getRevenueLastThreeMonths = () => getRevenueData(revenueLastThreeMonthsQuery);
export const getRevenueLastSixMonths = () => getRevenueData(revenueLastSixMonthsQuery);
export const getRevenueByDate = (date) => runQuery(revenueByDateQuery(date));
export const getPreviousRevenueLastHour = () => getRevenueData(previousRevenueLastHourQuery);
export const getPreviousRevenueLastDay = () => getRevenueData(previousRevenueLastDayQuery);
export const getPreviousRevenueLastMonth = () => getRevenueData(previousRevenueLastMonthQuery);
export const getPreviousRevenueLastTwoMonths = () => getRevenueData(previousRevenueLastTwoMonthsQuery);
export const getPreviousRevenueLastThreeMonths = () => getRevenueData(previousRevenueLastThreeMonthsQuery);
export const getPreviousRevenueLastSixMonths = () => getRevenueData(previousRevenueLastSixMonthsQuery);
export const getRevenueLastDayForProduct = (product) => getProductRevenue(product, '1d');
export const getRevenueLastWeekForProduct = (product) => getProductRevenue(product, '7d');
export const getRevenueLastThreeMonthsForProduct = (product) => getProductRevenue(product, '90d');
export const getSalesLastDayForProduct = (product) => getProductSales(product, '1d');
export const getSalesLastWeekForProduct = (product) => getProductSales(product, '7d');
export const getSalesLastThreeMonthsForProduct = (product) => getProductSales(product, '90d');
export const getCashSalesLastDay = () => getPaymentTypeSales('CASH', '1d');
export const getCashSalesLastWeek = () => getPaymentTypeSales('CASH', '7d');
export const getCashSalesLastThreeMonths = () => getPaymentTypeSales('CASH', '90d');
export const getCCSalesLastDay = () => getPaymentTypeSales('CC', '1d');
export const getCCSalesLastWeek = () => getPaymentTypeSales('CC', '7d');
export const getCCSalesLastThreeMonths = () => getPaymentTypeSales('CC', '90d');