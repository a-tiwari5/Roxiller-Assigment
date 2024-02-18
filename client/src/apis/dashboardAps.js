import axios from "axios";
export const fetchTransactionData = async (page, pageSize) => {
  const res = await axios.get(
    `${
      import.meta.env.VITE_BACKEND_API
    }/transactions/all?page=${page}&pageSize=${pageSize}`
  );
  return res;
};

export const fetchTransactionStats = async (month) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_API}/transactions/stats/${month}`
  );
  return res;
};

export const fetchTransactionBarStats = async (month) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_API}/transactions/bar_stats/${month}`
  );
  return res;
};
