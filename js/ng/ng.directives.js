// APP DIRECTIVES
// main directives
angular.module('app.main', [])
    //filters
    .filter('decimal', ['$filter', function ($filter) {

        var currency = $filter('number');
        return function (amount, places) {
            if (places == undefined)
                places = 2;
            if (amount == undefined)
                amount = 0;

            if (amount.toString().indexOf(",") > 0) {
                amount = amount.toString().replace(/\./g, '');
                amount = amount.toString().replace(/\,/g, '.');
            }

            var value = currency(amount, places);

            value = value.toString().replace(/\,/g, '#');
            value = value.toString().replace(/\./g, ',');
            value = value.toString().replace(/\#/g, '.');
            return value;
        };
    }])

    .filter('nl2br', ['$sce', function ($sce) {
        return function (text) {
            return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>').replace(/\r/g, '<br/>')) : '';
        };
    }])

	// initiate body
	.directive('body', function () {
	    return {
	        restrict: 'E',
	        link: function (scope, element, attrs) {
	            element.on('click', 'a[href="#"], [data-toggle]', function (e) {
	                e.preventDefault();
	            })
	        }
	    }
	})

	.directive("jdatepicker", function () {
	    return {
	        restrict: "A",
	        require: "ngModel",
	        link: function (scope, elem, attrs, ngModelCtrl) {
	            var updateModel = function (dateText) {
	                scope.$apply(function () {
	                    ngModelCtrl.$setViewValue(dateText);
	                });
	            };
	            var options = {
	                dateFormat: "dd/mm/yy",
	                onSelect: function (dateText) {
	                    updateModel($.datepicker.parseDate('dd/mm/yy', dateText).toJSON());
	                }
	            };
	            elem.datepicker(options);
	        }
	    }
	})

    .directive('uiCnpj', function () {
        return {
            require: '?ngModel',
            link: function ($scope, element, attrs, controller) {
                element.mask("99.999.999/9999-99", {
                    completed: function () {
                        controller.$setViewValue(this.val());
                        $scope.$apply();
                    }
                });
            }
        };
    })

    .directive('uiCpf', function () {
        return {
            require: '?ngModel',
            link: function ($scope, element, attrs, controller) {
                element.mask("999.999.999-99", {
                    completed: function () {
                        controller.$setViewValue(this.val());
                        $scope.$apply();
                    }
                });
            }
        };
    })

    .directive('uiDate', function () {
        return {
            require: '?ngModel',
            link: function ($scope, element, attrs, controller) {
                element.mask("99/99/9999", {
                    completed: function () {
                        var dataref = Date.parse(this.val(), "dd/MM/yyyy");
                        var dataAtual = Date.parse(new Date());
                        if (attrs.maxDate != undefined && dataref > dataAtual) {
                            this.val('');
                            this.blur();
                        }

                        if (isNaN(dataref)) {
                            this.val('');
                        }
                        else {
                            controller.$setViewValue(Date.parse(this.val(), "dd/MM/yyyy"));
                            $scope.$apply();
                        }
                    }
                });
            }
        };
    })

    .directive('uiHour', function () {
        return {
            require: '?ngModel',
            link: function ($scope, element, attrs, controller) {
                element.mask("99:99", {
                    completed: function () {
                        var isValid = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])?$/.test(this.val());
                        if (!isValid) {
                            this.val('');
                            this.blur();
                        }
                        else {
                            controller.$setViewValue(this.val());
                            $scope.$apply();
                        }
                    }
                });
            }
        };
    })

    .directive('validFile', function () {
        return {
            require: 'ngModel',
            link: function (scope, el, attrs, ngModel) {
                ngModel.$render = function () {
                    ngModel.$setViewValue(el.val());
                };

                el.bind('change', function () {
                    scope.$apply(function () {
                        ngModel.$render();
                    });
                });
            }
        };
    })

    .directive('numberDecimal', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function (inputValue) {

                    if (inputValue == undefined) return ''

                    var transformedInput = inputValue.replace(/\D/g, '')
                    transformedInput = transformedInput.replace(/(\d{1})(\d{17})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{14})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{11})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{8})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{5})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{1,2})$/, '$1,$2');

                    if (transformedInput != inputValue) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    })

    .directive('numberDecimal3', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function (inputValue) {

                    if (inputValue == undefined) return ''

                    var transformedInput = inputValue.replace(/\D/g, '')
                    transformedInput = transformedInput.replace(/(\d{1})(\d{18})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{15})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{12})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{9})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{6})$/, '$1.$2');
                    transformedInput = transformedInput.replace(/(\d{1})(\d{1,3})$/, '$1,$2');

                    if (transformedInput != inputValue) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    })

    //caso use essa diretiva e fazer cálculos, remover os pontos(.) antes
     .directive('numbersOnlyFormatted', ['$filter', function ($filter) {
         return {
             require: 'ngModel',
             link: function (scope, element, attrs, ngModelCtrl) {
                 ngModelCtrl.$parsers.push(function (inputValue) {
                     if (inputValue == undefined) return ''

                     var transformedInput = inputValue.replace(/\D/g, '')
                     transformedInput = $filter('decimal')(transformedInput, 0)

                     if (transformedInput != inputValue) {
                         ngModelCtrl.$setViewValue(transformedInput);
                         ngModelCtrl.$render();
                     }

                     return transformedInput;
                 });
             }
         };
     }])

    .directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue == undefined) return ''

                    var transformedInput = inputValue.replace(/\D/g, '')

                    if (transformedInput != inputValue) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    })

    .directive('myTable', function () {
        return function (scope, element, attrs) {

            // apply DataTable options, use defaults if none specified by user
            var options = {};

            if (attrs.myTable.length > 0) {
                options = scope.$eval(attrs.myTable);
            } else {
                options = {
                    "bStateSave": true,
                    "iCookieDuration": 2419200, /* 1 month */
                    "bJQueryUI": true,
                    "bPaginate": true,
                    "bLengthChange": false,
                    "bFilter": true,
                    "bInfo": false,
                    "bDestroy": true,
                    "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs'T>r>" +
						"t" +
						"<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
                    "oTableTools": {
                        "aButtons": [
                        "copy",
                        "csv",
                        "xls",
                           {
                               "sExtends": "pdf",
                               "sTitle": "Impeto_PDF",
                               "sPdfMessage": "Impeto PDF Export",
                               "sPdfSize": "letter"
                           },
                           {
                               "sExtends": "print",
                               "sMessage": "Generated by Impeto <i>(press Esc to close)</i>"
                           }
                        ],
                        "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
                    },
                };
            }

            // Tell the dataTables plugin what columns to use
            // We can either derive them from the dom, or use setup from the controller           
            var explicitColumns = [];
            element.find('th').each(function (index, elem) {
                explicitColumns.push($(elem).text());
            });

            //if (explicitColumns.length > 0) {
            //    options["aoColumns"] = explicitColumns;
            //} else if (attrs.aoColumns) {
            //    options["aoColumns"] = scope.$eval(attrs.aoColumns);
            //}

            // aoColumnDefs is dataTables way of providing fine control over column config
            if (attrs.aoColumnDefs) {
                options["aoColumnDefs"] = scope.$eval(attrs.aoColumnDefs);
            }

            if (attrs.fnRowCallback) {
                options["fnRowCallback"] = scope.$eval(attrs.fnRowCallback);
            }

            // apply the plugin
            var dataTable = element.dataTable(options);

            // watch for any changes to our data, rebuild the DataTable
            scope.$watch(attrs.aaData, function (value) {
                var val = value || [];
                dataTable.fnClearTable();
                if (val.length > 0) {
                    dataTable.fnAddData(scope.$eval(attrs.aaData));
                }
            });

            // Apply the filter
            $("#" + attrs.id + " thead th input[type=text]").on('keyup change', function () {

                var oTable = dataTable.DataTable();

                oTable
                    .column($(this).parent().index() + ':visible')
                    .search(this.value)
                    .draw();

            });
        };
    })

	.factory('ribbon', ['$rootScope', function ($rootScope) {
	    var ribbon = {
	        currentBreadcrumb: [],
	        updateBreadcrumb: function (crumbs) {
	            crumbs.push('Home');
	            var breadCrumb = crumbs.reverse();
	            ribbon.currentBreadcrumb = breadCrumb;
	            $rootScope.$broadcast('navItemSelected', breadCrumb);
	        }
	    };

	    return ribbon;
	}])

	.directive('action', function () {
	    return {
	        restrict: 'A',
	        link: function (scope, element, attrs) {
	            /*
				 * SMART ACTIONS
				 */
	            var smartActions = {

	                // LOGOUT MSG 
	                userLogout: function ($this) {

	                    // ask verification
	                    $.SmartMessageBox({
	                        title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
	                        content: $this.data('logout-msg') || "You can improve your security further after logging out by closing this opened browser",
	                        buttons: '[No][Yes]'

	                    }, function (ButtonPressed) {
	                        if (ButtonPressed == "Yes") {
	                            $.root_.addClass('animated fadeOutUp');
	                            setTimeout(logout, 1000);
	                        }
	                    });
	                    function logout() {
	                        window.location = $this.attr('href');
	                    }

	                },

	                // RESET WIDGETS
	                resetWidgets: function ($this) {
	                    $.widresetMSG = $this.data('reset-msg');

	                    $.SmartMessageBox({
	                        title: "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
	                        content: $.widresetMSG || "Would you like to RESET all your saved widgets and clear LocalStorage?",
	                        buttons: '[No][Yes]'
	                    }, function (ButtonPressed) {
	                        if (ButtonPressed == "Yes" && localStorage) {
	                            localStorage.clear();
	                            location.reload();
	                        }

	                    });
	                },

	                // LAUNCH FULLSCREEN 
	                launchFullscreen: function (element) {

	                    if (!$.root_.hasClass("full-screen")) {

	                        $.root_.addClass("full-screen");

	                        if (element.requestFullscreen) {
	                            element.requestFullscreen();
	                        } else if (element.mozRequestFullScreen) {
	                            element.mozRequestFullScreen();
	                        } else if (element.webkitRequestFullscreen) {
	                            element.webkitRequestFullscreen();
	                        } else if (element.msRequestFullscreen) {
	                            element.msRequestFullscreen();
	                        }

	                    } else {

	                        $.root_.removeClass("full-screen");

	                        if (document.exitFullscreen) {
	                            document.exitFullscreen();
	                        } else if (document.mozCancelFullScreen) {
	                            document.mozCancelFullScreen();
	                        } else if (document.webkitExitFullscreen) {
	                            document.webkitExitFullscreen();
	                        }

	                    }

	                },

	                // MINIFY MENU
	                minifyMenu: function ($this) {
	                    if (!$.root_.hasClass("menu-on-top")) {
	                        $.root_.toggleClass("minified");
	                        $.root_.removeClass("hidden-menu");
	                        $('html').removeClass("hidden-menu-mobile-lock");
	                        $this.effect("highlight", {}, 500);
	                    }
	                },

	                // TOGGLE MENU 
	                toggleMenu: function () {
	                    if (!$.root_.hasClass("menu-on-top")) {
	                        $('html').toggleClass("hidden-menu-mobile-lock");
	                        $.root_.toggleClass("hidden-menu");
	                        $.root_.removeClass("minified");
	                    } else if ($.root_.hasClass("menu-on-top") && $.root_.hasClass("mobile-view-activated")) {
	                        $('html').toggleClass("hidden-menu-mobile-lock");
	                        $.root_.toggleClass("hidden-menu");
	                        $.root_.removeClass("minified");
	                    }
	                },

	                // TOGGLE SHORTCUT 
	                toggleShortcut: function () {

	                    if (shortcut_dropdown.is(":visible")) {
	                        shortcut_buttons_hide();
	                    } else {
	                        shortcut_buttons_show();
	                    }

	                    // SHORT CUT (buttons that appear when clicked on user name)
	                    shortcut_dropdown.find('a').click(function (e) {
	                        e.preventDefault();
	                        window.location = $(this).attr('href');
	                        setTimeout(shortcut_buttons_hide, 300);

	                    });

	                    // SHORTCUT buttons goes away if mouse is clicked outside of the area
	                    $(document).mouseup(function (e) {
	                        if (!shortcut_dropdown.is(e.target) && shortcut_dropdown.has(e.target).length === 0) {
	                            shortcut_buttons_hide();
	                        }
	                    });

	                    // SHORTCUT ANIMATE HIDE
	                    function shortcut_buttons_hide() {
	                        shortcut_dropdown.animate({
	                            height: "hide"
	                        }, 300, "easeOutCirc");
	                        $.root_.removeClass('shortcut-on');

	                    }

	                    // SHORTCUT ANIMATE SHOW
	                    function shortcut_buttons_show() {
	                        shortcut_dropdown.animate({
	                            height: "show"
	                        }, 200, "easeOutCirc");
	                        $.root_.addClass('shortcut-on');
	                    }

	                }

	            };

	            var actionEvents = {
	                userLogout: function (e) {
	                    smartActions.userLogout(element);
	                },
	                resetWidgets: function (e) {
	                    smartActions.resetWidgets(element);
	                },
	                launchFullscreen: function (e) {
	                    smartActions.launchFullscreen(document.documentElement);
	                },
	                minifyMenu: function (e) {
	                    smartActions.minifyMenu(element);
	                },
	                toggleMenu: function (e) {
	                    smartActions.toggleMenu();
	                },
	                toggleShortcut: function (e) {
	                    smartActions.toggleShortcut();
	                }
	            };

	            if (angular.isDefined(attrs.action) && attrs.action != '') {
	                var actionEvent = actionEvents[attrs.action];
	                if (typeof actionEvent === 'function') {
	                    element.on('click', function (e) {
	                        actionEvent(e);
	                        e.preventDefault();
	                    });
	                }
	            }

	        }
	    };
	})

	.directive('header', function () {
	    return {
	        restrict: 'EA',
	        link: function (scope, element, attrs) {
	            // SHOW & HIDE MOBILE SEARCH FIELD
	            angular.element('#search-mobile').click(function () {
	                $.root_.addClass('search-mobile');
	            });

	            angular.element('#cancel-search-js').click(function () {
	                $.root_.removeClass('search-mobile');
	            });
	        }
	    };
	})

	.directive('ribbon', function () {
	    return {
	        restrict: 'A',
	        link: function (scope, element, attrs) {

	        }
	    };
	})

	.controller('breadcrumbController', ['$scope', function ($scope) {
	    $scope.breadcrumbs = [];
	    $scope.$on('navItemSelected', function (name, crumbs) {
	        $scope.setBreadcrumb(crumbs);
	    });

	    $scope.setBreadcrumb = function (crumbs) {
	        $scope.breadcrumbs = crumbs;
	    }
	}])

	.directive('breadcrumb', ['ribbon', 'localize', '$compile', function (ribbon, localize, $compile) {
	    return {
	        restrict: 'AE',
	        controller: 'breadcrumbController',
	        replace: true,
	        link: function (scope, element, attrs) {
	            scope.$watch('breadcrumbs', function (newVal, oldVal) {
	                if (newVal !== oldVal) {
	                    // update DOM
	                    scope.updateDOM();
	                }
	            })
	            scope.updateDOM = function () {
	                element.empty();
	                angular.forEach(scope.breadcrumbs, function (crumb) {
	                    var li = angular.element('<li data-localize="' + crumb + '">' + crumb + '</li>');
	                    li.text(localize.localizeText(crumb));

	                    $compile(li)(scope);
	                    element.append(li);
	                });
	            };

	            // set the current breadcrumb on load
	            scope.setBreadcrumb(ribbon.currentBreadcrumb);
	            scope.updateDOM();
	        },
	        template: '<ol class="breadcrumb"></ol>'
	    }
	}])

    .directive('inovacaoInclude', function ($http, $compile) {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                $http.get(attrs.src)
                    .then(function (response) {
                        element.html($compile(response.data)(scope));
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
                    });
            }
        };
    })

    .directive('fileUpload', ['serverBaseUrl', function (serverBaseUrl) {
        return {
            restrict: 'E',
            templateUrl: 'views/upload-template.html',
            scope: { tipodocumento: '=' },
            link: function (scope, element, attrs) {
                //set id input "fileToUpload" 
                var idFileUpload = 'fileToUpload' + Math.floor((1 + Math.random()) * 0x10000);
                $(element).find(':file').attr('id', idFileUpload);

                if (attrs.multiple != undefined && attrs.multiple == "false") {
                    $(element).find(':file').removeAttr('multiple');
                    scope.UploadMultiple = false;
                } else scope.UploadMultiple = true;

                scope.setFiles = function (element, attrs) {
                    scope.$apply(function (scope) {
                        console.log('files:', element.files);
                        if (!scope.$parent.files)
                            scope.$parent.files = [];

                        for (var i = 0; i < element.files.length; i++) {
                            if (scope.tipodocumento) {
                                scope.$parent.files.push({ file: element.files[i], tipo: scope.tipodocumento });
                            }
                            else if (fileIsValid(element.files[i])) {
                                scope.$parent.files.push({ file: element.files[i] });
                            }
                        }
                        scope.$parent.progressVisible = false
                    });
                };

                scope.removeFile = function (index) {
                    scope.$parent.files.splice(index, 1);
                    scope.$parent.progressVisible = false
                };

                uploadFiles = function (data) {
                    var fd = new FormData();
                    for (var i in scope.$parent.files) {

                        fd.append("uploadedFile" + i, scope.$parent.files[i].file);
                        if (scope.$parent.files[i].tipo) {
                            fd.append("enumTypeFile" + i, scope.$parent.files[i].tipo)
                        }
                    }

                    var xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener("progress", uploadProgress, false);
                    xhr.addEventListener("load", uploadComplete, false);
                    xhr.upload.addEventListener("error", uploadFailed, false);
                    xhr.upload.addEventListener("abort", uploadCanceled, false);
                    xhr.open("post", serverBaseUrl + "/api/Files/Upload", true);
                    scope.$parent.progressVisible = true;
                    xhr.send(fd);
                };

                function fileIsValid(file) {
                    if (file.type == "application/x-msdownload") {
                        return false;
                    }

                    var size = getImageSize(file.size);
                    if (size > 10) {
                        return false;
                    }

                    return true;
                }

                getImageSize = function (sizeInBytes) {
                    var sizeInMG = sizeInBytes / 1024 / 1024;
                    return +(Math.round(sizeInMG + "e+2") + "e-2");
                };

                function uploadProgress(evt) {
                    scope.$apply(function () {
                        if (evt.lengthComputable) {
                            scope.$parent.progress = Math.round(evt.loaded * 100 / evt.total)
                        } else {
                            scope.$parent.progress = 'unable to compute'
                        }
                    })
                }

                function uploadComplete(evt) {
                    scope.$parent.entity.Anexos = evt.target.responseText;
                    //só depois do upload que faço o submit
                    scope.$parent.onSuccessUpload();
                }

                function uploadFailed(evt) {
                    alert("There was an error attempting to upload the file.")
                }

                function uploadCanceled(evt) {
                    scope.$apply(function () {
                        scope.progressVisible = false
                    })
                    alert("The upload has been canceled by the user or the browser dropped the connection.")
                }
            }
        };
    }])

	.directive('dropbox', ['serverBaseUrl', function (serverBaseUrl) {
	    return {
	        restrict: 'A',
	        link: function (scope, element, attrs) {
	            var dropbox = element[0];
	            scope.dropText = 'Solte os arquivos aqui...';

	            function fileIsValid(file) {
	                if (file.type == "application/x-msdownload") {
	                    return false;
	                }

	                var size = getImageSize(file.size);
	                if (size > 10) {
	                    return false;
	                }

	                return true;
	            }

	            getImageSize = function (sizeInBytes) {
	                var sizeInMG = sizeInBytes / 1024 / 1024;
	                return +(Math.round(sizeInMG + "e+2") + "e-2");
	            };

	            function dragEnterLeave(evt) {
	                evt.stopPropagation()
	                evt.preventDefault()
	                scope.$apply(function () {
	                    scope.dropText = 'Solte os arquivos aqui...'
	                    scope.dropClass = ''
	                })
	            }

	            dropbox.addEventListener("dragenter", dragEnterLeave, false);
	            dropbox.addEventListener("dragleave", dragEnterLeave, false);

	            dropbox.addEventListener("dragover", function (evt) {
	                evt.stopPropagation()
	                evt.preventDefault()
	                var clazz = 'not-available'
	                var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0
	                scope.$apply(function () {
	                    scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!'
	                    scope.dropClass = ok ? 'over' : 'not-available'
	                })
	            }, false)

	            dropbox.addEventListener("drop", function (evt) {
	                console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)))
	                evt.stopPropagation()
	                evt.preventDefault()
	                scope.$apply(function () {
	                    scope.dropText = 'Drop files here...'
	                    scope.dropClass = ''
	                })
	                var files = evt.dataTransfer.files
	                if (files.length > 0) {
	                    scope.$apply(function () {

	                        if (!scope.$parent.files)
	                            scope.$parent.files = [];

	                        for (var i = 0; i < files.length; i++) {
	                            if (fileIsValid(files[i])) {

	                                if (scope.tipodocumento) {
	                                    scope.$parent.files.push({ file: files[i], tipo: scope.tipodocumento });
	                                }
	                                else {
	                                    scope.$parent.files.push({ file: files[i] });
	                                }
	                            }
	                        }
	                    })
	                }
	            }, false)
	        }
	    };
	}])
