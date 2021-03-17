var RexamWorkflowApp = angular.module('RexamWorkflowApp', [
  	'ngRoute',
  	//'ngAnimate', // this is buggy, jarviswidget will not work with ngAnimate :(
  	'ui.bootstrap',
  	'plunker',
    'impeto.accessControl',
    'impeto.controllers',
    'impeto.infrastructure.api',
  	'app.controllers',
    'app.repositories',
  	'app.main',
  	'app.navigation',
  	'app.localize',
  	'app.activity',
  	'app.smartui'
]);

RexamWorkflowApp
    //.value('serverBaseUrl', 'http://' + window.location.hostname + '/Rexam.Workflow.Api/')
    .value('serverBaseUrl', 'http://dummy.restapiexample.com') // public test API
    //.value('serverBaseUrl', 'http://localhost:8000/') // Local server
    .value('clientBaseUrl', 'http://' + window.location.hostname + '/Rexam.Client/')
    .value('loginUrl', 'http://' + window.location.hostname + '/Rexam.Client/login.html')
    .value('loginInternoUrl', 'http://' + window.location.hostname + '/Rexam.Client/logininterno.html')


RexamWorkflowApp.config(['$routeProvider', '$provide', function ($routeProvider, $provide) {
    $routeProvider
		.when('/', {
		    redirectTo: '/noc/home'
		})
        .when('/noc/home/', {
            templateUrl: 'views/noc/home.html',
            controller: 'HomeTasksController'
        })
        .when('/account/changePassword', {
            templateUrl: 'views/account/change-password.html',
            controller: 'ChangePasswordController'
        })

        .when('/noc-metal/register', {
            templateUrl: 'views/noc/register.html',
            controller: 'NocRegistrationController'
        })

          .when('/noc-metal/relatorio', {
              templateUrl: 'views/noc/relatorioView.html',
              controller: 'NocMetalRelatorioViewController'
          })
         .when('/noc-metal/relatorioTempoView', {
             templateUrl: 'views/noc/relatorioTempoView.html',
             controller: 'NocMetalRelatorioTempoViewController'
         })

        .when('/noc-metal/aceite/:id/:taskid', {
            templateUrl: 'views/noc/aceite.html',
            controller: 'NocAceiteController'
        })
        .when('/noc-metal/parecer-comercial/:id/:taskid', {
            templateUrl: 'views/noc/parecer-comercial.html',
            controller: 'NocMetalParecerComercialController'
        })
        .when('/noc-metal/resposta-fornecedor/:id/:taskid', {
            templateUrl: 'views/noc/resposta-fornecedor.html',
            controller: 'NocMetalRespostaFornecedorController'
        })
        .when('/noc-metal/resposta-rexam/:id/:taskid', {
            templateUrl: 'views/noc/resposta-rexam.html',
            controller: 'NocMetalRespostaRexamController'
        })
         .when('/nocFornecedor/register', {
             templateUrl: 'views/nocFornecedor/register.html',
             controller: 'NocFornecedorController'
         })
        .when('/nocFornecedor/relatorio', {
            templateUrl: 'views/nocFornecedor/relatorio.html',
            controller: 'RelatorioNocFornecedorController'
        })
         .when('/nocFornecedor/relatorioView', {
             templateUrl: 'views/nocFornecedor/relatorioView.html',
             controller: 'RelatorioViewNocFornecedorController'
         })
        .when('/nocFornecedor/aceite/:id/:taskid/:listName/:itemid/', {
            templateUrl: 'views/nocFornecedor/aceite.html',
            controller: 'NocFornecedorAceiteController'
        })
        .when('/nocFornecedor/respostaFornecedor/:id/:taskid/:listName/:itemid/', {
            templateUrl: 'views/nocFornecedor/respostaFornecedor.html',
            controller: 'NocFornecedorRespostaFornecedorController'
        })
        .when('/nocFornecedor/respostaRexam/:id/:taskid/:listName/:itemid/', {
            templateUrl: 'views/nocFornecedor/respostaRexam.html',
            controller: 'NocFornecedorRespostaRexamController'
        })
		.when('/nocFornecedor/visualizar/:id/:taskid/:listName/:itemid/', {
            templateUrl: 'views/nocFornecedor/visualizar.html',
            controller: 'NocFornecedorRespostaFornecedorController'
        })
        .when('/masterdataCliente/register/', {
            templateUrl: 'views/masterdataCliente/register.html',
            controller: 'MasterdataClientRegistrationController'
        })

        .when('/masterdataCliente/register/:id/:taskid/:idExterno/', {
            templateUrl: 'views/masterdataCliente/register.html',
            controller: 'MasterdataClientRegistrationController'
        })

        .when('/masterdataCliente/dadosFiscais/:id/:taskid/:idExterno/', {
            templateUrl: 'views/masterdataCliente/dadosFiscais.html',
            controller: 'MasterdataClientDadosFiscaisController'
        })
        .when('/masterdataCliente/dadosContabeis/:id/:taskid/:idExterno/', {
            templateUrl: 'views/masterdataCliente/dadosContabeis.html',
            controller: 'MasterdataClientDadosContabeisController'
        })
        .when('/masterdataCliente/passoFinanceiro/:id/:taskid/:idExterno/', {
            templateUrl: 'views/masterdataCliente/passoFinanceiro.html',
            controller: 'MasterdataClientPassoFinanceiroController'
        })
        .when('/masterdataCliente/cadastroSAP/:id/:taskid/:idExterno/', {
            templateUrl: 'views/masterdataCliente/cadastroSAP.html',
            controller: 'MasterdataClientCadastroSAPController'
        })
        .when('/masterdataCliente/historico/:id', {
            templateUrl: 'views/masterdataCliente/historico.html',
            controller: 'MasterdataClientHistoricoController'
        })
		
		.when('/masterdataCliente/relatorioRPA', {
             templateUrl: 'views/masterdataCliente/relatorioRPA.html',
             controller: 'RelatorioRPAViewMasterdataClienteController'
         })

        .when('/masterdataFornecedor/register/', {
            templateUrl: 'views/masterdataFornecedor/register.html',
            controller: 'MasterdataSupplierRegistrationController'
        })

         .when('/masterdataFornecedor/register/:id/:taskid/:idExterno/', {
             templateUrl: 'views/masterdataFornecedor/register.html',
             controller: 'MasterdataSupplierRegistrationController'
         })

        .when('/masterdataFornecedor/dadosContabeis/:id/:taskid/:idExterno/', {
            templateUrl: 'views/masterdataFornecedor/dadosContabeis.html',
            controller: 'MasterdataSupplierDadosContabeisController'
        })

        .when('/masterdataFornecedor/aprovacaoFinanceiro/:id/:taskid/:idExterno/', {
            templateUrl: 'views/masterdataFornecedor/aprovacaoFinanceiro.html',
            controller: 'MasterdataSupplierAprovacaoFinanceiroController'
        })

        .when('/masterdataFornecedor/cadastroSAP/:id/:taskid/:idExterno/', {
            templateUrl: 'views/masterdataFornecedor/cadastroSAP.html',
            controller: 'MasterdataSupplierCadastroSAPController'
        })

        .when('/masterdataFornecedor/historico/:id', {
            templateUrl: 'views/masterdataFornecedor/historico.html',
            controller: 'MasterdataSupplierHistoricoController'
        })
		
		.when('/masterdataFornecedor/relatorioRPA', {
             templateUrl: 'views/masterdataFornecedor/relatorioRPA.html',
             controller: 'RelatorioRPAViewMasterdataFornecedorController'
         })

        .when('/masterdataMaterial/register/', {
            templateUrl: 'views/masterdataMaterial/register.html',
            controller: 'MasterdataMaterialRegistrationController'
        })

        .when('/masterdataMaterial/register/:id/:taskid/:idExterno', {
            templateUrl: 'views/masterdataMaterial/register.html',
            controller: 'MasterdataMaterialRegistrationController'
        })

        .when('/masterdataMaterial/suprimentos/:id/:taskid/:idExterno', {
            templateUrl: 'views/masterdataMaterial/suprimentos.html',
            controller: 'MasterdataMaterialSuprimentosController'
        })

        .when('/masterdataMaterial/fiscal/:id/:taskid/:idExterno', {
            templateUrl: 'views/masterdataMaterial/fiscal.html',
            controller: 'MasterdataMaterialFiscalController'
        })

        .when('/masterdataMaterial/contabil/:id/:taskid/:idExterno', {
            templateUrl: 'views/masterdataMaterial/contabil.html',
            controller: 'MasterdataMaterialContabilController'
        })

        .when('/masterdataMaterial/engenharia/:id/:taskid/:idExterno', {
            templateUrl: 'views/masterdataMaterial/engenharia.html',
            controller: 'MasterdataMaterialEngenhariaController'
        })

        .when('/masterdataMaterial/cadastroSAP/:id/:taskid/:idExterno', {
            templateUrl: 'views/masterdataMaterial/cadastroSAP.html',
            controller: 'MasterdataMaterialCadastroSapController'
        })

        .when('/masterdataMaterial/historico/:id', {
            templateUrl: 'views/masterdataMaterial/historico.html',
            controller: 'MasterdataMaterialHistoricoController'
        })
		
		.when('/masterdataMaterial/relatorioRPA', {
             templateUrl: 'views/masterdataMaterial/relatorioRPA.html',
             controller: 'RelatorioRPAViewMasterdataMaterialController'
         })

        .when('/inovacao/register', {
            templateUrl: 'views/inovacao/register.html',
            controller: 'InovacaoRegistrationController'
        })

        .when('/inovacao/liderLean/:id/:taskid/:idExterno', {
            templateUrl: 'views/inovacao/liderLean.html',
            controller: 'InovacaoRegistrationController'
        })

        .when('/inovacao/superiorImediato/:id/:taskid/:idExterno', {
            templateUrl: 'views/inovacao/superiorImediato.html',
            controller: 'InovacaoSuperiorImediatoController'
        })

        .when('/inovacao/especialistaLean/:id/:taskid/:idExterno', {
            templateUrl: 'views/inovacao/especialistaLean.html',
            controller: 'InovacaoEspecialistaLeanController'
        })

        .when('/inovacao/gerente/:id/:taskid/:idExterno', {
            templateUrl: 'views/inovacao/gerente.html',
            controller: 'InovacaoGerenteController'
        })

        .when('/inovacao/historico/:id', {
            templateUrl: 'views/inovacao/historico.html',
            controller: 'InovacaoHistoricoController'
        })

        .when('/inovacao/relatorioPlanta', {
            templateUrl: 'views/inovacao/relatorioPlanta.html',
            controller: 'InovacaoRelatorioPlantaController'
        })

        .when('/inovacao/relatorioParticipante', {
            templateUrl: 'views/inovacao/relatorioParticipante.html',
            controller: 'InovacaoRelatorioParticipanteController'
        })

        .when('/nocCliente/register', {
            templateUrl: 'views/nocCliente/register.html',
            controller: 'NocClienteRegistrationController'
        })

         .when('/nocCliente/register/:id/:taskid/:idExterno', {
             templateUrl: 'views/nocCliente/register.html',
             controller: 'NocClienteRegistrationController'
         })

          .when('/nocCliente/edit/:id', {
              templateUrl: 'views/nocCliente/edit.html',
              controller: 'NocClienteEditController'
          })

        .when('/nocCliente/historico/:id', {
            templateUrl: 'views/nocCliente/historico.html',
            controller: 'NocClienteHistoricoController'
        })

        .when('/nocCliente/resposta/:id/:taskid/:idExterno', {
            templateUrl: 'views/nocCliente/resposta.html',
            controller: 'NocClienteRespostaController'
        })

        .when('/nocCliente/dispatch/:id/:taskid/:idExterno', {
            templateUrl: 'views/nocCliente/dispatch.html',
            controller: 'NocClienteDispatchController'
        })

        .when('/nocCliente/approver/:id/:taskid/:idExterno', {
            templateUrl: 'views/nocCliente/approver.html',
            controller: 'NocClienteApproverController'
        })



		/* We are loading our views dynamically by passing arguments to the location url */

		// A bug in smartwidget with angular (routes not reloading). 
		// We need to reload these pages everytime so widget would work
		// The trick is to add "/" at the end of the view.
		// http://stackoverflow.com/a/17588833
		.when('/:page', { // we can enable ngAnimate and implement the fix here, but it's a bit laggy
		    templateUrl: function ($routeParams) {
		        return 'views/' + $routeParams.page + '.html';
		    },
		    controller: 'PageViewController'
		})
		.when('/:page/:child*', {
		    templateUrl: function ($routeParams) {
		        return 'views/' + $routeParams.page + '/' + $routeParams.child + '.html';
		    },
		    controller: 'PageViewController'
		})
		.otherwise({
		    redirectTo: '/dashboard'
		});

    // with this, you can use $log('Message') same as $log.info('Message');
    $provide.decorator('$log', ['$delegate',
	function ($delegate) {
	    // create a new function to be returned below as the $log service (instead of the $delegate)
	    function logger() {
	        // if $log fn is called directly, default to "info" message
	        logger.info.apply(logger, arguments);
	    }

	    // add all the $log props into our new logger fn
	    angular.extend(logger, $delegate);
	    return logger;
	}]);

}]);

RexamWorkflowApp.run(['$rootScope', '$accountService', 'settings', function ($rootScope, $accountService, settings) {
    settings.currentLang = settings.languages[0]; // en

    function isLogged() {
        return localStorage.accessToken ? true : false;
    }

    //$rootScope.$on( "$locationChangeStart", function(event, next, current) {
    //    if (!inLoginPage && !isLogged()) {
    //        event.preventDefault()
    //        $accountService.navigateToLogin();
    //    }
    //});
}]);

var app;
app = app || (function () {
    var process = $('<div class="modal fade " data-backdrop="static" data-keyboard="false" id="process"> <div class="modal-dialog" style=" min-height:30px; width: 180px;"> <div class="modal-content"> <div class="modal-header"> <h5> <i class="fa fa-gear fa-2x fa-spin"></i> &nbsp; Processando... </h5></div></div></div></div>');

    return {
        showProcess: function () {
            process.modal('show');
        },
        hideProcess: function () {
            $('.modal-backdrop').remove();
            process.modal('hide');
        }
    };
})();
