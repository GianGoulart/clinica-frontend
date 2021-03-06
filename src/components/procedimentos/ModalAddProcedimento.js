import React, { useState, useContext, useEffect } from "react";
import {
    withStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Button,
    TextField,
    Select,
    Input as InputSelect,
    Grid,
    Paper,
    InputLabel,
    Box,
    makeStyles,
    FormControl,
    FormHelperText
} from "@material-ui/core";
import { ProcedimentoService } from '../../services/Services'
import AppContext from '../../AppContext';
import ModalAddProcedimentoStyle from "./ModalAddProcedimentoStyle"
import MaskedInput from "react-input-mask";
import { useForm } from "react-hook-form";
import moment from "moment";
import Snackbar from "../snackbar/Snackbar";
import CurrencyInput from "../CurrencyInput/CurrencyInput";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      textAlign: 'center',
      color: theme.palette.text.secondary,
      justifyContent: 'flex-end'
  
    },
    field: {
      padding: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
}));

const status = [
    {value: 1, label: "A Agendar"},
    {value: 2, label:"Agendado"},
    {value: 3, label: "Realizado"},
    {value: 4, label: "Cancelado"},
]

const procedimentos = [
	{value: 1, label : "CONSULTA"},
	{value: 2, label : "EXAMES"},
	{value: 3, label : "CIRURGIA"},
	{value: 4, label : "RETORNO"},
	{value: 5, label : "ESCLERO"},
	{value: 6, label : "CURATIVO"},
	{value: 7, label : "COMBOS"},
	{value: 8, label : "VENDAS DE PRODUTOS"},
	{value: 9, label : "TAXAS E LOCAÇÃO"},
]

const locais = [
	{value:1, label: "Clinica Abrão"},
	{value:2, label: "Albert Einstein"},
	{value:3, label: "Lefort Liberdade"},
	{value:4, label: "Lefort Morumbi"},
	{value:5, label: "São Luiz Jabaquara"},
	{value:6, label: "São Luiz Morumbi"},
	{value:7, label: "São Luiz Itaim"},
	{value:8, label: "Vila Nova Star"},
]

const esteira = [
	{value: 1, label: "Convenio"},
	{value: 2, label: "Particular"},
	{value: 3, label: "Convenio + Extra"},
]

const Input = props => {
    const { name, label, placeholder, inputRef, value, maskChar, ...inputProps } = props;
    return  <TextField
                {...inputProps}
                ref={inputRef}
                label={label===undefined?"Valor":label}
                id={name}
                name={name}
                value={value}
                placeholder={placeholder}
                type="text"
                fullWidth
            /> 
  
};

