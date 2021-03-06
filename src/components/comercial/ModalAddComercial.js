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
    Grid,
    Paper,
    InputLabel,
    Box,
    makeStyles,
    FormControl,
    FormHelperText} from "@material-ui/core";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import { ComercialService } from '../../services/Services'
import AppContext from '../../AppContext';
import ModalAddComercialStyle from "./ModalAddComercialStyle"
import { useForm } from "react-hook-form";
import moment from "moment";
import unformat from 'accounting-js/lib/unformat.js'

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

const tipoPagto = [
    {value: 1, label: "Reembolso"},
    {value: 2, label: "Extra"},
    {value: 3, label: "Particular"},
]

const formaPagto = [
	{value: 1, label : "Reembolso"},
	{value: 2, label : "Dinheiro"},
	{value: 3, label : "Transferencia"},
	{value: 4, label : "Boleto"},
	{value: 5, label : "Cheque"},
	{value: 6, label : "Débito"},
	{value: 7, label : "Crédito a Vista"},
	{value: 8, label : "Crédito Parcelado"},
]

const funcoes = [
	{value: 1, label: "CP"},
	{value: 2, label: "AN"},
	{value: 3, label: "IN"},
	{value: 4, label: "1AX"},
	{value: 5, label: "2AX"},
]

const Input = props => {
    const { name, label, placeholder, type,inputRef, value, maskChar, ...inputProps } = props;
    return  <TextField
                
                {...inputProps}
                ref={inputRef}
                label={label===undefined?"":label}
                id={name}
                name={name}
                value={value}
                placeholder={placeholder}
                type={type}
                fullWidth

            /> 
  
};

