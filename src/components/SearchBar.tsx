import React from "react";
import { TextField, Box } from "@mui/material";


type Props = {
value: string;
onChange: (v: string) => void;
};


const SearchBar: React.FC<Props> = ({ value, onChange }) => {
return (
<Box mb={2} display="flex" justifyContent="flex-start">
<TextField
label="Search by name"
value={value}
onChange={(e) => onChange(e.target.value)}
variant="outlined"
size="small"
inputProps={{ "aria-label": "search by name" }}
/>
</Box>
);
};


export default SearchBar;