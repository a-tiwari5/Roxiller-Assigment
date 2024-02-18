import { useEffect, useState } from "react";
import "./App.css";
import DataTable from "./components/DataTable";
import {
  fetchTransactionBarStats,
  fetchTransactionData,
  fetchTransactionStats,
} from "./apis/dashboardAps";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import BarChart from "./components/BarChart";

const months = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const UserData = [
  {
    id: 1,
    range: "100-200",
    count: 2,
  },
  {
    id: 2,
    range: "200-300",
    count: 10,
  },
  {
    id: 3,
    range: "300-400",
    count: 6,
  },
  {
    id: 4,
    range: "400-500",
    count: 10,
  },
  {
    id: 5,
    range: "600-700",
    count: 30,
  },
];

function App() {
  const [transactionData, setTransactionData] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [month, setMonth] = useState("3");
  const [statsData, setStatsData] = useState({
    totalSale: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total items",
        data: [],
      },
    ],
  });

  const handleChange = (event) => {
    setMonth(event.target.value);
  };
  useEffect(() => {
    setTransactionData((prev) => ({ ...prev, isLoading: true }));
    fetchTransactionData(transactionData.page, transactionData.pageSize).then(
      (res) => {
        setTransactionData((prev) => ({
          ...prev,
          isLoading: false,
          data: res.data.transactions,
          total: 60,
        }));
      }
    );
  }, [transactionData.page, transactionData.pageSize]);

  useEffect(() => {
    fetchTransactionStats(month).then(({ data }) => {
      console.log(data);
      setStatsData({
        totalNotSoldItems: data.data.totalUnsoldItems,
        totalSale: data.data.totalPriceSold,
        totalSoldItems: data.data.totalSoldItems,
      });
    });
    fetchTransactionBarStats(month).then(({ data }) => {
      console.log(data);
      setUserData({
        labels: data.data.map((data, index) => data.range),
        datasets: [
          {
            label: "Total items",
            data: data.data.map((data, index) => data.count),
          },
        ],
      });
    });
  }, [month]);

  return (
    <div className="container">
      <div className="logo">
        <h1 className="title">Transaction Dashboard</h1>
      </div>
      <DataTable
        transactionData={transactionData}
        setTransactionData={setTransactionData}
      />
      <div className="stats-container">
        <h1>Statistics</h1>
        <Box sx={{ minWidth: 100, maxWidth: 200, my: "20px" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={month}
              label="Month"
              onChange={handleChange}
            >
              {months.map((month, index) => {
                return (
                  <MenuItem key={index} value={index + 1}>
                    {month}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <div className="stats">
          <span>
            Total Sale &#8377;
            {statsData.totalSale}
          </span>
          <span>Total Sold Item {statsData.totalSoldItems}</span>
          <span>Total not sold item {statsData.totalNotSoldItems}</span>
        </div>
      </div>
      <BarChart chartData={userData} />
    </div>
  );
}

export default App;
