const Controller = {
  BASE_URL: null,
  
  BUTTON_EXPLORE: ".explore-stock",
  BUTTON_TIME_DATA: ".btn-time-data",
  
  CONTAINER_BIG_SEARCH: "#search-form-container",
  CONTAINER_SMALL_SEARCH: "#container-small-search",
  CONTAINER_RESULTS: "#results-containers",
  CONTAINER_ERROR_MSG: "#msg-error-container",
  CONTAINER_GRAPHIC: "#container-graphic",
  FORM: "#searchForm",
  FORM_SMALL: "#search-small-form",
  
  TEMPLATE_ALERT_DANGER: 'template-alert-danger',
  TEMPLATE_WAIT_RESPONSE: 'template-wait-response',
  TEMPLATE_SEARCH_RESULTS: 'template-search-results',
  TEMPLATE_DEFAULT_SELECT: 'template-stock-default',
  TEMPLATE_CANVAS_GRAPHIC: 'template-canvas-graphic',
  
  _selectedStockData: {},
  _graphicData: {},
  _graphicTooltipData: {},
  _templateAlertDanger: null,
  _templateWaitResponse: null,
  _templateSearchResults: null,
  _templateStockDefault: null,
  _templateCanvasGraphic: null,
  
  _loadTemplates: function _loadTemplates(){
    this._templateAlertDanger = document.getElementById(Controller.TEMPLATE_ALERT_DANGER).innerHTML;
    this._templateWaitResponse = document.getElementById(Controller.TEMPLATE_WAIT_RESPONSE).innerHTML;
    this._templateSearchResults = document.getElementById(Controller.TEMPLATE_SEARCH_RESULTS).innerHTML;
    this._templateStockDefault = document.getElementById(Controller.TEMPLATE_DEFAULT_SELECT).innerHTML;
    this._templateCanvasGraphic = document.getElementById(Controller.TEMPLATE_CANVAS_GRAPHIC).innerHTML;
  },
  
  _listeners: function _listeners(){
    $(Controller.FORM).submit(function(e){
      e.preventDefault();
      Controller._sendForm($(Controller.FORM));
    });
    $(Controller.FORM_SMALL).submit(function(e){
      e.preventDefault();
      Controller._sendForm($(Controller.FORM_SMALL));
    });
  },
  
  _sendForm: function _sendForm($form){
    let searchWord = $form.find('input[name="searchWord"]').val();
    
    if(searchWord === ""){
      return;
    }
    
    $(Controller.CONTAINER_BIG_SEARCH).slideDown();
    $(Controller.CONTAINER_SMALL_SEARCH).find('input').val("");
    $(Controller.CONTAINER_SMALL_SEARCH).hide();
    $(Controller.CONTAINER_RESULTS).html("");
    $(Controller.FORM).find('input[name="searchWord"]').val(searchWord);
    
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
    if(data.bestMatches.length > 0) {
      let template = Controller._templateSearchResults;
      let filtered_data = Controller._filterResult(data.bestMatches);
      let rendered = Controller._render(template, filtered_data);
      $(Controller.CONTAINER_RESULTS).html(rendered);
  
      // Add clickbutton event
      $(Controller.BUTTON_EXPLORE).click(function(){
        Controller._exploreStock($(this));
      });
    }
    else{
      Controller._handleError("Nenhuma bolsa foi encontrada com o termo digitado");
    }
  },
  
  _exploreStock: function($button){
    // Put wait message
    $(Controller.CONTAINER_BIG_SEARCH).slideUp();
    $(Controller.CONTAINER_SMALL_SEARCH).show();
    Controller._handleWait();
  
    Controller._selectedStockData = {
      symbol: $button.attr('data-symbol'),
      name: $button.attr('data-name'),
      region: $button.attr('data-region'),
      currency: $button.attr('data-currency'),
      timezone: $button.attr('data-timezone'),
      marketOpen: $button.attr('data-marketopen'),
      marketClose: $button.attr('data-marketclose')
    };
  
    let url = '/api/quote/'+Controller._selectedStockData.symbol;
    Controller.getData(url)
    .then(response => {
      if(response.data.status === "ok"){
        // Incorporate quote data to global _selectedStockData variable
        Controller._filterQuoteData(response.data.data['Global Quote']);
        let template = Controller._templateStockDefault;
        let rendered = Controller._render(template, Controller._selectedStockData);
        $(Controller.CONTAINER_RESULTS).html(rendered);
  
        $(Controller.BUTTON_TIME_DATA).click(function(){
          Controller._getStockTimeData($(this));
        });
      }else{
        Controller._handleError("Ocorreu um erro ao buscar as informações");
      }
    })
    .catch(error => {
      //console.log(error);
      Controller._handleError("Ocorreu um erro ao buscar as informações");
    });
  },
  
  _getStockTimeData: function _getStockTimeData($button){
    Controller._handleWait(true);
    
    let type = $button.attr('data-type');
    let url = '';
    let func = '';
    switch (type){
      case 'time-real':
        let interval = $button.attr('data-interval');
        url = '/api/intraday/'+Controller._selectedStockData.symbol+'/'+interval;
        func = Controller._renderMonthlyGraphic;
        break;
      case 'daily':
        url = '/api/daily/'+Controller._selectedStockData.symbol;
        func = Controller._renderDailyGraphic;
        break;
      case 'weekly':
        url = '/api/weekly/'+Controller._selectedStockData.symbol;
        func = Controller._renderWeeklyGraphic;
        break;
      case 'monthly':
        url = '/api/monthly/'+Controller._selectedStockData.symbol;
        func = Controller._renderMonthlyGraphic;
        break;
    }
  
    Controller.getData(url)
    .then(response => {
      if(response.data.status === "ok"){
        Controller._graphicData = response.data.data;
        // Execute Function
        func();
      }else{
        Controller._handleError("Ocorreu um erro ao buscar as informações", true);
      }
    })
    .catch(error => {
      console.log(error);
      Controller._handleError("Ocorreu um erro ao buscar as informações", true);
    });
  },
  
  _renderDailyGraphic: function _renderDailyGraphic(){
    let labels = Controller._getDailyLabels();
    let dataset = Controller._getDailyDataset();
    let container = $(Controller.CONTAINER_GRAPHIC);
    let template = Controller._templateCanvasGraphic;
    container.html(template);
    let graphic = new Chart(document.getElementById('chartjs'), {
      type: 'line',
      data: {labels: labels, datasets: dataset},
      options: {
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              return Controller._graphicTooltipData[tooltipItem[0].index].title;
            },
            label: function(tooltipItem, data) {
              return Controller._graphicTooltipData[tooltipItem.index].label;
            },
            afterBody: function(tooltipItem, data){
              return Controller._graphicTooltipData[tooltipItem[0].index].afterBody;
            }
          }
        }
      }
    })
  },
  
  _renderWeeklyGraphic: function _renderWeeklyGraphic(){
    let labels = Controller._getWeeklyLabels();
    let dataset = Controller._getWeeklyDataset();
    let container = $(Controller.CONTAINER_GRAPHIC);
    let template = Controller._templateCanvasGraphic;
    container.html(template);
    let graphic = new Chart(document.getElementById('chartjs'), {
      type: 'line',
      data: {labels: labels, datasets: dataset},
      options: {
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              return Controller._graphicTooltipData[tooltipItem[0].index].title;
            },
            label: function(tooltipItem, data) {
              return Controller._graphicTooltipData[tooltipItem.index].label;
            },
            afterBody: function(tooltipItem, data){
              return Controller._graphicTooltipData[tooltipItem[0].index].afterBody;
            }
          }
        }
      }
    })
  },
  
  _renderMonthlyGraphic: function _renderMonthlyGraphic(){
    let labels = Controller._getMonthlyLabels();
    let dataset = Controller._getMonthlyDataset();
    let container = $(Controller.CONTAINER_GRAPHIC);
    let template = Controller._templateCanvasGraphic;
    container.html(template);
    let graphic = new Chart(document.getElementById('chartjs'), {
      type: 'line',
      data: {labels: labels, datasets: dataset},
      options: {
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              return Controller._graphicTooltipData[tooltipItem[0].index].title;
            },
            label: function(tooltipItem, data) {
              return Controller._graphicTooltipData[tooltipItem.index].label;
            },
            afterBody: function(tooltipItem, data){
              return Controller._graphicTooltipData[tooltipItem[0].index].afterBody;
            }
          }
        }
      }
    })
  },
  
  _getDailyDataset: function _getDailyDataset(){
    let obj_keys = Object.keys(Controller._graphicData['Time Series (Daily)']);
    let obj_data = Object.values(Controller._graphicData['Time Series (Daily)']);
    let limit = 15;
    if(obj_data.length < 15){
      limit = obj_data.length;
    }
    let data = [];
    let tooltip_data = [];
  
    for(let i = 0; i < limit; i++){
      data.push(obj_data[i]['4. close']);
      let tooltip = {
        title: moment(obj_keys[i], "YYYY-MM-DD").format('DD/MM/YYYY'),
        label: 'Preço: ' + obj_data[i]['4. close'],
        afterBody: [
          'Abertura: ' + obj_data[i]['1. open'],
          'Alta: ' + obj_data[i]['2. high'],
          'Baixa: ' + obj_data[i]['3. low'],
          'Volume: ' + obj_data[i]['5. volume']
        ]
      };
      tooltip_data.push(tooltip);
    }
  
    tooltip_data.reverse();
    Controller._graphicTooltipData = tooltip_data;
    data.reverse();
  
    let dataset = [{
      label: Controller._selectedStockData.name,
      data: data,
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      lineTension: 0.1
    }];
  
    return dataset;
  },
  
  _getWeeklyDataset: function _getWeeklyDataset(){
    let obj_keys = Object.keys(Controller._graphicData['Weekly Time Series']);
    let obj_data = Object.values(Controller._graphicData['Weekly Time Series']);
    let limit = 15;
    if(obj_data.length < 15){
      limit = obj_data.length;
    }
    let data = [];
    let tooltip_data = [];
  
    for(let i = 0; i < limit; i++){
      data.push(obj_data[i]['4. close']);
      let tooltip = {
        title: moment(obj_keys[i], "YYYY-MM-DD").format('DD/MM/YYYY'),
        label: 'Preço: ' + obj_data[i]['4. close'],
        afterBody: [
          'Abertura: ' + obj_data[i]['1. open'],
          'Alta: ' + obj_data[i]['2. high'],
          'Baixa: ' + obj_data[i]['3. low'],
          'Volume: ' + obj_data[i]['5. volume']
        ]
      };
      tooltip_data.push(tooltip);
    }
  
    tooltip_data.reverse();
    Controller._graphicTooltipData = tooltip_data;
    data.reverse();
  
    let dataset = [{
      label: Controller._selectedStockData.name,
      data: data,
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      lineTension: 0.1
    }];
  
    return dataset;
  },
  
  _getMonthlyDataset: function _getMonthlyDataset(){
    let obj_keys = Object.keys(Controller._graphicData['Monthly Time Series']);
    let obj_data = Object.values(Controller._graphicData['Monthly Time Series']);
    let limit = 15;
    if(obj_data.length < 15){
      limit = obj_data.length;
    }
    let data = [];
    let tooltip_data = [];
    
    for(let i = 0; i < limit; i++){
      data.push(obj_data[i]['4. close']);
      let tooltip = {
        title: moment(obj_keys[i], "YYYY-MM-DD").format('DD/MM/YYYY'),
        label: 'Preço: ' + obj_data[i]['4. close'],
        afterBody: [
          'Abertura: ' + obj_data[i]['1. open'],
          'Alta: ' + obj_data[i]['2. high'],
          'Baixa: ' + obj_data[i]['3. low'],
          'Volume: ' + obj_data[i]['5. volume']
        ]
      };
      tooltip_data.push(tooltip);
    }
    
    tooltip_data.reverse();
    Controller._graphicTooltipData = tooltip_data;
    data.reverse();
  
    let dataset = [{
      label: Controller._selectedStockData.name,
      data: data,
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      lineTension: 0.1
    }];
    
    return dataset;
  },
  
  _getDailyLabels: function _getDailyLabels(){
    let data = Object.keys(Controller._graphicData['Time Series (Daily)']);
    let limit = 15;
    if(data.length < 15){
      limit = data.length;
    }
  
    let weeks = [];
    for(let i = 0; i < limit; i++){
      let d = moment(data[i], "YYYY-MM-DD");
      weeks.push(d.format('DD/MM'));
    }
    weeks.reverse();
  
    return weeks;
  },
  
  _getWeeklyLabels: function _getWeeklyLabels(){
    let data = Object.keys(Controller._graphicData['Weekly Time Series']);
    let limit = 15;
    if(data.length < 15){
      limit = data.length;
    }
  
    let weeks = [];
    for(let i = 0; i < limit; i++){
      let d = moment(data[i], "YYYY-MM-DD");
      weeks.push(d.format('DD/MM'));
    }
    weeks.reverse();
  
    return weeks;
  },
  
  _getMonthlyLabels: function _getMonthlyLabels(){
    let data = Object.keys(Controller._graphicData['Monthly Time Series']);
    let limit = 15;
    if(data.length < 15){
      limit = data.length;
    }
    
    let months = [];
    for(let i = 0; i < limit; i++){
      let d = moment(data[i], "YYYY-MM-DD");
      months.push(d.format('MM/YY'));
    }
    months.reverse();
    
    return months;
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
  
  _filterQuoteData: function _filterQuoteData(data){
    data.symbol = data['01. symbol'];
    data.open = data['02. open'];
    data.high = data['03. high'];
    data.low = data['04. low'];
    data.price = data['05. price'];
    data.volume = data['06. volume'];
    data.lastTradingDay = moment(data['07. latest trading day'], "YYYY-MM-DD");
    data.previousClose = data['08. previous close'];
    data.change = data['09. change'];
    data.changePercent = data['10. change percent'];
    delete data['01. symbol'];
    delete data['02. open'];
    delete data['03. high'];
    delete data['04. low'];
    delete data['05. price'];
    delete data['06. volume'];
    delete data['07. latest trading day'];
    delete data['08. previous close'];
    delete data['09. change'];
    delete data['10. changePercent'];
    
    Controller._selectedStockData.open = data.open;
    Controller._selectedStockData.high = data.high;
    Controller._selectedStockData.low = data.low;
    Controller._selectedStockData.price = data.price;
    Controller._selectedStockData.volume = data.volume;
    Controller._selectedStockData.lastTradingDay = data.lastTradingDay.format('DD/MM/YYYY');
    Controller._selectedStockData.previousClose = data.previousClose;
    Controller._selectedStockData.change = data.change;
    Controller._selectedStockData.changePercent = data.changePercent;
    
    return data;
  },
  
  _handleWait: function _handleWait(inGraphic = false){
    let template = Controller._templateWaitResponse;
    if(inGraphic){
      $(Controller.CONTAINER_GRAPHIC).html(template);
    }else{
      $(Controller.CONTAINER_RESULTS).html(template);
    }
  },
  
  _handleError: function _handleError(msg, inGraphic = false){
    let template = Controller._templateAlertDanger;
    let rendered = Controller._render(template, {message: msg});
    if(inGraphic){
      $(Controller.CONTAINER_GRAPHIC).html(rendered);
    }else {
      $(Controller.CONTAINER_RESULTS).html(rendered);
    }
  },
  
  _handleSearchError: function _handleSearchError(){
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