const ModalAddProcedimento = ({ open, onClose,  pacientes, medicos, procedimentoProps}) => {
    const {  handleSubmit } = useForm();
    const [loading, setLoading] = useState(false)
    const { state, dispatch } = useContext(AppContext)
    const [procedimento, setProcedimento] = useState(procedimentoProps)


    const classes = useStyles()

    const handleOnchage = (e) =>{
        setProcedimento(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();     
        try {

            if (parseInt(procedimento.status) == 1 || parseInt(procedimento.status) == 2 && moment(procedimento.data).utc().unix() < moment().utc().unix()) {
                dispatch({
                    type: 'SET_SNACKBAR',
                    payload: {
                        message: 'ERRO: Status Agendar/Agendado com uma data Anterior.',
                        color: 'red',
                    },
                })
    
                return
            } 

            if (parseInt(procedimento.status) == 3 && moment(procedimento.data).utc().unix() > moment().utc().unix()) {
                dispatch({
                    type: 'SET_SNACKBAR',
                    payload: {
                        message: 'ERRO: Status Realizado com uma data Futura.',
                        color: 'red',
                    },
                })
    
                return
            } 

            setLoading(true)
            procedimento.data = moment(procedimento.data).utc().unix()
            procedimento.procedimento = parseInt(procedimento.procedimento)
            procedimento.esteira = parseInt(procedimento.esteira)
            procedimento.status = parseInt(procedimento.status)
            procedimento.local_procedimento = parseInt(procedimento.local_procedimento)

            var cur_re = /\D*(\d+|\d.*?\d)(?:\D+(\d{2}))?\D*$/;
            var parts = cur_re.exec(procedimento.valor);
            procedimento.valor = parseFloat(parts[1].replace(/\D/,'')+'.'+(parts[2]?parts[2]:'00'));

            const response = await ProcedimentoService.saveProcedimento(procedimento)
            dispatch({
                type: 'SET_SNACKBAR',
                payload: {
                    message: 'Procedimento cadastrado com sucesso.',
                    color: 'green'
                },
            })
        } catch (error) {
            console.error(error)
            dispatch({
                type: 'SET_SNACKBAR',
                payload: {
                    message: 'Erro ao cadastrar procedimento, tente novamente.',
                    color: 'red'
                },
            })
        } finally {
            setProcedimento({})
            const response = await ProcedimentoService.getProcedimentos()
            dispatch({
                type: 'SET_PROCEDIMENTOS',
                payload: response.data,
            })              
            setLoading(false)
            onClose()
        }
        
    };
    
    return (
        <>
        <Snackbar
            color={state.snackBar.color}
            message={state.snackBar.message}
        />

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >  
            <DialogTitle className={classes.dialogTitle}>Cadastrar Procedimento</DialogTitle>               
              <form className={classes.form} noValidate onSubmit={(e)=>handleSubmit(onSubmit(e))}>
                    <DialogContent className={classes.dialogContent}>
                        <Grid item xs={12}>
                            <Paper >
                                <Box
                                className={classes.field}
                                sx={{
                                    display: 'flex',
                                }}
                                >
                                    <Grid item xs={4} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <InputLabel htmlFor="outlined-age-native-simple">Selecione o Paciente</InputLabel>
                                            <Select
                                                onChange={e => handleOnchage(e)}                                
                                                native
                                                value={procedimento.id_paciente}
                                                label="Selecione o Paciente"
                                                name="id_paciente"
                                            >
                                                <option aria-label="Selecione" value=""> </option> 
                                                {pacientes.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.nome}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>
                                    </Grid> 
                                    <Grid item xs={4} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <InputLabel htmlFor="outlined-age-native-simple">Médico</InputLabel>
                                            <Select
                                                onChange={e => handleOnchage(e)}                                
                                                native
                                                value={procedimento.id_medico}
                                                label="Paciente"
                                                name="id_medico"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {medicos.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.nome}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>
                                    </Grid> 
                                    <Grid item xs={4} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <InputLabel htmlFor="outlined-age-native-simple">Procedimento</InputLabel>
                                            <Select
                                                onChange={e => handleOnchage(e)}                                
                                                native
                                                value={procedimento.procedimento}
                                                name="procedimento"
                                                label="Procedimento"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {procedimentos.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>
                                    </Grid> 
                                                             
                                </Box>
                                <Box
                                className={classes.field}
                                sx={{
                                    display: 'flex',
                                }}
                                >                                   
                                    <Grid item xs={4}  className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <InputLabel htmlFor="outlined-age-native-simple">Local</InputLabel>
                                            <Select
                                                onChange={e => handleOnchage(e)}                                
                                                native
                                                name="local_procedimento"
                                                value={procedimento.local_procedimento}
                                                label="Local"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {locais.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>
                                    </Grid>  
                                    <Grid item xs={8} className={classes.field}>
                                        <MaskedInput
                                            onChange={e => handleOnchage(e)}                                
                                            value={procedimento.desc_procedimento}
                                            name="desc_procedimento"
                                            mask=""
                                            alwaysShowMask
                                            maskChar={null}
                                        >   
                                            <Input label={"Descrição Procedimento"} placeholder={'Observação Procedimento'}/>
                                        </MaskedInput>
                                    </Grid> 
                                </Box>
                                <Box
                                className={classes.field}
                                sx={{
                                    display: 'flex',
                                }}
                                >
                                    <Grid item xs={2} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <FormHelperText id="my-helper-text">Valor</FormHelperText>
                                            <CurrencyInput placeholder="R$0,00" onChange={(e)=>handleOnchage(e)} type="text" name={"valor"} value={procedimento.valor}/>
                                        </FormControl>
                                        <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>
                                    </Grid>                            
                                    <Grid item xs={2} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <FormHelperText id="my-helper-text">Data </FormHelperText>
                                            <TextField
                                                onChange={e => handleOnchage(e)}                                
                                                fullWidth
                                                id="date"
                                                name="data"
                                                type="date"
                                                className={classes.textField}
                                                    InputLabelProps={{
                                                shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>                                 
                                    <Grid item xs={3}  className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <FormHelperText id="my-helper-text">Esteira</FormHelperText>
                                            <Select
                                                onChange={e => handleOnchage(e)}                                
                                                native
                                                value={procedimento.esteira}
                                                label="Esteira"
                                                name="esteira"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {esteira.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                            <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>
                                        </FormControl>
                                    </Grid>  
                                    <Grid item xs={3}  className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <FormHelperText id="my-helper-text">Status</FormHelperText>
                                            <Select
                                                onChange={e => handleOnchage(e)}                                
                                                native
                                                value={procedimento.status}
                                                label="Status"
                                                name="status"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {status.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                            <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>
                                        </FormControl>
                                    </Grid>       
                                </Box>
                            </Paper>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            className={classes.buttonSubmit}
                            onClick={onSubmit}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress color='secondary' size={25} /> : 'Cadastrar'}
                        </Button>
                    </DialogActions>
                </form>
        </Dialog>
        </>
    );
};

export default withStyles(ModalAddProcedimentoStyle)(ModalAddProcedimento);