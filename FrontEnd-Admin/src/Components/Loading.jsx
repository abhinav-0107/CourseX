import { CircularProgress , Box} from '@mui/material';

export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: "flex",  justifyContent : "center" }} style={{marginTop : 350}}>
      <CircularProgress />
    </Box>
  );
}