;

// directives for localization
angular.module('app.localize', [])

	.factory('localize', ['$http', '$rootScope', '$window', function ($http, $rootScope, $window) {
	    var localize = {
	        currentLocaleData: {},
	        currentLang: {},
	        setLang: function (lang) {
	            $http({ method: 'GET', url: localize.getLangUrl(lang), cache: false })
				.success(function (data) {
				    localize.currentLocaleData = data;
				    localize.currentLang = lang;
				    $rootScope.$broadcast('localizeLanguageChanged');
				    $http.defaults.headers.common['Accept-Language'] = lang.langCode;
				}).error(function (data) {
				    console.log('Error updating language!');
				})
	        },
	        getLangUrl: function (lang) {
	            return 'js/langs/' + lang.langCode + '.js';
	        },

	        localizeText: function (sourceText) {
	            return localize.currentLocaleData[sourceText];
	        }
	    };

	    return localize;
	}])

	.directive('localize', ['localize', function (localize) {
	    return {
	        restrict: 'A',
	        scope: {
	            sourceText: '@localize'
	        },
	        link: function (scope, element, attrs) {
	            scope.$on('localizeLanguageChanged', function () {
	                var localizedText = localize.localizeText(scope.sourceText);
	                if (element.is('input, textarea')) element.attr('placeholder', localizedText)
	                else element.text(localizedText);
	            });
	        }
	    }
	}])
