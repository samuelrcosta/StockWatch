const Controller = {
  BASE_URL: null,
  
  CONTAINER_RESULTS: "#results-containers",
  CONTAINER_ERROR_MSG: "#msg-error-container",
  FORM: "#searchForm",
  
  TEMPLATE_ALERT_DANGER: 'template-alert-danger',
  TEMPLATE_WAIT_RESPONSE: 'template-wait-response',
  TEMPLATE_SEARCH_RESULTS: 'template-search-results',
  
  _templateAlertDanger: null,
  _templateWaitResponse: null,
  _templateSearchResults: null,
  
  _loadTemplates: function _loadTemplates(){
    this._templateAlertDanger = document.getElementById(Controller.TEMPLATE_ALERT_DANGER).innerHTML;
    this._templateWaitResponse = document.getElementById(Controller.TEMPLATE_WAIT_RESPONSE).innerHTML;
    this._templateSearchResults = document.getElementById(Controller.TEMPLATE_SEARCH_RESULTS).innerHTML;
  },
  
  _listeners: function _listeners(){
    $(Controller.FORM).submit(function(e){
      e.preventDefault();
      Controller._sendForm();
    });
  },
  
  _sendForm: function _sendForm(){
    let searchWord = $(Controller.FORM).find('input[name="searchWord"]').val();
    if(searchWord.length < 2){
      Controller._handleSearchError();
    }else{
      Controller._handleWait();
      
      let url = '/api/search/'+searchWord;
      Controller.getData(url)
      .then(response => {
        if(response.data.status === "ok"){
          Controller._renderSearchResults(response.data.data);
        }else{
          Controller._handleError("Ocorreu um erro ao buscar as informações");
        }
      })
      .catch(error => {
        //console.log(error);
        Controller._handleError("Ocorreu um erro ao buscar as informações");
      });
    }
  },
  
  _render: function _render(template, data){
    return Mustache.render(template, data);
  },
  
  _renderSearchResults: function _renderSearchResults(data){
    if(data.bestMatches.length > 0){
      let template = Controller._templateSearchResults;
      let filtered_data = Controller._filterResult(data.bestMatches);
      let rendered = Controller._render(template, filtered_data);
      $(Controller.CONTAINER_RESULTS).html(rendered);
    }else{
      Controller._handleError("Nenhuma bolsa foi encontrada com o termo digitado");
    }
  },
  
  _filterResult: function _filterResult(data){
    for(i = 0; i < data.length; i++){
      data[i].symbol = data[i]['1. symbol'];
      data[i].name = data[i]['2. name'];
      data[i].type = data[i]['3. type'];
      data[i].region = data[i]['4. region'];
      data[i].marketOpen = data[i]['5. marketOpen'];
      data[i].marketClose = data[i]['6. marketClose'];
      data[i].timezone = data[i]['7. timezone'];
      data[i].currency = data[i]['8. currency'];
      data[i].matchScore = data[i]['9. matchScore'];
      delete data[i]['1. symbol'];
      delete data[i]['2. name'];
      delete data[i]['3. type'];
      delete data[i]['4. region'];
      delete data[i]['5. marketOpen'];
      delete data[i]['6. marketClose'];
      delete data[i]['7. timezone'];
      delete data[i]['8. currency'];
      delete data[i]['9. matchScore'];
    }
    
    return data;
  },
  
  _handleWait: function _handleWait(){
    let template = Controller._templateWaitResponse;
    $(Controller.CONTAINER_RESULTS).html(template);
  },
  
  _handleError: function _handleError(msg){
    let template = Controller._templateAlertDanger;
    let rendered = Controller._render(template, {message: msg});
    $(Controller.CONTAINER_RESULTS).html(rendered);
  },
  
  _handleSearchError: function(){
    let msg = "Digite pelo menos dois caracteres para fazer a pesquisa";
    $(Controller.CONTAINER_ERROR_MSG).html(msg);
    $(Controller.CONTAINER_ERROR_MSG).slideDown();
  },
  
  getData: function getData(url){
    return axios.get(Controller.BASE_URL+url);
  },
  
  start: function start(base_url){
    this.BASE_URL = base_url;
    
    this._loadTemplates();
    
    this._listeners();
  },
};