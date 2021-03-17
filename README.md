# NOC-APP
AngularJS Project


1 - Adicionar controle dropdown no arquivo register.html;
	a) Na tag <select> verificar ser a diretiva ng-model aponta para o controller correto;
	b) Verificar os nomes das propriedades na diretiva ng-options (ng-options="f.employee_name for f in fabricas track by f.id"); 
2 - Definir a variável serverBaseUrl no arquivo ng.app.js para o local da api ou arquivo de dados;

3 - No arquivo ng.repositories.js, definir a variável apiPath no repository "LookupsNocClienteRepository" - (var apiPath = '/api/v1/employees' ou arquivo de dados local: var apiPath = '/data/fabricas.json') para testes;

4 - Adicionar um novo controller para obter os dados no arquivo ng.controllers.js
$scope.$watch('entity.Fabrica', function () {
            LookupsNocClienteRepository.getFabricas(settings.currentLang.codigoId).success(function (data) {
                $scope.fabricas = data.data;
                console.log(data.data);
            }).error(function (err, status) {
                defaultErrorResponseHandler($accountService, status, err.ExceptionMessage);
                console.log(status);
                console.log(err);
            });            
        }); 
