(function () {

    angular.module('app.repositories', []).factory('ClientRepository', ['$apiRepository', function ($apiRepository) {
        return $apiRepository.create('api/Client');
    }]).factory('WorkflowTasksRepository', function ($apiRepository, $api) {
        var apiPath = 'api/WorkflowTasks';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getInitiate: function () {
                return $api.get(apiPath + '/GetInitiate/');
            },

            getTasksInbox: function () {
                return $api.get(apiPath + '/GetTasksInbox/');
            },
            getTasksCompleted: function () {
                return $api.get(apiPath + '/GetTasksCompleted/');
            },
            getTasksInProgress: function () {
                return $api.get(apiPath + '/GetTasksInProgress/');
            },
            getReports: function () {
                return $api.get(apiPath + '/GetReports/');
            }
        });
        return repository;
    }).factory('NocFornecedorRelatorioViewRepository', function ($apiRepository, $api) {
        var apiPath = '/api/NocFornecedor';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getRelatorio: function () {
                return $api.get(apiPath + '/GetRelatorioViewNocFornecedor');
            }
        });
        return repository;
	}).factory('MasterdataFornecedorRelatorioRPAViewRepository', function ($apiRepository, $api) {
        var apiPath = '/api/MasterdataFornecedor';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getRelatorio: function () {
                return $api.get(apiPath + '/GetRelatorioRPAViewMasterdataFornecedor');
            }
        });
        return repository;
	}).factory('MasterdataClienteRelatorioRPAViewRepository', function ($apiRepository, $api) {
        var apiPath = '/api/MasterdataCliente';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getRelatorio: function () {
                return $api.get(apiPath + '/GetRelatorioRPAViewMasterdataCliente');
            }
        });
        return repository;
	}).factory('MasterdataMaterialRelatorioRPAViewRepository', function ($apiRepository, $api) {
        var apiPath = '/api/MasterdataMaterial';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getRelatorio: function () {
                return $api.get(apiPath + '/GetRelatorioRPAViewMasterdataMaterial');
            }
        });
        return repository;
    }).factory('RelatorioPlantaInovacaoRepository', function ($apiRepository, $api) {
        var apiPath = '/api/Inovacao';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getRelatorio: function (idEdicao, idIdioma) {
                return $api.get(apiPath + '/ObterRelatorioPlanta/' + idEdicao + '/' + idIdioma);
            }
        });
        return repository;
    }).factory('RelatorioParticipanteInovacaoRepository', function ($apiRepository, $api) {
        var apiPath = '/api/Inovacao';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getRelatorio: function (filtro) {
                return $api.post(apiPath + '/ObterRelatorioParticipantes', filtro);
            }
        });
        return repository;
    }).factory('NocClienteRepository', function ($apiRepository, $api) {
        var apiPath = '/api/NocCliente';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            findById: function (idNoc, idiomaId) {
                return $api.get(apiPath + '/Get/' + idNoc + '/' + idiomaId);
            },
            exportarParaExcel: function (idNoc, idiomaId) {
                return $api.get(apiPath + '/ExportarParaExcel/' + idNoc + '/' + idiomaId);
            },
            registrarResposta: function (resposta) {
                return $api.post(apiPath + '/RegistrarResposta/', resposta);
            },
            atualizarNOC: function (entity) {
                return $api.post(apiPath + '/AtualizarNOC/', entity);
            },
            registrarDispatch: function (dispatch) {
                return $api.post(apiPath + '/RegistrarDispatch', dispatch);
            },
            registrarApprover: function (approver) {
                return $api.post(apiPath + '/RegistrarApprover', approver);
            },
            checkPermissaoEdicao: function () {
                return $api.get(apiPath + '/ChecaPermissaoEdicao');
            }
        });
        return repository;
    }).factory('NocMetalRepository', function ($apiRepository, $api) {
        var apiPath = '/api/NocMetal';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            aceitar: function (idNocMetal, workflowTaskId) {
                return $api.post(apiPath + '/Aceite/' + idNocMetal + '/' + workflowTaskId);
            },
            registrarParecerComercial: function (registroDeParecerComercial) {
                return $api.post(apiPath + '/RegistrarParecerComercial/', registroDeParecerComercial);
            },
            registrarResposta: function (entity) {
                return $api.post(apiPath + '/RegistrarResposta/', entity);
            },
            getById: function (idNoc, workflowTaskId) {
                return $api.get(apiPath + '/GetNocById/' + idNoc + '/' + workflowTaskId);
            },
            getRelatorio: function (filtro) {
                return $api.post(apiPath + '/ObterRelatorioNocMetal', filtro);
            },
            getRelatorioTempo: function () {
                return $api.post(apiPath + '/ObterRelatorioTempoNocMetal');
            }
          

        });
        return repository;
    }).factory('NocFornecedorRepository', function ($apiRepository, $api) {
        var apiPath = '/api/NocFornecedor';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            Aceitar: function (entity) {
                return $api.post(apiPath + '/Aceite/', entity);
            },
            RegistrarResposta: function (entity) {
                return $api.post(apiPath + '/RegistrarResposta/', entity);
            },
            getById: function (idNoc, workflowTaskId) {
                return $api.get(apiPath + '/GetNocById/' + idNoc + '/' + workflowTaskId);
            }
        });
        return repository;
    }).factory('MasterdataClienteRepository', function ($apiRepository, $api) {
        var apiPath = '/api/MasterdataCliente';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getCadastroById: function (idMasterdataCliente, idiomaId) {
                return $api.get(apiPath + '/GetCadastroCliente/' + idMasterdataCliente + '/' + idiomaId);
            },
            registrarDadosContabeis: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosContabeis/', entity);
            },
            registrarDadosFiscais: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosFiscais/', entity);
            },
            registrarDadosFinanceiro: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosFinanceiro/', entity);
            },
            registrarDadosSAP: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosSAP/', entity);
            },
        });
        return repository;
    }).factory('MasterdataFornecedorRepository', function ($apiRepository, $api) {
        var apiPath = '/api/MasterdataFornecedor';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getCadastroById: function (idMasterdataFornecedor, idiomaId) {
                return $api.get(apiPath + '/GetCadastroFornecedor/' + idMasterdataFornecedor + '/' + idiomaId);
            },
            registrarDadosContabeis: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosContabeis/', entity);
            },
            registrarDadosFiscais: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosFiscais/', entity);
            },
            registrarDadosSAP: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosSAP/', entity);
            },
        });
        return repository;
    }).factory('MasterdataMaterialRepository', function ($apiRepository, $api) {
        var apiPath = '/api/MasterdataMaterial';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            findById: function (idMasterdataFornecedor, idiomaId) {
                return $api.get(apiPath + '/Get/' + idMasterdataFornecedor + '/' + idiomaId);
            },
            registrarDadosSuprimentos: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosSuprimentos/', entity);
            },
            registrarDadosFiscais: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosFiscais/', entity);
            },
            registrarDadosContabeis: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosContabeis/', entity);
            },
            registrarDadosEngenharia: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosEngenharia/', entity);
            },
            registrarDadosSAP: function (entity) {
                return $api.post(apiPath + '/RegistrarDadosSAP/', entity);
            }
        });
        return repository;
    }).factory('InovacaoRepository', function ($apiRepository, $api) {
        var apiPath = '/api/Inovacao';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            findById: function (idInovacao, idiomaId) {
                return $api.get(apiPath + '/Get/' + idInovacao + '/' + idiomaId);
            },
            registrarResposta: function (resposta) {
                return $api.post(apiPath + '/RegistrarResposta/', resposta);
            }
        });
        return repository;
    }).factory('LookupsNocClienteRepository', function ($apiRepository, $api) {
        // var apiPath = '/api/LookupsNocCliente';
        // var apiPath = '/api/v1/employees';
        var apiPath = '/data'; // Data from local file for test purpose

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getFabricas: function (idiomaId) {
                // return $api.get(apiPath + '/GetFabricas/' + idiomaId);
                return $api.get(apiPath + '/fabricas.json');
            },
            getImpactos: function (idiomaId) {
                // return $api.get(apiPath + '/GetFabricas/' + idiomaId);
                return $api.get(apiPath + '/impactos.json');
            },
            getClientes: function (fabricaId) {
                // return $api.get(apiPath + '/GetClientes/' + fabricaId);
                return $api.get(apiPath + '/clientes.json');
            },
            getClassesDefeito: function (idiomaId) {
                return $api.get(apiPath + '/GetClassesDefeito/' + idiomaId);
            },
            getDefeitos: function (classeDefeitoId, idiomaId) {
                return $api.get(apiPath + '/GetDefeitos/' + classeDefeitoId + '/' + idiomaId);
            },
            getMoedas: function (moedaId, idiomaId) {
                return $api.get(apiPath + '/GetMoedas/' + moedaId + '/' + idiomaId);
            },
            getSeveridades: function (idiomaId) {
                return $api.get(apiPath + '/GetSeveridades/' + idiomaId);
            },
            getTiposDeDocumento: function (idiomaId) {
                return $api.get(apiPath + '/GetTiposDeDocumento/' + idiomaId)
            },
            getPareceres: function (idiomaId) {
                return $api.get(apiPath + '/GetPareceres/' + idiomaId)
            },
            getCausasRaiz: function (idiomaId) {
                return $api.get(apiPath + '/GetCausasRaiz/' + idiomaId)
            },
            getProdutos: function (idiomaId, tipo) {
                return $api.get(apiPath + '/GetProdutos/' + idiomaId)
            },
            getFornecedores: function (tipo) {
                return $api.get(apiPath + '/GetFornecedores/' + tipo)
            },
        });
        return repository;

    }).factory('LookupsNocFornecedorRepository', function ($apiRepository, $api) {
        var apiPath = '/api/LookupsNocFornecedor';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getMoedas: function (idiomaId) {
                return $api.get(apiPath + '/GetMoedas/' + idiomaId);
            },
            getSeveridades: function (idiomaId) {
                return $api.get(apiPath + '/GetSeveridades/' + idiomaId);
            },
            getClassesDefeito: function (categoriaId, idiomaId) {
                return $api.get(apiPath + '/GetClassesDefeito/' + categoriaId + '/' + idiomaId);
            },
            getDefeitos: function (classeDefeitoId, idiomaId) {
                return $api.get(apiPath + '/GetDefeitos/' + classeDefeitoId + '/' + idiomaId);
            },
            getTiposServico: function (idiomaId) {
                return $api.get(apiPath + '/GetTiposServico/' + idiomaId);
            },
            getParecer: function (idiomaId) {
                return $api.get(apiPath + '/GetParecer/' + idiomaId);
            },
            getPlantas: function (idiomaId) {
                return $api.get(apiPath + '/GetPlantas/' + idiomaId)
            },
            getFornecedores: function (plantaId, categoriaId) {
                return $api.get(apiPath + '/GetFornecedores/' + plantaId + '/' + categoriaId)
            },
            getRespostasRexam: function (workflowTaskId) {
                return $api.get(apiPath + '/GetRespostasRexam/' + workflowTaskId)
            },
        });
        return repository;
    }).factory('LookupsMasterdataRepository', function ($apiRepository, $api) {
        var apiPath = '/api/LookupsMasterdata';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getPaises: function (idiomaId) {
                return $api.get(apiPath + '/GetPaises/' + idiomaId);
            },
            getRegioes: function (paisId, idiomaId) {
                return $api.get(apiPath + '/GetRegioes/' + paisId + '/' + idiomaId);
            },
            getPaisesRexam: function (idiomaId) {
                return $api.get(apiPath + '/GetPaisesRexam/' + idiomaId);
            },
            getEmpresas: function (paisId) {
                return $api.get(apiPath + '/GetEmpresas/' + paisId);
            },
            getPlantas: function (empresaId) {
                return $api.get(apiPath + '/GetPlantas/' + empresaId);
            },
            getFormasDePagamento: function (idiomaId) {
                return $api.get(apiPath + '/GetFormasDePagamento/' + idiomaId);
            },
            getGruposDeContasCliente: function (idiomaId) {
                return $api.get(apiPath + '/GetGruposDeContasCliente/' + idiomaId);
            },
            getGruposDeContasFornecedor: function (idiomaId) {
                return $api.get(apiPath + '/GetGruposDeContasFornecedor/' + idiomaId);
            },
            getRegioesDeVendas: function (paisRexamId) {
                return $api.get(apiPath + '/GetRegioesDeVendas/' + paisRexamId);
            },
            getGruposDeClientes: function (paisRexamId, idiomaId) {
                return $api.get(apiPath + '/GetGruposDeClientes/' + paisRexamId + '/' + idiomaId);
            },
            getMoedas: function (idiomaId) {
                return $api.get(apiPath + '/GetMoedas/' + idiomaId);
            },
			getGrpEsqFornecedor: function (moedaId, idiomaId) {
                return $api.get(apiPath + '/GetGrpEsqFornecedor');
            },
            getGruposDePreco: function (paisRexamId, idiomaId) {
                return $api.get(apiPath + '/GetGruposDePreco/' + paisRexamId + '/' + idiomaId);
            },
            getZonasDeTransporte: function (paisRexamId, idiomaId) {
                return $api.get(apiPath + '/GetZonasDeTransporte/' + paisRexamId + '/' + idiomaId);
            },
            getCondicoesDeExpedicao: function (paisRexamId, idiomaId) {
                return $api.get(apiPath + '/GetCondicoesDeExpedicao/' + paisRexamId + '/' + idiomaId);
            },
            getCondicoesDePagamento: function (paisRexamId, idiomaId) {
                return $api.get(apiPath + '/GetCondicoesDePagamento/' + paisRexamId + '/' + idiomaId);
            },
            getIncoterm: function (idiomaId) {
                return $api.get(apiPath + '/GetIncoterm/' + idiomaId);
            },
            getClassificacaoFiscal: function (idiomaId) {
                return $api.get(apiPath + '/GetClassificacaoFiscal/' + idiomaId);
            },
            getSetorIndustrial: function (idiomaId) {
                return $api.get(apiPath + '/GetSetorIndustrial/' + idiomaId);
            },
            getContaConciliatoriaCliente: function (idiomaId) {
                return $api.get(apiPath + '/GetContaConciliatoriaCliente/' + idiomaId);
            },
            getContaConciliatoriaFornecedor: function (idiomaId) {
                return $api.get(apiPath + '/GetContaConciliatoriaFornecedor/' + idiomaId);
            },
            getGrupoAdmTesouraria: function (idiomaId) {
                return $api.get(apiPath + '/GetGrupoAdmTesouraria/' + idiomaId);
            },
            getBanco: function (paisRexamId, idiomaId) {
                return $api.get(apiPath + '/GetBanco/' + paisRexamId + '/' + idiomaId);
            },
            getTipoLogradouro: function (idiomaId) {
                return $api.get(apiPath + '/GetTipoLogradouro/' + idiomaId);
            },
            getGrupoClassificacaoContabil: function (idiomaId) {
                return $api.get(apiPath + '/GetGrupoClassificacaoContabil/' + idiomaId);
            },

        });
        return repository;
    }).factory('LookupsMasterdataMaterialRepository', function ($apiRepository, $api) {
        var apiPath = '/api/LookupsMasterdataMaterial';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getPlantas: function (idiomaId) {
                return $api.get(apiPath + '/GetPlantas/' + idiomaId);
            },
            getDepositos: function (plantaId, tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetDepositos/' + plantaId + '/' + tipoMaterialId + '/' + idiomaId);
            },
            getUnidadesDeMedida: function (tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetUnidadesDeMedida/' + tipoMaterialId + '/' + idiomaId);
            },
            getGruposDeMercadoria: function (tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetGruposDeMercadoria/' + tipoMaterialId + '/' + idiomaId);
            },
            getUtilizacaoEquipamento: function (tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetUtilizacaoEquipamento/' + tipoMaterialId + '/' + idiomaId);
            },
            getEquipamentos: function (idiomaId) {
                return $api.get(apiPath + '/GetEquipamentos/' + idiomaId);
            },
            getOrigemMaterial: function (idiomaId) {
                return $api.get(apiPath + '/GetOrigemMaterial/' + idiomaId);
            },
            getTiposMRP: function (tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetTiposMRP/' + tipoMaterialId + '/' + idiomaId);
            },
            getPlanejadorMRP: function (tipoMrpId, idiomaId) {
                return $api.get(apiPath + '/GetPlanejadorMRP/' + tipoMrpId + '/' + idiomaId);
            },
            getTamanhoLoteMRP: function (planejadorMrpId, idiomaId) {
                return $api.get(apiPath + '/GetTamanhoLoteMRP/' + planejadorMrpId + '/' + idiomaId);
            },
            getCategoriaCFOP: function (tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetCategoriaCFOP/' + tipoMaterialId + '/' + idiomaId);
            },
            getClassificacaoFiscal: function (tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetClassificacaoFiscal/' + tipoMaterialId + '/' + idiomaId);
            },
            getUtilizacaoMaterial: function (tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetUtilizacaoMaterial/' + tipoMaterialId + '/' + idiomaId);
            },
            getClasseAvaliacao: function (tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetClasseAvaliacao/' + tipoMaterialId + '/' + idiomaId);
            },
            getAplicacaoEquipamento: function (idiomaId) {
                return $api.get(apiPath + '/GetAplicacaoEquipamento/' + idiomaId);
            },
            getDepositoProducao: function (idiomaId) {
                return $api.get(apiPath + '/GetDepositoProducao/' + idiomaId);
            },
            getCentroLucro: function (idiomaId) {
                return $api.get(apiPath + '/GetCentroLucro/' + idiomaId);
            },
            getGrupoMrp: function (idiomaId) {
                return $api.get(apiPath + '/GetGrupoMrp/' + idiomaId);
            },
            getTipoFert: function (tipoMaterialId, idiomaId) {
                return $api.get(apiPath + '/GetTipoFert/' + tipoMaterialId + '/' + idiomaId);
            },
            getLabEsc: function (idiomaId) {
                return $api.get(apiPath + '/GetLabEsc/' + idiomaId);
            },
        });
        return repository;
    }).factory('LookupsInovacaoRepository', function ($apiRepository, $api) {
        var apiPath = '/api/LookupsInovacao';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getTurmas: function () {
                return $api.get(apiPath + '/GetTurmas/');
            },
            getGruposResponsaveis: function () {
                return $api.get(apiPath + '/GetGruposResponsaveis/');
            },
            getProjetos: function (idUnidadeDoProjeto) {
                return $api.get(apiPath + '/GetProjetos/' + idUnidadeDoProjeto);
            },
            getUnidadesDeProjeto: function () {
                return $api.get(apiPath + '/GetUnidadesDeProjeto/');
            },
            getUnidadesDeProjetoRelatorio: function () {
                return $api.get(apiPath + '/GetUnidadesDeProjetoRelatorio/');
            },
            getParticipantes: function () {
                return $api.get(apiPath + '/GetParticipantes/');
            },
            getParticipantesPorUnidade: function (unidadeDoProjeto) {
                return $api.get(apiPath + '/GetParticipantesPorUnidade/' + unidadeDoProjeto);
            },
            getCategorias: function (idIdioma) {
                return $api.get(apiPath + '/GetCategorias/' + idIdioma);
            },
            getEdicaoAtual: function () {
                return $api.get(apiPath + '/GetEdicaoAtual/');
            },
            getPontuacao: function (idEdicao, idCategoria) {
                return $api.get(apiPath + '/GetPontuacao/' + idEdicao + '/' + idCategoria);
            },
            getTodasEdicoes: function () {
                return $api.get(apiPath + '/GetTodasEdicoes');
            }
        });
        return repository;
    }).factory('TipoMetalRepository', function ($apiRepository, $api) {
        var apiPath = '/api/TipoDeMetal';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getByFornecedor: function (fornecedorId, idPlanta, idiomaId) {
                return $api.get(apiPath + '/GetByFornecedor/' + fornecedorId + '/' + idPlanta + '/' + idiomaId);
            }
        });
        return repository;
    }).factory('PlantaRepository', function ($apiRepository, $api) {
        var apiPath = '/api/Planta';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getByIdioma: function (idiomaId) {
                return $api.get(apiPath + '/GetByIdioma/' + idiomaId);
            }
        });
        return repository;
    }).factory('TipoProblemaRepository', function ($apiRepository, $api) {
        var apiPath = '/api/TipoDeProblema';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getByIdioma: function (idiomaId) {
                return $api.get(apiPath + '/GetByIdioma/' + idiomaId);
            }
        });
        return repository;
    }).factory('FornecedorRepository', function ($apiRepository, $api) {
        var apiPath = '/api/Fornecedor';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getByPlanta: function (plantaId) {
                return $api.get(apiPath + '/GetByPlanta/' + plantaId);
            }
        });
        return repository;
    }).factory('MaterialRepository', function ($apiRepository, $api) {
        var apiPath = '/api/Material';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getByTipoMetal: function (idFornecedor, idPlanta, tipoMetalId, idiomaId) {
                return $api.get(apiPath + '/GetByTipoMetal/' + idFornecedor + '/' + idPlanta + '/' + tipoMetalId + '/' + idiomaId);
            }
        });
        return repository;
    }).factory('CategoriaFornecedorRepository', function ($apiRepository, $api) {
        var apiPath = '/api/NocFornecedor';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getAll: function () {
                return $api.get(apiPath + '/GetAllCategoriaFornecedor');
            }
        });
        return repository;
    }).factory('CausaRaizRepository', function ($apiRepository, $api) {
        var apiPath = '/api/CausaRaiz';

        var repository = $apiRepository.create(apiPath);
        angular.extend(repository, {
            getByTipoMetal: function (tipoMetalId, idiomaId) {
                return $api.get(apiPath + '/GetByTipoMetal/' + tipoMetalId + '/' + idiomaId);
            }
        });
        return repository;
    });
})();