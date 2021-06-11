import React from 'react';

const AppContext = React.createContext({
    keycloak: null,
    pacientes: [],
    paciente:{},
    medicos: [],
    medico:{},
    procedimentos:[],
    procedimento:{},
    financeiro_list:[],
    financeiro:{},
    comercial_list:[],
    comercial:{},
  
    snackBar: {}
});

export default AppContext;