;

// directives for navigation
angular.module('app.navigation', [])
	.directive('navigation', function () {
	    return {
	        restrict: 'AE',
	        controller: ['$scope', function ($scope) {

	        }],
	        transclude: true,
	        replace: true,
	        link: function (scope, element, attrs) {
	            if (!topmenu) {
	                if (!null) {
	                    element.first().jarvismenu({
	                        accordion: true,
	                        speed: $.menu_speed,
	                        closedSign: '<em class="fa fa-plus-square-o"></em>',
	                        openedSign: '<em class="fa fa-minus-square-o"></em>'
	                    });
	                } else {
	                    alert("Error - menu anchor does not exist");
	                }
	            }

	            // SLIMSCROLL FOR NAV
	            if ($.fn.slimScroll) {
	                element.slimScroll({
	                    height: '100%'
	                });
	            }

	            scope.getElement = function () {
	                return element;
	            }
	        },
	        template: '<nav><ul data-ng-transclude=""></ul></nav>'
	    };
	})

	.controller('NavGroupController', ['$scope', function ($scope) {
	    $scope.active = false;
	    $scope.hasIcon = angular.isDefined($scope.icon);
	    $scope.hasIconCaption = angular.isDefined($scope.iconCaption);

	    this.setActive = function (active) {
	        $scope.active = active;
	    }

	}])
	.directive('navGroup', function () {
	    return {
	        restrict: 'AE',
	        controller: 'NavGroupController',
	        transclude: true,
	        replace: true,
	        scope: {
	            icon: '@',
	            title: '@',
	            iconCaption: '@',
	            active: '=?'
	        },
	        template: '\
				<li data-ng-class="{active: active}">\
					<a href="">\
						<i data-ng-if="hasIcon" class="{{ icon }}"><em data-ng-if="hasIconCaption"> {{ iconCaption }} </em></i>\
						<span class="menu-item-parent" data-localize="{{ title }}">{{ title }}</span>\
					</a>\
					<ul data-ng-transclude=""></ul>\
				</li>',

	    };
	})

	.controller('NavItemController', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
	    $scope.isChild = false;
	    $scope.active = false;
	    $scope.isActive = function (viewLocation) {
	        $scope.active = viewLocation === $location.path();
	        return $scope.active;
	    };

	    $scope.hasIcon = angular.isDefined($scope.icon);
	    $scope.hasIconCaption = angular.isDefined($scope.iconCaption);

	    $scope.getItemUrl = function (view) {
	        if (angular.isDefined($scope.href)) return $scope.href;
	        if (!angular.isDefined(view)) return '';
	        return '#' + view;
	    };

	    $scope.getItemTarget = function () {
	        return angular.isDefined($scope.target) ? $scope.target : '_self';
	    };

	}])
	.directive('navItem', ['ribbon', '$window', function (ribbon, $window) {
	    return {
	        require: ['^navigation', '^?navGroup'],
	        restrict: 'AE',
	        controller: 'NavItemController',
	        scope: {
	            title: '@',
	            view: '@',
	            icon: '@',
	            iconCaption: '@',
	            href: '@',
	            target: '@'
	        },
	        link: function (scope, element, attrs, parentCtrls) {
	            var navCtrl = parentCtrls[0],
					navgroupCtrl = parentCtrls[1]

	            scope.$watch('active', function (newVal, oldVal) {
	                if (newVal) {
	                    if (angular.isDefined(navgroupCtrl)) navgroupCtrl.setActive(true);
	                    $window.document.title = scope.title;
	                    scope.setBreadcrumb();
	                } else {
	                    if (angular.isDefined(navgroupCtrl)) navgroupCtrl.setActive(false);
	                }
	            });

	            scope.openParents = scope.isActive(scope.view);
	            scope.isChild = angular.isDefined(navgroupCtrl);

	            scope.setBreadcrumb = function () {
	                var crumbs = [];
	                crumbs.push(scope.title);
	                // get parent menus
	                var test = element.parents('nav li').each(function () {
	                    var el = angular.element(this);
	                    var parent = el.find('.menu-item-parent:eq(0)');
	                    crumbs.push(parent.data('localize').trim());
	                    if (scope.openParents) {
	                        // open menu on first load
	                        parent.trigger('click');
	                    }
	                });
	                // this should be only fired upon first load so let's set this to false now
	                scope.openParents = false;
	                ribbon.updateBreadcrumb(crumbs);
	            };

	            element.on('click', 'a[href!="#"]', function () {
	                if ($.root_.hasClass('mobile-view-activated')) {
	                    $.root_.removeClass('hidden-menu');
	                    $('html').removeClass("hidden-menu-mobile-lock");
	                }
	            });

	        },
	        transclude: true,
	        replace: true,
	        template: '\
				<li data-ng-class="{active: isActive(view)}">\
					<a href="{{ getItemUrl(view) }}" target="{{ getItemTarget() }}" title="{{ title }}">\
						<i data-ng-if="hasIcon" class="{{ icon }}"><em data-ng-if="hasIconCaption"> {{ iconCaption }} </em></i>\
						<span ng-class="{\'menu-item-parent\': !isChild}" data-localize="{{ title }}"> {{ title }} </span>\
						<span data-ng-transclude=""></span>\
					</a>\
				</li>'
	    };
	}])
