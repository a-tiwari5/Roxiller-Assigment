import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const columns = [
  { field: "_id", headerName: "ID", width: 90 },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
  },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    width: 110,
  },
  {
    field: "category",
    headerName: "Category",
    width: 160,
  },
  {
    field: "sold",
    headerName: "Sold",
  },
  {
    field: "image",
    headerName: "Image",
    flex: 1,
  },
];

export default function DataTable({ transactionData, setTransactionData }) {
  return (
    <Box sx={{ width: "80%", height: "100%" }}>
      <DataGrid
        rows={transactionData.data}
        columns={columns}
        loading={transactionData.isLoading}
        getRowId={(row) => row._id}
        hideFooterPagination
      />
      <div className="pagination">
        <h3>Page No : {transactionData.page}</h3>
        <div className="control">
          <Button
            variant="contained"
            disabled={transactionData.page <= 1 ? true : false}
            onClick={() =>
              setTransactionData((prev) => {
                if (prev.page <= 1) {
                  return {
                    ...prev,
                  };
                } else {
                  return {
                    ...prev,
                    page: prev.page - 1,
                  };
                }
              })
            }
          >
            Prev
          </Button>
          <Button
            variant="contained"
            disabled={
              transactionData.total / transactionData.pageSize ===
              transactionData.page
                ? true
                : false
            }
            onClick={() =>
              setTransactionData((prev) => {
                if (prev.page >= prev.total / prev.pageSize) {
                  return {
                    ...prev,
                  };
                } else {
                  return {
                    ...prev,
                    page: prev.page + 1,
                  };
                }
              })
            }
          >
            Next
          </Button>
        </div>
        <h3>Per Page:{transactionData.pageSize}</h3>
      </div>
    </Box>
  );
}
