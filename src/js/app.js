App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if(typeof web3 !== 'undefined'){
      console.log('if');
      App.web3Provider = web3.currentProvider;
    }else{
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data){
      var AdoptionArtifact = data;
      //获取json文件中的合约名称
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      //配置合约关联的私有链
      App.contracts.Adoption.setProvider(App.web3Provider);
      return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.getAdopters();
    }).then(function(adopters){
      console.info(adopters.length);
      for (let i = 0; i < adopters.length; i++) {
        if(adopters[i]!='0x0000000000000000000000000000000000000000'){
          $('.panel-pet').eq(i).find('button').text('success').attr('disabled',true);
        }
      }
    }).catch(function(err){
      console.log('markAdopted:'+err.message);
    });
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    console.log(petId);
    var adoptionInstance;
    web3.eth.getAccounts(function(error, accounts){
      if(error){
        console.log(error);
      }
      var account = accounts[0];
      web3.eth.defaultAccount = account;
      App.contracts.Adoption.deployed().then(function(instance){
        adoptionInstance = instance;
        adoptionInstance.adopt(petId);
        return;
      }).then(function(result){
        return App.markAdopted();
      }).catch(function(err){
        console.log(err.message);
      })
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
