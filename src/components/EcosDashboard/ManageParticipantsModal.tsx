import React from 'react'
import { Modal } from '../Modal'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Ecosystem, Participant } from '../../types/Ecosystem.type';
import AddParticipantModal from './AddParticipantModal';
import EcosystemService from '../../services/EcosystemService';

interface ManageParticipantsModalProps {
  setModalState: React.Dispatch<React.SetStateAction<boolean>>,
  modalState: boolean,
  ecos: Ecosystem,
  setEcos: React.Dispatch<React.SetStateAction<Ecosystem>>
}

export default function ManageParticipantsModal({ setModalState, modalState, ecos, setEcos }: ManageParticipantsModalProps) {

  const participants = ecos.participants || [] as Participant[];


  const [addParticipantModalState, setAddParticipantModalState] = React.useState(false);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome',
      width: 300,
      sortable: false,
      resizable: false
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      sortable: false,
      resizable: false
    },
    {
      field: 'editbtn',
      headerName: 'Editar',
      width: 140,
      sortable: false,
      resizable: false,
      renderCell: () => <Button variant="contained" color="warning" startIcon={<EditIcon />}>Editar</Button>
    },
    {
      field: 'deletebtn',
      headerName: 'Deletar',
      width: 140,
      sortable: false,
      resizable: false,
      renderCell: (params: GridRenderCellParams<Participant, string>) => <Button variant="contained" color="error" onClick={()=>deleteParticipant(params.value??'')} startIcon={<DeleteIcon />}>Deletar</Button>,
      valueGetter: (params: GridRenderCellParams<Participant, number>) =>{
        return params.row.id;
      }
    },
  ]

  const handleModalClose = () => {
    setModalState(false);
  };

  const deleteParticipant = (id: string) => {
    if(id === '') return;

    const newParticipants = participants.filter(p => p.id !== id);
    const newEcos = {...ecos, participants: newParticipants};

    EcosystemService.updateEcosystem(newEcos);
    
    setEcos(newEcos);
  }

  return (
    <>
      <Modal.Root state={modalState} handleClose={handleModalClose} title="Gerenciar Participantes" id="manage-users-modal" size='md'>
        <Modal.Text>
          <Button variant="contained" color="primary" sx={{ width: '100%', mb: 2 }} onClick={() => setAddParticipantModalState(true)} startIcon={<AddIcon />}>Adicionar Participante</Button>
          <DataGrid
            rows={participants}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
            disableColumnMenu
            hideFooterPagination
          />

        </Modal.Text>
        <Divider />
        <Modal.Actions handleClose={handleModalClose} />
      </Modal.Root>
      <AddParticipantModal addParticipantModalState={addParticipantModalState} setAddParticipantModalState={setAddParticipantModalState} ecos={ecos} setEcos={setEcos} />
    </>

  )
}