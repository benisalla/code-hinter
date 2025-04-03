import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Box, Collapse, Typography, Button } from '@mui/material';
import CodeInput from 'src/components/CodeInput';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getSubmittedStudentsByExercise, StudentSubmission } from 'src/components/api';
import { useNavigate, useParams } from 'react-router-dom';


const SubmissionsPage: React.FC = () => {
   const [openIndex, setOpenIndex] = React.useState<number|null>(null);
   const { Id } = useParams<{ Id: string }>();

   const navigate = useNavigate();
  
   if (!Id) {
      navigate('/');
   }
  

   const [submissions, setSubmissions] = React.useState<StudentSubmission[]>([]);

   React.useEffect(() => {
      const fetchSubmissions = async () => {
         try {
            const response = await getSubmittedStudentsByExercise(parseInt(Id ?? '0', 10) as number);
            setSubmissions(response);
         } catch (error) {
            console.error('Error fetching submissions:', error);
         }
      };

      fetchSubmissions();
   }, []);

   return (
      <TableContainer component={Paper}>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell >Student Name</TableCell>
                  <TableCell >Student Code</TableCell>
                  <TableCell>Score</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {submissions.map((submission, index) => (
                 <React.Fragment key={index}>
                  <TableRow>
                    <TableCell width={'20%'} sx={{
                     fontWeight: 'bold',
                     fontSize: '1rem'
                    }}>
                     <strong> {submission.stud_name}</strong>
                   </TableCell>
                    <TableCell width={'60%'}>
                     <Box sx={{
                        display: 'flex',
                        alignItems: 'center',

                     }}>
                         <Button
                           aria-label="expand row"
                           size="small"
                           onClick={() => setOpenIndex(openIndex === index ? null : index)}
                           sx={{
                              my: 1,
                           }}
                        >
                           {openIndex === index ? <> 
                              <KeyboardArrowUpIcon />
                              Hide Code
                              </> : <>
                              <KeyboardArrowDownIcon />
                              View Code
                           </>}

                        </Button>

                        
                     </Box>
                    

                    <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                       
                        <Card sx={{
                              border: '1px dashed',
                              borderColor: 'primary'
                           }}>
                              <CardContent>
                              <CodeInput 
                                 value={submission.code_submitted || ''} 
                                 onChange={() =>{}} 
                                 height={'150px'}
                              />
                              </CardContent>
                           </Card>
                  
                     </Collapse>


                     
                    </TableCell>
                    <TableCell
                     align='left'
                     sx={{
                        // textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}
                    > 
                     Score: <br/>
                     <Box 
                        sx={{
                         display: 'inline-block',
                         padding: '0.5rem',
                         border: '1px solid',
                         borderColor: 'primary.main',
                         borderRadius: '4px',
                         backgroundColor: 'background.paper'
                        }}
                     >
                        <strong>{submission.score}</strong>
                     </Box>
                     
                     </TableCell>
                  </TableRow>
                  {index < submissions.length - 1 && (
                    <TableRow>
                     <TableCell colSpan={3}>
                       <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
                     </TableCell>
                    </TableRow>
                  )}
                 </React.Fragment>
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

export default SubmissionsPage;