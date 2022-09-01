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
    if (window.ethereum){
      console.log('aaa');
      App.web3Provider = window.ethereum;
      try{
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    } else if (window.web3) {
      console.log('bbb');
      App.web3Provider = window.web3.currentProvider;
    } else{
      console.log('ccc');
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    }
    web3 = new Web3(App.web3Provider);
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
      for (let i = 0; i < adopters.length; i++) {
        if(adopters[i]!='0x0000000000000000000000000000000000000000'){
          console.log('领养者的地址'+adopters[i]);
          $('.panel-pet').eq(i).find('button').text('success').attr('disabled',true);
        }
      }
    }).catch(function(err){
      console.log('markAdopted:'+err.message);
    });
  },

  handleAdopt: function(event) {
    // event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    console.log(petId);
    var adoptionInstance;
    web3.eth.getAccounts(function(error, accounts){
      var account = accounts[0];
      web3.eth.defaultAccount = account;
      App.contracts.Adoption.deployed().then(function(instance){
        console.log('111');
        adoptionInstance = instance;
        return adoptionInstance.adopt(petId);
      }).then(function(result){
        console.info('result:'+result);
        return App.markAdopted();
      }).catch(function(err){
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
