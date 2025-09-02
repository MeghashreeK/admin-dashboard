// src/components/UserTable.tsx
import React, { useMemo } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import type { User } from "../types";
import { Box, Chip, Switch, Typography } from "@mui/material";
import { useUsers } from "../hooks/useUsers";

type Pagination = { pageIndex: number; pageSize: number };

type Props = {
  data: User[];
  totalCount: number;
  pagination: Pagination;
  // match setPagination from UsersPage: React.Dispatch<SetStateAction<Pagination>>
  onPaginationChange: React.Dispatch<React.SetStateAction<Pagination>>;
};

const columnsMetadata = [
  { key: "name", header: "Name", type: "string", pinned: "left", width: 220, sorting: true },
  { key: "email", header: "Email", type: "string", width: 260, sorting: true },
  { key: "status", header: "Status", type: "badge", width: 120 },
  { key: "createdAt", header: "Joined", type: "date", format: "YYYY-MM-DD", width: 140 },
  { key: "groups", header: "Groups", type: "chiplist", width: 280 },
] as const;

const UserTable: React.FC<Props> = ({ data, totalCount, pagination, onPaginationChange }) => {
  const { toggleStatus } = useUsers();

  const columns = useMemo<MRT_ColumnDef<User>[]>(() => {
    return columnsMetadata.map((col) => {
      if (col.key === "groups") {
        return {
          accessorKey: "groups",
          header: col.header,
          size: col.width,
          enableSorting: false,
          Cell: ({ cell }) => {
            const groups = cell.getValue() as User["groups"];
            return (
              <Box display="flex" gap={1} flexWrap="wrap">
                {groups?.map((g) => (
                  <Chip key={g.id} label={g.name} size="small" />
                )) ?? null}
              </Box>
            );
          },
        } as MRT_ColumnDef<User>;
      }

      if (col.key === "status") {
        return {
          accessorKey: "status",
          header: col.header,
          size: col.width,
          Cell: ({ row }) => {
            const user = row.original as User;
            return (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body2">{user.status}</Typography>
                <Switch
                  checked={user.status === "active"}
                  onChange={() => toggleStatus(user.id)}
                  inputProps={{
                    "aria-label": `${user.status === "active" ? "Deactivate" : "Activate"} user ${user.name}`,
                  }}
                />
              </Box>
            );
          },
        } as MRT_ColumnDef<User>;
      }

      if (col.key === "createdAt") {
        return {
          accessorKey: "createdAt",
          header: col.header,
          size: col.width,
          Cell: ({ cell }) => {
            const v = cell.getValue() as string | undefined;
            return <span>{v ? new Date(v).toISOString().slice(0, 10) : "-"}</span>;
          },
        } as MRT_ColumnDef<User>;
      }

      return {
        accessorKey: col.key as keyof User,
        header: col.header,
        size: col.width,
      } as MRT_ColumnDef<User>;
    });
    // note: toggleStatus comes from context and should be stable; if not, add it to deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      manualPagination
      rowCount={totalCount}
      state={{ pagination }}
      onPaginationChange={onPaginationChange}
      enableSorting
      enablePagination
      enableColumnOrdering={false}
      initialState={{ density: "comfortable" }}
      muiTablePaperProps={{ elevation: 0 }}
    />
  );
};

export default UserTable;
