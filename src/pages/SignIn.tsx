import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Divider, Toolbar } from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContext, AuthenticationContextType } from '../context/authenticationContext';
import Footer from '../components/Footer';
import GoogleIcon from '@mui/icons-material/Google';
import { useTranslation } from 'react-i18next';
import { Modal } from '../components/Modal';


export default function SignIn() {

  const { t } = useTranslation(['sign_in', 'survey_instructions']);

  const navigate = useNavigate();

  const { signed, signInEmailPassword, signInGoogle } = React.useContext(AuthenticationContext) as AuthenticationContextType;

  const queryParams = new URLSearchParams(window.location.search);
  const redirect = queryParams.get('redirect');


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email')?.toString();
    if (!email) return alert('Email is required');

    const password = data.get('password')?.toString();
    if (!password) return alert('Password is required');

    const success = await signInEmailPassword(email, password);
    if (!success) {
      alert('Error signing in');
    }

    navigate((!redirect) ? '/dashboard' : redirect);

  };

  React.useEffect(() => {
    if (signed) navigate((!redirect) ? '/dashboard' : redirect);
  }, [signed, navigate, redirect]);

  const SurveyInstructionsModal = () => {
    const [modalState, setModalState] = React.useState(true);

    return (
      <Modal.Root state={modalState} handleClose={() => setModalState(false)} title={t('survey_instructions:title')} id="survey-instructions-modal">
        <Modal.Text>
          {t('survey_instructions:paragraph1')}
        </Modal.Text>
        <Modal.Text>
          {t('survey_instructions:paragraph2')}<Link href={`sign-up?${queryParams}`}>{t('survey_instructions:here')}</Link>{t('survey_instructions:create_account')}
        </Modal.Text>
        <Divider />
        <Modal.Actions handleClose={() => setModalState(false)} />
      </Modal.Root>
    );
  }

  return (
    <>
      {redirect && <SurveyInstructionsModal />}
      <Navbar />
      <Toolbar />
      <Container component="main" maxWidth="xs" style={{ marginBottom: '1rem', height: '75vh' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t('title')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('email_field')}
              name="email"
              autoComplete="email"
              type='email'
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('password_field')}
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('sign_in_button')}
            </Button>
            <Button fullWidth variant="outlined" sx={{ mb: 2 }} onClick={signInGoogle}>
              <GoogleIcon sx={{ mr: 1 }} />
              {t('google_button')}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={`sign-up?${queryParams}`} variant="body2">
                  {t('sign_up_link')}
                </Link>
              </Grid>
            </Grid>

          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}