;

// directives for activity
angular.module('app.activity', [])
	.controller('ActivityController', ['$scope', '$http', function ($scope, $http) {
	    var ctrl = this,
			items = ctrl.items = $scope.items = [];

	    ctrl.loadItem = function (loadedItem, callback) {
	        angular.forEach(items, function (item) {
	            if (item.active && item !== loadedItem) {
	                item.active = false;
	                //item.onDeselect();
	            }
	        });

	        loadedItem.active = true;
	        if (angular.isDefined(loadedItem.onLoad)) {
	            loadedItem.onLoad(loadedItem);
	        }

	        $http.get(loadedItem.src).then(function (result) {
	            var content = result.data;
	            if (angular.isDefined(callback)) {
	                callback(content);
	            }
	        });
	    };

	    ctrl.addItem = function (item) {
	        items.push(item);
	        if (!angular.isDefined(item.active)) {
	            // set the default
	            item.active = false;
	        } else if (item.active) {
	            ctrl.loadItem(item);
	        }
	    };

	    ctrl.refresh = function (e) {
	        var btn = angular.element(e.currentTarget);
	        btn.button('loading');

	        if (angular.isDefined($scope.onRefresh)) {
	            $scope.onRefresh($scope, function () {
	                btn.button('reset');
	            });
	        } else {
	            btn.button('reset');
	        }
	    };
	}])

	.directive('activity', function () {
	    return {
	        restrict: 'AE',
	        replace: true,
	        transclude: true,
	        controller: 'ActivityController',
	        scope: {
	            onRefresh: '=onrefresh',
	        },
	        template: '<span data-ng-transclude=""></span>'
	    };
	})

	.directive('activityButton', function () {
	    return {
	        restrict: 'AE',
	        require: '^activity',
	        replace: true,
	        transclude: true,
	        controller: function ($scope) {

	        },
	        scope: {
	            icon: '@',
	            total: '='
	        },
	        template: '\
					<span id="activity" class="activity-dropdown">\
						<i ng-class="icon"></i>\
						<b class="badge"> {{ total }} </b>\
					</span>',
	        link: function (scope, element, attrs, activityCtrl) {

	            attrs.$observe('icon', function (value) {
	                if (!angular.isDefined(value))
	                    scope.icon = 'fa fa-user';
	            });

	            element.on('click', function (e) {
	                var $this = $(this);

	                if ($this.find('.badge').hasClass('bg-color-red')) {
	                    $this.find('.badge').removeClassPrefix('bg-color-');
	                    $this.find('.badge').text("0");
	                    // console.log("Ajax call for activity")
	                }

	                if (!$this.next('.ajax-dropdown').is(':visible')) {
	                    $this.next('.ajax-dropdown').fadeIn(150);
	                    $this.addClass('active');
	                } else {
	                    $this.next('.ajax-dropdown').fadeOut(150);
	                    $this.removeClass('active');
	                }

	                var mytest = $this.next('.ajax-dropdown').find('.btn-group > .active > input').attr('id');
	                //console.log(mytest)

	                e.preventDefault();
	            });

	            if (scope.total > 0) {
	                var $badge = element.find('.badge');
	                $badge.addClass("bg-color-red bounceIn animated");
	            }
	        }
	    };
	})

	.controller('ActivityContentController', ['$scope', function ($scope) {
	    var ctrl = this;
	    $scope.currentContent = '';
	    ctrl.loadContent = function (content) {
	        $scope.currentContent = content;
	    }
	}])

	.directive('activityContent', ['$compile', function ($compile) {
	    return {
	        restrict: 'AE',
	        transclude: true,
	        require: '^activity',
	        replace: true,
	        scope: {
	            footer: '=?'
	        },
	        controller: 'ActivityContentController',
	        template: '\
				<div class="ajax-dropdown">\
					<div class="btn-group btn-group-justified" data-toggle="buttons" data-ng-transclude=""></div>\
					<div class="ajax-notifications custom-scroll">\
						<div class="alert alert-transparent">\
							<h4>Click a button to show messages here</h4>\
							This blank page message helps protect your privacy, or you can show the first message here automatically.\
						</div>\
						<i class="fa fa-lock fa-4x fa-border"></i>\
					</div>\
					<span> {{ footer }}\
						<button type="button" data-loading-text="Loading..." data-ng-click="refresh($event)" class="btn btn-xs btn-default pull-right" data-activty-refresh-button="">\
						<i class="fa fa-refresh"></i>\
						</button>\
					</span>\
				</div>',
	        link: function (scope, element, attrs, activityCtrl) {
	            scope.refresh = function (e) {
	                activityCtrl.refresh(e);
	            };

	            scope.$watch('currentContent', function (newContent, oldContent) {
	                if (newContent !== oldContent) {
	                    var el = element.find('.ajax-notifications').html(newContent);
	                    $compile(el)(scope);
	                }
	            });
	        }
	    };
	}])

	.directive('activityItem', function () {
	    return {
	        restrict: 'AE',
	        require: ['^activity', '^activityContent'],
	        scope: {
	            src: '=',
	            onLoad: '=onload',
	            active: '=?'
	        },
	        controller: function () {

	        },
	        transclude: true,
	        replace: true,
	        template: '\
				<label class="btn btn-default" data-ng-click="loadItem()" ng-class="{active: active}">\
					<input type="radio" name="activity">\
					<span data-ng-transclude=""></span>\
				</label>',
	        link: function (scope, element, attrs, parentCtrls) {
	            var activityCtrl = parentCtrls[0],
					contentCtrl = parentCtrls[1];

	            scope.$watch('active', function (active) {
	                if (active) {
	                    activityCtrl.loadItem(scope, function (content) {
	                        contentCtrl.loadContent(content);
	                    });
	                }
	            });
	            activityCtrl.addItem(scope);

	            scope.loadItem = function () {
	                scope.active = true;
	            };
	        }
	    };
	})

