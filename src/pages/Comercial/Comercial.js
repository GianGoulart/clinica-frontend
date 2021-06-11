import React, { useContext, useEffect, useState } from 'react';
import { Box, Container, withStyles } from '@material-ui/core';
import ComercialListResults from '../../components/comercial/ComercialListResults';
import ComercialListToolbar from '../../components/comercial/ComercialListToolbar';
import AppContext from 'src/AppContext';
import Loading from 'src/components/loading/Loading';
import { ComercialService, MedicoService, PacienteService, ProcedimentoService } from 'src/services/Services';
import ModalEditComercial from 'src/components/comercial/ModalEditComercial';
import ModalDeleteComercial from 'src/components/comercial/ModalDeleteComercial';
import moment from "moment";

const Comercial = () => {
    const [loading, setLoading] = useState(false)
    const { state, dispatch } = useContext(AppContext)
    const [openEdit, setOpenEdit] = useState({open:false})
    const [openDelete, setOpenDelete] = useState({open:false})
    const [comercial, setComercial] = useState({})
    
    useEffect(() => {
      (async () => {
        try {
          setLoading(true)
          const comercialList = await ComercialService.getComercial();
          dispatch({
            type: 'SET_COMERCIAL_LIST',
            payload: comercialList.data,
          })              

          const procedimentos = await ProcedimentoService.getProcedimentos();
          dispatch({
            type: 'SET_PROCEDIMENTOS',
            payload: procedimentos.data,
          })              

          const medicos = await MedicoService.getMedicos();
          dispatch({
            type: 'SET_MEDICOS',
            payload: medicos.data,
          })              

        } catch (error) {
          setLoading(false)
          dispatch({
            type: 'SET_SNACKBAR',
            payload: {
                message: 'Erro ao buscar os dados comerciais cadastradas.',
                color: 'error'
            },
          })          
        } finally {
          setLoading(false)
        }
      })();
      },[]);

    const handleCloseModalDelete = () => setOpenDelete(false)
    const handleOpenModalDelete = (id) => setOpenDelete({open:true,id})
    const handleOpenModalEdit = (comercial) =>{
      setComercial(comercial)
      setOpenEdit({open:true})
    }
    const handleCloseModalEdit = () => {
      setComercial({})
        setOpenEdit(false)
    }    

    const handleOnchageEdit = (e) =>{
      setComercial(prevState => ({
            ...prevState,
            [e.target.name]:e.target.name == "data_emissao_nf" || e.target.name == "data_vencimento" ? moment(e.target.value).utc().unix():e.target.value
          }))
    }

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
            <ComercialListToolbar procedimentos={state.procedimentos} medicos={state.medicos}/>
            {loading
            ?(
                <Box sx={{ pt: 3 }}>
                    <Loading />
                </Box>
            ):(
                <Box sx={{ pt: 3 }}>
                  {state.comercial_list.length > 0 
                  ?(<ComercialListResults comercial_list={state.comercial_list} openHandleEdit={handleOpenModalEdit} openHandleDelete={handleOpenModalDelete}/>)
                  :null}
                </Box>
           )}
           <ModalEditComercial open={openEdit.open} onClose={handleCloseModalEdit} onChange={handleOnchageEdit}
             comercial={comercial} procedimentos={state.procedimentos} medicos={state.medicos}/>
           <ModalDeleteComercial open={openDelete.open} onClose={handleCloseModalDelete} id={openDelete.id} />
        </Container>    
      </Box>
    </>
  );
};

export default withStyles()(Comercial);
