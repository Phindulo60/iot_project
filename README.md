# Vending Machine Dashboard

## Overview
This project is a comprehensive dashboard for managing and monitoring vending machine sales and machine status. It includes features like revenue tracking, sales analysis, and machine health monitoring. The dashboard provides a user-friendly interface with various charts and cards to display key metrics and data points.

## Features
- **Sales Dashboard**: Displays revenue and sales data for different products over various time periods.
- **Machine Status Monitoring**: Shows the current status of the vending machine, including temperature and voltage trends.
- **Product Selection**: Allows users to send free vend messages to the vending machine for specific products.
- **Real-time Data Fetching**: Fetches data from AWS Timestream and displays it in real-time.
- **Loading Indicators**: Displays loading indicators while data is being fetched.

## Technologies Used
- **Frontend**: React, Material-UI
- **Backend**: AWS Timestream, AWS SDK
- **Routing**: React Router
- **Date Management**: Date-fns

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- AWS account with access to Timestream

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Phindulo60/iot_project.git
   cd iot_project

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install

3. Set up environment variables:
Create a .env file in the root directory and add your AWS credentials:
    ```bash
    REACT_APP_AWS_ACCESS_KEY_ID=your_access_key_id
    REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_access_key
    REACT_APP_AWS_REGION=your_aws_region

4. Run the application:
    ```bash
   npm start
   # or
   yarn start


## Components

### CustomCard
A reusable card component that displays an icon, title, value, and subtext. It also supports customization through props like `bgColor`, `sx`, `titleSx`, `iconSx`, `valueSx`, and `subTextSx`.

### CustomChartCard
A reusable chart card component that displays data trends using charts. It supports props like `title`, `data`, `dataKey`, and `stroke`.

### VendEventsTable
A table component that displays vending machine purchase events. It supports sorting and grouping by product and payment type.

### StatusTable
A table component that displays the machine status, including ambient temperature, exhaust temperature, and voltage.

## Pages

### Dashboard
The main dashboard page that includes the `Sidebar`, `MachineHealth`, and different status cards.

### SalesDashboard
The sales dashboard page that displays various metrics related to sales and revenue. It includes loading indicators while data is being fetched.

## Data Fetching
Data fetching is handled using AWS Timestream queries defined in `timestreamClient.js`. The results are processed and displayed in the respective components.

## Customization
You can customize the appearance and behavior of the components by modifying their props and styles. The `CustomCard` component, for example, allows you to customize the background color, title, icon, value, and subtext styles.