;

angular.module('app.smartui', [])
	.directive('widgetGrid', function () {
	    return {
	        restrict: 'AE',
	        link: function (scope, element, attrs) {
	            scope.setup_widget_desktop = function () {
	                if ($.fn.jarvisWidgets && $.enableJarvisWidgets) {
	                    element.jarvisWidgets({
	                        grid: 'article',
	                        widgets: '.jarviswidget',
	                        localStorage: true,
	                        deleteSettingsKey: '#deletesettingskey-options',
	                        settingsKeyLabel: 'Reset settings?',
	                        deletePositionKey: '#deletepositionkey-options',
	                        positionKeyLabel: 'Reset position?',
	                        sortable: true,
	                        buttonsHidden: false,
	                        // toggle button
	                        toggleButton: true,
	                        toggleClass: 'fa fa-minus | fa fa-plus',
	                        toggleSpeed: 200,
	                        onToggle: function () {
	                        },
	                        // delete btn
	                        deleteButton: true,
	                        deleteClass: 'fa fa-times',
	                        deleteSpeed: 200,
	                        onDelete: function () {
	                        },
	                        // edit btn
	                        editButton: true,
	                        editPlaceholder: '.jarviswidget-editbox',
	                        editClass: 'fa fa-cog | fa fa-save',
	                        editSpeed: 200,
	                        onEdit: function () {
	                        },
	                        // color button
	                        colorButton: true,
	                        // full screen
	                        fullscreenButton: true,
	                        fullscreenClass: 'fa fa-expand | fa fa-compress',
	                        fullscreenDiff: 3,
	                        onFullscreen: function () {
	                        },
	                        // custom btn
	                        customButton: false,
	                        customClass: 'folder-10 | next-10',
	                        customStart: function () {
	                            alert('Hello you, this is a custom button...');
	                        },
	                        customEnd: function () {
	                            alert('bye, till next time...');
	                        },
	                        // order
	                        buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
	                        opacity: 1.0,
	                        dragHandle: '> header',
	                        placeholderClass: 'jarviswidget-placeholder',
	                        indicator: true,
	                        indicatorTime: 600,
	                        ajax: true,
	                        timestampPlaceholder: '.jarviswidget-timestamp',
	                        timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
	                        refreshButton: true,
	                        refreshButtonClass: 'fa fa-refresh',
	                        labelError: 'Sorry but there was a error:',
	                        labelUpdated: 'Last Update:',
	                        labelRefresh: 'Refresh',
	                        labelDelete: 'Delete widget:',
	                        afterLoad: function () {
	                        },
	                        rtl: false, // best not to toggle this!
	                        onChange: function () {

	                        },
	                        onSave: function () {

	                        },
	                        ajaxnav: $.navAsAjax // declears how the localstorage should be saved (HTML or AJAX page)

	                    });
	                }
	            }

	            scope.setup_widget_mobile = function () {
	                if ($.enableMobileWidgets && $.enableJarvisWidgets) {
	                    scope.setup_widgets_desktop();
	                }
	            }

	            if ($.device === "desktop") {
	                scope.setup_widget_desktop();
	            } else {
	                scope.setup_widget_mobile();
	            }

	        }
	    }
	})

	.directive('widget', function () {
	    return {
	        restrict: 'AE',
	        transclude: true,
	        replace: true,
	        template: '<div class="jarviswidget" data-ng-transclude=""></div>'
	    }
	})

	.directive('widgetHeader', function () {
	    return {
	        restrict: 'AE',
	        transclude: true,
	        replace: true,
	        scope: {
	            title: '@',
	            icon: '@'
	        },
	        template: '\
				<header>\
					<span class="widget-icon"> <i data-ng-class="icon"></i> </span>\
					<h2>{{ title }}</h2>\
					<span data-ng-transclude></span>\
				</header>'
	    }
	})

	.directive('widgetToolbar', function () {
	    return {
	        restrict: 'AE',
	        transclude: true,
	        replace: true,
	        template: '<div class="widget-toolbar" data-ng-transclude=""></div>'
	    }
	})

	.directive('widgetEditbox', function () {
	    return {
	        restrict: 'AE',
	        transclude: true,
	        replace: true,
	        template: '<div class="jarviswidget-editbox" data-ng-transclude=""></div>'
	    }
	})

	.directive('widgetBody', function () {
	    return {
	        restrict: 'AE',
	        transclude: true,
	        replace: true,
	        template: '<div data-ng-transclude=""></div>'
	    }
	})

	.directive('widgetBodyToolbar', function () {
	    return {
	        restrict: 'AE',
	        transclude: true,
	        replace: true,
	        scope: {
	            class: '@'
	        },
	        template: '<div class="widget-body-toolbar" data-ng-transclude=""></div>'
	    }
	})

	.directive('widgetContent', function () {
	    return {
	        restrict: 'AE',
	        transclude: true,
	        replace: true,
	        template: '<div class="widget-body" data-ng-transclude=""></div>'
	    }
	})

    .directive('passwordMatch', [function () {
        return {
            restrict: 'A',
            scope: true,
            require: 'ngModel',
            link: function (scope, elem, attrs, control) {
                var checker = function () {

                    //get the value of the first password
                    var e1 = scope.$eval(attrs.ngModel);

                    //get the value of the other password
                    var e2 = scope.$eval(attrs.passwordMatch);
                    return e1 == e2;
                };
                scope.$watch(checker, function (n) {

                    //set the form control to valid if both
                    //passwords are the same, else invalid
                    control.$setValidity("passwordMatch", n);
                });
            }
        };
    }])
