import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PageLogin() {
  const navigate = useNavigate();
  const [cognitoConfig, setCognitoConfig] = useState<{
    userPoolId: string;
    clientId: string;
    domain: string;
    region: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  // Check for ID token in URL fragment (from Cognito redirect)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get("id_token");
      if (idToken) {
        localStorage.setItem("cognito_id_token", idToken);
        localStorage.setItem("cognito_access_token", params.get("access_token") || "");
        console.log("ID token stored successfully");
        navigate("/");
        return;
      }
    }

    // Load Cognito configuration from CDK outputs
    // In a real app, this would come from an API or config file
    // For now, we'll provide instructions for manual setup
  }, [navigate]);

  const handleCognitoLogin = async () => {
    // For now, this will guide users to open the Cognito hosted UI
    // In the actual setup, the loginUrl should be provided by CDK outputs
    const loginUrl = `https://product-service-${process.env.AWS_ACCOUNT_ID}.auth.${process.env.AWS_REGION}.amazoncognito.com/login?client_id=${process.env.REACT_APP_COGNITO_CLIENT_ID}&response_type=token&redirect_uri=http://localhost:3000/`;
    
    alert(
      "Please set the COGNITO_LOGIN_URL environment variable to the Cognito Hosted UI login URL\n\n" +
      "You can find this in the ProductServiceStack CDK outputs (CognitoHostedUiUrl)"
    );
  };

  const handleManualLogin = async () => {
    if (!credentials.email || !credentials.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setError(null);
      // This is a placeholder - in a real app, you'd authenticate with Cognito API
      alert(
        "Manual login not implemented yet. Please use the Cognito Hosted UI\n\n" +
        "Click 'Login with Cognito' to proceed"
      );
    } catch (err) {
      setError(`Login failed: ${(err as Error).message}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box py={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Login
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography variant="body2" color="textSecondary" paragraph>
                Login with Cognito to access protected resources:
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCognitoLogin}
                sx={{ mb: 2 }}
              >
                Login with Cognito
              </Button>

              <Typography variant="body2" color="textSecondary" align="center" sx={{ my: 2 }}>
                or
              </Typography>

              {!showManualLogin ? (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setShowManualLogin(true)}
                >
                  Manual Login
                </Button>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                    margin="normal"
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleManualLogin}
                    sx={{ mt: 2 }}
                  >
                    Login
                  </Button>
                </>
              )}
            </Box>

            <Typography variant="body2" color="textSecondary">
              Don't have an account? Sign up on the Cognito hosted UI.
            </Typography>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Setup Instructions:
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>
                Deploy the CDK stack: <code>npm run build && npx aws-cdk deploy</code>
              </li>
              <li>
                Get the Cognito Hosted UI URL from the ProductServiceStack outputs
              </li>
              <li>
                Set the COGNITO_LOGIN_URL environment variable or update the hardcoded URL
              </li>
              <li>
                Click "Login with Cognito" to sign up and log in
              </li>
            </ol>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
