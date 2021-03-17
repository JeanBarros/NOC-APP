angular.module('app.controllers', ['ngSanitize'])
	.factory('settings', ['$rootScope', function ($rootScope) {
	    // supported languages

	    var settings = {
	        languages: [
                {
                    //language: 'Português',
                    translation: 'Português',
                    langCode: 'pt',
                    codigoId: 0
                },
				{
				    //language: 'English',
				    translation: 'English',
				    langCode: 'en',
				    codigoId: 1
				},
				{
				    //language: 'Espanhol',
				    translation: 'Español',
				    langCode: 'es',
				    codigoId: 2
				},
	        ]
	    };

	    return settings;
	}])

    .controller('PageViewController', ['$scope', '$route', '$animate', function ($scope, $route, $animate) {
        // controler of the dynamically loaded views, for DEMO purposes only.
        /*$scope.$on('$viewContentLoaded', function() {
			
		});*/
    }])

	.controller('SmartAppController', ['$scope', '$accountService', function ($scope, $accountService) {
	    // your main controller
	    if (!localStorage.userName)
	        $accountService.obterUsuarioWindows();
	}])

    .controller('MainController', ['$scope', '$accountService', function ($scope, $accountService) {

        $scope.userName = function () { return localStorage.userName; }
        $scope.logout = $accountService.logout;

    }])

	.controller('LangController', ['$scope', 'settings', 'localize', function ($scope, settings, localize) {
	    $scope.languages = settings.languages;
	    $scope.currentLang = settings.currentLang;
	    $scope.setLang = function (lang) {
	        settings.currentLang = lang;
	        $scope.currentLang = lang;
	        localize.setLang(lang);
	    };

	    // set the default language
	    $scope.setLang($scope.currentLang);

	}])

    .controller('RecuperarPasswordController', ['$scope', '$api', function ($scope, $api) {
        $scope.showValidation = false;

        $scope.submit = function () {
            $scope.showValidation = true;
            $scope.CurrentPasswordErrors = [];

            if ($scope.recuperarSenhaForm.$valid) {
                $api.post('api/Usuario/ForgotPassword', $scope.pedidoDeRecuperacaoDeSenha).success(function (data, textStatus, jqXHR) {
                    $scope.Errors = [data];
                })
                .error(function (jqXHR, textStatus, errorThrown) {
                    $scope.Errors = [jqXHR];
                });
            }
        }
    }])

    .controller('ResetPasswordController', ['$scope', '$api', 'loginInternoUrl', function ($scope, $api, loginInternoUrl) {
        $scope.showValidation = false;
        $scope.UsuarioValido = false;
        $scope.entity = { Hoje: new Date().toJSON() };

        $scope.exibirDatepicker = function ($event, name) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[name] = !$scope[name];
        };

        $scope.submit = function () {

            $scope.showValidation = true;

            if ($scope.resetPasswordForm.$valid) {
                $api.post('api/Usuario/ValidarUsuario', $scope.userData).success(function (data, textStatus, jqXHR) {

                    if (data.Erro == true)
                        $scope.Errors = [data.MensagemErro];
                    else
                        $scope.UsuarioValido = true;
                })
                 .error(function (jqXHR, textStatus, errorThrown) {
                     $scope.Errors = [jqXHR];
                 });
            }
        }

        $scope.changePassword = function () {

            $scope.showValidation = true;

            if ($scope.changePasswordForm.$valid) {
                $scope.userData.userName = $scope.userData.cpf;
                $api.post('api/Usuario/AlterarSenha', $scope.userData).success(function (data, textStatus, jqXHR) {

                    if (data.length > 0)
                        $scope.ErrorsSenha = [data];
                    else {

                        AlertUi('Sucesso', 'Senha alterada.');

                        setTimeout(function () {
                            window.location = loginInternoUrl;
                        }, 4000)
                    }

                })
                 .error(function (jqXHR, textStatus, errorThrown) {
                     $scope.ErrorsSenha = [jqXHR];
                 });
            }
        }

    }])

    .controller('ChangePasswordController', ['$scope', '$api', '$location', function ($scope, $api, $location) {
        $scope.userName = localStorage.userName;
        $scope.showValidation = false;

        $scope.submit = function () {
            $scope.showValidation = true;
            $scope.CurrentPasswordErrors = [];

            if ($scope.changePasswordForm.$valid) {
                $api.post('api/Usuario/ChangePassword', $scope.userData).success(function (data, textStatus, jqXHR) {

                    $location.path('/');
                    $.smallBox({
                        title: "Success!",
                        content: "Password changed.",
                        color: "#739E73",
                        iconSmall: "fa fa-check",
                        timeout: 5000
                    });
                })
                .error(function (jqXHR, textStatus, errorThrown) {
                    $scope.Errors = [jqXHR];
                });
            }
        }
    }])

    .controller('LoginController', ['$scope', '$accountService', '$location', 'settings', function ($scope, $accountService, $location, settings) {
        $scope.showValidation = false;
        inLoginPage = true;
        $scope.settings = settings;
        $scope.videoPrimeiroAcesso = {
            pt: $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/videos/acesso_funcionario_pt.mp4',
            en: $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/videos/acesso_funcionario_pt.mp4',
            es: $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/videos/acesso_funcionario_es.mp4'
        };
        $scope.submit = function () {
            $scope.Errors = [];
            $scope.showValidation = true;

            if ($scope.loginForm.$valid) {

                $accountService.login($scope.userData)
                    .then(null, function () {
                        $scope.Errors = ["The username or password you entered is incorrect."];
                    });
                ;
            }
        }
    }])

    .controller('RegisterUsuarioController', ['$scope', '$api', '$location', '$accountService', function ($scope, $api, $location, $accountService) {

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.registerForm.$valid) {
                $api.post('api/Usuario/Register', $scope.userData).success(function (data, textStatus, jqXHR) {

                    if (data.length > 0)
                        $scope.Errors = [data];
                    else {
                        $scope.userDataLogin = {
                            grant_type: "password",
                            password: $scope.userData.password,
                            username: $scope.userData.cpf
                        }

                        $accountService.login($scope.userDataLogin)
                            .then(null, function () {
                                $scope.Errors = ["The username or password you entered is incorrect."];
                            });
                        ;
                    }
                })
                 .error(function (jqXHR, textStatus, errorThrown) {
                     $scope.Errors = [jqXHR];
                 });
            }
        }
    }])

    .controller('HomeTasksController', ['$scope', '$location', 'WorkflowTasksRepository', '$window', '$accountService', function ($scope, $location, WorkflowTasksRepository, $window, $accountService) {
        $scope.showValidation = false;
        $scope.userName = localStorage.userName;

        $scope.refreshCallback = function (contentScope, done) {

            setTimeout(function () {
                carregarTasks();
            }, 1000);

        };

        var carregarTasks = function () {
            app.showProcess();
            WorkflowTasksRepository.getInitiate().success(function (data) {
                if (data.length > 0) {
                    $scope.InitiateBox = data;
                    $scope.showInitiate = true;
                } else
                    $scope.showInitiate = false;

                $('#tblInitiate thead th:eq(0)').removeClass('linkGrid');
                app.hideProcess();
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            WorkflowTasksRepository.getTasksInbox().success(function (data) {
                if (data.length > 0)
                    $scope.TasksInbox = data;
                $('#tblInbox thead th:eq(0)').removeClass('linkGrid');
                app.hideProcess();
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            WorkflowTasksRepository.getTasksCompleted().success(function (data) {
                if (data.length > 0)
                    $scope.TasksCompleted = data;
                $('#tblCompleted thead th:eq(0)').removeClass('linkGrid');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            WorkflowTasksRepository.getTasksInProgress().success(function (data) {
                if (data.length > 0)
                    $scope.TasksInProgress = data;
                $('#tblInProgress thead th:eq(0)').removeClass('linkGrid');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            WorkflowTasksRepository.getReports().success(function (data) {
                if (data.length > 0)
                    $scope.Reports = data;
                $('#tblInProgress thead th:eq(0)').removeClass('linkGrid');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        };

        carregarTasks();

        $scope.aoColumns = [];

        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(0)', nRow).unbind("click");
            $('td:eq(0)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            if (info.UrlAcesso == "#" || info.URL == "#")
                return false;
            $window.open(info.UrlAcesso ? info.UrlAcesso : info.URL);
        };

        $scope.InboxColumnDefs = [
            { "mDataProp": "ProcessName", "aTargets": [0], "className": 'linkGrid' },
            { "mDataProp": "Summary", "aTargets": [1] },
            { "mDataProp": "ItemId", "aTargets": [2] },
            { "mDataProp": "Step", "aTargets": [3] },
            {
                "mDataProp": "StartDate", "aTargets": [4], //"render": function (data) { if (data == null) return ''; var dt = new Date(data).toLocaleDateString(); return dt; }
            },
            {
                "mDataProp": "DueTime", "aTargets": [5], //"render": function (data) { if (data == null) return ''; var dt = new Date(data).toLocaleDateString(); return dt; }
            },
            { "mDataProp": "Status", "aTargets": [6] },
            { "mDataProp": "Author", "aTargets": [7] }
        ];

        $scope.InProgressColumnDefs = [
           { "mDataProp": "ProcessName", "aTargets": [0], "className": 'linkGrid' },
           { "mDataProp": "Summary", "aTargets": [1] },
           { "mDataProp": "ItemId", "aTargets": [2] },
           { "mDataProp": "Step", "aTargets": [3] },
           {
               "mDataProp": "StartDate", "aTargets": [4], "render": function (data) { if (data == null) return ''; var dt = new Date(data).toLocaleDateString(); return dt; }
           },
           { "mDataProp": "Status", "aTargets": [5] },
           { "mDataProp": "Author", "aTargets": [6] }
        ];

        $scope.CompletedColumnDefs = [
           { "mDataProp": "ProcessName", "aTargets": [0], "className": 'linkGrid' },
           { "mDataProp": "Summary", "aTargets": [1] },
           { "mDataProp": "ItemId", "aTargets": [2] },
           {
               "mDataProp": "StartDate", "aTargets": [3], "render": function (data) { if (data == null) return ''; var dt = new Date(data).toLocaleDateString(); return dt; }
           },
           {
               "mDataProp": "EndDate", "aTargets": [4], "render": function (data) { if (data == null) return ''; var dt = new Date(data).toLocaleDateString(); return dt; }
           },
           { "mDataProp": "Duration", "aTargets": [5] },
           { "mDataProp": "Status", "aTargets": [6] },
           { "mDataProp": "Author", "aTargets": [7] }
        ];

        $scope.ReportColumnDefs = [
          { "mDataProp": "Title", "aTargets": [0], "aTargets": [0], "className": 'linkGrid' },
        ];

        $scope.columnInitiateDefs = [
            { "mDataProp": "Title", "aTargets": [0], "className": 'linkGrid' }
        ];
    }])

    .controller('RelatorioViewNocFornecedorController', ['$scope', '$location', 'NocFornecedorRelatorioViewRepository', '$window', '$accountService', function ($scope, $location, NocFornecedorRelatorioViewRepository, $window, $accountService) {
        $scope.showValidation = false;
        $scope.userName = localStorage.userName;

        app.showProcess();
        NocFornecedorRelatorioViewRepository.getRelatorio().success(function (data) {
            $scope.NocFornecedorRelatorioView = data;
            $('#tblInbox thead th:eq(0)').removeClass('linkGrid');
            app.hideProcess();
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        $scope.aoColumns = [];

        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(0)', nRow).unbind("click");
            $('td:eq(0)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $window.open(info.UrlAcesso);
        };

        $scope.columnDefs = [
            { "mDataProp": "Fornecedor", "aTargets": [0] },
            { "mDataProp": "NOC", "aTargets": [1] },
            { "mDataProp": "Categoria", "aTargets": [2] },
            { "mDataProp": "Planta", "aTargets": [3] },
            { "mDataProp": "Parecer", "aTargets": [4] },
            { "mDataProp": "Resposta", "aTargets": [5] },
            { "mDataProp": "Criado", "aTargets": [6] },
            { "mDataProp": "Tarefa", "aTargets": [7] },
            { "mDataProp": "Resultado", "aTargets": [8] },
            { "mDataProp": "DiffData", "aTargets": [9] },
            { "mDataProp": "Dono", "aTargets": [10] },
            { "mDataProp": "Mes", "aTargets": [11] },
            { "mDataProp": "Ano", "aTargets": [12] },
            /*{
                "mDataProp": "DueTime", "aTargets": [4], "render": function (data) { var dt = new Date(data).toLocaleDateString(); return dt; }
            }*/
        ];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 0,//2419200, /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };
    }])

    .controller('NocRegistrationController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'NocMetalRepository', 'CausaRaizRepository', 'FornecedorRepository', 'PlantaRepository', 'TipoMetalRepository', 'TipoProblemaRepository', 'MaterialRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, NocMetalRepository, CausaRaizRepository, FornecedorRepository, PlantaRepository, TipoMetalRepository, TipoProblemaRepository, MaterialRepository, serverBaseUrl, settings, $accountService, localize) {

        $(function () {

            var $validator = $("#nocRegistrationForm").validate({

                rules: {
                    dataEntrada: { required: true },
                    dataOcorrencia: { required: true },
                    planta: { required: true },
                    causaRaiz: { required: true },
                    cartaoHFI: { required: true },
                    tipoMetal: { required: true },
                    fornecedor: { required: true },
                    tipoProblema: { required: true },
                    codigoMetal: { required: true },
                    lote: { required: true },
                    dcrProblema: { required: true },
                    dataFaturamenFornecedor: { required: true },
                    pesoTotalBobina: {
                        required: true,
                        minlength: 1
                    },
                    pesoReclamada: {
                        required: true,
                        minlength: 1
                    },
                    unidadeMedida: { required: true },
                    qtdAmostraEnviada: {
                        required: true,
                        minlength: 1
                    },
                    qtdAmostraRetorno: {
                        required: true,
                        minlength: 1
                    },

                    indicadorDevolucaoVenda: { required: true },
                    gerouDrenoLinha: { required: true },
                    qtdDefeitoDrenoLinha: { required: true },
                    gerouPerdaProducao: { required: true },
                    qtdDefeitoPerdaProducao: { required: true },
                    perdaFerramenta: { required: true },
                    valorPerdaFerramenta: { required: true },
                    dcrPerdaFerramenta: { required: true },
                    perdaOutrosCustos: { required: true },
                    valorPerdaOutrosCustos: { required: true },
                    dcrPerdaOutrosCustos: { required: true },
                    reteste: { required: true },
                    acompanhamentoFornecedor: { required: true }
                },

                messages: {
                    dataEntrada: "Informe a data de entrada",
                    dataOcorrencia: "Informe a data de ocorrência",
                    planta: "Informe a planta",
                    causaRaiz: "Informe a causa raiz",
                    cartaoHFI: "Informe número do cartão HFI",
                    tipoMetal: "Informe o tipo de metal",
                    fornecedor: "Informe o fornecedor",
                    tipoProblema: "Informe o tipo de problema",
                    codigoMetal: "Informe o código do metal",
                    lote: "Informe o lote",
                    dcrProblema: "Informe detalhes do problema",
                    dataFaturamenFornecedor: "Informe a data de faturamento do fornecedor",
                    pesoTotalBobina: "Informe o peso total da bobina",
                    pesoReclamada: "Informe o peso reclamada",
                    unidadeMedida: "Informe a unidade de medida",
                    qtdAmostraEnviada: "Informe a qtd. amostras enviadas ao fornecedor (meia-latas ou chapas)",
                    qtdAmostraRetorno: "Informe a qtd. retorno fornecedor/venda",
                    indicadorDevolucaoVenda: "Informe se teve indicador de devolução ou venda código do metal",
                    gerouDrenoLinha: "Informe se o defeito gerou dreno de linha",
                    qtdDefeitoDrenoLinha: "Informe quantas latas e/ou tampas",
                    gerouPerdaProducao: "Informe se o defeito gerou perda de produção",
                    qtdDefeitoPerdaProducao: "Informe quantas latas e/ou tampas",
                    perdaFerramenta: "Informe se ocorreu perda de ferramenta",
                    valorPerdaFerramenta: "Informe o valor da perda de ferramenta",
                    dcrPerdaFerramenta: "Informe detalhes da perda ferramental",
                    perdaOutrosCustos: "Informe se ocorreu outras perdas ou outros custos",
                    valorPerdaOutrosCustos: "Informe o valor de outras perdas / custos",
                    dcrPerdaOutrosCustos: "Informe detalhes de outras perdas / custos",
                    reteste: "Informe se ocorreu reteste",
                    acompanhamentoFornecedor: "Informe se teve acompanhamento do fornecedor",
                },

                invalidHandler: function () {
                    $('#dropdown-languages').find('.active a').click();
                },

                errorPlacement: function (error, element) {
                    error.attr('data-localize', $(element).data('localize-error'));
                    if (element.attr('type') == 'radio') {
                        $(element).parent().parent().append(error);
                    } else if (element.attr('ui-date') == '') {
                        $(element).parent().parent().append(error);
                        $(element).parent().parent().find('em').css('font-size', 13 + 'px')
                    }
                    else {
                        $(element).parent().append(error);
                    }

                    $compile(error)($scope);
                }
            });

            $('#bootstrap-wizard-1').bootstrapWizard({

                'tabClass': 'form-wizard',
                'onNext': function (tab, navigation, index) {
                    var $valid = $("#nocRegistrationForm").valid();
                    if (!$valid) {
                        $validator.focusInvalid();
                        return false;
                    } else if (!angular.element('#nocRegistrationForm').scope().ValidarCalculos(index)) {
                        return false;
                    } else {
                        $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(index - 1).addClass('complete');
                        $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(index - 1).find('.step').html('<i class="fa fa-check"></i>');
                    }

                    angular.element('#nocRegistrationForm').scope().$apply();
                },
                'onTabShow': function (tab, navigation, index) {
                    var $total = navigation.find('li').length;
                    var $current = index + 1;

                    if ($current >= $total) {
                        $('#bootstrap-wizard-1').find('.pager .next').hide();
                        $('#bootstrap-wizard-1').find('.pager .finish').show();
                        $('#bootstrap-wizard-1').find('.pager .finish').removeClass('disabled');
                    } else {
                        $('#bootstrap-wizard-1').find('.pager .next').show();
                        $('#bootstrap-wizard-1').find('.pager .finish').hide();
                    }
                },
                'onTabClick': function (tab, navigation, index) {
                    return false;
                }
            });
        });

        $scope.showValidation = false;

        $scope.exibirDatepicker = function ($event, name) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[name] = !$scope[name];
        };

        //tratar erro de validation do wizard
        $scope.ValidarRadio = function ($event) {
            $(event.target).parent().find('em').remove();
        };

        $scope.entity = {
            DataAbertura: new Date().toJSON(),
            IdFornecedor: 0,
            UsarPerdaDeMetalNoReembolso: false,
            UsarCustosDeFerramentaNoReembolso: false,
            UsarOutrosCustosReembolso: false,
            UsarPerdaDeProducaolNoReembolso: false,

            DataOcorrencia: null,
            IdPlanta: 0,
            IdCodigoMaterial: 0,
            IdTipoMetal: 0,

            QtdDefeitoDrenoLinha: 0,
            ValorPerdaFerramenta: toDecimal(0, 2),
            ValorPerdaOutrosCustos: toDecimal(0, 2),

            PrecoCompra: null, //Preço de Compra – (Data de Ocorrência, Planta , Fornecedor, Código Metal  “Material” )
            PrecoVenda: null, //Representa o valor do coeficiente LME médio para o mês anterior à data de referência, multiplicado por 0,80
            Coeficiente: null, //Coef - (Data de Ocorrência, Planta , Tipo de Metal)
            CPM: null, //CPM - (Data de Ocorrência, Planta , Tipo de Metal)
            KGs: 0,
            PerdasMetal: 0,//[(Preço de Compra - Preço de Venda)/1000] * KGs
            PerdasProducao: 0,//(Qtd. Produtos Perdidos (Unid.) /1000) * CPM
            PerdaTotal: 0, //Perdas Metal (US$) + Perdas Produção (US$) + Custos Ferramentas (US$) + Outros Custos (US$)
            ReembolsoTotal: 0,//usa o as flags de custos para calclulo

        }

        ObterPrecoVenda = function () {
            $.ajax({
                type: "GET",
                url: serverBaseUrl + '/api/Calculos/getPrecoVenda/',
                async: false,
                dataType: 'json',
                success: function (data) {
                    $scope.entity.PrecoVenda = toDecimal(data, 2);
                }
            });
        }

        ObterPrecoCompra = function () {
            $.ajax({
                type: "GET",
                url: serverBaseUrl + '/api/Calculos/GetPrecoCompra/' + $scope.entity.IdPlanta + '/' + $scope.entity.IdFornecedor + '/' + $scope.entity.IdCodigoMaterial,
                async: false,
                dataType: 'json',
                success: function (data) {
                    $scope.entity.PrecoCompra = toDecimal(data, 2);
                }
            });
        };

        ObterCoeficiente = function () {
            $.ajax({
                type: "GET",
                url: serverBaseUrl + '/api/Calculos/GetCoeficiente/' + $scope.entity.IdPlanta + '/' + $scope.entity.IdTipoMetal + '/' + $scope.entity.IdCodigoMaterial,
                async: false,
                dataType: 'json',
                success: function (data) {
                    $scope.entity.Coeficiente = toDecimal(data, 6);
                }
            });
        };

        ObterCPM = function () {
            $.ajax({
                type: "GET",
                url: serverBaseUrl + '/api/Calculos/GetCPM/' + $scope.entity.IdFornecedor + '/' + $scope.entity.IdPlanta,
                async: false,
                dataType: 'json',
                success: function (data) {
                    $scope.entity.CPM = toDecimal(data, 2);
                }
            });
        };

        $scope.ValidarCalculos = function (index) {
            var ok = true;

            if (index == 1) {
                $scope.entity.PrecoCompra = null;
                $scope.entity.PrecoVenda = null;
                $scope.entity.Coeficiente = null;
                $scope.entity.CPM = null;

                app.showProcess();
                ObterPrecoCompra();
                ObterPrecoVenda();
                ObterCoeficiente();
                ObterCPM();

                app.hideProcess();

                var mensagem = '';

                $('#validacaoCalculos').empty();
                //TO DO -> traduzir usar o localize Ex.: localize.localizeText('msgConcluido');
                if ($scope.entity.PrecoCompra == null || $scope.entity.PrecoVenda == null || $scope.entity.Coeficiente == null || $scope.entity.CPM == null) {
                    var indices = '';
                    var mensagem = '<div class="alert alert-danger" role="alert">';
                    mensagem += 'Índice(s) Faltante(s): ';

                    if ($scope.entity.PrecoCompra == null)
                        indices += 'Preço de Compra';
                    if ($scope.entity.PrecoVenda == null)
                        indices += (indices.length == 0 ? '' : ',') + 'Preço de Venda';
                    if ($scope.entity.Coeficiente == null)
                        indices += (indices.length == 0 ? '' : ',') + 'Coef.(Kg/m)';
                    if ($scope.entity.CPM == null)
                        indices += (indices.length == 0 ? '' : ',') + 'CPM';

                    mensagem += indices;
                    mensagem += '</br>Favor entrar em contato com a área  de Suprimentos Diretos.';
                    mensagem += '</div>';

                    $('#validacaoCalculos').append(mensagem);
                    ok = false;
                }
            }
            else if (index == 2) {
                var valPerdaFerramenta = $scope.entity.ValorPerdaFerramenta == null || $scope.entity.ValorPerdaFerramenta == '' ? 0 : toDecimal($scope.entity.ValorPerdaFerramenta, 2);
                var valPerdaOutrosCustos = $scope.entity.ValorPerdaOutrosCustos == null || $scope.entity.ValorPerdaOutrosCustos == '' ? 0 : toDecimal($scope.entity.ValorPerdaOutrosCustos, 2);
                ///(Qtd. Produtos Perdidos (Unid.) /1000) * CPM
                var valPerdaProducao = $scope.entity.QtdDefeitoDrenoLinha == null || $scope.entity.QtdDefeitoDrenoLinha == '' ? 0 : parseInt($scope.entity.QtdDefeitoDrenoLinha) / 1000 * $scope.entity.CPM;

                //(Qtd. Produtos Perdidos / 1000) * Coef.(Kg/m)
                $scope.entity.KGs = toDecimal($scope.entity.QtdDefeitoDrenoLinha == null ? 0 : ($scope.entity.QtdDefeitoDrenoLinha / 1000) * $scope.entity.Coeficiente, 2);
                //[(Preço de Compra - Preço de Venda)/1000] * KGs
                $scope.entity.PerdasMetal = toDecimal(($scope.entity.PrecoCompra - $scope.entity.PrecoVenda) / 1000 * $scope.entity.KGs, 2);
                $scope.entity.PerdasProducao = toDecimal(valPerdaProducao, 2);
                //Perdas Metal (US$) + Perdas Produção (US$) + Custos Ferramentas (US$) + Outros Custos (US$)               
                $scope.entity.PerdaTotal = toDecimal(parseFloat($scope.entity.PerdasMetal) + parseFloat($scope.entity.PerdasProducao) + parseFloat(valPerdaFerramenta) + parseFloat(valPerdaOutrosCustos), 2);

                $scope.entity.ValorPerdaFerramenta = valPerdaFerramenta;
                $scope.entity.ValorPerdaOutrosCustos = valPerdaOutrosCustos;

                $scope.entity.ReembolsoTotal = 0;

                if ($scope.entity.UsarPerdaDeMetalNoReembolso)
                    $scope.entity.ReembolsoTotal += parseFloat($scope.entity.PerdasMetal);
                if ($scope.entity.UsarPerdaDeProducaolNoReembolso)
                    $scope.entity.ReembolsoTotal += parseFloat($scope.entity.PerdasProducao);
                if ($scope.entity.UsarCustosDeFerramentaNoReembolso)
                    $scope.entity.ReembolsoTotal += parseFloat(valPerdaFerramenta);
                if ($scope.entity.UsarOutrosCustosReembolso)
                    $scope.entity.ReembolsoTotal += parseFloat(valPerdaOutrosCustos);

                $scope.entity.ReembolsoTotal = toDecimal($scope.entity.ReembolsoTotal, 2);
            }
            return ok;
        };

        $scope.$watch('entity.FlgGerouDrenoLinha', function (value) {
            if (value == 'true') {
                $('#qtdDefeitoDrenoLinha').attr('disabled', false);
            }
            else {
                $('#qtdDefeitoDrenoLinha').attr('disabled', true);
            }
        });

        $scope.$watch('entity.FlgGerouPerdaProducao', function (value) {
            if (value == 'true') {
                $('#qtdDefeitoPerdaProducao').attr('disabled', false);
            }
            else {
                $('#qtdDefeitoPerdaProducao').val('');
                $('#qtdDefeitoPerdaProducao').attr('disabled', true);
            }
        });

        $scope.$watch('entity.FlgPerdaFerramenta', function (value) {
            if (value == 'true') {
                $('#valorPerdaFerramenta').attr('disabled', false);
                $('#dcrPerdaFerramenta').attr('disabled', false);
            }
            else {
                $('#valorPerdaFerramenta').val('');
                $('#valorPerdaFerramenta').attr('disabled', true);

                $('#dcrPerdaFerramenta').val('');
                $('#dcrPerdaFerramenta').attr('disabled', true);
            }
        });

        $scope.$watch('entity.FlgPerdaOutrosCustos', function (value) {
            if (value == 'true') {
                $('#valorPerdaOutrosCustos').attr('disabled', false);
                $('#dcrPerdaOutrosCustos').attr('disabled', false);
            }
            else {
                $('#valorPerdaOutrosCustos').val('');
                $('#valorPerdaOutrosCustos').attr('disabled', true);

                $('#dcrPerdaOutrosCustos').val('');
                $('#dcrPerdaOutrosCustos').attr('disabled', true);

            }
        });

        $scope.settings = settings;

        $scope.$watch('settings.currentLang', function () {
            PlantaRepository.getByIdioma(settings.currentLang.codigoId).success(function (data) {
                $scope.plantas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            TipoProblemaRepository.getByIdioma(settings.currentLang.codigoId).success(function (data) {
                $scope.tiposProblemas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            if ($scope.entity.tipoMetal) {
                CausaRaizRepository.getByTipoMetal($scope.entity.tipoMetal.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#causaRaiz').attr('disabled', false);
                    $scope.causas = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            }
        });

        $scope.$watch('entity.planta', function (newValue) {
            if (newValue) {

                $scope.entity.IdPlanta = newValue.Id;
                $scope.entity.NomePlanta = newValue.Nome;

                FornecedorRepository.getByPlanta(newValue.Id).success(function (data) {
                    $('#fornecedor').attr('disabled', false);
                    $scope.fornecedores = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            } else {
                $scope.fornecedores = [];
            }
        });

        $scope.$watch('entity.fornecedor', function (newValue) {
            //carrega o objeto fornecedor
            if (newValue) {

                $scope.entity.IdFornecedor = newValue.Id;
                $scope.entity.NomeFornecedor = newValue.RazaoSocial;
                $scope.entity.UsarPerdaDeMetalNoReembolso = newValue.UsarPerdaDeMetalNoReembolso;
                $scope.entity.UsarCustosDeFerramentaNoReembolso = newValue.UsarCustosDeFerramentaNoReembolso;
                $scope.entity.UsarOutrosCustosReembolso = newValue.UsarOutrosCustosReembolso;
                $scope.entity.UsarPerdaDeProducaolNoReembolso = newValue.UsarPerdaDeProducaolNoReembolso;

                TipoMetalRepository.getByFornecedor($scope.entity.IdFornecedor, $scope.entity.IdPlanta, newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#tipoMetal').attr('disabled', false);
                    $scope.tiposMetais = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            } else {
                $scope.tiposMetais = [];
            }
        });

        $scope.$watch('entity.tipoMetal', function (newValue) {
            if (newValue) {

                $scope.entity.IdTipoMetal = newValue.Id;
                $scope.entity.NomeTipoMetal = newValue.Codigo;

                CausaRaizRepository.getByTipoMetal(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#causaRaiz').attr('disabled', false);
                    $scope.causas = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });

                MaterialRepository.getByTipoMetal($scope.entity.IdFornecedor, $scope.entity.IdPlanta, newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#codigoMetal').attr('disabled', false);
                    $scope.materias = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });

            } else {
                $scope.causas = [];
            }
        });

        $scope.$watch('entity.codigoMetal', function (newValue) {
            if (newValue) {
                $scope.entity.IdCodigoMaterial = newValue.Id;
            }
        });

        $scope.submit = function () {
            //validacao é feita por etapa do wizard
            $scope.showValidation = false;

            if ($scope.files) {
                uploadFiles();
            }
            else {
                $scope.onSuccessUpload();
            }
        };

        $scope.onSuccessUpload = function () {
            app.showProcess();

            //transformar o valor em  decimal
            $scope.entity.PesoTotalBobina = toDecimal($scope.entity.PesoTotalBobina, 3);
            $scope.entity.PesoReclamada = toDecimal($scope.entity.PesoReclamada, 3);

            NocMetalRepository.saveOrUpdate($scope.entity, function () {
                $location.path('/NocMetal');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.Message);
            }).success(function () {
                var mensagem = localize.localizeText('msgConcluido');

                $('#bootstrap-wizard-1').find('.pager .finish').hide();
                $('#bootstrap-wizard-1').find('.pager .previous').hide();
                $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(3).removeClass('active');
                $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(3).addClass('complete');
                $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(3).find('.step').html('<i class="fa fa-check"></i>');

                FecharJanelaComMensagem(localize.localizeText('msgSucesso'), mensagem);
            }).finally(function () {
                app.hideProcess();
            });
        }

    }])

    .controller('NocAceiteController', ['$scope', '$location', '$routeParams', 'NocMetalRepository', 'WorkflowTasksRepository', 'serverBaseUrl', '$accountService', 'localize', function ($scope, $location, $routeParams, NocMetalRepository, WorkflowTasksRepository, serverBaseUrl, $accountService, localize) {
        $scope.showValidation = false;

        $scope.resposta = {
            DataResposta: new Date().toJSON()
        };

        if ($routeParams.taskid)
            $scope.resposta.WorkflowTaskId = $routeParams.taskid;

        $scope.resposta.NomeResponsavel = localStorage.userName;

        if ($routeParams.id) {
            app.showProcess();

            NocMetalRepository.getById($routeParams.id, $routeParams.taskid).success(function (data) {

                $scope.entity = data;

                $scope.entity.IsHistorico = $scope.entity.IsHistorico || $scope.entity.Status != 0;

                $scope.resposta.NocMetal = $scope.entity;
                app.hideProcess();

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.submit = function () {
            app.showProcess();
            NocMetalRepository.aceitar($scope.entity.Id, $scope.resposta.WorkflowTaskId)
                .success(function (data) {

                    var mensagem = localize.localizeText('msgConcluido');
                    $('#salvar').hide();

                    FecharJanelaComMensagem(localize.localizeText('msgSucesso'), mensagem);

                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.Message);
                }).finally(function () {
                    app.hideProcess();
                });
        };
    }])

    .controller('NocMetalParecerComercialController', ['$scope', '$location', '$routeParams', 'NocMetalRepository', 'WorkflowTasksRepository', 'serverBaseUrl', '$accountService', 'localize', function ($scope, $location, $routeParams, NocMetalRepository, WorkflowTasksRepository, serverBaseUrl, $accountService, localize) {
        $scope.showValidation = false;

        $scope.resposta = {
            DataResposta: new Date().toJSON()
        };

        if ($routeParams.taskid)
            $scope.resposta.WorkflowTaskId = $routeParams.taskid;

        if ($routeParams.id) {
            app.showProcess();

            $scope.resposta.IdNocMetal = $routeParams.id;

            NocMetalRepository.getById($routeParams.id, $routeParams.taskid).success(function (data) {

                $scope.entity = data;
                //$scope.entity.IsHistorico = $scope.entity.IsHistorico || $scope.entity.Status != 6;
                $scope.resposta.NocMetal = $scope.entity;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            }).finally(function () {
                app.hideProcess();
            });
        }

        $scope.submit = function () {
            app.showProcess();
            NocMetalRepository.registrarParecerComercial($scope.resposta)
                .success(function (data) {

                    var mensagem = localize.localizeText('msgConcluido');
                    $('#salvar').hide();

                    FecharJanelaComMensagem(localize.localizeText('msgSucesso'), mensagem);

                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.Message);
                }).finally(function () {
                    app.hideProcess();
                });
        };
    }])

    .controller('NocMetalRespostaFornecedorController', ['$scope', '$location', '$routeParams', 'NocMetalRepository', 'WorkflowTasksRepository', 'serverBaseUrl', '$accountService', 'localize', function ($scope, $location, $routeParams, NocMetalRepository, WorkflowTasksRepository, serverBaseUrl, $accountService, localize) {
        $scope.showValidation = false;

        $scope.resposta = {
            DataResposta: new Date().toJSON()
        };

        if ($routeParams.taskid)
            $scope.resposta.WorkflowTaskId = $routeParams.taskid;

        $scope.resposta.NomeResponsavel = localStorage.userName;

        if ($routeParams.id) {
            app.showProcess();

            NocMetalRepository.getById($routeParams.id, $routeParams.taskid).success(function (data) {

                $scope.entity = data;
                $scope.resposta.RespostasWorkflow = data.RespostasWorkflow;
                $scope.podeEditar = !data.EhRespostaDaRexam;

                $scope.resposta.NocMetal = $scope.entity;
                app.hideProcess();
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.nocAceiteForm.$valid) {
                if ($scope.files) {
                    uploadFiles();
                }
                else {
                    $scope.onSuccessUpload();
                }
            }
        };

        $scope.onSuccessUpload = function () {

            app.showProcess();

            $scope.resposta.Anexos = $scope.entity.Anexos;

            NocMetalRepository.registrarResposta($scope.resposta, function () {

            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.Message);
                app.hideProcess();
            })
            .success(function (msg, status) {
                var mensagem = localize.localizeText('msgConcluido');
                $('#Salvar').hide();
                app.hideProcess();

                FecharJanelaComMensagem(localize.localizeText('msgSucesso'), mensagem + " \n " + msg.replace(/"/g, ''));
            });
        }
    }])

    .controller('NocMetalRespostaRexamController', ['$scope', '$location', '$routeParams', 'NocMetalRepository', 'WorkflowTasksRepository', 'serverBaseUrl', '$accountService', 'localize', function ($scope, $location, $routeParams, NocMetalRepository, WorkflowTasksRepository, serverBaseUrl, $accountService, localize) {
        $scope.showValidation = false;

        $scope.resposta = {
            DataResposta: new Date().toJSON()
        };

        if ($routeParams.taskid)
            $scope.resposta.WorkflowTaskId = $routeParams.taskid;

        $scope.resposta.NomeResponsavel = "Rexam";

        if ($routeParams.id) {
            app.showProcess();

            NocMetalRepository.getById($routeParams.id, $routeParams.taskid).success(function (data) {

                $scope.entity = data;
                $scope.resposta.RespostasWorkflow = data.RespostasWorkflow;
                $scope.podeEditar = data.EhRespostaDaRexam;

                $scope.resposta.NocMetal = $scope.entity;
                app.hideProcess();

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.nocAceiteForm.$valid) {

                if ($scope.files) {
                    uploadFiles();
                }
                else {
                    $scope.onSuccessUpload();
                }
            }
        };

        $scope.onSuccessUpload = function () {
            app.showProcess();

            $scope.resposta.Anexos = $scope.entity.Anexos;

            NocMetalRepository.registrarResposta($scope.resposta, function () {

            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.Message);
                app.hideProcess();
            })
            .success(function (data) {
                $('#Salvar').hide();

                var message;

                if (data.Message) {
                    message = data.Message.replace(/"/g, '');
                } else {
                    message = '';
                }

                if ($routeParams.id) {
                    data.Url = data.Url.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: data.Url,
                        data: data.WorkflowTaskSave,
                        method: 'GET',
                        useForm: true,
                        idEntidade: $scope.entity.Id,
                        fluxo: "NOC Metal",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido') + " \n " + message.replace(/"/g, '')
                    });
                }
            });
        }
    }])

     .controller('NocMetalRelatorioViewController', ['$scope', '$location', 'NocMetalRepository', '$window', '$accountService', 'settings', 'localize', function ($scope, $location, NocMetalRepository, $window, $accountService, settings, localize) {
         $scope.settings = settings;

         $scope.filtro = {

         };

         //    $scope.obterRelatorio = function () {
         app.showProcess();
         NocMetalRepository.getRelatorio($location.search().cnpj).success(function (data) {
             if (data.length) {
                 $scope.NocMetalRelatorio = data;
             } else {
                 $scope.NocMetalRelatorio = undefined;
             }
             app.hideProcess();
         }).error(function (err, status) {
             defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
             app.hideProcess();
         });
         //  }

         $scope.aoColumns = [];

         $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
             return nRow;
         };

         $scope.someClickHandler = function (info) {
             $window.open(info.UrlAcesso);
         };

         $scope.columnDefs = [

             { "mDataProp": "NOC", "aTargets": [0] },
             { "mDataProp": "PLANTA", "aTargets": [1] },
             { "mDataProp": "FORNECEDOR", "aTargets": [2] },
             { "mDataProp": "DATA_OCORRENCIA", "aTargets": [3] },
             { "mDataProp": "DATA_ABERTURA", "aTargets": [4] },
             { "mDataProp": "DATA_ENCERRAMENTO", "aTargets": [5] },
             { "mDataProp": "DURAÇÃO_TOTAL", "aTargets": [6] },
             { "mDataProp": "STATUS", "aTargets": [7] },
             { "mDataProp": "PARECER", "aTargets": [8] },
             { "mDataProp": "TIPO_METAL", "aTargets": [9] },
             { "mDataProp": "CODIGO_METAL", "aTargets": [10] },
             { "mDataProp": "LOTE", "aTargets": [11] },
             { "mDataProp": "TIPO_PROBLEMA", "aTargets": [12] },
             { "mDataProp": "CAUSA_RAIZ", "aTargets": [13] },
             { "mDataProp": "CARTÃO_HFI", "aTargets": [14] },
             { "mDataProp": "USUARIO", "aTargets": [15] },
             { "mDataProp": "PESO_RECLAMADO", "aTargets": [16] },
             { "mDataProp": "DRENO_DE_LINHA", "aTargets": [17] },
             { "mDataProp": "CUSTO_METAL_PERDIDO", "aTargets": [18] },
             { "mDataProp": "CUSTO_PRODUÇÃO", "aTargets": [19] },
             { "mDataProp": "LME", "aTargets": [20] },
             { "mDataProp": "PREÇO_COMPRA", "aTargets": [21] },
             { "mDataProp": "CPM", "aTargets": [22] },
             { "mDataProp": "COEFICIENTE", "aTargets": [23] },
             { "mDataProp": "PERDA_TOTAL", "aTargets": [24] },


         ];



         $scope.overrideOptions = {
             "bStateSave": true,
             "iCookieDuration": 0,//2419200, /* 1 month */
             "bJQueryUI": true,
             "bPaginate": true,
             "bLengthChange": true,
             "bFilter": false,
             "bInfo": true,
             "bDestroy": true
         };
     }])

    .controller('NocMetalRelatorioTempoViewController', ['$scope', '$location', 'NocMetalRepository', '$window', '$accountService', function ($scope, $location, NocMetalRepository, $window, $accountService) {
        $scope.showValidation = false;
        $scope.userName = localStorage.userName;

        app.showProcess();
        NocMetalRepository.getRelatorioTempo().success(function (data) {
            $scope.NocMetalRelatorioTempoView = data;
            $('#tblInbox thead th:eq(0)').removeClass('linkGrid');
            app.hideProcess();
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        $scope.aoColumns = [];

        //$scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        //    $('td:eq(0)', nRow).unbind("click");
        //    $('td:eq(0)', nRow).bind('click', function () {
        //        $scope.$apply(function () {
        //            $scope.someClickHandler(aData);
        //        });
        //    });
        //    return nRow;
        //};

        $scope.someClickHandler = function (info) {
            $window.open(info.UrlAcesso);
        };

        $scope.columnDefs = [
            { "mDataProp": "Fornecedor", "aTargets": [0] },
            { "mDataProp": "NOC", "aTargets": [1] },
            { "mDataProp": "Planta", "aTargets": [2] },
            { "mDataProp": "Parecer", "aTargets": [3] },
            { "mDataProp": "AcoesCorretivas", "aTargets": [4] },
            { "mDataProp": "Resposta", "aTargets": [5] },
            { "mDataProp": "Criado", "aTargets": [6] },
            { "mDataProp": "Tarefa", "aTargets": [7] },
            { "mDataProp": "Resultado", "aTargets": [8] },
            { "mDataProp": "DiffData", "aTargets": [9] },
            { "mDataProp": "Dono", "aTargets": [10] },
            { "mDataProp": "Mes", "aTargets": [11] },
            { "mDataProp": "Ano", "aTargets": [12] },
            /*{
                "mDataProp": "DueTime", "aTargets": [4], "render": function (data) { var dt = new Date(data).toLocaleDateString(); return dt; }
            }*/
        ];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 0,//2419200, /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };
    }])

    .controller('NocFornecedorController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'NocFornecedorRepository', 'LookupsNocFornecedorRepository', 'FornecedorRepository', 'PlantaRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, NocFornecedorRepository, LookupsNocFornecedorRepository, FornecedorRepository, PlantaRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;

        $scope.exibirDatepicker = function ($event, name) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[name] = !$scope[name];
        };

        $scope.entity = {
            DataAbertura: new Date().toJSON(),
            IdFornecedor: 0,
            Categoria: 0,
            Hoje: new Date().toJSON()
        }

        LookupsNocFornecedorRepository.getPlantas(settings.currentLang.codigoId).success(function (data) {
            $scope.plantas = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        LookupsNocFornecedorRepository.getMoedas(settings.currentLang.codigoId).success(function (data) {
            $scope.moedas = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        LookupsNocFornecedorRepository.getSeveridades(settings.currentLang.codigoId).success(function (data) {
            $scope.severidades = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        LookupsNocFornecedorRepository.getTiposServico(settings.currentLang.codigoId).success(function (data) {
            $scope.tiposDeServico = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        $scope.settings = settings;

        $scope.$watch('settings.currentLang', function () {
            $scope.entity.categoria = '';
            LookupsNocFornecedorRepository.getPlantas(settings.currentLang.codigoId).success(function (data) {
                $scope.plantas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsNocFornecedorRepository.getMoedas(settings.currentLang.codigoId).success(function (data) {
                $scope.moedas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsNocFornecedorRepository.getSeveridades(settings.currentLang.codigoId).success(function (data) {
                $scope.severidades = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsNocFornecedorRepository.getTiposServico(settings.currentLang.codigoId).success(function (data) {
                $scope.tiposDeServico = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.$watch('entity.categoria', function (newValue) {
            if (newValue) {
                LookupsNocFornecedorRepository.getClassesDefeito(newValue, settings.currentLang.codigoId).success(function (data) {
                    $('#classe').attr('disabled', false);
                    $scope.classes = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
                $scope.entity.fornecedor = {};
                if ($scope.entity.planta) {
                    LookupsNocFornecedorRepository.getFornecedores($scope.entity.planta.Id, newValue).success(function (data) {
                        $('#fornecedor').attr('disabled', false);
                        $scope.fornecedores = data;
                    }).error(function (err, status) {
                        defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                        $('#fornecedor').attr('disabled', true);
                    });
                }
            } else {
                $scope.classes = [];
                $('#fornecedor').attr('disabled', true);
            }
        });

        $scope.$watch('entity.planta', function (newValue) {
            if (newValue) {
                $scope.entity.IdPlanta = newValue.Id;
                $scope.entity.NomePlanta = newValue.Nome;
                if ($scope.entity.categoria) {
                    LookupsNocFornecedorRepository.getFornecedores(newValue.Id, $scope.entity.categoria).success(function (data) {
                        $('#fornecedor').attr('disabled', false);
                        $scope.fornecedores = data;
                    }).error(function (err, status) {
                        defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                        $('#fornecedor').attr('disabled', true);
                    });
                }
            } else {
                $scope.fornecedores = [];
                $('#fornecedor').attr('disabled', true);
            }
        });

        $scope.$watch('entity.fornecedor', function (newValue) {
            if (newValue) {
                $scope.entity.IdFornecedor = newValue.Id;
                $scope.entity.NomeFornecedor = newValue.RazaoSocial;
            }
        });

        $scope.$watch('entity.classedefeito', function (newValue) {
            if (newValue) {

                $scope.entity.IdClasseDefeito = newValue.Id;
                $scope.entity.ClasseDefeito = newValue.Nome;

                LookupsNocFornecedorRepository.getDefeitos(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#defeito').attr('disabled', false);
                    $scope.defeitos = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            } else {
                $scope.defeitos = [];
            }
        });

        $scope.$watch('entity.moeda', function (newValue) {
            if (newValue) {
                $scope.entity.IdMoeda = newValue.Id;
                $scope.entity.Moeda = newValue.Nome;
            }
        });

        $scope.$watch('entity.severidade', function (newValue) {
            if (newValue) {
                $scope.entity.IdSeveridade = newValue.Id;
                $scope.entity.Severidade = newValue.Nome;
            }
        });

        $scope.$watch('entity.defeito', function (newValue) {
            if (newValue) {
                $scope.entity.IdDefeito = newValue.Id;
                $scope.entity.Defeito = newValue.Nome;
            }
        });

        $scope.$watch('entity.tipoServico', function (newValue) {
            if (newValue) {
                $scope.entity.IdDefeito = newValue.Id;
                $scope.entity.TipoServico = newValue.Nome;
            }
        });

        $scope.Ressarcimento = function (value) {
            if (value == 'true') {
                $('#valorCustosDespesas').attr('disabled', false);
                $('#observacao').attr('disabled', false);
            }
            else {
                $('#valorCustosDespesas').val('');
                $('#valorCustosDespesas').attr('disabled', true);

                $('#observacao').val('');
                $('#observacao').attr('disabled', true);
            }
        }

        $scope.submit = function () {

            $scope.showValidation = true;

            if ($scope.nocFornecedorRegistrationForm.$valid) {

                if ($scope.files) {
                    uploadFiles();
                }
                else {
                    $scope.onSuccessUpload();
                }
            }
        }

        $scope.onSuccessUpload = function () {
            app.showProcess();

            //transformar o valor em  decimal
            $scope.entity.valorCustosDespesas = toDecimal($scope.entity.valorCustosDespesas, 2);
            $scope.entity.Idioma = settings.currentLang.codigoId;
            NocFornecedorRepository.saveOrUpdate($scope.entity, function () {
                $location.path('/NocMetal');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                var mensagem = localize.localizeText('msgConcluido');
                $('#salvar').hide();
                app.hideProcess();

                FecharJanelaComMensagem(localize.localizeText('msgSucesso'), mensagem);
            });
        }
    }])

    .controller('NocFornecedorAceiteController', ['$scope', '$location', '$routeParams', 'NocFornecedorRepository', 'LookupsNocFornecedorRepository', 'serverBaseUrl', '$accountService', 'settings', 'localize', function ($scope, $location, $routeParams, NocFornecedorRepository, LookupsNocFornecedorRepository, serverBaseUrl, $accountService, settings, localize) {
        $scope.showValidation = false;

        $scope.exibirDatepicker = function ($event, name) {
            if (!$('#dataAutorizacaoDevolucao').attr('disabled')) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[name] = !$scope[name];
            }
        };

        $scope.entity = {
        }
        $scope.entity.resposta = {}

        if ($routeParams.listName)
            $scope.entity.ListName = $routeParams.listName;
        if ($routeParams.itemid)
            $scope.entity.ItemId = $routeParams.itemid;

        $scope.entity.UsuarioAceite = localStorage.userName


        if ($routeParams.id && $routeParams.taskid) {

            app.showProcess();

            NocFornecedorRepository.getById($routeParams.id, $routeParams.taskid).success(function (data) {
                $scope.entity = data;
                $scope.entity.WorkflowTaskId = $routeParams.taskid;
                // $scope.entity.UsuarioAceite = localStorage.userName;
                $scope.entity.DataAceite = new Date().toJSON();
                app.hideProcess();
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            $scope.settings = settings;
        }

        $scope.Devolucao = function (value) {
            if (value == 'true') {
                $('#qtdAutorizadaDevolver').attr('disabled', false);
                $('#dataAutorizacaoDevolucao').attr('disabled', false);
            }
            else {
                $('#qtdAutorizadaDevolver').val('');
                $('#qtdAutorizadaDevolver').attr('disabled', true);

                $('#dataAutorizacaoDevolucao').val('');
                $('#dataAutorizacaoDevolucao').attr('disabled', true);
            }
        }

        LookupsNocFornecedorRepository.getParecer(settings.currentLang.codigoId).success(function (data) {
            $scope.entity.Pareceres = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        $scope.$watch('settings.currentLang', function () {
            LookupsNocFornecedorRepository.getParecer(settings.currentLang.codigoId).success(function (data) {
                $scope.entity.Pareceres = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.$watch('entity.resposta.ParecerLookup', function (newValue) {
            if (newValue) {
                $scope.entity.resposta.IdParecer = newValue.Id;
                $scope.entity.resposta.Parecer = newValue.Nome;
            }
        });




        $scope.submit = function () {

            if ($scope.entity.RespondeAceitando == true) {
                $scope.showValidation = true;

                if ($scope.nocFornecedorAceiteForm.$valid) {

                    app.showProcess();
                    $scope.entity.UsuarioAceite = localStorage.userName;
                    NocFornecedorRepository.Aceitar($scope.entity, function () {

                    }).error(function (err, status) {
                        defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                        app.hideProcess();
                    })
              .success(function (msg, status) {
                  var mensagem = localize.localizeText('msgConcluido');
                  $('#Salvar').hide();
                  app.hideProcess();
                  FecharJanelaComMensagem(localize.localizeText('msgSucesso'), mensagem);


              });
                }
            } else {
                if ($scope.entity.NomeRepresentante != null) {
                    app.showProcess();
                    $scope.entity.UsuarioAceite = localStorage.userName;

                    NocFornecedorRepository.Aceitar($scope.entity, function () {

                    }).error(function (err, status) {
                        defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                        app.hideProcess();
                    })
              .success(function (msg, status) {
                  var mensagem = localize.localizeText('msgConcluido');
                  $('#Salvar').hide();
                  app.hideProcess();
                  FecharJanelaComMensagem(localize.localizeText('msgSucesso'), mensagem);


              });

                }
            }
            //NocFornecedorRepository.Aceitar($scope.resposta)
            //    .success(function (data) {
            //        var mensagem = localize.localizeText('msgConcluido');
            //        $('#Aceitar').hide();
            //        app.hideProcess();
            //        FecharJanelaComMensagem(localize.localizeText('msgSucesso'), mensagem);
            //    }).error(function (err, status) {
            //        defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            //        app.hideProcess();
            //    });
        }

    }])

    .controller('NocFornecedorRespostaFornecedorController', ['$scope', '$location', '$routeParams', 'NocFornecedorRepository', 'WorkflowTasksRepository', 'LookupsNocFornecedorRepository', 'serverBaseUrl', '$accountService', 'settings', 'localize', function ($scope, $location, $routeParams, NocFornecedorRepository, WorkflowTasksRepository, LookupsNocFornecedorRepository, serverBaseUrl, $accountService, settings, localize) {
        $scope.showValidation = false;

        $scope.exibirDatepicker = function ($event, name) {
            if (!$('#dataAutorizacaoDevolucao').attr('disabled')) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[name] = !$scope[name];
            }
        };

        $scope.resposta = {
            DataResposta: new Date().toJSON(),
            FlgRespostaRexam: 0,
            Hoje: new Date().toJSON()
        }

        if ($routeParams.listName)
            $scope.resposta.ListName = $routeParams.listName;
        if ($routeParams.taskid)
            $scope.resposta.WorkflowTaskId = $routeParams.taskid;
        if ($routeParams.itemid)
            $scope.resposta.ItemId = $routeParams.itemid;

        $scope.resposta.NomeResponsavel = localStorage.userName

        if ($routeParams.id && $routeParams.taskid) {

            app.showProcess();

            NocFornecedorRepository.getById($routeParams.id, $routeParams.taskid).success(function (data) {
                $scope.entity = data;
                $scope.entity.IsRepostaRexam = true;
                $scope.resposta.NocFornecedor = $scope.entity;
                app.hideProcess();

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.Devolucao = function (value) {
            if (value == 'true') {
                $('#qtdAutorizadaDevolver').attr('disabled', false);
                $('#dataAutorizacaoDevolucao').attr('disabled', false);
            }
            else {
                $('#qtdAutorizadaDevolver').val('');
                $('#qtdAutorizadaDevolver').attr('disabled', true);

                $('#dataAutorizacaoDevolucao').val('');
                $('#dataAutorizacaoDevolucao').attr('disabled', true);
            }
        }

        LookupsNocFornecedorRepository.getParecer(settings.currentLang.codigoId).success(function (data) {
            $scope.resposta.Pareceres = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        $scope.settings = settings;

        $scope.$watch('settings.currentLang', function () {
            LookupsNocFornecedorRepository.getParecer(settings.currentLang.codigoId).success(function (data) {
                $scope.resposta.Pareceres = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.$watch('resposta.ParecerLookup', function (newValue) {
            if (newValue) {
                $scope.resposta.IdParecer = newValue.Id;
                $scope.resposta.Parecer = newValue.Nome;
            }
        });

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.nocFornecedorRespostaFornecedorForm.$valid) {

                if ($scope.files) {
                    uploadFiles();
                }
                else {
                    $scope.onSuccessUpload();
                }
            }
        }

        $scope.onSuccessUpload = function () {
            app.showProcess();

            $scope.resposta.QtdAutorizadaDevolver = toDecimal($scope.resposta.QtdAutorizadaDevolver, 2);
            $scope.resposta.ValorAutorizadoRessarcimento = toDecimal($scope.resposta.ValorAutorizadoRessarcimento, 2);
            $scope.resposta.Anexos = $scope.entity.Anexos;

            NocFornecedorRepository.RegistrarResposta($scope.resposta, function () {

            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (msg, status) {
                var mensagem = localize.localizeText('msgConcluido');
                $('#Salvar').hide();
                app.hideProcess();
                FecharJanelaComMensagem(localize.localizeText('msgSucesso'), mensagem);
            });
        }
    }])

    .controller('NocFornecedorRespostaRexamController', ['$scope', '$location', '$routeParams', 'NocFornecedorRepository', 'serverBaseUrl', '$accountService', 'settings', 'LookupsNocFornecedorRepository', 'localize', function ($scope, $location, $routeParams, NocFornecedorRepository, serverBaseUrl, $accountService, settings, LookupsNocFornecedorRepository, localize) {
        $scope.showValidation = false;
        $scope.resposta = {
            DataResposta: new Date().toJSON(),
            FlgRespostaRexam: 1,
            Hoje: new Date().toJSON()
        }

        if ($routeParams.listName)
            $scope.resposta.ListName = $routeParams.listName;
        if ($routeParams.taskid)
            $scope.resposta.WorkflowTaskId = $routeParams.taskid;
        if ($routeParams.itemid)
            $scope.resposta.ItemId = $routeParams.itemid;

        $scope.resposta.NomeResponsavel = 'Rexam';

        if ($routeParams.id && $routeParams.taskid) {
            app.showProcess();

            LookupsNocFornecedorRepository.getRespostasRexam($routeParams.taskid).success(function (data) {
                $scope.respostasRexam = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            NocFornecedorRepository.getById($routeParams.id, $routeParams.taskid).success(function (data) {
                $scope.entity = data;
                $scope.entity.IsRepostaRexam = true;
                $scope.resposta.NocFornecedor = $scope.entity;
                app.hideProcess();
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.validarMotivo = function () {
            return parseInt($('input[name=statusResposta]:checked', '#nocFornecedorRespostaRexamForm').attr('index')) > 0;
        }

        $scope.$watch('resposta.respostaRexam', function (newValue) {
            if (newValue) {
                $scope.resposta.StatusResposta = newValue;
            }
        });

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.nocFornecedorRespostaRexamForm.$valid) {
                if ($scope.files) {
                    uploadFiles();
                }
                else {
                    $scope.onSuccessUpload();
                }
            }
        }

        $scope.onSuccessUpload = function () {
            app.showProcess();

            $scope.resposta.Anexos = $scope.entity.Anexos;

            NocFornecedorRepository.RegistrarResposta($scope.resposta, function () {

            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $('#Salvar').hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "NOC Fornecedor",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataClientRegistrationController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsMasterdataRepository', 'MasterdataClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsMasterdataRepository, MasterdataClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.entity = {
            TipoDePessoa: 'J',
            IsInclusao: true
        };

        $scope.entityEmpresa = {};
        $scope.settings = settings;

        $('#bootstrap-wizard-1').bootstrapWizard({
            'tabClass': 'form-wizard',
            'onNext': function (tab, navigation, index) {
                $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(index - 1).addClass('complete');
                $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(index - 1).find('.step').html('<i class="fa fa-check"></i>');
            },
            'onTabShow': function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                if ($current >= $total) {
                    $('#bootstrap-wizard-1').find('.pager .next').hide();
                    $('#bootstrap-wizard-1').find('.pager .finish').show();
                    $('#bootstrap-wizard-1').find('.pager .finish').removeClass('disabled');
                } else {
                    $('#bootstrap-wizard-1').find('.pager .next').show();
                    $('#bootstrap-wizard-1').find('.pager .finish').hide();
                }
            },
            //'onTabClick': function (tab, navigation, index) {
            //    return false;
            //}
        });

        $scope.$watch('settings.currentLang', function () {
            LookupsMasterdataRepository.getPaises(settings.currentLang.codigoId).success(function (data) {
                $scope.paises = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getPaisesRexam(settings.currentLang.codigoId).success(function (data) {
                $scope.paisesRexam = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getFormasDePagamento(settings.currentLang.codigoId).success(function (data) {
                $scope.formasDePagamento = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getMoedas(settings.currentLang.codigoId).success(function (data) {
                $scope.moedasDeContabilizacao = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getGruposDeContasCliente(settings.currentLang.codigoId).success(function (data) {
                $scope.gruposDeContas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getIncoterm(settings.currentLang.codigoId).success(function (data) {
                $scope.incoterms = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.SetMascaraCodigoFiscal = function () {
            if ($scope.entity.TipoDePessoa == 'F') {
                if ($scope.entity.PaisDoCliente && $scope.entity.PaisDoCliente.MascaraCPF) {
                    $('#codigoFiscal').mask($scope.entity.PaisDoCliente.MascaraCPF);
                }
                else {
                    $('#codigoFiscal').unmask($scope.entity.PaisDoCliente.MascaraCPF);
                    $scope.cpf_cnpj_invalido = false
                }
            }
            else {
                if ($scope.entity.PaisDoCliente && $scope.entity.PaisDoCliente.MascaraCNPJ) {
                    $('#codigoFiscal').mask($scope.entity.PaisDoCliente.MascaraCNPJ);
                }
                else {
                    $('#codigoFiscal').unmask($scope.entity.PaisDoCliente.MascaraCNPJ);
                    $scope.cpf_cnpj_invalido = false
                }
            }
        };

        function usarValidacao(text) {
            var array = ["brasil", "brazil"];
            var ok = false;
            text = text.toLowerCase();

            //text  = igual um dos valores do array
            //return $.inArray(text, arr) > -1;

            //text conter um dos valores do array
            $.each(array, function (index, value) {
                if (text.indexOf(value) > -1) {
                    ok = true;
                    return false;
                }
            });

            return ok;
        }

        $scope.ValidarCpfCnpf = function (event) {
            if (usarValidacao($scope.entity.PaisDoCliente.Nome)) {
                var cpf_cnpj = $(event.target).val();
                $scope.cpf_cnpj_invalido = !valida_cpf_cnpj(cpf_cnpj);
            }
            else {
                $scope.cpf_cnpj_invalido = false;
            }
        }

        $scope.paisDoClienteChange = function () {
            $scope.SetMascaraCodigoFiscal();
            $('#codigoFiscal').attr('disabled', false);

            if ($scope.entity.PaisDoCliente.Nome == 'BRASIL') {
                $('#telefone').mask("(99) 9999?9-9999")
            }

            if ($scope.entity.PaisDoCliente.Nome != 'BRASIL') {
                $('#telefone').unmask();
            }
            obterRegioes();

            $scope.entity.InscricaoEstadual = '';
            $scope.entity.InscricaoMunicipal = '';
            $scope.entity.CodigoFiscal = '';
            $scope.entity.DcrRegiao = '';
            $scope.entity.Regiao = '';
        }

        $scope.telefoneDoClienteChange = function () {

            if ($scope.entity.PaisDoCliente.Nome == 'BRASIL') {
                //"(99) 9999?9-9999"
                var txt = $('#telefone').val();
                if (txt.length == 14) {
                    $('#telefone').mask("(99) 9999-9999")
                }
            }
        }

        $scope.InputMaskTelefoneCliente = function () {

            if ($scope.entity.PaisDoCliente.Nome == 'BRASIL') {
                $('#telefone').mask("(99) 9999?9-9999")
            }

            if ($scope.entity.PaisDoCliente.Nome != 'BRASIL') {
                $('#telefone').unmask();
            }

        }

        $scope.OutputMaskTelefoneCliente = function () {

            if ($scope.entity.PaisDoCliente.Nome == 'BRASIL') {
                //"(99) 9999?9-9999"
                var txt = $('#telefone').val();
                if (txt.length == 14) {
                    $('#telefone').mask("(99) 9999-9999")
                }
            }

        }

        obterRegioes = function () {
            LookupsMasterdataRepository.getRegioes($scope.entity.PaisDoCliente.Id, settings.currentLang.codigoId).success(function (data) {
                if (data.length) {
                    $('#regiao').attr('disabled', true);
                    $('#regiaoddl').attr('disabled', false);
                    $scope.mostrarDropboxRegiao = true;
                }
                else {
                    $('#regiao').attr('disabled', false);
                    $('#regiaoddl').attr('disabled', true);
                    $scope.mostrarDropboxRegiao = false;
                }
                $scope.regioes = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.$watch('entity.PaisDaRexam', function (newValue) {
            if (newValue) {
                $('#btn-empresas').attr('disabled', false);

                LookupsMasterdataRepository.getCondicoesDeExpedicao(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#condicaoDeExpedicao').attr('disabled', false);
                    $scope.condicoesDeExpedicao = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
                LookupsMasterdataRepository.getCondicoesDePagamento(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#condicaoDePagamento').attr('disabled', false);
                    $scope.condicoesDePagamento = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
                LookupsMasterdataRepository.getRegioesDeVendas(newValue.Id).success(function (data) {
                    $('#regiaoDeVendas').attr('disabled', false);
                    $scope.regioesDeVendas = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
                LookupsMasterdataRepository.getZonasDeTransporte(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#zonaDeTransporte').attr('disabled', false);
                    $scope.zonasDeTransporte = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
                LookupsMasterdataRepository.getEmpresas(newValue.Id).success(function (data) {
                    $scope.empresas = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
                LookupsMasterdataRepository.getGruposDeClientes(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#grupoDeClientes').attr('disabled', false);
                    $scope.gruposDeClientes = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
                LookupsMasterdataRepository.getGruposDePreco(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#grupoDePreco').attr('disabled', false);
                    $scope.gruposDePrecos = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            } else {
                $scope.condicoesDeExpedicao = [];
                $scope.condicoesDePagamento = [];
                $scope.regioesDeVendas = [];
                $scope.zonasDeTransporte = [];
                $scope.empresas = [];
                $scope.gruposDeClientes = [];
                $scope.gruposDePrecos = [];
                $('#btn-empresas').attr('disabled', true);
            }
        });

        $scope.$watch('entity.FlgRecebedorDiferente', function (newValue) {
            if (newValue) {
                $('#codigoClienteSap').attr('disabled', false);
            }
            else {
                $scope.entity.CodigoClienteSap = '';
                $('#codigoClienteSap').attr('disabled', true);
            }
        });

        if ($routeParams.id) {
            $scope.entity.IsInclusao = false;
            app.showProcess();
            MasterdataClienteRepository.findById($routeParams.id).success(function (data) {
                app.hideProcess();

                if (data.Status != 0) {
                    $location.path("/masterdataCliente/historico/" + $routeParams.id);
                    return;
                }

                if (!data.CodigoClienteSap) {
                    data.CodigoClienteSap = '';
                }

                $scope.entity = data;
                $scope.entity.IdExterno = $routeParams.idExterno;

                $('#codigoFiscal').attr('disabled', false);
                obterRegioes();

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        possuiAnexo = function () {
            if ($routeParams.id) {
                if (!$scope.entity.ListaAnexos || $scope.entity.ListaAnexos.length == 0)
                    return false;

                return true;
            }
            else {
                if (!$scope.files || $scope.files.length == 0)
                    return false;

                return true;
            }
        }

        $scope.removeArquivo = function (index) {
            $scope.entity.ListaAnexos.splice(index, 1);
        };

        $scope.submit = function () {
            $scope.showValidation = true;

            if (!possuiAnexo()) {
                var mensagem = localize.localizeText('msgArquivoObrigatorio');
                defaultErrorResponseHandler(status, $location, mensagem);
                return;
            }

            if ($scope.masterdataClientRegistrationForm.$valid) {
                if ($scope.entity.ListaEmpresas.length) {
                    if ($scope.files) {
                        uploadFiles();
                    }
                    else {
                        $scope.onSuccessUpload();
                    }
                }
                else {
                    var mensagem = localize.localizeText('msgEmpresas');
                    defaultErrorResponseHandler(status, $location, mensagem);
                }
            }
            else {
                var tabAtiva = $('#myWizard li.active a').attr('href');
                setFocusWizard(tabAtiva);

                var firstInvalid = ObterFirstElementInvalid($(tabAtiva));
                if (firstInvalid == undefined) {
                    var tabsNaoAtiva = $('#myWizard li').not('.active').find('a');
                    setFocusElementInvalid(tabsNaoAtiva);
                    tabAtiva = $('#myWizard li.active a').attr('href');
                    setFocusWizard(tabAtiva);
                }
                window.event.stopPropagation();
                return false;
            }
        }

        setFocusWizard = function (tab) {
            var wizard = $(tab).find('.form-bootstrapWizard').parent().attr('id');
            if (wizard) {
                var tabsNaoAtiva = $('#myWizard li').not('.active').find('a');
                setFocusElementInvalid(tabsNaoAtiva);
            }
        }

        setFocusElementInvalid = function (elements) {
            $(elements).each(function (event) {
                var tabNaoAtiva = $(this).attr('href');
                firstInvalid = ObterFirstElementInvalid($(tabNaoAtiva));

                //nao localizou e troca de aba
                if (firstInvalid != undefined) {
                    $('#h' + tabNaoAtiva.replace("#", "")).click();
                    $('#' + firstInvalid).focus();
                    return false;
                }
            });
        }

        ObterFirstElementInvalid = function (form) {
            return $(form).find('.ng-invalid:first').attr('name');
        }

        $scope.onSuccessUpload = function () {
            app.showProcess();
            $scope.entity.Idioma = settings.currentLang.codigoId;

            if ($routeParams.taskid) {
                $scope.entity.WorkflowTaskId = $routeParams.taskid;
            }

            MasterdataClienteRepository.saveOrUpdate($scope.entity, function () {
                $location.path('/MasterdataCliente');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
             .success(function (data) {
                 $('#salvar').hide();

                 if ($routeParams.id) {
                     var url = data.replace(/"/g, '');
                     $accountService.salvarSharepoint({
                         url: url,
                         idEntidade: $scope.entity.Id,
                         fluxo: "Masterdata Cliente",
                         msgSucesso: localize.localizeText('msgSucesso'),
                         msgConcluido: localize.localizeText('msgConcluido')
                     });
                 }
                 else {
                     app.hideProcess();
                     FecharJanelaComMensagem(localize.localizeText('msgSucesso'), localize.localizeText('msgConcluido'));
                 }
             });
        }

        //inclusao de empresas
        $scope.$watch('entityEmpresa.empresa', function (newValue) {
            if (newValue) {
                LookupsMasterdataRepository.getPlantas(newValue.Id).success(function (data) {
                    $('#centroDeFornecimento').attr('disabled', false);
                    $scope.centrosDeFornecimento = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            }
        });

        $scope.entity.ListaEmpresas = [];
        $scope.Errors = [];

        ValidarInclusao = function () {
            $scope.showValidationEmpresa = !$scope.entityEmpresa || !$scope.entityEmpresa.empresa || !$scope.entityEmpresa.centroDeFornecimento || (!$scope.entityEmpresa.grupoDeClientes && !$scope.entityEmpresa.novoCodigoGrupoDeClientes) || (!$scope.entityEmpresa.grupoDePreco && !$scope.entityEmpresa.novoCodigoGrupoDePreco);
        }

        $scope.IncluirEmpresa = function () {
            ValidarInclusao();

            if (!$scope.showValidationEmpresa) {
                var novaEmpresa = {
                    IdTemp: $scope.entity.ListaEmpresas.length,
                    IdEmpresa: $scope.entityEmpresa.empresa.Id,
                    DcrEmpresa: $scope.entityEmpresa.empresa.Nome,
                    IdCentroFornecimento: $scope.entityEmpresa.centroDeFornecimento.Id,
                    DcrCentroFornecimento: $scope.entityEmpresa.centroDeFornecimento.Nome,
                };

                if ($scope.entityEmpresa.grupoDeClientes) {
                    novaEmpresa.IdGrupoCliente = $scope.entityEmpresa.grupoDeClientes.Id;
                    novaEmpresa.DcrGrupoCliente = $scope.entityEmpresa.grupoDeClientes.Nome;
                }
                else {
                    novaEmpresa.IdGrupoCliente = '';
                    novaEmpresa.DcrGrupoCliente = '';
                }

                if ($scope.entityEmpresa.grupoDePreco) {
                    novaEmpresa.IdGrupoPreco = $scope.entityEmpresa.grupoDePreco.Id;
                    novaEmpresa.DcrGrupoPreco = $scope.entityEmpresa.grupoDePreco.Nome;
                }

                else {
                    novaEmpresa.IdGrupoPreco = '';
                    novaEmpresa.DcrGrupoPreco = '';
                }

                $scope.entity.ListaEmpresas.push(novaEmpresa);

                limparCampos();
                $scope.showValidationEmpresa = false;
                $('#cadEmpresa').modal('toggle');
            }
        };

        $scope.atualizarEmpresas = function () {
            $scope.centrosDeFornecimento = [];
            $('#centroDeFornecimento').attr('disabled', true);
        }

        limparCampos = function () {
            $scope.entityEmpresa.empresa = '';
            $scope.entityEmpresa.centroDeFornecimento = '';
            $scope.entityEmpresa.grupoDeClientes = '';
            $scope.entityEmpresa.novoCodigoGrupoDeClientes = '';
            $scope.entityEmpresa.grupoDePreco = '';
            $scope.entityEmpresa.novoCodigoGrupoDePreco = '';
        };

        $scope.removeEmpresa = function (index) {
            $scope.entity.ListaEmpresas.splice(index, 1);
        };
        //FIM inclusao de empresas                                        
    }])

    .controller('MasterdataClientDadosFiscaisController', ['$scope', '$location', '$routeParams', 'LookupsMasterdataRepository', 'MasterdataClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $location, $routeParams, LookupsMasterdataRepository, MasterdataClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.settings = settings;
        app.showProcess();

        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsMasterdataRepository.getClassificacaoFiscal(settings.currentLang.codigoId).success(function (data) {
                $scope.classificacoesFiscais = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataRepository.getSetorIndustrial(settings.currentLang.codigoId).success(function (data) {
                $scope.setoresIndustriais = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            MasterdataClienteRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 1 && data.Status != 2) {
                    $location.path("/masterdataCliente/historico/" + $routeParams.id);
                    return;
                }
                if ($scope.entity) {
                    var classificacaoFiscal = $scope.entity.ClassificacaoFiscal;
                    var setorIndustrial = $scope.entity.SetorIndustrial;
                    $scope.entity = data;
                    $scope.entity.ClassificacaoFiscal = classificacaoFiscal;
                    $scope.entity.SetorIndustrial = setorIndustrial;
                }
                else {
                    $scope.entity = data;
                }

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.entity.ClassificacaoFiscal.Id && $scope.entity.SetorIndustrial.Id) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            $scope.resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                ClassificacaoFiscalId: $scope.entity.ClassificacaoFiscal.Id,
                SetorIndustrialId: $scope.entity.SetorIndustrial.Id,
                IdExterno: $routeParams.idExterno
            }

            MasterdataClienteRepository.registrarDadosFiscais($scope.resposta, function () {
                $location.path('/MasterdataCliente');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            }).success(function (data) {
                $('#salvar').hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Cliente",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataClientDadosContabeisController', ['$scope', '$location', '$routeParams', 'LookupsMasterdataRepository', 'MasterdataClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $location, $routeParams, LookupsMasterdataRepository, MasterdataClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.settings = settings;
        app.showProcess();

        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsMasterdataRepository.getContaConciliatoriaCliente(settings.currentLang.codigoId).success(function (data) {
                $scope.contasConciliatorias = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getGrupoClassificacaoContabil(settings.currentLang.codigoId).success(function (data) {
                $scope.gruposClassificaoContabil = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            MasterdataClienteRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();
                if (data.Status != 1 && data.Status != 3) {
                    $location.path("/masterdataCliente/historico/" + $routeParams.id);
                    return;
                }

                $scope.entity = data;

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.entity.ContaConciliatoria.Id) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            $scope.resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                ContaConciliatoriaId: $scope.entity.ContaConciliatoria.Id,
                GrupoClassificacaoContabilId: $scope.entity.GrupoClassificacaoContabil.Id,
                IdExterno: $routeParams.idExterno
            }

            MasterdataClienteRepository.registrarDadosContabeis($scope.resposta, function () {
                $location.path('/MasterdataCliente');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            }).success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Cliente",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataClientPassoFinanceiroController', ['$scope', '$location', '$routeParams', 'LookupsMasterdataRepository', 'MasterdataClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $location, $routeParams, LookupsMasterdataRepository, MasterdataClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.settings = settings;
        app.showProcess();
        $scope.entity = {};
        $scope.$watch('entity.Aprovar', function (newValue) {
            $scope.entity.GrupoAdmTesouraria = {};
            $scope.entity.PedidoDeCorrecao = '';
        });

        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsMasterdataRepository.getGrupoAdmTesouraria(settings.currentLang.codigoId).success(function (data) {
                $scope.gruposAdmTesouraria = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            MasterdataClienteRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();
                if (data.Status != 4) {
                    $location.path("/masterdataCliente/historico/" + $routeParams.id);
                    return;
                }

                data.Aprovar = $scope.entity.Aprovar;
                if (data) {
                    $scope.entity = data;
                    $scope.entity.GrupoAdmTesouraria = {};
                    $scope.entity.PedidoDeCorrecao = '';
                }
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.submit = function (devolver) {
            $scope.devolver = devolver;
            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.masterdataClientPassoFinanceiroForm.pedidoDeCorrecao.$valid;
                }
                else {
                    var valido = $scope.masterdataClientPassoFinanceiroForm.grupoAdmTesouraria.$modelValue.Id;
                }
            }
            else {
                var valido = false;
            }

            $scope.showValidation = true;

            if (valido) {
                $scope.showValidation = false;
                postarFormulario(devolver);
            }
        }

        postarFormulario = function (devolver) {
            app.showProcess();
            $scope.resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                GrupoAdmTesourariaId: $scope.entity.GrupoAdmTesouraria.Id,
                PedidoDeCorrecao: $scope.entity.PedidoDeCorrecao,
                Devolver: devolver,
                IdExterno: $routeParams.idExterno
            }

            MasterdataClienteRepository.registrarDadosFinanceiro($scope.resposta, function () {
                $location.path('/MasterdataCliente');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
             .success(function (data) {
                 $("#salvar").hide();

                 if ($routeParams.id) {
                     var url = data.replace(/"/g, '');
                     $accountService.salvarSharepoint({
                         url: url,
                         idEntidade: $scope.entity.Id,
                         fluxo: "Masterdata Cliente",
                         msgSucesso: localize.localizeText('msgSucesso'),
                         msgConcluido: localize.localizeText('msgConcluido')
                     });
                 }
             });
        }
    }])

    .controller('MasterdataClientCadastroSAPController', ['$scope', '$location', '$routeParams', 'LookupsMasterdataRepository', 'MasterdataClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $location, $routeParams, LookupsMasterdataRepository, MasterdataClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.settings = settings;
        app.showProcess();
        $scope.entity = {};

        $scope.$watch('settings.currentLang', function (newValue) {
            MasterdataClienteRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 5) {
                    $location.path("/masterdataCliente/historico/" + $routeParams.id);
                    return;
                }
                $scope.entity = data;
                $scope.entity.PedidoDeCorrecao = '';
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.submit = function (devolver) {
            $scope.devolver = devolver;
            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.masterdataClientCadastroSapForm.pedidoDeCorrecao.$valid;
                }
                else {
                    var valido = $scope.masterdataClientCadastroSapForm.numeroCliente.$valid;
                }
            }
            else {
                var valido = false;
            }

            $scope.showValidation = true;

            if (valido) {
                postarFormulario(devolver);
            }
        }

        postarFormulario = function (devolver) {
            app.showProcess();

            $scope.resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                NumeroCliente: $scope.entity.NumeroCliente,
                PedidoDeCorrecao: $scope.entity.PedidoDeCorrecao,
                Devolver: devolver,
                IdExterno: $routeParams.idExterno
            }

            MasterdataClienteRepository.registrarDadosSAP($scope.resposta, function () {
                $location.path('/MasterdataCliente');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Cliente",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataClientHistoricoController', ['$scope', '$location', '$routeParams', 'LookupsMasterdataRepository', 'MasterdataClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $location, $routeParams, LookupsMasterdataRepository, MasterdataClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.settings = settings;
        app.showProcess();

        $scope.$watch('settings.currentLang', function (newValue) {
            MasterdataClienteRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                $scope.entity = data;
                app.hideProcess();
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        });
    }])

	.controller('RelatorioRPAViewMasterdataClienteController', ['$scope', '$location', 'MasterdataClienteRelatorioRPAViewRepository', '$window', '$accountService', function ($scope, $location, MasterdataClienteRelatorioRPAViewRepository, $window, $accountService) {
	    $scope.showValidation = false;
	    $scope.userName = localStorage.userName;

	    app.showProcess();
	    MasterdataClienteRelatorioRPAViewRepository.getRelatorio().success(function (data) {
	        $scope.MasterdataClienteRelatorioRPAView = data;
	        $('#tblInbox thead th:eq(0)').removeClass('linkGrid');
	        app.hideProcess();
	    }).error(function (err, status) {
	        defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
	    });

	    $scope.aoColumns = [];

	    $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	        $('td:eq(0)', nRow).unbind("click");
	        $('td:eq(0)', nRow).bind('click', function () {
	            $scope.$apply(function () {
	                $scope.someClickHandler(aData);
	            });
	        });
	        return nRow;
	    };

	    $scope.someClickHandler = function (info) {
	        $window.open(info.UrlAcesso);
	    };

	    $scope.columnDefs = [
            { "mDataProp": "ENUM_TIPO_PESSOA", "aTargets": [0] },
			{ "mDataProp": "PAIS", "aTargets": [1] },
			{ "mDataProp": "CODIGO_FISCAL", "aTargets": [2] },
			{ "mDataProp": "GRUPO_CLIENTE", "aTargets": [3] },
			{ "mDataProp": "GRUPO_CONTA", "aTargets": [4] },
            { "mDataProp": "EMPRESA", "aTargets": [5] },

			{ "mDataProp": "ORG_VENDAS", "aTargets": [6] },
			{ "mDataProp": "CANAL_DISTRIB", "aTargets": [7] },
			{ "mDataProp": "SETOR_ATIVIDADE", "aTargets": [8] },

			{ "mDataProp": "NOME_CLIENTE", "aTargets": [9] },
			{ "mDataProp": "NOME_BUSCA", "aTargets": [10] },
			{ "mDataProp": "RUA", "aTargets": [11] },
			{ "mDataProp": "NUMERO", "aTargets": [12] },
			{ "mDataProp": "COMPLEMENTO", "aTargets": [13] },
			{ "mDataProp": "BAIRRO", "aTargets": [14] },
			{ "mDataProp": "CEP", "aTargets": [15] },
			{ "mDataProp": "CIDADE", "aTargets": [16] },
			{ "mDataProp": "PAIS", "aTargets": [17] },

			{ "mDataProp": "DCR_REGIAO", "aTargets": [18] },

			{ "mDataProp": "TELEFONE", "aTargets": [19] },
			{ "mDataProp": "ZONA_TRANSPORTE", "aTargets": [20] },
			{ "mDataProp": "E_MAIL_NFE", "aTargets": [21] },
			{ "mDataProp": "E_MAIL", "aTargets": [22] },

			{ "mDataProp": "CODIGO_FISCAL", "aTargets": [23] },
			{ "mDataProp": "INSCRICAO_ESTADUAL", "aTargets": [24] },
			{ "mDataProp": "INSCRICAO_MUNICIPAL", "aTargets": [25] },
			{ "mDataProp": "CONTA_CONCILIATORIA", "aTargets": [26] },
			{ "mDataProp": "GRUPO_ADM_TESOURARIA", "aTargets": [27] },
			{ "mDataProp": "CONDICAO_PAGAMENTO", "aTargets": [28] },
			{ "mDataProp": "FORMA_PAGAMENTO", "aTargets": [29] },
			{ "mDataProp": "REGIAO_VENDA", "aTargets": [30] },
			{ "mDataProp": "GRUPO_VENDEDORES", "aTargets": [31] },
			{ "mDataProp": "CONDICAO_EXPEDICAO", "aTargets": [32] },
			{ "mDataProp": "CENTRO_FORNECIMENTO", "aTargets": [33] },
			{ "mDataProp": "INCOTERMS", "aTargets": [34] },
			{ "mDataProp": "GRUPO_CLASSIFICACAO_CONTABIL", "aTargets": [35] },
			{ "mDataProp": "CLASSIFICACAO_FISCAL", "aTargets": [36] },
			{ "mDataProp": "AGENTE_FRETE", "aTargets": [37] },
			{ "mDataProp": "SETOR_INDUSTRIAL", "aTargets": [38] },
			{ "mDataProp": "MOEDA", "aTargets": [39] },

			{ "mDataProp": "GRUPO_PRECO", "aTargets": [40] },
			{ "mDataProp": "ENVASADORA_PRODUTO_ACABADO", "aTargets": [41] },
			{ "mDataProp": "MOTIVO_SOLICITACAO", "aTargets": [42] },
			{ "mDataProp": "FLG_RECEBEDOR_DIFERENTE", "aTargets": [43] },
	    ];

	    $scope.overrideOptions = {
	        "bStateSave": true,
	        "iCookieDuration": 0,//2419200, /* 1 month */
	        "bJQueryUI": true,
	        "bPaginate": true,
	        "bLengthChange": false,
	        "bFilter": true,
	        "bInfo": true,
	        "bDestroy": true
	    };
	}])

    .controller('MasterdataSupplierRegistrationController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsMasterdataRepository', 'MasterdataFornecedorRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsMasterdataRepository, MasterdataFornecedorRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;

        $scope.entity = {
            TipoDePessoa: 'J',
            IsInclusao: true,
            ListaEmpresas: [],
            DadosBancarios: [],
        };
        $scope.settings = settings;

        $('#bootstrap-wizard-1').bootstrapWizard({
            'tabClass': 'form-wizard',
            'onNext': function (tab, navigation, index) {
                $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(index - 1).addClass('complete');
                $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(index - 1).find('.step').html('<i class="fa fa-check"></i>');
            },
            'onTabShow': function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                if ($current >= $total) {
                    $('#bootstrap-wizard-1').find('.pager .next').hide();
                    $('#bootstrap-wizard-1').find('.pager .finish').show();
                    $('#bootstrap-wizard-1').find('.pager .finish').removeClass('disabled');
                } else {
                    $('#bootstrap-wizard-1').find('.pager .next').show();
                    $('#bootstrap-wizard-1').find('.pager .finish').hide();
                }
            },
            //'onTabClick': function (tab, navigation, index) {
            //    return false;
            //}
        });

        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsMasterdataRepository.getPaises(settings.currentLang.codigoId).success(function (data) {
                $scope.paises = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getPaisesRexam(settings.currentLang.codigoId).success(function (data) {
                $scope.paisesRexam = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getFormasDePagamento(settings.currentLang.codigoId).success(function (data) {
                $scope.formasDePagamento = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getMoedas(settings.currentLang.codigoId).success(function (data) {
                $scope.moedas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getGrpEsqFornecedor().success(function (data) {
                $scope.grpsEsqFornecedor = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getSetorIndustrial(settings.currentLang.codigoId).success(function (data) {
                $scope.setoresIndustriais = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataRepository.getTipoLogradouro(settings.currentLang.codigoId).success(function (data) {
                $scope.tiposDeLogradouro = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.SetMascaraCodigoFiscal = function () {
            if ($scope.entity.TipoDePessoa == 'F') {
                if ($scope.entity.PaisDoFornecedor && $scope.entity.PaisDoFornecedor.MascaraCPF) {
                    $('#codigoFiscal').mask($scope.entity.PaisDoFornecedor.MascaraCPF);
                }
                else {
                    $('#codigoFiscal').unmask($scope.entity.PaisDoFornecedor.MascaraCPF);
                    $scope.cpf_cnpj_invalido = false
                }
            }
            else {
                if ($scope.entity.PaisDoFornecedor && $scope.entity.PaisDoFornecedor.MascaraCNPJ) {
                    $('#codigoFiscal').mask($scope.entity.PaisDoFornecedor.MascaraCNPJ);
                }
                else {
                    $('#codigoFiscal').unmask($scope.entity.PaisDoFornecedor.MascaraCNPJ);
                    $scope.cpf_cnpj_invalido = false
                }
            }
            $scope.entity.CodigoFiscal = '';
        };

        $scope.SetMascaraCEP = function () {
            if ($scope.entity.PaisDoFornecedor && $scope.entity.PaisDoFornecedor.MascaraCEP) {
                $('#cep').mask($scope.entity.PaisDoFornecedor.MascaraCEP);
            }
            else {
                $('#cep').unmask($scope.entity.PaisDoFornecedor.MascaraCEP);
                $scope.cep_invalido = false
            }

            $scope.entity.Cep = '';
        };

        function usarValidacao(text) {
            var array = ["brasil", "brazil"];
            var ok = false;
            text = text.toLowerCase();

            //text  = igual um dos valores do array
            //return $.inArray(text, arr) > -1;

            //text conter um dos valores do array
            $.each(array, function (index, value) {
                if (text.indexOf(value) > -1) {
                    ok = true;
                    return false;
                }
            });
            return ok;
        }

        $scope.ValidarCpfCnpf = function (event) {
            if (usarValidacao($scope.entity.PaisDoFornecedor.Nome)) {
                var cpf_cnpj = $(event.target).val();
                $scope.cpf_cnpj_invalido = !valida_cpf_cnpj(cpf_cnpj);
            }
        }

        $scope.ValidarCEP = function (event) {
            if ($scope.entity.PaisDoFornecedor && $scope.entity.PaisDoFornecedor.MascaraCEP) {
                var cep = $(event.target).val();
                $scope.cep_invalido = (cep.length != $scope.entity.PaisDoFornecedor.MascaraCEP.length);
            }
        }


        obterRegioes = function () {
            LookupsMasterdataRepository.getRegioes($scope.entity.PaisDoFornecedor.Id, settings.currentLang.codigoId).success(function (data) {
                if (data.length) {
                    $('#regiao').attr('disabled', true);
                    $('#regiaoddl').attr('disabled', false);
                    $scope.mostrarDropboxRegiao = true;
                }
                else {
                    $('#regiao').attr('disabled', false);
                    $('#regiaoddl').attr('disabled', true);
                    $scope.mostrarDropboxRegiao = false;
                }
                $scope.regioes = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getBanco($scope.entity.PaisDoFornecedor.Id, settings.currentLang.codigoId).success(function (data) {
                $('#btnIncluirBanco').attr('disabled', false);
                $scope.bancos = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.paisDoFornecedorChange = function () {
            $scope.SetMascaraCodigoFiscal();
            $scope.SetMascaraCEP();
            $('#codigoFiscal').attr('disabled', false);

            if ($scope.entity.PaisDoFornecedor.Nome == 'BRASIL') {
                $('#telefone').mask("(99) 9999?9-9999")
            }

            if ($scope.entity.PaisDoFornecedor.Nome != 'BRASIL') {
                $('#telefone').unmask();
            }

            obterRegioes();

            $scope.entity.InscricaoEstadual = '';
            $scope.entity.InscricaoMunicipal = '';
            $scope.entity.CodigoFiscal = '';
            $scope.entity.DcrRegiao = '';
            $scope.entity.Regiao = '';
        }

        $scope.telefoneDoFornecedorChange = function () {

            if ($scope.entity.PaisDoFornecedor.Nome == 'BRASIL') {
                //"(99) 9999?9-9999"
                var txt = $('#telefone').val();
                if (txt.length == 14) {
                    $('#telefone').mask("(99) 9999-9999")
                }
            }
        }

        $scope.InputMaskTelefone = function () {

            if ($scope.entity.PaisDoFornecedor.Nome == 'BRASIL') {
                $('#telefone').mask("(99) 9999?9-9999")
            }

            if ($scope.entity.PaisDoFornecedor.Nome != 'BRASIL') {
                $('#telefone').unmask();
            }

        }

        $scope.OutputMaskTelefone = function () {

            if ($scope.entity.PaisDoFornecedor.Nome == 'BRASIL') {
                //"(99) 9999?9-9999"
                var txt = $('#telefone').val();
                if (txt.length == 14) {
                    $('#telefone').mask("(99) 9999-9999")
                }
            }

        }

        $scope.$watch('entity.PaisDaRexam', function (newValue) {
            if (newValue) {
                LookupsMasterdataRepository.getCondicoesDePagamento(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $('#condicaoDePagamento').attr('disabled', false);
                    $scope.condicoesDePagamento = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });

                LookupsMasterdataRepository.getEmpresas(newValue.Id).success(function (data) {
                    $scope.empresas = data;
                    $('#btnCadEmpresa').attr('disabled', false);
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });

            } else {
                $scope.condicoesDePagamento = [];
                $scope.bancos = [];
            }
        });

        $scope.$watch('entity.CondicaoDePagamento', function (newValue) {
            if (newValue && newValue.InformarJustificativa) {
                $('#justificativaCondicaoPagamento').attr('disabled', false);
            }
            else {
                $scope.entity.JustificativaCondicaoPagamento = '';
                $('#justificativaCondicaoPagamento').attr('disabled', true);
            }
        });

        $scope.$watch('entity.FormaDePagamento', function (newValue) {
            if (newValue && newValue.InformarJustificativa) {
                $('#justificativaFormaDePagamento').attr('disabled', false);
            }
            else {
                $scope.entity.JustificativaFormaPagamento = '';
                $('#justificativaFormaDePagamento').attr('disabled', true);
            }
        });

        if ($routeParams.id) {
            app.showProcess();
            MasterdataFornecedorRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 0) {
                    $location.path("/masterdataFornecedor/historico/" + $routeParams.id);
                    return;
                }

                $scope.entity = data;
                $scope.entity.IdExterno = $routeParams.idExterno;

                $('#codigoFiscal').attr('disabled', false);
                obterRegioes();

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.InArray = function (arr, tipo) {
            if (arr == undefined)
                return false;
            var result = $.grep(arr, function (e) { return e.DcrTipoDocumento == tipo; });
            if (result.length == 0)
                return false;
            return true;
        }

        $scope.ArquivosTipados = [];

        $scope.SetArquivo = function (element, enumTipo) {
            var obj = { file: element.files[0], tipo: enumTipo }

            var result = $.grep($scope.ArquivosTipados, function (e) { return e.tipo == obj.tipo; });
            if (result.length == 0)
                $scope.ArquivosTipados.push(obj);
            else {
                var result = $.grep($scope.ArquivosTipados, function (e) { return e.tipo == obj.tipo && obj.file == undefined; });
                if (result.length == 1)
                    $scope.ArquivosTipados.pop(obj);
            }
        }

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.masterdataSupplierRegistrationForm.$valid) {
                if ($scope.entity.ListaEmpresas.length) {
                    if (!$scope.entity.FormaDePagamento.InformarDadosBancarios || $scope.entity.DadosBancarios.length) {
                        if ($scope.ArquivosTipados && $scope.files == undefined)
                            $scope.files = [];

                        for (var i = 0; i < $scope.ArquivosTipados.length; i++) {
                            $scope.files.push($scope.ArquivosTipados[i]);
                        }

                        if ($scope.files) {
                            uploadFiles();
                        }
                        else {
                            $scope.onSuccessUpload();
                        }
                    }
                    else {
                        var mensagem = localize.localizeText('msgDadosBancarios');
                        defaultErrorResponseHandler(status, $location, mensagem);
                    }
                }
                else {
                    var mensagem = localize.localizeText('msgEmpresas');
                    defaultErrorResponseHandler(status, $location, mensagem);
                }
            }
            else {
                var tabAtiva = $('#myWizard li.active a').attr('href');
                setFocusWizard(tabAtiva);

                var firstInvalid = ObterFirstElementInvalid($(tabAtiva));
                if (firstInvalid == undefined) {
                    var tabsNaoAtiva = $('#myWizard li').not('.active').find('a');
                    setFocusElementInvalid(tabsNaoAtiva);
                    tabAtiva = $('#myWizard li.active a').attr('href');
                    setFocusWizard(tabAtiva);
                }
                window.event.stopPropagation();
                return false;
            }
        }

        setFocusWizard = function (tab) {
            var wizard = $(tab).find('.form-bootstrapWizard').parent().attr('id');
            if (wizard) {
                var tabsNaoAtiva = $('#myWizard li').not('.active').find('a');
                setFocusElementInvalid(tabsNaoAtiva);
            }
        }

        setFocusElementInvalid = function (elements) {
            $(elements).each(function (event) {
                var tabNaoAtiva = $(this).attr('href');
                firstInvalid = ObterFirstElementInvalid($(tabNaoAtiva));

                //nao localizou e troca de aba
                if (firstInvalid != undefined) {
                    $('#h' + tabNaoAtiva.replace("#", "")).click();
                    $('#' + firstInvalid).focus();
                    return false;
                }
            });
        }

        ObterFirstElementInvalid = function (form) {
            return $(form).find('.ng-invalid:first').attr('name');
        }

        $scope.onSuccessUpload = function () {
            app.showProcess();

            $scope.entity.Idioma = settings.currentLang.codigoId;

            if ($routeParams.taskid) {
                $scope.entity.WorkflowTaskId = $routeParams.taskid;
            }

            MasterdataFornecedorRepository.saveOrUpdate($scope.entity, function () {
                $location.path('/MasterdataFornecedor');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Fornecedor",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
                else {
                    app.hideProcess();
                    FecharJanelaComMensagem(localize.localizeText('msgSucesso'), localize.localizeText('msgConcluido'));
                }
            });
        }

        $scope.removeArquivo = function (index) {
            $scope.entity.ListaAnexos.splice(index, 1);
        };

        //inclusao de empresas
        $scope.atualizarEmpresas = function () {
            $scope.organizacaoDeCompra = [];
            $('#organizacaoCompra').attr('disabled', true);
        }

        $scope.$watch('entityEmpresa.empresa', function (newValue) {
            if (newValue) {
                $('#organizacaoCompra').attr('disabled', false);

                LookupsMasterdataRepository.getPlantas(newValue.Id).success(function (data) {
                    $scope.organizacaoDeCompra = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            }
        });

        ValidarInclusaoEmpresa = function () {
            $scope.showValidationEmpresa = !$scope.entityEmpresa || !$scope.entityEmpresa.empresa || !$scope.entityEmpresa.organizacaoCompra;
        }

        $scope.IncluirEmpresa = function () {
            ValidarInclusaoEmpresa();

            if (!$scope.showValidationEmpresa) {
                $scope.entity.ListaEmpresas.push({
                    IdTemp: $scope.entity.ListaEmpresas.length,
                    IdEmpresa: $scope.entityEmpresa.empresa.Id,
                    DcrEmpresa: $scope.entityEmpresa.empresa.Nome,
                    IdOrganizacaoCompra: $scope.entityEmpresa.organizacaoCompra.Id,
                    DcrOrganizacaoCompra: $scope.entityEmpresa.organizacaoCompra.Nome,
                });

                limparCampos();
                $('#cadEmpresa').modal('toggle');
            }
        };

        limparCampos = function () {
            $scope.showValidationEmpresa = false;
            $scope.entityEmpresa.empresa = '';
            $scope.entityEmpresa.organizacaoCompra = '';
        };

        $scope.removeEmpresa = function (index) {
            $scope.entity.ListaEmpresas.splice(index, 1);
        };
        //FIM inclusao de empresas

        //inclusao dados bancarios
        ValidarInclusaoDadosBanco = function () {
            $scope.showValidationBanco = !$scope.entityDadosBancario || !$scope.entityDadosBancario.banco || !$scope.entityDadosBancario.agencia || !$scope.entityDadosBancario.contaCorrente;
        }

        $scope.IncluirBanco = function () {
            ValidarInclusaoDadosBanco();

            if (!$scope.showValidationBanco) {
                $scope.entity.DadosBancarios.push({
                    IdTemp: $scope.entity.DadosBancarios.length,
                    IdBanco: $scope.entityDadosBancario.banco.Id,
                    DcrBanco: $scope.entityDadosBancario.banco.Nome,
                    Agencia: $scope.entityDadosBancario.agencia,
                    ContaCorrente: $scope.entityDadosBancario.contaCorrente,
                    AgenciaDigito: $scope.entityDadosBancario.agenciaDigito,
                    ContaDigito: $scope.entityDadosBancario.contaDigito,
                    CBU: $scope.entityDadosBancario.cbu,
                });

                limparCamposBanco();
                $('#cadBanco').modal('toggle');
            }
        };

        limparCamposBanco = function () {
            $scope.showValidationBanco = false;
            $scope.entityDadosBancario.banco = '';
            $scope.entityDadosBancario.agencia = '';
            $scope.entityDadosBancario.contaCorrente = '';
            $scope.entityDadosBancario.agenciaDigito = '';
            $scope.entityDadosBancario.contaDigito = '';
            $scope.entityDadosBancario.cbu = '';
        };

        $scope.removeBanco = function (index) {
            $scope.entity.DadosBancarios.splice(index, 1);
        };
        //FIM inclusao dados bancarios
    }])

    .controller('MasterdataSupplierDadosContabeisController', ['$scope', '$location', '$routeParams', 'LookupsMasterdataRepository', 'MasterdataFornecedorRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $location, $routeParams, LookupsMasterdataRepository, MasterdataFornecedorRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.entity = {};
        $scope.settings = settings;

        $scope.$watch('settings.currentLang', function (newValue) {
            app.showProcess();

            LookupsMasterdataRepository.getContaConciliatoriaFornecedor(settings.currentLang.codigoId).success(function (data) {
                $scope.contasConciliatorias = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsMasterdataRepository.getGruposDeContasFornecedor(settings.currentLang.codigoId).success(function (data) {
                $scope.gruposDeContas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            MasterdataFornecedorRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();
                if (data.Status != 3) {
                    $location.path("/masterdataFornecedor/historico/" + $routeParams.id);
                    return;
                }
                if ($scope.entity) {
                    var contaConciliatoria = $scope.entity.ContaConciliatoria;
                    var grupoDeContas = $scope.entity.GrupoDeContas;
                    data.Aprovar = $scope.entity.Aprovar;
                    $scope.entity = data;
                    if (contaConciliatoria)
                        $scope.entity.ContaConciliatoria = contaConciliatoria;
                    if (grupoDeContas)
                        $scope.entity.GrupoDeContas = grupoDeContas;
                }
                else {
                    $scope.entity = data;
                }

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.submit = function (devolver) {
            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.entity.PedidoDeCorrecao;
                }
                else {
                    var valido = $scope.entity.GrupoDeContas && $scope.entity.ContaConciliatoria;
                }
            }
            else {
                var valido = false;
            }

            $scope.devolver = devolver;
            $scope.showValidation = true;

            if (valido) {
                postarFormulario(devolver);
            }
        }

        postarFormulario = function (devolver) {
            app.showProcess();

            $scope.resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                ContaConciliatoriaId: $scope.entity.ContaConciliatoria ? $scope.entity.ContaConciliatoria.Id : null,
                GrupoDeContasId: $scope.entity.GrupoDeContas ? $scope.entity.GrupoDeContas.Id : null,
                PedidoDeCorrecao: $scope.entity.PedidoDeCorrecao,
                Devolver: devolver,
                IdExterno: $routeParams.idExterno
            }

            MasterdataFornecedorRepository.registrarDadosContabeis($scope.resposta, function () {
                $location.path('/MasterdataFornecedor');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            }).success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Fornecedor",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataSupplierAprovacaoFinanceiroController', ['$scope', '$location', '$routeParams', 'LookupsMasterdataRepository', 'MasterdataFornecedorRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $location, $routeParams, LookupsMasterdataRepository, MasterdataFornecedorRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.entity = {};
        $scope.settings = settings;

        $scope.$watch('settings.currentLang', function (newValue) {
            app.showProcess();

            MasterdataFornecedorRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 4) {
                    $location.path("/masterdataFornecedor/historico/" + $routeParams.id);
                    return;
                }
                data.Aprovar = $scope.entity.Aprovar;

                $scope.entity = data;
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.submit = function (devolver) {
            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.entity.PedidoDeCorrecao;
                }
                else {
                    var valido = true;
                }
            }
            else {
                var valido = false;
            }

            $scope.devolver = devolver;
            $scope.showValidation = true;

            if (valido) {
                $scope.showValidation = false;
                postarFormulario(devolver);
            }
        }

        postarFormulario = function (devolver) {
            app.showProcess();

            $scope.resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                PedidoDeCorrecao: $scope.entity.PedidoDeCorrecao,
                Devolver: devolver,
                IdExterno: $routeParams.idExterno
            }

            MasterdataFornecedorRepository.registrarDadosFiscais($scope.resposta, function () {
                $location.path('/MasterdataFornecedor');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            }).success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Fornecedor",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataSupplierCadastroSAPController', ['$scope', '$location', '$routeParams', 'LookupsMasterdataRepository', 'MasterdataFornecedorRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $location, $routeParams, LookupsMasterdataRepository, MasterdataFornecedorRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.entity = {};
        $scope.settings = settings;

        $scope.$watch('settings.currentLang', function (newValue) {
            app.showProcess();

            MasterdataFornecedorRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 5) {
                    $location.path("/masterdataFornecedor/historico/" + $routeParams.id);
                    return;
                }
                data.Aprovar = $scope.entity.Aprovar;
                $scope.entity = data;
                $scope.entity.PedidoDeCorrecao = '';
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.submit = function (devolver) {
            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.entity.PedidoDeCorrecao && $scope.entity.Status;
                }
                else {
                    var valido = $scope.entity.NumeroFornecedorSAP;
                }
            }
            else {
                var valido = false;
            }
            $scope.devolver = devolver;
            $scope.showValidation = true;

            if (valido) {
                postarFormulario(devolver);
            }
        }

        postarFormulario = function (devolver) {
            app.showProcess();

            $scope.resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                NumeroFornecedor: $scope.entity.NumeroFornecedorSAP,
                Status: $scope.entity.Status,
                PedidoDeCorrecao: $scope.entity.PedidoDeCorrecao,
                Devolver: devolver,
                IdExterno: $routeParams.idExterno
            }

            MasterdataFornecedorRepository.registrarDadosSAP($scope.resposta, function () {
                $location.path('/MasterdataFornecedor');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            }).success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Fornecedor",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataSupplierHistoricoController', ['$scope', '$location', '$routeParams', 'LookupsMasterdataRepository', 'MasterdataFornecedorRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $location, $routeParams, LookupsMasterdataRepository, MasterdataFornecedorRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.settings = settings;
        app.showProcess();

        $scope.$watch('settings.currentLang', function (newValue) {
            MasterdataFornecedorRepository.getCadastroById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                $scope.entity = data;
                app.hideProcess();
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });
    }])

	.controller('RelatorioRPAViewMasterdataFornecedorController', ['$scope', '$location', 'MasterdataFornecedorRelatorioRPAViewRepository', '$window', '$accountService', function ($scope, $location, MasterdataFornecedorRelatorioRPAViewRepository, $window, $accountService) {
	    $scope.showValidation = false;
	    $scope.userName = localStorage.userName;

	    app.showProcess();
	    MasterdataFornecedorRelatorioRPAViewRepository.getRelatorio().success(function (data) {
	        if (data.length > 0)
	            $scope.MasterdataFornecedorRelatorioRPAView = data;
	        else
	            $scope.MasterdataFornecedorRelatorioRPAView = [];

	        $('#tblInbox thead th:eq(0)').removeClass('linkGrid');
	        app.hideProcess();
	    }).error(function (err, status) {
	        defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
	    });

	    $scope.aoColumns = [];

	    $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	        $('td:eq(0)', nRow).unbind("click");
	        $('td:eq(0)', nRow).bind('click', function () {
	            $scope.$apply(function () {
	                $scope.someClickHandler(aData);
	            });
	        });
	        return nRow;
	    };

	    $scope.someClickHandler = function (info) {
	        $window.open(info.UrlAcesso);
	    };

	    $scope.columnDefs = [
            { "mDataProp": "EMPRESA", "aTargets": [0] },
            { "mDataProp": "ORG_COMPRAS", "aTargets": [1] },
			{ "mDataProp": "ID_GRUPO_CONTAS", "aTargets": [2] },
			{ "mDataProp": "NOME", "aTargets": [3] },
			{ "mDataProp": "TERMO_PESQUISA", "aTargets": [4] },
			{ "mDataProp": "RUA", "aTargets": [5] },
			{ "mDataProp": "NUMERO", "aTargets": [6] },
			{ "mDataProp": "CX_POSTAL", "aTargets": [7] },
			{ "mDataProp": "REGIAO_CIDADE", "aTargets": [8] },
			{ "mDataProp": "PAIS", "aTargets": [9] },
			{ "mDataProp": "LOCAL_ESTADO", "aTargets": [10] },
			{ "mDataProp": "COMPLEMENTO", "aTargets": [11] },
			{ "mDataProp": "BAIRRO", "aTargets": [12] },
			{ "mDataProp": "TELEFONE", "aTargets": [13] },
			{ "mDataProp": "EMAIL", "aTargets": [14] },
			{ "mDataProp": "CNPJ", "aTargets": [15] },
			{ "mDataProp": "CPF", "aTargets": [16] },
			{ "mDataProp": "PESSOA_FISICA", "aTargets": [17] },
			{ "mDataProp": "INSCRICAO_ESTADUAL", "aTargets": [18] },
			{ "mDataProp": "INSCRICAO_MUNICIPAL", "aTargets": [19] },
			{ "mDataProp": "SETOR_INDUSTRIAL", "aTargets": [20] },

			{ "mDataProp": "PAIS_F", "aTargets": [21] },
			{ "mDataProp": "ID_BANCO1", "aTargets": [22] },
			{ "mDataProp": "AGENCIA1", "aTargets": [23] },
			{ "mDataProp": "AGENCIA_DIGITO1", "aTargets": [24] },
			{ "mDataProp": "CONTA_CORRENTE1", "aTargets": [25] },
			{ "mDataProp": "CONTA_DIGITO1", "aTargets": [26] },
			{ "mDataProp": "TITULAR_CONTA1", "aTargets": [27] },
			{ "mDataProp": "CBU1", "aTargets": [28] },

			{ "mDataProp": "PAIS_F2", "aTargets": [29] },
			{ "mDataProp": "ID_BANCO2", "aTargets": [30] },
			{ "mDataProp": "AGENCIA2", "aTargets": [31] },
			{ "mDataProp": "AGENCIA_DIGITO2", "aTargets": [32] },
			{ "mDataProp": "CONTA_CORRENTE2", "aTargets": [33] },
			{ "mDataProp": "CONTA_DIGITO2", "aTargets": [34] },
			{ "mDataProp": "TITULAR_CONTA2", "aTargets": [35] },
			{ "mDataProp": "CBU2", "aTargets": [36] },

			{ "mDataProp": "MOTIVO_SOLICITACAO", "aTargets": [37] },
			{ "mDataProp": "CONTA_CONCILIATORIA", "aTargets": [38] },
			{ "mDataProp": "CONDICAO_PAGAMENTO", "aTargets": [39] },
			{ "mDataProp": "VERF_DUPLICADAS", "aTargets": [40] },
			{ "mDataProp": "FORM_PAGAMENTO", "aTargets": [41] },
			{ "mDataProp": "ID_MOEDA", "aTargets": [42] },
			{ "mDataProp": "ID_CONDICAO_PAGAMENTO", "aTargets": [43] },
			{ "mDataProp": "VER_FAT_BAS_EM", "aTargets": [44] }
	    ];

	    $scope.overrideOptions = {
	        "bStateSave": true,
	        "iCookieDuration": 0,//2419200, /* 1 month */
	        "bJQueryUI": true,
	        "bPaginate": true,
	        "bLengthChange": false,
	        "bFilter": true,
	        "bInfo": true,
	        "bDestroy": true
	    };
	}])

    .controller('MasterdataMaterialRegistrationController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsMasterdataMaterialRepository', 'MasterdataMaterialRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsMasterdataMaterialRepository, MasterdataMaterialRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.entity = { TipoMaterial: 0 };
        $scope.entityListaTecnica = {};
        $scope.settings = settings;

        $scope.init = function () {
            if (!$routeParams.id) {
                switch ($scope.entity.TipoMaterial.toString()) {
                    case "0"://ERSA
                        $scope.entity.FlgFerramentaIntermutavel = 'false';
                        $scope.entity.FlgItemCritico = 'false';
                        $scope.entity.FlgItemRecuperavel = 'false';
                        break;
                    case "1"://ROH
                    case "2"://LEIH
                    case "3"://VERP
                    case "4"://DIEN
                    case "6"://HALB
                    case "7"://NLAG
                    case "8"://FERT
                        $scope.entity.FlgModeloMaterial = 'false';
                        break;
                }
            }
        }

        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsMasterdataMaterialRepository.getPlantas(settings.currentLang.codigoId).success(function (data) {
                $scope.plantas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            carregarLookupsMateriais();
        });

        $scope.$watch('entity.TipoMaterial', function (newValue) {
            if (!$routeParams.id) {
                $scope.entity = { TipoMaterial: newValue };
            }
            carregarLookupsMateriais();
        });

        carregarLookupsMateriais = function () {
            LookupsMasterdataMaterialRepository.getUnidadesDeMedida($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.unidadesMedida = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getGruposDeMercadoria($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.gruposMercadoria = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getUtilizacaoEquipamento($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.utilizacoesEquipamento = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getEquipamentos(settings.currentLang.codigoId).success(function (data) {
                $scope.equipamentos = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getOrigemMaterial(settings.currentLang.codigoId).success(function (data) {
                $scope.origensMaterial = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getTiposMRP($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.tiposMrp = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getLabEsc(settings.currentLang.codigoId).success(function (data) {
                $scope.labsEsc = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getAplicacaoEquipamento(settings.currentLang.codigoId).success(function (data) {
                $scope.aplicacoesEquipamento = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getGrupoMrp(settings.currentLang.codigoId).success(function (data) {
                $scope.gruposMrp = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getCentroLucro(settings.currentLang.codigoId).success(function (data) {
                $scope.centrosLucro = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getDepositoProducao(settings.currentLang.codigoId).success(function (data) {
                $scope.depositosProducao = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.$watch('entity.Planta', function (newValue) {
            if (newValue) {
                LookupsMasterdataMaterialRepository.getDepositos(newValue.Id, $scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                    $scope.depositos = data;
                    $('#deposito').attr('disabled', false);
                }).error(function (err, status) {
                    $('#deposito').attr('disabled', true);
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            } else {
                $scope.depositos = [];
                $('#deposito').attr('disabled', true);
            }
        });

        $scope.$watch('entityPlanta.Planta', function (newValue) {
            if (newValue) {
                LookupsMasterdataMaterialRepository.getDepositos(newValue.Id, 8, settings.currentLang.codigoId).success(function (data) {
                    $scope.depositos = data;
                    $('#regDeposito').attr('disabled', false);
                }).error(function (err, status) {
                    $('#regDeposito').attr('disabled', true);
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            } else {
                $scope.depositos = [];
                $('#regDeposito').attr('disabled', true);
            }
        });

        $scope.$watch('entity.FlgModeloMaterial', function (newValue) {
            if (newValue === 'true') {
                $('#codigoMaterialSap').attr('disabled', false);
            }
            else {
                $scope.entity.CodigoModeloMaterialSap = '';
                $('#codigoMaterialSap').attr('disabled', true);
            }
        });

        $scope.$watch('entity.TipoMrp', function (newValue) {
            if (newValue) {
                LookupsMasterdataMaterialRepository.getPlanejadorMRP(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $scope.planejadoresMrp = data;
                    $('#planejadorMrp').attr('disabled', false);
                }).error(function (err, status) {
                    $('#planejadorMrp').attr('disabled', true);
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            } else {
                $scope.planejadoresMrp = [];
                $('#planejadorMrp').attr('disabled', true);
            }
        });

        $scope.$watch('entity.PlanejadorMrp', function (newValue) {
            if (newValue) {
                LookupsMasterdataMaterialRepository.getTamanhoLoteMRP(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $scope.tamanhosLoteMrp = data;
                    $('#tamanhoLoteMrp').attr('disabled', false);
                }).error(function (err, status) {
                    $('#tamanhoLoteMrp').attr('disabled', true);
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            } else {
                $scope.tamanhosLoteMrp = [];
                $('#tamanhoLoteMrp').attr('disabled', true);
            }
        });

        if ($routeParams.id) {
            $scope.entity.IsInclusao = false;
            app.showProcess();

            MasterdataMaterialRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 0) {
                    $location.path("/masterdataMaterial/historico/" + $routeParams.id);
                    return;
                }

                $('#tipoMaterial').attr('disabled', true);
                $scope.entity = data;
                if ($scope.entity.FlgModeloMaterial != null)
                    $scope.entity.FlgModeloMaterial = $scope.entity.FlgModeloMaterial.toString();
                if ($scope.entity.FlgItemCritico != null)
                    $scope.entity.FlgItemCritico = $scope.entity.FlgItemCritico.toString();
                if ($scope.entity.FlgFerramentaIntermutavel != null)
                    $scope.entity.FlgFerramentaIntermutavel = $scope.entity.FlgFerramentaIntermutavel.toString();
                if ($scope.entity.FlgItemRecuperavel != null)
                    $scope.entity.FlgItemRecuperavel = $scope.entity.FlgItemRecuperavel.toString();
                if ($scope.entity.FlgDeixarVersaoBloqueadoZ1 != null)
                    $scope.entity.FlgDeixarVersaoBloqueadoZ1 = $scope.entity.FlgDeixarVersaoBloqueadoZ1.toString();;
                if ($scope.entity.FlgDeixarVersaoBloqueado03 != null)
                    $scope.entity.FlgDeixarVersaoBloqueado03 = $scope.entity.FlgDeixarVersaoBloqueado03.toString();
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.removeArquivo = function (index) {
            $scope.entity.ListaAnexos.splice(index, 1);
        };

        $scope.submit = function () {
            $scope.showValidation = true;
            $scope.Errors = [];

            if ($scope.masterdataMaterialRegistrationForm.$valid) {
                if ($scope.files) {
                    uploadFiles();
                }
                else {
                    $scope.onSuccessUpload();
                }
            }
        };

        $scope.onSuccessUpload = function () {
            app.showProcess();
            $scope.entity.Idioma = settings.currentLang.codigoId;

            if ($routeParams.idExterno)
                $scope.entity.IdExterno = $routeParams.idExterno;
            if ($routeParams.taskid)
                $scope.entity.WorkflowTaskId = $routeParams.taskid;

            MasterdataMaterialRepository.saveOrUpdate($scope.entity, function () {
                $location.path('/MasterdataMaterial');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Material",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
                else {
                    app.hideProcess();
                    FecharJanelaComMensagem(localize.localizeText('msgSucesso'), localize.localizeText('msgConcluido'));
                }
            });
        }

        //inclusao de informações lista técnica

        $scope.entity.ListaInformacaoTecnica = [];
        $scope.Errors = [];

        ValidarInclusaoListaTecnica = function () {
            $scope.showValidationListaTecnica = !($scope.entityListaTecnica && $scope.entityListaTecnica.codigo && $scope.entityListaTecnica.produto && $scope.entityListaTecnica.quantidade && $scope.entityListaTecnica.unidadeMedida);
        }

        $scope.IncluirInformacaoListaTecnica = function () {
            ValidarInclusaoListaTecnica();

            if (!$scope.showValidationListaTecnica) {
                var novaInformacao = {
                    Codigo: $scope.entityListaTecnica.codigo,
                    Produto: $scope.entityListaTecnica.produto,
                    Quantidade: $scope.entityListaTecnica.quantidade,
                    UnidadeMedida: $scope.entityListaTecnica.unidadeMedida
                };

                if (!$scope.entity.ListaInformacaoTecnica) {
                    $scope.entity.ListaInformacaoTecnica = [novaInformacao];
                }
                else {
                    $scope.entity.ListaInformacaoTecnica.push(novaInformacao);
                }

                limparCamposListaTecnica();
                $scope.showValidationListaTecnica = false;
                $('#cadListaTecnica').modal('toggle');
            }
        };

        limparCamposListaTecnica = function () {
            $scope.entityListaTecnica.codigo = '';
            $scope.entityListaTecnica.produto = '';
            $scope.entityListaTecnica.quantidade = '';
            $scope.entityListaTecnica.unidadeMedida = '';
        };

        $scope.removeListaTecnica = function (index) {
            $scope.entity.ListaInformacaoTecnica.splice(index, 1);
        };

        //FIM inclusao de informacao 

        //inclusao de planta

        $scope.entity.ListaPlantas = [];
        $scope.Errors = [];

        ValidarInclusaoPlanta = function () {
            $scope.showValidationPlanta = !$scope.entityPlanta || !$scope.entityPlanta.Planta.Id || !$scope.entityPlanta.Deposito.Id;
        }

        $scope.IncluirPlanta = function () {
            ValidarInclusaoPlanta();

            if (!$scope.showValidationPlanta) {
                var novaInformacao = {
                    IdPlanta: $scope.entityPlanta.Planta.Id,
                    DcrPlanta: $scope.entityPlanta.Planta.Nome,
                    IdDeposito: $scope.entityPlanta.Deposito.Id,
                    DcrDeposito: $scope.entityPlanta.Deposito.Nome
                };

                if (!$scope.entity.ListaPlantas) {
                    $scope.entity.ListaPlantas = [novaInformacao];
                }
                else {
                    $scope.entity.ListaPlantas.push(novaInformacao);
                }

                limparCamposPlanta();
                $scope.showValidationPlanta = false;
                $('#cadPlanta').modal('toggle');
            }
        };

        limparCamposPlanta = function () {
            $scope.entityPlanta.Planta = '';
            $scope.entityPlanta.Deposito = '';
        };

        $scope.removePlanta = function (index) {
            $scope.entity.ListaPlantas.splice(index, 1);
        };

        $scope.atualizarPlantas = function () {
            LookupsMasterdataMaterialRepository.getPlantas(settings.currentLang.codigoId).success(function (data) {
                $scope.plantas = data;
                angular.forEach($scope.entity.ListaPlantas, function (value, key) {
                    $scope.plantas = $.grep($scope.plantas, function (e) {
                        return e.Id != value.IdPlanta;
                    });
                });
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        //FIM inclusao de plantas 

    }])

    .controller('MasterdataMaterialSuprimentosController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsMasterdataMaterialRepository', 'MasterdataMaterialRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsMasterdataMaterialRepository, MasterdataMaterialRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.entity = { TipoMaterial: 0 };
        $scope.resposta = {};

        obterEnum = function () {
            var idEnum = $scope.entity.TipoMaterial;
            switch (idEnum) {
                case 0:
                    return 'ERSA';
                case 1:
                    return 'ROH';
                case 2:
                    return 'LEIH';
                case 3:
                    return 'VERP';
                case 4:
                    return 'DIEN';
                case 5:
                    return 'HIBE';
                case 6:
                    return 'HALB';
                case 7:
                    return 'NLAG';
                case 8:
                    return 'FERT';
            }
        }

        $scope.exibirCustoMaterial = function () {
            var tipoEnum = obterEnum();
            switch (obterEnum()) {
                case 'DIEN':
                    return false;
                default:
                    return true;
            }
        }

        $scope.exibirCodigoNCM = function () {
            switch (obterEnum()) {
                case 'ERSA':
                case 'ROH':
                case 'LEIH':
                case 'VERP':
                case 'HIBE':
                case 'HALB':
                case 'NLAG':
                    return true;
                default:
                    return false;
            }
        }

        if ($routeParams.id) {
            app.showProcess();

            MasterdataMaterialRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 1) {
                    $location.path("/masterdataMaterial/historico/" + $routeParams.id);
                    return;
                }

                $scope.entity = data;
                $scope.resposta.CustoMaterial = $scope.entity.CustoMaterial;
                $scope.resposta.CodigoNcm = $scope.entity.CodigoNcm;
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        isValid = function () {
            var valid = true;

            if ($scope.exibirCustoMaterial() && !$scope.resposta.CustoMaterial)
                valid = false;

            if ($scope.exibirCodigoNCM() && !$scope.resposta.CodigoNcm)
                valid = false;

            return valid;
        }

        $scope.submit = function (devolver) {
            $scope.showValidation = true;
            $scope.devolver = devolver;

            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.resposta.PedidoCorrecao;
                }
                else {
                    var valido = isValid();
                }
            }
            else {
                var valido = false;
            }

            if (valido) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            $scope.resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                IdExterno: $routeParams.idExterno,
                CustoMaterial: toDecimal($scope.resposta.CustoMaterial, 2),
                CodigoNcm: $scope.resposta.CodigoNcm,
                Devolver: $scope.devolver,
                PedidoDeCorrecao: $scope.resposta.PedidoCorrecao
            };

            MasterdataMaterialRepository.registrarDadosSuprimentos($scope.resposta, function () {
                $location.path('/MasterdataMaterial');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Material",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }

    }])

    .controller('MasterdataMaterialFiscalController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsMasterdataMaterialRepository', 'MasterdataMaterialRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsMasterdataMaterialRepository, MasterdataMaterialRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.entity = { TipoMaterial: 0 };
        $scope.resposta = {};

        $scope.$watch('settings.currentLang', function (newValue) {
            carregarLookups();
        });

        $scope.$watch('entity.TipoMaterial', function (newValue) {
            carregarLookups();
        });

        var carregarLookups = function () {
            LookupsMasterdataMaterialRepository.getCategoriaCFOP($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.categoriasCfop = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getClassificacaoFiscal($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.classificacoesFiscais = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsMasterdataMaterialRepository.getUtilizacaoMaterial($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.utilizacoesDoMaterial = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        };

        if ($routeParams.id) {
            app.showProcess();
            MasterdataMaterialRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 2 && data.Status != 3) {
                    $location.path("/masterdataMaterial/historico/" + $routeParams.id);
                    return;
                }
                $scope.entity = data;

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.submit = function (devolver) {
            $scope.showValidation = true;
            $scope.devolver = devolver;

            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.resposta.PedidoCorrecao && $scope.resposta.DevolverPara;
                }
                else {
                    var valido = $scope.resposta.UtilizacaoDoMaterial && $scope.resposta.ClassificacaoFiscal && $scope.resposta.CategoriaCfop;
                }
            }
            else {
                var valido = false;
            }

            if (valido) {
                $scope.showValidation = false;
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            var respostaModel = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                Status: $scope.resposta.DevolverPara,
                IdExterno: $routeParams.idExterno,
                Devolver: $scope.devolver,
                PedidoDeCorrecao: $scope.resposta.PedidoCorrecao,
                CategoriaCfopId: $scope.resposta.CategoriaCfop ? $scope.resposta.CategoriaCfop.Id : null,
                ClassificacaoFiscalId: $scope.resposta.ClassificacaoFiscal ? $scope.resposta.ClassificacaoFiscal.Id : null,
                UtilizacaoMaterialId: $scope.resposta.UtilizacaoDoMaterial ? $scope.resposta.UtilizacaoDoMaterial.Id : null,
            };

            MasterdataMaterialRepository.registrarDadosFiscais(respostaModel, function () {
                $location.path('/MasterdataMaterial');
            })
                .success(function (data) {
                    $("#salvar").hide();

                    if ($routeParams.id) {
                        var url = data.replace(/"/g, '');
                        $accountService.salvarSharepoint({
                            url: url,
                            idEntidade: $scope.entity.Id,
                            fluxo: "Masterdata Material",
                            msgSucesso: localize.localizeText('msgSucesso'),
                            msgConcluido: localize.localizeText('msgConcluido')
                        });
                    }
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                    app.hideProcess();
                });
        }
    }])

    .controller('MasterdataMaterialContabilController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsMasterdataMaterialRepository', 'MasterdataMaterialRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsMasterdataMaterialRepository, MasterdataMaterialRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.entity = { TipoMaterial: 0 };
        $scope.resposta = {};

        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsMasterdataMaterialRepository.getClasseAvaliacao($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.classesAvaliacao = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.$watch('entity.TipoMaterial', function (newValue) {
            LookupsMasterdataMaterialRepository.getClasseAvaliacao($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.classesAvaliacao = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        if ($routeParams.id) {
            app.showProcess();
            MasterdataMaterialRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 2 && data.Status != 4) {
                    $location.path("/masterdataMaterial/historico/" + $routeParams.id);
                    return;
                }

                $scope.entity = data;
                $scope.resposta.ClasseAvaliacao = $scope.entity.ClasseAvaliacao;
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.submit = function (devolver) {
            $scope.showValidation = true;
            $scope.devolver = devolver;

            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.resposta.PedidoCorrecao && $scope.resposta.DevolverPara;
                }
                else {
                    var valido = $scope.resposta.ClasseAvaliacao;
                }
            }
            else {
                var valido = false;
            }

            if (valido) {
                $scope.showValidation = false;
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            var resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                IdExterno: $routeParams.idExterno,
                Status: $scope.resposta.DevolverPara,
                Devolver: $scope.devolver,
                PedidoDeCorrecao: $scope.resposta.PedidoCorrecao,
                ClasseAvaliacaoId: $scope.resposta.ClasseAvaliacao ? $scope.resposta.ClasseAvaliacao.Id : null,
            };

            MasterdataMaterialRepository.registrarDadosContabeis(resposta, function () {
                $location.path('/MasterdataMaterial');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Material",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataMaterialEngenhariaController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsMasterdataMaterialRepository', 'MasterdataMaterialRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsMasterdataMaterialRepository, MasterdataMaterialRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.entity = { TipoMaterial: 0 };
        $scope.resposta = {};

        if ($routeParams.id) {
            app.showProcess();
            MasterdataMaterialRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 5) {
                    $location.path("/masterdataMaterial/historico/" + $routeParams.id);
                    return;
                }

                $scope.entity = data;
                $scope.resposta.DescricaoCurta = $scope.entity.DescricaoCurta;
                $scope.resposta.DescricaoLonga = $scope.entity.DescricaoLonga;
                $scope.resposta.GrupoMercadoria = $scope.entity.GrupoMercadoria;

                LookupsMasterdataMaterialRepository.getGruposDeMercadoria($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                    $scope.gruposMercadoria = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });

            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsMasterdataMaterialRepository.getGruposDeMercadoria($scope.entity.TipoMaterial, settings.currentLang.codigoId).success(function (data) {
                $scope.gruposMercadoria = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.submit = function (devolver) {
            $scope.showValidation = true;
            $scope.devolver = devolver;

            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.resposta.PedidoCorrecao && $scope.entity.DevolverPara;
                }
                else {
                    var valido = $scope.resposta.DescricaoCurta && $scope.resposta.DescricaoLonga && $scope.resposta.GrupoMercadoria;
                }
            }
            else {
                var valido = false;
            }

            if (valido) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            var resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                IdExterno: $routeParams.idExterno,
                Status: $scope.entity.DevolverPara,
                Devolver: $scope.devolver,
                PedidoDeCorrecao: $scope.resposta.PedidoCorrecao,
                DescricaoCurta: $scope.resposta.DescricaoCurta,
                DescricaoLonga: $scope.resposta.DescricaoLonga,
                GrupoMercadoriaId: $scope.resposta.GrupoMercadoria ? $scope.resposta.GrupoMercadoria.Id : null,
            };

            MasterdataMaterialRepository.registrarDadosEngenharia(resposta, function () {
                $location.path('/MasterdataMaterial');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Material",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataMaterialCadastroSapController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsMasterdataMaterialRepository', 'MasterdataMaterialRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsMasterdataMaterialRepository, MasterdataMaterialRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.entity = { TipoMaterial: 0 };

        if ($routeParams.id) {
            app.showProcess();
            MasterdataMaterialRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 6) {
                    $location.path("/masterdataMaterial/historico/" + $routeParams.id);
                    return;
                }

                $scope.entity = data;
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.submit = function (devolver) {
            $scope.showValidation = true;
            $scope.devolver = devolver;

            if ($scope.entity.Aprovar) {
                if (devolver) {
                    var valido = $scope.entity.PedidoCorrecao && $scope.entity.DevolverPara;
                }
                else {
                    var valido = $scope.entity.CodigoSap;
                }
            }
            else {
                var valido = false;
            }

            if (valido) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            var resposta = {
                MasterdataId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                IdExterno: $routeParams.idExterno,
                Status: $scope.entity.DevolverPara,
                CodigoMaterialSap: $scope.entity.CodigoSap,
                Devolver: $scope.devolver,
                PedidoDeCorrecao: $scope.entity.PedidoCorrecao
            };

            MasterdataMaterialRepository.registrarDadosSAP(resposta, function () {
                $location.path('/MasterdataMaterial');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Masterdata Material",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('MasterdataMaterialHistoricoController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsMasterdataMaterialRepository', 'MasterdataMaterialRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsMasterdataMaterialRepository, MasterdataMaterialRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.settings = settings;
        $scope.entity = { TipoMaterial: 0 };

        if ($routeParams.id) {
            app.showProcess();
            MasterdataMaterialRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                $scope.entity = data;
                app.hideProcess();
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }
    }])

	.controller('RelatorioRPAViewMasterdataMaterialController', ['$scope', '$location', 'MasterdataMaterialRelatorioRPAViewRepository', '$window', '$accountService', function ($scope, $location, MasterdataMaterialRelatorioRPAViewRepository, $window, $accountService) {
	    $scope.showValidation = false;
	    $scope.userName = localStorage.userName;

	    app.showProcess();
	    MasterdataMaterialRelatorioRPAViewRepository.getRelatorio().success(function (data) {
	        $scope.MasterdataMaterialRelatorioRPAView = data;
	        $('#tblInbox thead th:eq(0)').removeClass('linkGrid');
	        app.hideProcess();
	    }).error(function (err, status) {
	        defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
	    });

	    $scope.aoColumns = [];

	    $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	        $('td:eq(0)', nRow).unbind("click");
	        $('td:eq(0)', nRow).bind('click', function () {
	            $scope.$apply(function () {
	                $scope.someClickHandler(aData);
	            });
	        });
	        return nRow;
	    };

	    $scope.someClickHandler = function (info) {
	        $window.open(info.UrlAcesso);
	    };

	    $scope.columnDefs = [
            { "mDataProp": "TIPO_MATERIAL", "aTargets": [0] },
			{ "mDataProp": "FLG_MODELO_MATERIAL", "aTargets": [1] },
			{ "mDataProp": "CODIGO_MODELO_MATERIAL_SAP", "aTargets": [2] },
			{ "mDataProp": "TIPO_FERT", "aTargets": [3] },
			{ "mDataProp": "FERRAMENTA_INTERMUTAVEL", "aTargets": [4] },
			{ "mDataProp": "ITEM_CRITICO", "aTargets": [5] },
			{ "mDataProp": "ITEM_RECUPERAVEL", "aTargets": [6] },
			{ "mDataProp": "PLANTA", "aTargets": [7] },
			{ "mDataProp": "DEPOSITO", "aTargets": [8] },
			{ "mDataProp": "DESCRICAO_CURTA", "aTargets": [9] },
			{ "mDataProp": "UNIDADE_MEDIDA", "aTargets": [10] },
			{ "mDataProp": "GRUPO_MERCADORIA", "aTargets": [11] },
			{ "mDataProp": "DEIXAR_VERSAO_BLOQUEADO_Z1", "aTargets": [12] },
			{ "mDataProp": "DEIXAR_VERSAO_BLOQUEADO_03", "aTargets": [13] },
			{ "mDataProp": "QTD_LATAS_CAMADA", "aTargets": [14] },
			{ "mDataProp": "QTD_LATAS_PALETE", "aTargets": [15] },
			{ "mDataProp": "LAB_ESC", "aTargets": [16] },
			{ "mDataProp": "DESCRICAO_LONGA", "aTargets": [17] },
			{ "mDataProp": "DESCRICAO_IMPORTADA", "aTargets": [18] },
			{ "mDataProp": "FUNCAO_MATERIAL", "aTargets": [19] },
			{ "mDataProp": "UTILIZACAO_EQUIPAMENTO", "aTargets": [20] },
			{ "mDataProp": "EQUIPAMENTO", "aTargets": [21] },
			{ "mDataProp": "ORIGEM_MATERIAL", "aTargets": [22] },
			{ "mDataProp": "PART_NUMBER", "aTargets": [23] },
			{ "mDataProp": "FABRICANTE", "aTargets": [24] },
			{ "mDataProp": "ESTOQUE_MINIMO", "aTargets": [25] },
			{ "mDataProp": "ESTOQUE_MAXIMO", "aTargets": [26] },
			{ "mDataProp": "TIPO_MRP", "aTargets": [27] },
			{ "mDataProp": "PLANEJADOR_MRP", "aTargets": [28] },
			{ "mDataProp": "TAMANHO_LOTE_MRP", "aTargets": [29] },
            { "mDataProp": "PESO_BRUTO", "aTargets": [30] },
			{ "mDataProp": "PESO_LIQUIDO", "aTargets": [31] },
			{ "mDataProp": "CENTRO_LUCRO", "aTargets": [32] },
			{ "mDataProp": "DEPOSITO_PRODUCAO", "aTargets": [33] },
			{ "mDataProp": "INFO_TEC_CODIGO1", "aTargets": [34] },
			{ "mDataProp": "INFO_TEC_PRODUTO1", "aTargets": [35] },
			{ "mDataProp": "INFO_TEC_QUANTIDADE1", "aTargets": [36] },
			{ "mDataProp": "INFO_TEC_UNIDADE_MEDIDA1", "aTargets": [37] },
			{ "mDataProp": "INFO_TEC_CODIGO2", "aTargets": [38] },
			{ "mDataProp": "INFO_TEC_PRODUTO2", "aTargets": [39] },
            { "mDataProp": "INFO_TEC_QUANTIDADE2", "aTargets": [40] },
			{ "mDataProp": "INFO_TEC_UNIDADE_MEDIDA2", "aTargets": [41] },
			{ "mDataProp": "CUSTO_MATERIAL", "aTargets": [42] },
			{ "mDataProp": "CODIGO_NCM", "aTargets": [43] },
			{ "mDataProp": "CATEGORIA_CFOP", "aTargets": [44] },
			{ "mDataProp": "CLASSIFICACAO_FISCAL", "aTargets": [45] },
			{ "mDataProp": "UTILIZACAO_MATERIAL", "aTargets": [46] },
			{ "mDataProp": "CLASSE_AVALIACAO", "aTargets": [47] }
	    ];

	    $scope.overrideOptions = {
	        "bStateSave": true,
	        "iCookieDuration": 0,//2419200, /* 1 month */
	        "bJQueryUI": true,
	        "bPaginate": true,
	        "bLengthChange": false,
	        "bFilter": true,
	        "bInfo": true,
	        "bDestroy": true
	    };
	}])

    .controller('InovacaoRegistrationController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsInovacaoRepository', 'InovacaoRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsInovacaoRepository, InovacaoRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.entity = { Hoje: new Date().toJSON(), ValorDaLata: 0, TaxaDolar: 1 };
        $scope.entityEquipe = {};
        $scope.settings = settings;

        $scope.exibirDatepicker = function ($event) {
            if (!$('#dataDeImplantacaoDoProjeto').attr('disabled')) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.exibirDatepickerInovacao = !$scope.exibirDatepickerInovacao;
            }
        };

        LookupsInovacaoRepository.getUnidadesDeProjeto().success(function (data) {
            $scope.unidades = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        LookupsInovacaoRepository.getTurmas().success(function (data) {
            $scope.turmas = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        LookupsInovacaoRepository.getEdicaoAtual().success(function (data) {
            if (!$routeParams.id && !data.Id) {
                var titulo = localize.localizeText('tituloEdicaoNaoEncontrada');
                var mensagem = localize.localizeText('msgEdicaoNaoEncontrada');
                var avisoLean = localize.localizeText('msgEntrarContatoLean');
                AlertUi(titulo, mensagem + '\n' + avisoLean, FecharJanela);
            }

            if (data.Id && !data.AindaPermiteCriacao) {
                var titulo = localize.localizeText('tituloPedidoCriacaoExpirou');
                var mensagem = localize.localizeText('msgPedidoCriacaoExpirou');
                var avisoLean = localize.localizeText('msgEntrarContatoLean');
                AlertUi(titulo, mensagem + '\n' + avisoLean, FecharJanela);
            }

            $scope.entity.Edicao = data;
            $scope.entity.ValorDaLata = data.CPM / 1000;
            $scope.entity.CPM = data.CPM;
            $scope.entity.TaxaDolar = data.TaxaDolar
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        LookupsInovacaoRepository.getParticipantes().success(function (data) {
            $scope.participantes = data;
            $('#participanteEquipe').attr('disabled', false);
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            $('#participanteEquipe').attr('disabled', true);
        });

        $scope.$watch('Edicao', function (newValue) {
            if ($scope.entity.Edicao && $scope.entity.Categoria) {
                obterPontuacao();
            }
        });

        $scope.$watch('entity.CategoriaId', function (newValue) {
            if ($scope.entity.Edicao && $scope.entity.CategoriaId) {
                obterPontuacao();
            }
        });

        obterPontuacao = function () {
            LookupsInovacaoRepository.getPontuacao($scope.entity.Edicao.Id, $scope.entity.CategoriaId).success(function (data) {
                $scope.pontuacao = data;
                atualizarCalculosPontuacao();
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        };

        validacaoCadastroDePontos = function () {
            if ($scope.pontuacao) {

                if ($scope.pontuacao.Pontos == 0) {
                    var titulo = localize.localizeText('tituloSemCadastroDePontos');
                    var mensagem = localize.localizeText('msgSemCadastroDePontos');

                    AlertUi(titulo, mensagem);
                    return false;
                }
                return true;
            }
        }

        atualizarCalculosPontuacao = function () {
            if ($scope.pontuacao) {

                validacaoCadastroDePontos();

                $scope.entity.TotalDeCreditos = $scope.pontuacao.Pontos;
                if ($scope.entity.AtuaSobreGargalo && $scope.pontuacao.ConsiderarAtuaSobreGargalo)
                    $scope.entity.TotalDeCreditos = $scope.entity.TotalDeCreditos + $scope.pontuacao.PontosSobreGargalo;

                if ($scope.entity.ProjetoVinculadoAPerdaDeLatas && $scope.pontuacao.ConsiderarPerdaDeLatas) {
                    var economia = 0;
                    if (!isNaN($scope.entity.UnidadesPerdidasPorMesAntesDaInovacao) && !isNaN($scope.entity.UnidadesPerdidasPorMesDepoisDaInovacao))
                        economia = ($scope.entity.UnidadesPerdidasPorMesAntesDaInovacao - $scope.entity.UnidadesPerdidasPorMesDepoisDaInovacao) / 30;

                    var qtdLotes = Math.floor(economia / $scope.pontuacao.TamanhoDeLoteLatas);
                    $scope.entity.TotalDeCreditos = $scope.entity.TotalDeCreditos + ($scope.pontuacao.PontosParaLoteEconomizado * qtdLotes);
                }
            }
        }

        $scope.$watch('entity.AtuaSobreGargalo', function (newValue) {
            atualizarCalculosPontuacao();
        });

        $scope.$watch('entity.UnidadeDoProjeto', function (newValue) {
            if (newValue) {
                LookupsInovacaoRepository.getGruposResponsaveis().success(function (data) {
                    $scope.gruposResponsaveis = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
                $scope.supervisores = newValue.GrupoDeSupervisores;
            }
        });

        $scope.$watch('entity.ProjetoImportadoDeOutraUnidade', function (newValue) {
            if (newValue) {
                $('#unidadeDoProjetoReplicado').attr('disabled', false);
                $('#projetoReplicado').attr('disabled', false);
                $('#dataDeImplantacaoDoProjeto').attr('disabled', false);
            } else {
                $('#unidadeDoProjetoReplicado').attr('disabled', true);
                $('#projetoReplicado').attr('disabled', true);
                $('#dataDeImplantacaoDoProjeto').attr('disabled', true);
                $scope.entity.UnidadeDoProjetoReplicado = '';
                $scope.entity.ProjetoReplicado = '';
                $scope.entity.DataDeImplementacaoDoProjeto = '';
            }
        });

        $scope.$watch('entity.HouveRiscoEliminadoPeloProjeto', function (newValue) {
            if (newValue) {
                $('#qualRiscoFoiEliminado').attr('disabled', false);
            } else {
                $('#qualRiscoFoiEliminado').attr('disabled', true);
                $scope.entity.DescricaoDoRiscoEliminado = '';
            }
        });

        $scope.$watch('entity.ProjetoVinculadoAPerdaDeLatas', function (newValue) {
            atualizarCalculosPontuacao();
            if (newValue) {
                $('#antesDaInovacao').attr('disabled', false);
                $('#depoisDaInovacao').attr('disabled', false);
                $scope.entity.OutrasEconomias = '';
            } else {
                $('#antesDaInovacao').attr('disabled', true);
                $('#depoisDaInovacao').attr('disabled', true);
                $scope.entity.LatasPerdidasPorMinutoAntes = '';
                $scope.entity.LatasPerdidasPorMinutoDepois = '';
            }
        });

        $scope.$watch('entity.LatasPerdidasPorMinutoAntes', function (newValue) {
            $scope.entity.UnidadesPerdidasPorMesAntesDaInovacao = newValue.replace(/\D/g, '') * 60 * 24 * 30;
            $scope.entity.UnidadesPerdidasPorAnoAntesDaInovacao = $scope.entity.UnidadesPerdidasPorMesAntesDaInovacao * 12;
            $scope.entity.DesperdicioMesAntesDaInovacao = ($scope.entity.ValorDaLata * $scope.entity.UnidadesPerdidasPorMesAntesDaInovacao) / $scope.entity.TaxaDolar;
            $scope.entity.DesperdicioAnoAntesDaInovacao = $scope.entity.DesperdicioMesAntesDaInovacao * 12;
            obterEconomiaGerada();
            atualizarCalculosPontuacao();
        });

        $scope.$watch('entity.LatasPerdidasPorMinutoDepois', function (newValue) {
            $scope.entity.UnidadesPerdidasPorMesDepoisDaInovacao = newValue.replace(/\D/g, '') * 60 * 24 * 30;
            $scope.entity.UnidadesPerdidasPorAnoDepoisDaInovacao = $scope.entity.UnidadesPerdidasPorMesDepoisDaInovacao * 12;
            $scope.entity.DesperdicioMesDepoisDaInovacao = ($scope.entity.ValorDaLata * $scope.entity.UnidadesPerdidasPorMesDepoisDaInovacao) / $scope.entity.TaxaDolar;
            $scope.entity.DesperdicioAnoDepoisDaInovacao = $scope.entity.DesperdicioMesDepoisDaInovacao * 12;
            obterEconomiaGerada();
            atualizarCalculosPontuacao();
        });

        var obterEconomiaGerada = function () {
            if ($scope.entity.LatasPerdidasPorMinutoAntes && $scope.entity.LatasPerdidasPorMinutoDepois) {
                $scope.entity.EconomiaGeradaPorMes = $scope.entity.DesperdicioMesAntesDaInovacao - $scope.entity.DesperdicioMesDepoisDaInovacao;
                $scope.entity.EconomiaGeradaPorAno = $scope.entity.DesperdicioAnoAntesDaInovacao - $scope.entity.DesperdicioAnoDepoisDaInovacao;
            } else {
                $scope.entity.EconomiaGeradaPorMes = null;
                $scope.entity.EconomiaGeradaPorAno = null;
            }
        };

        $scope.$watch('entity.UnidadeDoProjetoReplicado', function (newValue) {
            if (newValue) {
                LookupsInovacaoRepository.getProjetos(newValue.Id).success(function (data) {
                    $scope.projetos = data;
                    $('#projetoReplicado').attr('disabled', false);

                }).error(function (err, status) {
                    $('#projetoReplicado').attr('disabled', true);
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                });
            } else {
                $('#projetoReplicado').attr('disabled', true);
            }
        });

        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsInovacaoRepository.getCategorias(settings.currentLang.codigoId).success(function (data) {
                $scope.categorias = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        if ($routeParams.id) {
            app.showProcess();
            InovacaoRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 1) {
                    $location.path("/inovacao/historico/" + $routeParams.id);
                    return;
                }

                if (!data.Edicao.AindaPermiteAprovacao) {
                    var titulo = localize.localizeText('tituloPedidoAprovacaoExpirou');
                    var mensagem = localize.localizeText('msgPedidoAprovacaoExpirou');
                    var avisoLean = localize.localizeText('msgEntrarContatoLean');
                    AlertUi(titulo, mensagem + '\n' + avisoLean, FecharJanela);
                }

                $scope.entity = data;
                $scope.entity.CategoriaId = $scope.entity.Categoria.Id;

                $.grep($scope.entity.EquipeDoProjeto, function (e, index) {
                    if (e.Lider) {
                        $scope.entity.LiderDoProjeto = index;
                    }
                });
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        }

        $scope.removeArquivo = function (index) {
            $scope.entity.ListaAnexos.splice(index, 1);
        };

        $scope.submit = function () {
            $scope.showValidation = true;

            if (!validacaoCadastroDePontos())
                return;

            var valido = $scope.inovacaoRegistrationForm.$valid;

            if ($routeParams.id) {
                valido = valido & $scope.inovacaoliderLeanForm.$valid;
            }

            if (valido) {
                var numeroDeParticipantes = $scope.entity.EquipeDoProjeto.length;
                if (numeroDeParticipantes) {

                    $scope.entity.EquipeDoProjeto = $.grep($scope.entity.EquipeDoProjeto, function (e, index) {
                        e.PontosMelhoria = $scope.entity.TipoDeProjeto == 0 ? Math.round($scope.entity.TotalDeCreditos / numeroDeParticipantes) : 0;
                        e.PontosInovacao = $scope.entity.TipoDeProjeto == 1 ? Math.round($scope.entity.TotalDeCreditos / numeroDeParticipantes) : 0;

                        if (index == $scope.entity.LiderDoProjeto) {
                            e.Lider = true;
                        }
                        else {
                            e.Lider = false;
                        }
                        return e;
                    });

                    var lider = $.grep($scope.entity.EquipeDoProjeto, function (e) {
                        return e.Lider;
                    });

                    $scope.entity.Categoria = $.grep($scope.categorias, function (e) {
                        return e.Id == $scope.entity.CategoriaId;
                    })[0];

                    if (!lider.length) {
                        var mensagem = localize.localizeText('msgLider');
                        defaultErrorResponseHandler(status, $location, mensagem);
                    }
                    else {
                        if ($scope.files) {
                            uploadFiles();
                        }
                        else {
                            $scope.onSuccessUpload();
                        }
                    }
                }
                else {
                    var mensagem = localize.localizeText('msgEquipe');
                    defaultErrorResponseHandler(status, $location, mensagem);
                }
            }
            else {
                var tabAtiva = $('#inovacaoRegistrationForm');
                setFocusWizard(tabAtiva);

                var firstInvalid = ObterFirstElementInvalid($(tabAtiva));
                if (firstInvalid == undefined) {
                    var tabsNaoAtiva = $('#myTab li').not('.active').find('a');
                    setFocusElementInvalid(tabsNaoAtiva);
                    tabAtiva = $('#myTab li.active a').attr('href');
                    setFocusWizard(tabAtiva);
                }
                window.event.stopPropagation();
                return false;
            }
        }

        setFocusWizard = function (tab) {
            var wizard = $(tab).find('.form-bootstrapWizard').parent().attr('id');
            if (wizard) {
                var tabsNaoAtiva = $('#myWizard li').not('.active').find('a');
                setFocusElementInvalid(tabsNaoAtiva);
            }
        }

        setFocusElementInvalid = function (elements) {
            $(elements).each(function (event) {
                var tabNaoAtiva = $(this).attr('href');
                firstInvalid = ObterFirstElementInvalid($(tabNaoAtiva));

                //nao localizou e troca de aba
                if (firstInvalid != undefined) {
                    $('#h' + tabNaoAtiva.replace("#", "")).click();
                    $('#' + firstInvalid).focus();
                    return false;
                }
            });
        }

        ObterFirstElementInvalid = function (form) {
            return $(form).find('.ng-invalid:first').attr('name');
        }

        $scope.onSuccessUpload = function () {
            app.showProcess();

            $scope.entity.InvestimentoDoProjeto = toDecimal($scope.entity.InvestimentoDoProjeto, 2);
            $scope.entity.OutrasEconomias = toDecimal($scope.entity.OutrasEconomias, 2);

            $scope.entity.LatasPerdidasPorMinutoAntes = toDecimal($scope.entity.LatasPerdidasPorMinutoAntes, 0);//newValue.replace(/\D/g, '')
            $scope.entity.LatasPerdidasPorMinutoDepois = toDecimal($scope.entity.LatasPerdidasPorMinutoDepois, 0);
            $scope.entity.Idioma = settings.currentLang.codigoId;
            $scope.entity.Status = 1;

            if ($routeParams.taskid) {
                $scope.entity.WorkflowTaskId = $routeParams.taskid;
            }
            if ($routeParams.idExterno) {
                $scope.entity.IdExterno = $routeParams.idExterno;
            }

            InovacaoRepository.saveOrUpdate($scope.entity, function () {
                $location.path('/Inovacao');
            }).error(function (err, status) {
                defaultErrorResponseHandler(status, $location, err.ExceptionMessage);
                app.hideProcess();
            })
             .success(function (data) {
                 $("#salvar").hide();

                 if ($routeParams.id) {
                     var url = data.replace(/"/g, '');
                     $accountService.salvarSharepoint({
                         url: url,
                         idEntidade: $scope.entity.Id,
                         fluxo: "Inovação",
                         msgSucesso: localize.localizeText('msgSucesso'),
                         msgConcluido: localize.localizeText('msgConcluido')
                     });
                 }
                 else {
                     app.hideProcess();
                     FecharJanelaComMensagem(localize.localizeText('msgSucesso'), localize.localizeText('msgConcluido'));
                 }
             });
        }

        //inclusao de equipe

        $scope.entity.EquipeDoProjeto = [];

        ValidarInclusaoEquipe = function () {
            $scope.showValidationEquipe = !$scope.entityEquipe || !$scope.entityEquipe.Participante || !$scope.entityEquipe.Turma;
        }

        $scope.IncluirEquipe = function () {
            ValidarInclusaoEquipe();

            if (!$scope.showValidationEquipe) {
                var novoMembroDaEquipe = {
                    NomeUnidadeDoParticipante: $scope.entityEquipe.Participante.Unidade,
                    NomeParticipante: $scope.entityEquipe.Participante.Nome,
                    Participante: $scope.entityEquipe.Participante.Id,
                    Matricula: $scope.entityEquipe.Participante.Matricula,
                    Departamento: $scope.entityEquipe.Participante.Departamento,
                    Cargo: $scope.entityEquipe.Participante.Cargo,
                    Turma: $scope.entityEquipe.Turma.Id,
                    NomeDaTurma: $scope.entityEquipe.Turma.Nome,
                };

                if (!$scope.entity.EquipeDoProjeto) {
                    $scope.entity.EquipeDoProjeto = [novoMembroDaEquipe];
                }
                else {
                    $scope.entity.EquipeDoProjeto.push(novoMembroDaEquipe);
                }

                limparCamposEquipe();
                $scope.showValidationEquipe = false;
                $('#cadEquipe').modal('toggle');
            }
        };

        limparCamposEquipe = function () {
            $scope.entityEquipe.Participante = {};
            $scope.entityEquipe.Turma = {};
        };

        $scope.removeMembro = function (index) {
            $scope.entity.EquipeDoProjeto.splice(index, 1);
            if (index == $scope.entity.LiderDoProjeto) {
                $scope.entity.LiderDoProjeto = undefined;
            }
        };

        //FIM inclusao de plantas 

    }])

    .controller('InovacaoSuperiorImediatoController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsInovacaoRepository', 'InovacaoRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsInovacaoRepository, InovacaoRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.entity = {};

        if ($routeParams.id) {
            app.showProcess();
            InovacaoRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 2) {
                    $location.path("/inovacao/historico/" + $routeParams.id);
                    return;
                }

                if (!data.Edicao.AindaPermiteAprovacao) {
                    var titulo = localize.localizeText('tituloPedidoAprovacaoExpirou');
                    var mensagem = localize.localizeText('msgPedidoAprovacaoExpirou');
                    var avisoLean = localize.localizeText('msgEntrarContatoLean');
                    AlertUi(titulo, mensagem + '\n' + avisoLean, FecharJanela);
                }

                $scope.entity = data;
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.inovacaoApprovalForm.$valid) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            var resposta = {
                InovacaoId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                IdExterno: $routeParams.idExterno,
                Resposta: $scope.entity.Aprovar,
                JustificativaDaReprovacao: $scope.entity.JustificativaDeReprovacao,
                MotivoDaCorrecao: $scope.entity.MotivoDaCorrecao
            };

            InovacaoRepository.registrarResposta(resposta, function () {
                $location.path('/Inovacao');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Inovação",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('InovacaoEspecialistaLeanController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsInovacaoRepository', 'InovacaoRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsInovacaoRepository, InovacaoRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.entity = {};

        if ($routeParams.id) {
            app.showProcess();
            InovacaoRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 3) {
                    $location.path("/inovacao/historico/" + $routeParams.id);
                    return;
                }

                if (!data.Edicao.AindaPermiteAprovacao) {
                    var titulo = localize.localizeText('tituloPedidoAprovacaoExpirou');
                    var mensagem = localize.localizeText('msgPedidoAprovacaoExpirou');
                    var avisoLean = localize.localizeText('msgEntrarContatoLean');
                    AlertUi(titulo, mensagem + '\n' + avisoLean, FecharJanela);
                }

                $scope.entity = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        }

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.inovacaoApprovalForm.$valid) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            var resposta = {
                InovacaoId: $scope.entity.Id,
                Resposta: $scope.entity.Aprovar,
                WorkflowTaskId: $routeParams.taskid,
                IdExterno: $routeParams.idExterno,
                JustificativaDaReprovacao: $scope.entity.JustificativaDeReprovacao,
                MotivoDaCorrecao: $scope.entity.MotivoDaCorrecao
            };

            InovacaoRepository.registrarResposta(resposta, function () {
                $location.path('/Inovacao');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Inovação",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('InovacaoGerenteController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsInovacaoRepository', 'InovacaoRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsInovacaoRepository, InovacaoRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.entity = {};

        if ($routeParams.id) {
            app.showProcess();
            InovacaoRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 4) {
                    $location.path("/inovacao/historico/" + $routeParams.id);
                    return;
                }

                if (!data.Edicao.AindaPermiteAprovacao) {
                    var titulo = localize.localizeText('tituloPedidoAprovacaoExpirou');
                    var mensagem = localize.localizeText('msgPedidoAprovacaoExpirou');
                    var avisoLean = localize.localizeText('msgEntrarContatoLean');
                    AlertUi(titulo, mensagem + '\n' + avisoLean, FecharJanela);
                }

                $scope.entity = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        }

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.inovacaoApprovalForm.$valid) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            var resposta = {
                InovacaoId: $scope.entity.Id,
                Resposta: $scope.entity.Aprovar,
                WorkflowTaskId: $routeParams.taskid,
                IdExterno: $routeParams.idExterno,
                JustificativaDaReprovacao: $scope.entity.JustificativaDeReprovacao,
                MotivoDaCorrecao: $scope.entity.MotivoDaCorrecao
            };

            InovacaoRepository.registrarResposta(resposta, function () {
                $location.path('/Inovacao');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "Inovação",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('InovacaoHistoricoController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsInovacaoRepository', 'InovacaoRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsInovacaoRepository, InovacaoRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.settings = settings;
        $scope.entity = {};

        if ($routeParams.id) {
            app.showProcess();
            InovacaoRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                $scope.entity = data;
                app.hideProcess();
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        }
    }])

    .controller('InovacaoRelatorioPlantaController', ['$scope', '$location', 'RelatorioPlantaInovacaoRepository', 'LookupsInovacaoRepository', '$window', '$accountService', 'settings', 'localize', function ($scope, $location, RelatorioPlantaInovacaoRepository, LookupsInovacaoRepository, $window, $accountService, settings, localize) {
        $scope.settings = settings;
        app.showProcess();

        LookupsInovacaoRepository.getTodasEdicoes().success(function (data) {
            $scope.edicoes = data;
            app.hideProcess();
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            app.hideProcess();
        });

        $scope.$watch('edicao', function (newValue) {
            if (newValue) {
                app.showProcess();
                RelatorioPlantaInovacaoRepository.getRelatorio(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    if (data.length) {
                        $scope.RelatorioPlantaInovacao = data;
                    } else {
                        $scope.RelatorioPlantaInovacao = undefined;
                    }
                    app.hideProcess();
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                    app.hideProcess();
                });
            }
        });

        $scope.aoColumns = [];

        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(0)', nRow).unbind("click");
            $('td:eq(0)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $window.open(info.UrlAcesso);
        };

        $scope.columnDefs = [
            { "mDataProp": "Planta", "aTargets": [0], "className": 'linkGrid' },
            { "mDataProp": "Tipo", "aTargets": [1] },
            { "mDataProp": "QuantidadeDeInscritos", "aTargets": [2] },
            { "mDataProp": "QuantidadeDeAprovados", "aTargets": [3] },
            { "mDataProp": "QuantidadeEmAprovacao", "aTargets": [4] },
            { "mDataProp": "QuantidadeDeReprovados", "aTargets": [5] },
            { "mDataProp": "QuantidadeDeExpirados", "aTargets": [6] }
        ];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 0,//2419200, /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };
    }])

    .controller('InovacaoRelatorioParticipanteController', ['$scope', '$location', 'RelatorioParticipanteInovacaoRepository', 'LookupsInovacaoRepository', '$window', '$accountService', 'settings', 'localize', function ($scope, $location, RelatorioParticipanteInovacaoRepository, LookupsInovacaoRepository, $window, $accountService, settings, localize) {
        $scope.settings = settings;
        //app.showProcess();

        LookupsInovacaoRepository.getTodasEdicoes().success(function (data) {
            $scope.edicoes = data;
            app.hideProcess();
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            app.hideProcess();
        });

        LookupsInovacaoRepository.getUnidadesDeProjetoRelatorio().success(function (data) {
            $scope.unidades = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        $scope.obterRelatorio = function () {
            app.showProcess();
            RelatorioParticipanteInovacaoRepository.getRelatorio($scope.filtro).success(function (data) {
                if (data.length) {
                    $scope.RelatorioParticipanteInovacao = data;
                } else {
                    $scope.RelatorioParticipanteInovacao = undefined;
                }
                app.hideProcess();
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        }

        $scope.aoColumns = [];

        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $window.open(info.UrlAcesso);
        };

        $scope.columnDefs = [

            { "mDataProp": "NomeDaUnidade", "aTargets": [0], "className": 'linkGrid' },
            { "mDataProp": "NomeDaEdicao", "aTargets": [1] },
            { "mDataProp": "Nome", "aTargets": [2] },
            { "mDataProp": "Matricula", "aTargets": [3] },
            { "mDataProp": "Cargo", "aTargets": [4] },
            { "mDataProp": "PontosMelhoria", "aTargets": [5] },
            { "mDataProp": "PontosInovacao", "aTargets": [6] },
            { "mDataProp": "ValorMelhoria", "aTargets": [7] },
            { "mDataProp": "ValorInovacao", "aTargets": [8] },
            { "mDataProp": "ValorTotal", "aTargets": [9] },
        ];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 0,//2419200, /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };
    }])

    .controller('NocClienteRegistrationController', ['$scope', '$compile', '$location', '$routeParams', '$filter', 'LookupsNocClienteRepository', 'NocClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $location, $routeParams, $filter, LookupsNocClienteRepository, NocClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.entity = { EhInformativa: "false", Hoje: new Date().toJSON(), Produto: [] };
        $scope.settings = settings;

        $scope.exibirDatepicker = function ($event, name) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[name] = !$scope[name];
        };

        $scope.produtoCheio = [];

        LookupsNocClienteRepository.getProdutos(settings.currentLang.codigoId).success(function (data) {
            $scope.produtoCheio = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });


        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsNocClienteRepository.getFabricas(settings.currentLang.codigoId).success(function (data) {
                $scope.fabricas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsNocClienteRepository.getClassesDefeito(settings.currentLang.codigoId).success(function (data) {
                $scope.classes = data;
                $('#classe').attr('disabled', false);
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                $('#classe').attr('disabled', true);
            });
            LookupsNocClienteRepository.getSeveridades(settings.currentLang.codigoId).success(function (data) {
                $scope.severidades = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsNocClienteRepository.getTiposDeDocumento(settings.currentLang.codigoId).success(function (data) {
                $scope.tiposDeDocumentos = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        LookupsNocClienteRepository.getFornecedores(3).success(function (data) {
            $scope.fornecedores = data;
            $('#fornecedor').attr('disabled', false);
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            $('#fornecedor').attr('disabled', true);
        });

        $scope.$watch('entity.Fabrica', function (newValue) {
            if (newValue && newValue.Id) {
                LookupsNocClienteRepository.getClientes(newValue.Id).success(function (data) {
                    $scope.clientes = data;
                    $('#cliente').attr('disabled', false);
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                    $('#cliente').attr('disabled', true);
                });

            }
            else {
                $('#cliente').attr('disabled', true);
            }
        });

        $scope.$watch('entity.UnidadeRetida', AtualizarListaProdutos);

        function AtualizarListaProdutos(newValue) {
            delete $scope.entity.ProdutoFiltrado;
            $scope.entity.ProdutoFiltrado = [];

            if (newValue == 'Tampas')
                newValue = 'T';
            else
                newValue = 'L';

            angular.forEach($scope.produtoCheio, function (value, key) {
                if (value.Tipo == newValue)
                    $scope.entity.ProdutoFiltrado.push(value);
            });
        }

        $scope.$watch('entity.ClasseDefeito', function (newValue) {
            if (newValue && newValue.Id) {
                LookupsNocClienteRepository.getDefeitos(newValue.Id, settings.currentLang.codigoId).success(function (data) {
                    $scope.defeitos = data;
                    $('#defeito').attr('disabled', false);
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                    $('#defeito').attr('disabled', true);
                });
            }
            else {
                $('#defeito').attr('disabled', true);
            }
        });

        $scope.$watch('entity.TipoDeDocumento', function (newValue) {
            if (newValue && newValue.Nome == 'Outros') {
                $('#outroTipoDeDocumento').attr('disabled', false);
            }
            else {
                $('#outroTipoDeDocumento').attr('disabled', true);
                $('#outroTipoDeDocumento').val('');
            }
        });

        if ($routeParams.id) {
            app.showProcess();
            NocClienteRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 0) {
                    $location.path("/nocCliente/historico/" + $routeParams.id);
                    return;
                }
                $scope.entity.ProdutoFiltrado = $scope.produtoCheio;
                $scope.entity = data;

                $scope.entity = data;
                if ($scope.entity.Produto.Tipo)
                    AtualizarListaProdutos($scope.entity.Produto.Tipo);
                $scope.entity.EhInformativa = $scope.entity.EhInformativa.toString();

            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        }

        $scope.removeArquivo = function (index) {
            $scope.entity.ListaAnexos.splice(index, 1);
        };

        $scope.submit = function () {
            $scope.showValidation = true;
            if ($scope.nocClienteRegistrationForm.$valid) {

                if ($scope.files) {
                    uploadFiles();
                }
                else {
                    $scope.onSuccessUpload();
                }
            }
        }

        $scope.onSuccessUpload = function () {
            app.showProcess();
            $scope.entity.Idioma = settings.currentLang.codigoId;
            $scope.entity.Status = 1;
            $scope.entity.QuantidadeRetida = toDecimal($scope.entity.QuantidadeRetida, 2);


            if ($routeParams.taskid) {
                $scope.entity.WorkflowTaskId = $routeParams.taskid;
            }
            if ($routeParams.idExterno) {
                $scope.entity.IdExterno = $routeParams.idExterno;
            }

            NocClienteRepository.saveOrUpdate($scope.entity, function () {
                $location.path('/NocCliente');
            }).error(function (err, status) {
                defaultErrorResponseHandler(status, $location, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "NOC Cliente",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
                else {
                    app.hideProcess();
                    FecharJanelaComMensagem(localize.localizeText('msgSucesso'), localize.localizeText('msgConcluido'));
                }
            });
        }
    }])

    .controller('NocClienteEditController', ['$scope', '$compile', '$location', '$routeParams', '$filter', 'LookupsNocClienteRepository', 'NocClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $location, $routeParams, $filter, LookupsNocClienteRepository, NocClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        var flagPermissao = false;
        app.showProcess();

        $scope.entity = {};
        $scope.settings = settings;


        var CarregaNoc = function () {
            app.showProcess();
            NocClienteRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                $scope.entity = data;
                app.hideProcess();
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });

        }
        var checaPermissaoEdicao = function () {

            NocClienteRepository.checkPermissaoEdicao().error(function (err, status) {
                $location.path("/nocCliente/historico/" + $routeParams.id);
                return;
            }).success(function () {
                $location.path("/nocCliente/edit/" + $routeParams.id);
                if ($routeParams.id) {
                    CarregaNoc();
                }
            });
        }
        $scope.exibirDatepicker = function ($event, name) {

            if ((!$('#dataAutorizacaoDevolucao').attr('disabled') && name == 'exibirDatepickerDataAutorizacaoDevolucao')
              || (!$('#dataAutorizacaoRessarcimento').attr('disabled') && name == 'exibirDatepickerDataAutorizacaoRessarcimento')
              || !$('#dataChegadaDoLote').attr('disabled') && name == 'exibirDatepickerDataChegadaDoLote') {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[name] = !$scope[name];
            }
        };

        $scope.$watch('settings.currentlang', function (newvalue) {
            LookupsNocClienteRepository.getFabricas(settings.currentLang.codigoId).success(function (data) {
                $scope.fabricas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsNocClienteRepository.getPareceres(settings.currentLang.codigoId).success(function (data) {
                $scope.pareceres = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsNocClienteRepository.getSeveridades(settings.currentLang.codigoId).success(function (data) {
                $scope.severidades = data;
            }).error(function (err, status) {
                defaulterrorresponsehandler($accountservice, status, err.exceptionmessage);
            });


        });

        $scope.$watch('entity.Resposta.Ressarcimento', function (newValue) {
            if (newValue) {
                $('#dataAutorizacaoRessarcimento').attr('disabled', false);
                $('#quantidadeRessarcidaTampa').attr('disabled', false);
                $('#quantidadeRessarcidaLata').attr('disabled', false);
            }
            else {
                $('#dataAutorizacaoRessarcimento').attr('disabled', true);
                $('#quantidadeRessarcidaTampa').attr('disabled', true);
                $('#quantidadeRessarcidaLata').attr('disabled', true);

                $('#dataAutorizacaoRessarcimento').val('');
                $('#quantidadeRessarcidaTampa').val('');
                $('#quantidadeRessarcidaLata').val('');
            }
        });

        $scope.$watch('entity.Resposta.Devolucao', function (newValue) {
            if (newValue) {
                $('#dataAutorizacaoDevolucao').attr('disabled', false);
                $('#quantidadeAutorizadaADevolver').attr('disabled', false);
                $('#fabricaDevolucao').attr('disabled', false);
                $('#valorDoFrete').attr('disabled', false);
            }
            else {
                $('#dataAutorizacaoDevolucao').attr('disabled', true);
                $('#quantidadeAutorizadaADevolver').attr('disabled', true);
                $('#fabricaDevolucao').attr('disabled', true);
                $('#valorDoFrete').attr('disabled', true);

                $('#dataAutorizacaoDevolucao').val('');
                $('#quantidadeAutorizadaADevolver').val('');
                $('#fabricaDevolucao').val('');
                $('#valorDoFrete').val('');
            }
        });

        $scope.salvar = function () {
            app.showProcess();
            $scope.entity.Resposta.ValorDoFrete = toDecimal($scope.entity.Resposta.ValorDoFrete, 2);
            $scope.entity.ValorDoFrete = toDecimal($scope.entity.ValorDoFrete, 2);

            NocClienteRepository.atualizarNOC($scope.entity, function () {
                $location.path('/NocCliente/historico/' + $scope.entity.id);
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            }).success(function (data) {
                $(".btnSalvar").hide();

                FecharJanelaComMensagem(localize.localizeText('msgSucesso'), localize.localizeText('msgConcluido'));

            }).finally(function () {
                app.hideProcess();
            });
        }
        checaPermissaoEdicao();
    }])

    .controller('NocClienteHistoricoController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'NocClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, NocClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.settings = settings;
        $scope.entity = {};

        $scope.ConverterNumeroParaLetra = function (numero) {
            return String.fromCharCode(65 + numero);
        };

        $scope.exportData = function () {
            app.showProcess();

            var blob = new Blob(["\ufeff", document.getElementById('exportar').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            app.hideProcess();
            saveAs(blob, "NOCCliente.xls");

        };

        $scope.exportarParaExcel = function () {



            //NocClienteRepository.exportarParaExcel($routeParams.id, settings.currentLang.codigoId).success(function (data) {
            //    app.hideProcess();
            //    // location.href = window.location.origin + '/Download.ashx?nomeArquivo=' + data;
            //    location.href = window.location.origin + '/Rexam.Workflow.Api/Download.ashx?nomeArquivo=' + data;
            //}).error(function (err, status) {
            //    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            //}).finally(function (xpto) {
            //    app.hideProcess();
            //});
        }

        if ($routeParams.id) {
            app.showProcess();
            NocClienteRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                $scope.entity = data;
                app.hideProcess();
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        }
    }])

    .controller('NocClienteRespostaController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsNocClienteRepository', 'NocClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsNocClienteRepository, NocClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.resposta = {
            PlanoDeAcao: [],
            Rascunho: false
        };

        $scope.exibirDatepicker = function ($event, name) {

            if ((!$('#dataAutorizacaoDevolucao').attr('disabled') && name == 'exibirDatepickerDataAutorizacaoDevolucao')
                || (!$('#dataAutorizacaoRessarcimento').attr('disabled') && name == 'exibirDatepickerDataAutorizacaoRessarcimento')
                || (name == 'exibirDatepickerPrazoAcao')) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[name] = !$scope[name];
            }
        };
        $scope.teste = function () {
            alert($scope.resposta.Parecer);
        }

        $scope.removeArquivo = function (index) {
            $scope.resposta.ListaAnexos.splice(index, 1);
        };

        $scope.$watch('settings.currentLang', function (newValue) {
            LookupsNocClienteRepository.getFabricas(settings.currentLang.codigoId).success(function (data) {
                $scope.fabricas = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });

            LookupsNocClienteRepository.getCausasRaiz(settings.currentLang.codigoId).success(function (data) {
                $scope.causasRaiz = data;
                $('#classe').attr('disabled', false);
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                $('#classe').attr('disabled', true);
            });

            LookupsNocClienteRepository.getSeveridades(settings.currentLang.codigoId).success(function (data) {
                $scope.severidades = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
            LookupsNocClienteRepository.getPareceres(settings.currentLang.codigoId).success(function (data) {
                $scope.pareceres = data;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        });

        $scope.$watch('resposta.Devolucao', function (newValue) {
            if (newValue) {
                $('#dataAutorizacaoDevolucao').attr('disabled', false);
                $('#quantidadeAutorizadaADevolver').attr('disabled', false);
                $('#fabricaDevolucao').attr('disabled', false);
                $('#valorDoFrete').attr('disabled', false);
            }
            else {
                $('#dataAutorizacaoDevolucao').attr('disabled', true);
                $('#quantidadeAutorizadaADevolver').attr('disabled', true);
                $('#fabricaDevolucao').attr('disabled', true);
                $('#valorDoFrete').attr('disabled', true);

                $('#dataAutorizacaoDevolucao').val('');
                $('#quantidadeAutorizadaADevolver').val('');
                $('#fabricaDevolucao').val('');
                $('#valorDoFrete').val('');
            }
        });

        $scope.$watch('resposta.Ressarcimento', function (newValue) {
            if (newValue) {
                $('#dataAutorizacaoRessarcimento').attr('disabled', false);
                $('#quantidadeRessarcidaTampa').attr('disabled', false);
                $('#quantidadeRessarcidaLata').attr('disabled', false);
            }
            else {
                $('#dataAutorizacaoRessarcimento').attr('disabled', true);
                $('#quantidadeRessarcidaTampa').attr('disabled', true);
                $('#quantidadeRessarcidaLata').attr('disabled', true);

                $('#dataAutorizacaoRessarcimento').val('');
                $('#quantidadeRessarcidaTampa').val('');
                $('#quantidadeRessarcidaLata').val('');
            }
        });

        $('#bootstrap-wizard-1').bootstrapWizard({
            'tabClass': 'form-wizard',
            'onNext': function (tab, navigation, index) {
                $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(index - 1).addClass('complete');
                $('#bootstrap-wizard-1').find('.form-wizard').children('li').eq(index - 1).find('.step').html('<i class="fa fa-check"></i>');
            },
            'onTabShow': function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                if ($current >= $total) {
                    $('#bootstrap-wizard-1').find('.pager .next').hide();
                    $('#bootstrap-wizard-1').find('.pager .finish').show();
                    $('#bootstrap-wizard-1').find('.pager .finish').removeClass('disabled');
                } else {
                    $('#bootstrap-wizard-1').find('.pager .next').show();
                    $('#bootstrap-wizard-1').find('.pager .finish').hide();
                }
            },
            //'onTabClick': function (tab, navigation, index) {
            //    return false;
            //}
        });

        $scope.ConverterNumeroParaLetra = function (numero) {
            return String.fromCharCode(65 + numero);
        };

        if ($routeParams.id) {
            app.showProcess();
            NocClienteRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 1) {
                    $location.path("/nocCliente/historico/" + $routeParams.id);
                    return;
                }

                $scope.entity = data;
                if ($scope.entity.Resposta) {
                    $scope.resposta = $scope.entity.Resposta;

                }

                $scope.resposta.Severidade = $scope.entity.Severidade;

                if (!$scope.resposta.AnaliseDasCausas)
                    $scope.resposta.AnaliseDasCausas = [];

                if (!$scope.resposta.PlanoDeAcao)
                    $scope.resposta.PlanoDeAcao = [];

                $scope.resposta.Rascunho = false;
                $scope.entity.Resposta.Rascunho = false;
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        }

        formValido = function () {
            //if ($scope.resposta.Rascunho) 
            //    return true;

            if (!$scope.nocClienteRespostaForm.$valid)
                return false;

            if ($scope.resposta.Aprovar == undefined)
                return false;

            if ($scope.resposta.Aprovar)
                return $scope.nocClienteRespostaForm.$valid;

            else return $scope.resposta.PedidoCorrecao;
        }

        $scope.submitDraft = function () {
            $scope.resposta.Rascunho = true;
            $scope.submitBase();
        }

        $scope.submit = function () {
            $scope.resposta.Rascunho = false;
            $scope.submitBase();
        }

        $scope.submitBase = function () {
            if ($scope.resposta.Rascunho == false && $scope.resposta.Aprovar) {
                if (formValido()) {
                    if (!$scope.resposta.AnaliseDasCausas.length && !$scope.resposta.PedidoCorrecao && ($scope.resposta.Parecer && $scope.resposta.Parecer.IdCampo != '01')) {
                        var mensagem = localize.localizeText('msgAnaliseDasCausas');
                        defaultErrorResponseHandler(status, $location, mensagem);
                        $('a[href=#' + $('.tab-pane').has('#btnIncluirCausa').last().attr('id') + ']').click();
                        return false;
                    }

                    if (!$scope.resposta.PlanoDeAcao.length && !$scope.resposta.PedidoCorrecao && ($scope.resposta.Parecer && $scope.resposta.Parecer.IdCampo != '01')) {
                        var mensagem = localize.localizeText('msgPlanoDeAcao');
                        defaultErrorResponseHandler(status, $location, mensagem);
                        $('a[href=#' + $('.tab-pane').has('#btnIncluirAcao').last().attr('id') + ']').click();
                        return false;
                    }

                    if ($scope.files) {
                        uploadFiles();
                    }
                    else {
                        $scope.onSuccessUpload();
                    }
                }
                else {
                    $scope.showValidation = true;
                    var tabAtiva = $('#myTab li.active a').attr('href');
                    setFocusWizard(tabAtiva);

                    var firstInvalid = ObterFirstElementInvalid($(tabAtiva));
                    if (firstInvalid == undefined) {
                        var tabsNaoAtiva = $('#myTab li').not('.active').find('a');
                        setFocusElementInvalid(tabsNaoAtiva);
                        tabAtiva = $('#myTab li.active a').attr('href');
                        setFocusWizard(tabAtiva);
                    }
                    window.event.stopPropagation();
                    return false;
                }
            }
            else {
                if ($scope.files) {
                    uploadFiles();
                }
                else {
                    $scope.onSuccessUpload();
                }
            }
        }

        setFocusWizard = function (tab) {
            var wizard = $(tab).find('.form-bootstrapWizard').parent().attr('id');
            if (wizard) {
                var tabsNaoAtiva = $('#bootstrap-wizard-1 li').not('.active').find('a');
                setFocusElementInvalid(tabsNaoAtiva);
            }
        }

        setFocusElementInvalid = function (elements) {
            $(elements).each(function (event) {
                var tabNaoAtiva = $(this).attr('href');
                firstInvalid = ObterFirstElementInvalid($(tabNaoAtiva));

                //nao localizou e troca de aba
                if (firstInvalid != undefined) {
                    $('#h' + tabNaoAtiva.replace("#", "")).click();
                    var accordion = $('.panel-group').has('input[name=' + firstInvalid + ']').find('.collapsed');
                    if (accordion) {
                        accordion.click();
                    }
                    $('input[name=' + firstInvalid + ']').first().focus();
                    return false;
                }
            });
        }

        ObterFirstElementInvalid = function (form) {
            return $(form).find('.ng-invalid:first').attr('name');
        }

        $scope.onSuccessUpload = function () {
            app.showProcess();
            $scope.resposta.Anexos = $scope.entity.Anexos;

            $scope.resposta.NocClienteId = $scope.entity.Id,
            $scope.resposta.StatusResposta = $scope.resposta.Aprovar ? 0 : 2;//Aprovado = 0, PedidoDeCorrecao = 2
            $scope.resposta.WorkflowTaskId = $routeParams.taskid;
            $scope.resposta.IdExterno = $routeParams.idExterno;
            $scope.resposta.Idioma = settings.currentLang.codigoId;
            $scope.resposta.ValorDoFrete = toDecimal($scope.resposta.ValorDoFrete, 2);

            NocClienteRepository.registrarResposta($scope.resposta, function () {
                $location.path('/NocCliente');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            })
            .success(function (data) {
                $(".btnSalvar").hide();
                if ($scope.resposta.Rascunho)
                    FecharJanelaComMensagem(localize.localizeText('msgSucesso'), localize.localizeText('msgConcluido'));
                else if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "NOC Cliente",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            }).finally(function () {
                app.hideProcess();
            });
        }

        //inclusao causas 
        ValidarInclusaoCausa = function () {
            $scope.showValidationCausa = !$scope.entityCausa || !$scope.entityCausa.Causa || !$scope.entityCausa.Porque1 || !$scope.entityCausa.Porque2;
        }

        $scope.IncluirCausa = function () {
            ValidarInclusaoCausa();

            if (!$scope.showValidationCausa) {
                $scope.resposta.AnaliseDasCausas.push({
                    IdTemp: $scope.resposta.AnaliseDasCausas.length,
                    Causa: $scope.entityCausa.Causa,
                    Porque1: $scope.entityCausa.Porque1,
                    Porque2: $scope.entityCausa.Porque2,
                    Porque3: $scope.entityCausa.Porque3,
                    Porque4: $scope.entityCausa.Porque4,
                    Porque5: $scope.entityCausa.Porque5,
                });

                limparCamposCausa();
                $('#cadCausa').modal('toggle');
            }
        };

        limparCamposCausa = function () {
            $scope.showValidationCausa = false;
            $scope.entityCausa.Causa = '';
            $scope.entityCausa.Porque1 = '';
            $scope.entityCausa.Porque2 = '';
            $scope.entityCausa.Porque3 = '';
            $scope.entityCausa.Porque4 = '';
            $scope.entityCausa.Porque5 = '';
        };;

        $scope.removeCausa = function (index) {
            $scope.resposta.AnaliseDasCausas.splice(index, 1);
        };
        //FIMinclusao Causas

        //inclusao ação
        ValidarInclusaoAcao = function () {
            $scope.showValidationAcao = !$scope.entityAcao || !$scope.entityAcao.causas || !$scope.entityAcao.acao || !$scope.entityAcao.responsavel || !$scope.entityAcao.prazo;
        }

        $scope.IncluirAcao = function () {
            ValidarInclusaoAcao();

            if (!$scope.showValidationAcao) {
                $scope.resposta.PlanoDeAcao.push({
                    Causas: $scope.entityAcao.causas,
                    AcaoCorrespondente: $scope.entityAcao.acao,
                    Responsavel: $scope.entityAcao.responsavel,
                    PrazoDeExecucao: $scope.entityAcao.prazo
                });

                limparCamposAcao();
                $('#cadPlanoDeAcao').modal('toggle');
            }
        };

        limparCamposAcao = function () {
            $scope.showValidationAcao = false;
            $scope.entityAcao.causas = '';
            $scope.entityAcao.acao = '';
            $scope.entityAcao.responsavel = '';
            $scope.entityAcao.prazo = '';
        };;

        $scope.removeAcao = function (index) {
            $scope.resposta.PlanoDeAcao.splice(index, 1);
        };
        //FIMinclusao ação
    }])

    .controller('NocClienteDispatchController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsNocClienteRepository', 'NocClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsNocClienteRepository, NocClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;
        $scope.hoje = new Date().toJSON();

        $scope.ConverterNumeroParaLetra = function (numero) {
            return String.fromCharCode(65 + numero);
        };

        $scope.exibirDatepicker = function ($event) {
            if (!$('#dataChegadaDoLote').attr('disabled')) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.exibirDatepickerDataChegadaDoLote = !$scope.exibirDatepickerDataChegadaDoLote;
            }
        };

        if ($routeParams.id) {
            app.showProcess();
            NocClienteRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 2) {
                    $location.path("/nocCliente/historico/" + $routeParams.id);
                    return;
                }

                $scope.entity = data;
                if (!$scope.entity.Causas)
                    $scope.entity.Causas = [];
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            });
        }

        $scope.submit = function () {
            $scope.showValidation = true;

            if ($scope.nocClienteDispatchForm.$valid) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            var dispatch = {
                NocClienteId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                IdExterno: $routeParams.idExterno,
                QuantidadeDevolvida: $scope.entityResposta.QuantidadeDevolvida,
                DataChegadaDoLote: $scope.entityResposta.DataChegadaDoLote,
                ValorDoFrete: toDecimal($scope.entityResposta.ValorDoFrete, 2)
            };

            NocClienteRepository.registrarDispatch(dispatch, function () {
                $location.path('/NocCliente');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "NOC Cliente",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('NocClienteApproverController', ['$scope', '$compile', '$timeout', '$location', '$routeParams', '$filter', 'LookupsNocClienteRepository', 'NocClienteRepository', 'serverBaseUrl', 'settings', '$accountService', 'localize', function ($scope, $compile, $timeout, $location, $routeParams, $filter, LookupsNocClienteRepository, NocClienteRepository, serverBaseUrl, settings, $accountService, localize) {
        $scope.showValidation = false;
        $scope.settings = settings;

        $scope.ConverterNumeroParaLetra = function (numero) {
            return String.fromCharCode(65 + numero);
        };

        LookupsNocClienteRepository.getSeveridades(settings.currentLang.codigoId).success(function (data) {
            $scope.severidades = data;
        }).error(function (err, status) {
            defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        });

        if ($routeParams.id) {
            app.showProcess();
            NocClienteRepository.findById($routeParams.id, settings.currentLang.codigoId).success(function (data) {
                app.hideProcess();

                if (data.Status != 3) {
                    $location.path("/nocCliente/historico/" + $routeParams.id);
                    return;
                }

                $scope.entity = data;
            }).error(function (err, status) {
                app.hideProcess();
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
            });
        }

        $scope.submit = function (devolver) {
            $scope.showValidation = true;
            $scope.devolver = devolver;

            if ($scope.entity.Aprovar) {
                if (devolver == "0") {
                    var valido = true;
                } else {
                    var valido = $scope.entity.DevolverPara && $scope.entity.PedidoCorrecao;
                }
            }
            else {
                var valido = false;
            }

            if (valido) {
                postarFormulario();
            }
        }

        postarFormulario = function () {
            app.showProcess();

            var respostaApprover = {
                NocId: $scope.entity.Id,
                WorkflowTaskId: $routeParams.taskid,
                IdExterno: $routeParams.idExterno,
                DevolverPara: $scope.entity.DevolverPara,
                StatusAprovacao: $scope.entity.Aprovar,
                PedidoDeCorrecao: $scope.entity.PedidoCorrecao,
                Severidade: $scope.entity.Severidade,
                Comentarios: $scope.entity.Comentarios,
            };

            NocClienteRepository.registrarApprover(respostaApprover, function () {
                $location.path('/NocCliente');
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                app.hideProcess();
            })
            .success(function (data) {
                $("#salvar").hide();

                if ($routeParams.id) {
                    var url = data.replace(/"/g, '');
                    $accountService.salvarSharepoint({
                        url: url,
                        idEntidade: $scope.entity.Id,
                        fluxo: "NOC Cliente",
                        msgSucesso: localize.localizeText('msgSucesso'),
                        msgConcluido: localize.localizeText('msgConcluido')
                    });
                }
            });
        }
    }])

    .controller('ManutencaoController', ['$scope', '$location', 'ManutencaoRepository', '$window', '$accountService', function ($scope, $location, ManutencaoRepository, $window, $accountService) {
        $scope.showValidation = false;
        $scope.userName = localStorage.userName;

        //app.showProcess();
        //  //ManutencaoRepository.getRelatorioTempo().success(function (data) {
        //  //  $scope.NocMetalRelatorioTempoView = data;
        //  //  $('#tblInbox thead th:eq(0)').removeClass('linkGrid');
        //    app.hideProcess();
        //}).error(function (err, status) {
        //    defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
        //});

        $scope.aoColumns = [];

        //$scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        //    $('td:eq(0)', nRow).unbind("click");
        //    $('td:eq(0)', nRow).bind('click', function () {
        //        $scope.$apply(function () {
        //            $scope.someClickHandler(aData);
        //        });
        //    });
        //    return nRow;
        //};

        $scope.someClickHandler = function (info) {
            $window.open(info.UrlAcesso);
        };

        $scope.columnDefs = [
            { "mDataProp": "Fornecedor", "aTargets": [0] },
            { "mDataProp": "NOC", "aTargets": [1] },
            { "mDataProp": "Planta", "aTargets": [2] },
            { "mDataProp": "Parecer", "aTargets": [3] },
            { "mDataProp": "AcoesCorretivas", "aTargets": [4] },
            { "mDataProp": "Resposta", "aTargets": [5] },
            { "mDataProp": "Criado", "aTargets": [6] },
            { "mDataProp": "Tarefa", "aTargets": [7] },
            { "mDataProp": "Resultado", "aTargets": [8] },
            { "mDataProp": "DiffData", "aTargets": [9] },
            { "mDataProp": "Dono", "aTargets": [10] },
            { "mDataProp": "Mes", "aTargets": [11] },
            { "mDataProp": "Ano", "aTargets": [12] },
            /*{
                "mDataProp": "DueTime", "aTargets": [4], "render": function (data) { var dt = new Date(data).toLocaleDateString(); return dt; }
            }*/
        ];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 0,//2419200, /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };
    }])

;