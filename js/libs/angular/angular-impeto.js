'use strict';
(function () {

    angular.module('impeto.infrastructure.api', [])
        .value('serverBaseUrl', '')
        .factory('$api', ['$http', 'serverBaseUrl', $api])
        .factory('$apiRepository', ['$api', $apiRepository]);

    angular.module('impeto.accessControl', [])
        .factory('$accountService', ['serverBaseUrl', 'clientBaseUrl', 'loginUrl', '$q', '$http', 'loginInternoUrl', $accountService]);

    angular.module('impeto.controllers', [])
        .factory('$listController', ['$accountService', $listController]);

    function $api($http, serverBaseUrl) {
        // Define the functions and properties to reveal.

        var service = {
            addModelErrorsToScope: addModelErrorsToScope,
            post: function (path, data, options) {
                options = options || service.defaultOptions;

                angular.extend(options, { headers: getHeaders() });

                return $http.post(getServiceUrl(path), data, options)
            },
            "delete": function (path, options) {
                options = options || service.defaultOptions;

                angular.extend(options, { headers: getHeaders() });

                return $http.delete(getServiceUrl(path), options)
            },
            get: function (path, options) {
                options = options || service.defaultOptions;

                angular.extend(options, { headers: getHeaders() });

                return $http.get(getServiceUrl(path), options)
            },
            defaultOptions: {}
        };

        return service;

        function getServiceUrl(path) {
            return serverBaseUrl + path;
        }

        function addModelErrorsToScope($scope, errors) {

            angular.forEach(errors, function (value) {

                var collectionName = value.TargetProperty.concat("Errors");

                $scope[collectionName] = value.Messages;
            })

        }

        // we have to include the Bearer token with each call to the Web API controllers.
        function getHeaders() {
            var accessToken = localStorage.accessToken;

            if (accessToken) {
                return { "Authorization": "Bearer " + accessToken };
            }
        }
    }

    function $apiRepository($api) {
        return {
            create: function (apiPath) {
                return {
                    "delete": function (id) {
                        return $api.delete(apiPath + '/' + id);
                    },
                    findById: function (id) {
                        return $api.get(apiPath + '/' + id);
                    },
                    getAll: function () {
                        return $api.get(apiPath);
                    },
                    saveOrUpdate: function (data, callback) {
                        return $api.post(apiPath, data);
                    }
                }
            }
        }
    }

    function $accountService(serverBaseUrl, clientBaseUrl, loginUrl, $q, $http, loginInternoUrl) {
        return {
            navigateToLogin: navigateToLogin,
            logout: logout,
            login: login,
            obterUsuarioWindows: obterUsuarioWindows,
            salvarSharepoint: salvarSharepoint
        };

        function login(userData) {
            var tokenUrl = serverBaseUrl + "Token";

            if (!userData.grant_type) {
                userData.grant_type = "password";
            }

            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: tokenUrl,
                data: "userName=" + userData.username + "&password=" + userData.password + "&grant_type=password"
            }).success(function (data, status, headers, cfg) {
                localStorage.accessToken = data.access_token;
                localStorage.userName = data.userName;
                window.location = clientBaseUrl + '/';

                deferred.resolve(data);

            }).error(function (err, status) {
                deferred.reject(status);
            });

            return deferred.promise;
        }

        function logout() {
            var cpf_cnpj = localStorage.userName;
            $.ajax({
                type: "POST",
                url: serverBaseUrl + '/api/Usuario/Logout/',
                async: false,
                success: function (data) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userName');
                }
            });

            navigateToLogin(cpf_cnpj);
        }

        function navigateToLogin(cpf_cnpj) {
            window.location = cpf_cnpj.length == 11 ? loginInternoUrl : loginUrl;
        }

        function obterUsuarioWindows() {
            $.ajax({
                type: "GET",
                url: serverBaseUrl + '/api/Usuario/ObterUsuario/',
                async: false,
                dataType: 'json',
                success: function (data) {
                    localStorage.accessToken = "";
                    localStorage.userName = data != null ? data.replace(/"""/g, "") : "";
                }
            });
        }

        function iframeRequest(url, method, data, callback) {
            var container = $('<div></div>');
            var frame = $('<iframe src="#" name="postFrame"></iframe>');

            if (data) {
                var form = $('<form target="postFrame"></form>')
                    .attr('action', url)
                    .attr('method', method);


                $.each(data, function (key, value) {
                    var field = $('<input>');

                    field.attr("type", "hidden");
                    field.attr("name", key);
                    field.attr("value", value);

                    form.append(field);
                });

                container.append(form);
            }

            container.append(frame);

            $(document.body).append(container);

            if (data) {
                form.submit();
            }

            frame.load(function () {
                if(callback) {
                    callback(frame);
                }

                container.remove();
            });
        }

        function salvarSharepoint(userData) {

            var method = userData.method || 'GET';

            $(window).on("message", function (e) {
                var data = e.originalEvent.data;
                if (data[0]) {
                    var log = {
                        Mensagem: data[1],
                        IdEntidade: userData.idEntidade,
                        Fluxo: userData.fluxo,
                        Usuario: localStorage.userName,
                        Url: userData.url
                    };

                    $.ajax({
                        type: "POST",
                        url: serverBaseUrl + '/api/Log/SalvarLogErroSharepoint/',
                        async: false,
                        dataType: 'json',
                        data: log
                    }).success(function () {
                        app.hideProcess();
                        FecharJanelaComMensagem(userData.msgSucesso, userData.msgConcluido);
                    }).error(function () {
                        app.hideProcess();
                    });
                } else {
                    app.hideProcess();
                    FecharJanelaComMensagem(userData.msgSucesso, userData.msgConcluido);
                }
            });

            if (!userData.useForm) {
                $('body').append("<iframe id='respostaWkf' style='display:none;' src='" + userData.url + "'></iframe>");
            } else {
                iframeRequest(userData.url, method, userData.data);
            }

            setTimeout(function () {
                app.hideProcess();
                FecharJanelaComMensagem(userData.msgSucesso, userData.msgConcluido);
            }, 7000);
        }
    }

    function $listController($accountService) {
        return {
            create: function ($scope, repository) {
                repository.getAll().success(function (data) {
                    $scope.items = data;
                }).error(function (err, status) {
                    defaultErrorResponseHandler($accountService, status);
                });
            }
        }
    }
})();

function defaultErrorResponseHandler($accountService, status, error) {
    if (status == 401) {
        $accountService.logout();
    }
    else {
        $.smallBox({
            title: "Error!",
            content: error.replace(/\n/g, "<br />"),
            color: "#a90329",
            iconSmall: "fa fa-times",
            timeout: 10000,
            sound_file: 'voice_alert',
        });
        console.log('status: ' + status + ' erro: ', error);
        //alert(error);
    }
}

function defaultSuccess(msg) {
    $.smallBox({
        title: "Success!",
        content: msg,
        color: "#739E73",
        iconSmall: "fa fa-check",
        timeout: 10000,
        sound_file: 'voice_alert',
    });
}