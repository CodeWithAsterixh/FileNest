// components/FileGrid.tsx
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface File {
  name: string;
  type: string;
  size: string;
}

const FileGrid = ({ files }: { files: File[] }) => {
  return (
    <div className="w-full flex items-start justify-start gap-2 flex-wrap p-2">
      {files.map((file, index) => (
        <Card
          key={index}
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
          }}
          className="!basis-[200px] !flex-grow !max-w-[300px]"
        >
          <CardMedia
            component="img"
            image={`/icons/${file.type.toLowerCase()}.png`} // Replace with actual icons or placeholders
            alt={`${file.type} file`}
            sx={{ width: 64, height: 64, marginBottom: 1 }}
          />
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" noWrap>
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {file.type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {file.size}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FileGrid;
