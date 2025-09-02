import React, { useEffect, useState } from "react";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import SearchBar from "../SearchBar";
import UserTable from "../UserTable";
import { useUsers } from "../../hooks/useUsers";

const UsersPage: React.FC = () => {
  const { users, loading, error, fetchUsers,totalCount } = useUsers();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [query, setQuery] = useState("");
  


useEffect(() => {
  const t = setTimeout(() => {
    fetchUsers({
      query: query || undefined,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    });
  }, 250);

  return () => clearTimeout(t);
     // eslint-disable-next-line react-hooks/exhaustive-deps
}, [query, pagination]);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Admin Dashboard
        </Typography>
        <SearchBar value={query} onChange={setQuery} />

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress size={100} sx={{ color: "grey.800" }}/>
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          <UserTable
  data={users}
  totalCount={totalCount}
  pagination={pagination}
  onPaginationChange={setPagination}
/>
        )}
      </Box>
    </Container>
  );
};

export default UsersPage;
