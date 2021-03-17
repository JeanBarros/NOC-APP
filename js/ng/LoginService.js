(function () {
    'use strict';

    RexamWorkflowApp.factory('LoginService', ['$http', '$q', LoginService]);

    function LoginService($http, $q) {
        // Define the functions and properties to reveal.
        var service = {
            login: login
        };

        return service;
    }
})();