const ModalAddComercial = ({ open, onClose, medicos, procedimentos, planoContas, contas, comercialProps}) => {
    const {  handleSubmit } = useForm();
    const [loading, setLoading] = useState(false)
    const { state, dispatch } = useContext(AppContext)
    const [comercial, setComercial] = useState(comercialProps)
    const [procedimento, setProcedimento] = useState({})

    const classes = useStyles()

        const handleOnchange = (e) =>{
            setComercial(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }))

            if (e.target.name == "id_procedimento"){
                const p = procedimentos
                .filter(procedimento => procedimento.id == e.target.value) // inline
                .map(p => p);

                setProcedimento(p[0])
            }

        }

    const handleOnclose = (e) =>{
        setComercial({})
        setProcedimento({})
        onClose()
    }

    const onSubmit = async (e) => {
        e.preventDefault();     
        try {
            setLoading(true)
            comercial.data_emissao_nf = comercial.data_emissao_nf != "" && comercial.data_emissao_nf != null ? moment(comercial.data_emissao_nf).utc().unix() : 0
            comercial.data_vencimento = comercial.data_vencimento != "" && comercial.data_vencimento != null ? moment(comercial.data_vencimento).utc().unix() : 0

            comercial.funcao_medico_part = parseInt(comercial.funcao_medico_part)
            comercial.tipo_pagamento = parseInt(comercial.tipo_pagamento)
            comercial.forma_pagamento = parseInt(comercial.forma_pagamento)
            comercial.qtd_parcelas = parseInt(comercial.qtd_parcelas)
            
            comercial.data_pagamento = comercial.data_pagamento != "" && comercial.data_pagamento != null ? moment(comercial.data_pagamento).utc().unix() : 0
            comercial.data_compensacao = comercial.data_compensacao != "" && comercial.data_compensacao != null ? moment(comercial.data_compensacao).utc().unix() : 0
            comercial.conta = comercial.conta != null ? parseInt(comercial.conta) : 0
            comercial.plano_contas = comercial.plano_contas != null ? parseInt(comercial.plano_contas) : 0

            comercial.valor_ajuste = unformat(comercial.valor_ajuste,",")
            comercial.valor_parcelas = unformat(comercial.valor_parcelas,",")

            const response = await ComercialService.saveComercial(comercial)
            dispatch({
                type: 'SET_SNACKBAR',
                payload: {
                message: 'Cadastrado com sucesso.'
                },
            })
        } catch (error) {
            console.error(error)
            dispatch({
                type: 'SET_SNACKBAR',
                payload: {
                message: 'Erro ao cadastrar, tente novamente.',
                color: 'error'
                },
            })
        } finally {
            setComercial({})
            const response = await ComercialService.getComercial()
            dispatch({
                type: 'SET_COMERCIAL_LIST',
                payload: response.data,
            })              
            setLoading(false)
            onClose()
        }
        
    };
    
    return (
        <Dialog
            open={open}
            onClose={handleOnclose}
            maxWidth="lg"
            fullWidth
        >  
            <DialogTitle className={classes.dialogTitle}>Cadastrar Comercial</DialogTitle>               
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
                                    <Grid item xs={6} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <InputLabel htmlFor="outlined-age-native-simple">Selecione o Procedimento</InputLabel>
                                            <Select
                                                onChange={e => handleOnchange(e)}
                                                native
                                                value={comercial.id_procedimento}
                                                label="Selecione o Procedimento"
                                                name="id_procedimento"
                                            >
                                                <option aria-label="Selecione" value=""> </option> 
                                                {procedimentos.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.nome_medico} - {item.nome_paciente} - {item.nome_procedimento} - {moment(item.data * 1000).format("DD/MM/YYYY")} - {item.desc_esteira}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>
                                    </Grid> 
                                    <Grid item xs={4} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field}>
                                            <InputLabel htmlFor="outlined-age-native-simple">Médico Participante</InputLabel>
                                            <Select
                                                onChange={e => handleOnchange(e)}
                                                native
                                                value={comercial.id_medico_part}
                                                label="Médico"
                                                name="id_medico_part"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {medicos.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.nome}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid> 
                                    <Grid item xs={2} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field}>
                                            <InputLabel htmlFor="outlined-age-native-simple">Função Médico</InputLabel>
                                            <Select
                                                onChange={e => handleOnchange(e)}
                                                native
                                                value={comercial.funcao_medico_part}
                                                name="funcao_medico_part"
                                                label="Função"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {funcoes.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>                                                              
                                </Box>
                                <Box
                                className={classes.field}
                                sx={{
                                    display: 'flex',
                                }}
                                >                                   

                                    <Grid item xs={3}  className={classes.field}>
                                        <FormControl required fullWidth variant="outlined" className={classes.field}>
                                            <InputLabel htmlFor="outlined-age-native-simple">Tipo de Pagamento</InputLabel>
                                            <Select
                                                onChange={e => handleOnchange(e)}
                                                native
                                                value={comercial.tipo_pagamento}
                                                label="Tipo de Pagamento"
                                                name="tipo_pagamento"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {tipoPagto.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>

                                    </Grid>  
                                    <Grid item xs={3}  className={classes.field}>
                                        <FormControl required fullWidth variant="outlined" className={classes.field}>
                                            <InputLabel htmlFor="outlined-age-native-simple">Forma de Pagamento</InputLabel>
                                            <Select
                                                onChange={e => handleOnchange(e)}
                                                native
                                                value={comercial.forma_pagamento}
                                                label="Forma de Pagamento"
                                                name="forma_pagamento"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {formaPagto.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormHelperText id="my-helper-text">*Obrigatório</FormHelperText>

                                    </Grid>  
                                    <Grid item xs={4} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field}>
                                            <InputLabel htmlFor="outlined-age-native-simple">Plano de Contas</InputLabel>
                                            <Select
                                                onChange={e => handleOnchange(e)}                                
                                                native
                                                value={comercial.planoContas}
                                                label="Plano de Contas"
                                                name="plano_contas"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {planoContas.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid> 
                                    <Grid item xs={2} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field}>
                                            <InputLabel htmlFor="outlined-age-native-simple">Contas</InputLabel>
                                            <Select
                                                onChange={e => handleOnchange(e)}                                
                                                native
                                                value={comercial.conta}
                                                name="conta"
                                                label="Contas"
                                            >
                                                <option aria-label="Selecione" value="" />
                                                {contas.map((item, index) => (
                                                    <option key={index} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid> 
                                </Box>
                                <Box
                                className={classes.field}
                                sx={{
                                    display: 'flex',
                                }}
                                >
                    
                                    <Grid item xs={3} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field}>
                                            <TextField
                                                onChange={e => handleOnchange(e)}
                                                fullWidth
                                                id="date"
                                                label="Data de Emissão NF"
                                                name="data_emissao_nf"
                                                value={comercial.data_emissao_nf}
                                                type="date"
                                                className={classes.textField}
                                                    InputLabelProps={{
                                                shrink: true,
                                                }}
                                            /> 
                                        </FormControl>
                                    </Grid>                                 
                                    <Grid item xs={3} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field}>

                                            <TextField
                                                onChange={e => handleOnchange(e)}                                
                                                fullWidth
                                                id="date"
                                                name="data_vencimento"
                                                label={"Data Vencimento"} 
                                                value={comercial.data_vencimento}
                                                type="date"
                                                className={classes.textField}
                                                    InputLabelProps={{
                                                shrink: true,
                                                }}
                                            />       
                                        </FormControl>
                                    </Grid>                                 
                                    <Grid item xs={3}  className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field}>
                                            <TextField
                                                onChange={e => handleOnchange(e)}                                
                                                fullWidth
                                                id="date"
                                                label="Data de Pagamento"
                                                name="data_pagamento"
                                                value={comercial.data_pagamento}
                                                type="date"
                                                className={classes.textField}
                                                    InputLabelProps={{
                                                shrink: true,
                                                }}
                                            />       
                                        </FormControl>
                                    </Grid>  
                                    <Grid item xs={3} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field}>
                                            <TextField
                                                onChange={e => handleOnchange(e)}                                
                                                fullWidth
                                                id="date"
                                                label="Data de Compensação"
                                                name="data_compensacao"
                                                value={comercial.data_compensacao}
                                                type="date"
                                                className={classes.textField}
                                                    InputLabelProps={{
                                                shrink: true,
                                                }}
                                            />       
                                        </FormControl>
                                    </Grid> 
                                </Box>
                            </Paper>
                            <Paper >
                                <Box
                                className={classes.field}
                                sx={{
                                    display: 'flex',
                                }} 
                                >                                   
                                    <Grid item xs={3} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" disabled className={classes.field}>
                                            <FormHelperText id="my-helper-text">Valor Procedimento </FormHelperText>
                                            <Input type={"text"} name={"valor"} value={procedimento.valor} 
                                            />

                                        </FormControl>

                                    </Grid>  
                                    <Grid item xs={3}  className={classes.field}>
                                        <FormControl required  fullWidth variant="outlined" className={classes.field}>
                                        <FormHelperText id="my-helper-text">Qtd de Parcelas </FormHelperText>
                                            <Input type={"number"} name={"qtd_parcelas"} value={comercial.qtd_parcelas} 
                                                placeholder={'Qtde Parcelas'}
                                                InputProps={{ inputProps: { min: 0, max: 100 } }}
                                                onChange={e => handleOnchange(e)} 
                                            />
                                        </FormControl>
                                    </Grid>  
                                    <Grid item xs={3} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <FormHelperText id="my-helper-text">Valor Parcela</FormHelperText>
                                            <CurrencyInput placeholder="R$0,00" onChange={(e)=>handleOnchange(e)} type="text" name={"valor_parcelas"} value={comercial.valor_parcelas}/>
                                        </FormControl>
                                    </Grid>                                             
                                    <Grid item xs={3} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field} required>
                                            <FormHelperText id="my-helper-text">Valor Ajuste</FormHelperText>
                                            <CurrencyInput placeholder="R$0,00" onChange={(e)=>handleOnchange(e)} type="text" name={"valor_ajuste"} value={comercial.valor_ajuste}/>
                                        </FormControl>
                                    </Grid>                            
                                </Box>
                                <Box
                                    className={classes.field}
                                    sx={{
                                        display: 'flex',
                                    }}
                                    >
                                    <Grid item xs={12} className={classes.field}>
                                        <FormControl fullWidth variant="outlined" className={classes.field}>
                                            <TextField
                                                margin="dense"
                                                label={"Observação"}
                                                name={"obs"}
                                                value={comercial.obs}
                                                placeholder={"Observação"}
                                                type="text"
                                                onChange={e => handleOnchange(e)}                                
                                                fullWidth
                                            />                                         
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
    );
};

export default withStyles(ModalAddComercialStyle)(ModalAddComercial);