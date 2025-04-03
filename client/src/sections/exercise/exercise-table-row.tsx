import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
import { useNavigate, useLocation } from 'react-router-dom';
import { deleteProfExe } from 'src/components/api/api';

// ----------------------------------------------------------------------

export type ExerciseProps = {
  id: number;
  code_prof: string;
  concepts: string;
  id_prof: number;
};

type ExerciseTableRowProps = {
  row: ExerciseProps;
  selected: boolean;
  onSelectRow: () => void;
  forTeacher?: boolean;
};

export function ExerciseTableRow({
  row,
  selected,
  onSelectRow,
  forTeacher = true,
}: ExerciseTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = useCallback(async () => {
    handleClosePopover();
    await deleteProfExe(row.id);
    navigate(location.pathname, { replace: true, state: { refresh: Date.now() } });
  }, [handleClosePopover, row.id, navigate, location.pathname]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>  
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box 
            gap={2} 
            display="flex" 
            alignItems="center"
            sx={{
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {row.code_prof}
          </Box>
        </TableCell>

        <TableCell>
          <Box
            sx={{
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {row.concepts}
          </Box>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          {!forTeacher ? (
            <MenuItem onClick={()=>{
              handleClosePopover();
              navigate(`/solve-exercise/${row.id}`);
            }}>
              <Iconify icon="eva:person-fill" />
              Solve
            </MenuItem>
          ) : (
            <>
              <MenuItem onClick={() => { navigate(`/submitions/${row.id}`); handleClosePopover() }}>
                <Iconify icon="solar:file-text-bold" />
                Submitions
              </MenuItem>

              <MenuItem onClick={() => { navigate(`/new-exercise/${row.id}`); handleClosePopover() }}>
                <Iconify icon="solar:pen-bold" />
                Edit
              </MenuItem>

              <MenuItem onClick={async () => { handleDelete() }} sx={{ color: 'error.main' }}>
                <Iconify icon="solar:trash-bin-trash-bold" />
                Delete
              </MenuItem>
            </>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
