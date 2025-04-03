import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';


import CodeInput from 'src/components/CodeInput';
import {  submitCode, run_code } from 'src/components/api';
import { useState } from 'react';
import SubmitModal from 'src/components/modals/SubmitModal';
import CheckModal from 'src/components/modals/CheckModal';
import { DEFAULT_ST_CODE } from 'src/components/defaults';
import { Box, Button, Card, CardContent, Grid, TextField } from '@mui/material';
import { Restricted, ROLES } from 'src/components/Restrected';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from 'src/components/context/authStore';

// ----------------------------------------------------------------------

export default function Page() {
  const {user } = useAuth();
  const [st_code, setStudentCode] = useState(DEFAULT_ST_CODE);
  const [check_results, setCheckResults] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckerModalOpen, setCheckerModalOpen] = useState(false);
  const [isRankerModalOpen, setRankerModalOpen] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [model_type, setModelType] = useState('default');
  const navigate = useNavigate();

  const { Id } = useParams();

  const handleRun = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCheckResults('');

    try {
      const response = await run_code({
        code: st_code,
        exercise_id: parseInt(Id ?? '0', 10) as number,
        student_id: user?.id as number,
      });
      
      setCheckResults(response.response);
      setCheckerModalOpen(() => true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setCheckerModalOpen(false); // Close any open modals
    setLoading(true);
    setError('');
    try {
      const response = await submitCode({
        code: st_code,
        exercise_id: parseInt(Id ?? '0', 10) as number,
        student_id: user?.id as number,
      });
      setScore(response.response);
      setRankerModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>
      <Box className="App">
        <Box component="header" className="App-header">
          <h1 className="App-title">Code Hinter</h1>
        </Box>

        <form>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              {/* code editor for the student */}
              <Restricted to={ROLES.student}>
                <Card
                  sx={{
                    minHeight: '400px',
                    border: '1px dashed',
                    borderColor: 'primary',
                  }}
                >
                  <CardContent>
                    <CodeInput value={st_code} onChange={setStudentCode} />
                  </CardContent>
                </Card>
              </Restricted>
            </Grid>

            <Grid item xs={12} className="form-action-row">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ mr: 2 }}
                type="submit"
              >
                Submit
              </Button>
              <Button variant="contained" color="secondary" type='button'  disabled={loading} onClick={handleRun}>
                Run
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      {error && <p className="error-message">Error: {error}</p>}

      <CheckModal
        isOpen={isCheckerModalOpen}
        onRequestClose={() => setCheckerModalOpen(false)}
        response={check_results}
      />

      <SubmitModal
        isOpen={isRankerModalOpen}
        onRequestClose={() => {
          navigate('/');
          setRankerModalOpen(false);
        }}
        score={score}
      />
    </>
  );
}
