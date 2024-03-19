import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { i18n } from '../../translate/i18n';
import { AuthContext } from '../../context/Auth/AuthContext';
import { system } from '../../config.json';
import logo from '../../assets/logo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundImage: 'linear-gradient(to bottom right, #400fa3, #8c52ff)', // Gradiente de fundo moderno
    padding: theme.spacing(4),
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    maxWidth: 400,
  },
  logo: {
    width: 100,
    height: '120',
    marginBottom: theme.spacing(2),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  copyright: {
    marginTop: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
}));

const Login = () => {
  const classes = useStyles();
  const [user, setUser] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = React.useContext(AuthContext);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  return (
    <Box className={classes.root}>
      <Container className={classes.container} maxWidth="xs">
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src={logo} alt="Logo" className={classes.logo} />
          <Typography component="h1" variant="h5" gutterBottom>
            {i18n.t('login.title')}
          </Typography>
        </Box>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={i18n.t('login.form.email')}
            name="email"
            value={user.email}
            onChange={handleChangeInput}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={i18n.t('login.form.password')}
            id="password"
            value={user.password}
            onChange={handleChangeInput}
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {i18n.t('login.buttons.submit')}
          </Button>
        </form>
        <Box className={classes.copyright}>
          <Typography variant="body2" color="textSecondary" align="center">
            © {new Date().getFullYear()}{' '}
            <Link color="inherit" href={system.url || 'https://wasap.com.br'}>
              {system.name}
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;