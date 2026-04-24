import { Link as RouterLink, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import { useAvailableProduct } from "~/queries/products";
import { formatAsPrice } from "~/utils/utils";
import { HttpError } from "~/utils/http";

export default function PageProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useAvailableProduct(id);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError && error instanceof HttpError && error.status === 404) {
    return (
      <Box py={3}>
        <Typography variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Button component={RouterLink} to="/" variant="outlined">
          Back to catalog
        </Button>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box py={3}>
        <Typography color="error">Could not load product.</Typography>
        <Button component={RouterLink} to="/" sx={{ mt: 2 }}>
          Back to catalog
        </Button>
      </Box>
    );
  }

  return (
    <Box py={3}>
      <Button component={RouterLink} to="/" color="primary" sx={{ mb: 2 }}>
        ← Back to catalog
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        {data.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {data.description}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {formatAsPrice(data.price)}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        In stock: {data.count}
      </Typography>
      <AddProductToCart product={data} />
    </Box>
  );
}
