"use strict";

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

//TODO: Método copiado da internet, refatorar para melhor entendimento.
Function.method('inherits', function () {

    var parent = arguments[0];

    var newArguments = [];
    for (var i = 1; i < arguments.length; i++) {
        newArguments.push(arguments[i]);
    }

    var parentInstance = Object.create(parent.prototype);
    parent.apply(parentInstance, newArguments);

    this.prototype = parentInstance;
    var d = {},
        p = this.prototype;
    this.prototype.constructor = this;
    this.method('uber', function uber(name) {
        if (!(name in d)) {
            d[name] = 0;
        }
        var f, r, t = d[name], v = parent.prototype;
        if (t) {
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            f = v[name];
        } else {
            f = p[name];
            if (f == this[name]) {
                f = v[name];
            }
        }
        d[name] += 1;
        r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
        d[name] -= 1;
        return r;
    });
    return this;
});


var Impeto = {};

var NAMESPACE_SEPARATOR = ".";

var namespace = function (path, content) {
    var namespaces = path.split(NAMESPACE_SEPARATOR);
    var previousNamespace = window;

    $.each(namespaces, function (key, item) {
        if (!previousNamespace[item]) {
            previousNamespace[item] = {};
        }

        previousNamespace = previousNamespace[item];
    });

    angular.extend(previousNamespace, content);
};

//Apenas definição de escopo. Dessa forma é possível criar classes internas.
(function () {

    //Representa uma sequencia para auto-incremento
    var Sequence = function (name) {
        var name = name;
        var store = new DevExpress.data.LocalStore({
            name: name,
            key: "id"
        });

        var currentValue = function () {
            var currentValue;

            store.totalCount()
                .done(function (result) {
                    currentValue = result;
                });

            return currentValue;
        }

        var nextValue = function () {

            var nextValue = currentValue() + 1;

            store.insert({ id: nextValue });
            return nextValue;
        }

        this.currentValue = currentValue;
        this.nextValue = nextValue;
    }

    var LocalDataRepository = function (name) {

        var store = new DevExpress.data.LocalStore({
            name: name,
            key: "id",
            immediate: true
        });

        /* implementação dos métodos de repositório */
        var save = function (entity) {

            if (!entity.id) {
                entity.id = sequence.nextValue();
            }
            store.insert(entity);
        };

        var update = function (entity) {
            store.update(entity.id, entity);
        };

        var saveOrUpdate = function (entity) {
            if (!entity.id) {
                save(entity);
            } else {
                update(entity);
            }
        };

        var filter = function (filter) {
            var entities;

            store.load({ filter: filter }).done(function (items) {
                entities = items;
            });

            return entities;
        };

        var findById = function (id) {
            var entity;

            store.byKey(id).done(function (dataItem) {
                entity = dataItem;
            });

            return entity;
        };

        var getAll = function () {
            var entities;

            store.load().done(function (items) {
                entities = items;
            });

            return entities;
        };

        var sequence = new Sequence("sq_" + name);

        this.save = save;
        this.update = update;
        this.saveOrUpdate = saveOrUpdate;

        //delete é uma palavra reservada do JavaScript, por isso não é declarado antes;
        this.delete = function (id) {
            store.remove(id);
        }

        this.filter = filter;
        this.findById = findById;
        this.getAll = getAll;
    }

    //Classes de infraestrutura são publicadas aqui
    namespace("Impeto.infrastructure.data", {
        Sequence: Sequence,
        LocalDataRepository: LocalDataRepository
    });

})();