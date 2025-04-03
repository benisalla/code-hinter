import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import ConceptInput from 'src/components/ConceptInput';
import CodeInput from 'src/components/CodeInput';
import { evaluate_code, compare_code, createOrUpdateExercise } from 'src/components/api'
import { useState } from 'react';
import { DEFAULT_CONCEPTS, DEFAULT_PR_CODE, DEFAULT_ST_CODE } from 'src/components/defaults';
import { Box, Button, Card, CardContent, Grid, TextField } from '@mui/material';
import { Restricted, ROLES } from 'src/components/Restrected';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'src/components/context/authStore';
import { useEffect } from 'react';
import { getExerciseById } from 'src/components/api';

// ----------------------------------------------------------------------

export default function Page() {

  // const [concepts, setConcepts] = useState(DEFAULT_CONCEPTS);
  // const [pr_code, setPrcode] = useState(DEFAULT_PR_CODE);
  const [concepts, setConcepts] = useState<string>("");
  const [pr_code, setPrcode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [model_type, setModelType] = useState("default");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { Id } = useParams<{ Id: string }>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = user && await createOrUpdateExercise({
        code_prof: pr_code || "",
        concepts: concepts || "",
        id_prof: user.id,
        id: Id ? parseInt(Id) : undefined,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchExercise = async () => {
      if (Id) {
        setLoading(true);
        try {
          const exercise = await getExerciseById(parseInt(Id));
          setConcepts(exercise.concepts || "");
          setPrcode(exercise.code_prof || "");
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExercise();
  }, [Id]);

  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="" />
      </Helmet>
      <Box className="App">
        <Restricted to={ROLES.prof}>
          <Box component="header" className="App-header">
            <h1 className="App-title">Exercise</h1>
          </Box>

          <form onSubmit={handleSubmit}>


            <Grid container spacing={2}>
              <Grid item xs={12} >
                <ConceptInput value={concepts} onChange={(e) => setConcepts(e.target.value)} />
              </Grid>


              <Grid item xs={12} >

                <Card sx={{
                  minHeight: '400px',
                  border: '1px dashed',
                  borderColor: 'primary'
                }}>
                  <CardContent>
                    <CodeInput value={pr_code} onChange={setPrcode} />
                  </CardContent>
                </Card>

              </Grid>


              <Grid item xs={12} className="form-action-row">
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading} sx={{ mr: 2 }}>
                  Save Exercise
                </Button>
              </Grid>
            </Grid>

          </form>
        </Restricted>
      </Box>
    </>
  );
}
