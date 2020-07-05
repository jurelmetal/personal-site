var EnqueuePro;
(function (EnqueuePro) {
    var Javascript;
    (function (Javascript) {
        var _enqueueproBuildJsVersion = "1.8.8";
        Javascript.Version = _enqueueproBuildJsVersion;
    })(Javascript = EnqueuePro.Javascript || (EnqueuePro.Javascript = {}));
})(EnqueuePro || (EnqueuePro = {}));

var EnqueuePro;
(function (EnqueuePro) {
    var Javascript;
    (function (Javascript) {
        var Addons;
        (function (Addons) {
            var token = /** @class */ (function () {
                function token(queueClient, queryStringPrefix, urlUtil) {
                    if (queryStringPrefix === void 0) { queryStringPrefix = null; }
                    if (urlUtil === void 0) { urlUtil = null; }
                    this.queryStringPrefix = !queryStringPrefix ? "" : queryStringPrefix;
                    this.client = queueClient;
                    this.urlUtil = urlUtil;
                    if (!this.urlUtil) {
                        this.urlUtil = {
                            getPathName: function () { return document.location.pathname; },
                            getSearch: function () { return document.location.search; },
                            getHash: function () { return document.location.hash; },
                            replaceHistory: function (url) { return window.history.replaceState(window.history.state, document.title, url); }
                        };
                    }
                }
                token.prototype.removeTokenFromUrl = function () {
                    if (!window.history || !window.history.replaceState)
                        return;
                    var queryString = this.urlUtil.getSearch();
                    queryString = this.tryRemoveQueueITToken(queryString);
                    var guidRegEx = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
                    queryString = queryString.replace(this.generateRegex("q", guidRegEx), "$1");
                    queryString = queryString.replace(this.generateRegex("p", guidRegEx), "$1");
                    queryString = queryString.replace(this.generateRegex("h", "[0-9a-f]{32}"), "$1");
                    queryString = queryString.replace(this.generateRegex("rt", "[a-z]+"), "");
                    queryString = queryString.replace(this.generateRegex("ts", "\\d+"), "$1");
                    queryString = queryString.replace(this.generateRegex("e", "[a-z0-9]{3,20}"), "$1");
                    queryString = queryString.replace(this.generateRegex("c", this.client.getCustomerId()), "$1");
                    queryString = queryString.replace(/\?$/, "");
                    queryString = queryString.replace(/&$/, "");
                    queryString = queryString.replace(/\?#/, "#");
                    var pathname = this.urlUtil.getPathName();
                    var url = pathname +
                        queryString +
                        this.urlUtil.getHash();
                    if (!url)
                        url = "/";
                    this.urlUtil.replaceHistory(url);
                };
                token.prototype.tryRemoveQueueITToken = function (queryString) {
                    var regex = new RegExp("([\?&])(enqueuetoken=([a-z0-9]|-|_|~)*&?)", "i");
                    queryString = queryString.replace(regex, "$1");
                    return queryString;
                };
                token.prototype.generateRegex = function (queryStringParameter, value) {
                    if (value === void 0) { value = "[^&]+"; }
                    var regex = new RegExp("([\?&])(" + this.queryStringPrefix + queryStringParameter + "=" + value + "&?)", "i");
                    return regex;
                };
                return token;
            }());
            Addons.token = token;
        })(Addons = Javascript.Addons || (Javascript.Addons = {}));
    })(Javascript = EnqueuePro.Javascript || (EnqueuePro.Javascript = {}));
})(EnqueuePro || (EnqueuePro = {}));

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}
function queueClient(c, e, options) {
    var clientOptions;
    //support legacy function queueClient(c: string, e: string, validity: any, language: string, options: EnqueuePro.Javascript.Options)
    if (arguments.length >= 5)
        clientOptions = arguments[4];
    if (typeof options == "object")
        clientOptions = options;
    if (!clientOptions)
        clientOptions = new EnqueuePro.Javascript.Options();
    if (arguments[2] != null && !isNaN(arguments[2])) {
        clientOptions.validity = Number(arguments[2]);
    }
    if (arguments[3] != null && typeof arguments[3] == "string") {
        clientOptions.culture = arguments[3];
    }
    //end legacy support
    return new EnqueuePro.Javascript.QueueClient(c, e, clientOptions);
}
var EnqueuePro;
(function (EnqueuePro) {
    var Javascript;
    (function (Javascript) {
        var QueueClientCustomerRepo = /** @class */ (function () {
            function QueueClientCustomerRepo() {
                this.clients = new Array();
            }
            QueueClientCustomerRepo.prototype.add = function (client) {
                this.clients.push(client);
                this[client.getEventId()] = client;
            };
            QueueClientCustomerRepo.prototype.getAll = function () {
                return this.clients;
            };
            return QueueClientCustomerRepo;
        }());
        Javascript.QueueClientCustomerRepo = QueueClientCustomerRepo;
        var QueueClientRepository = /** @class */ (function () {
            function QueueClientRepository() {
            }
            QueueClientRepository.prototype.set = function (c, e, client) {
                if (!this[c]) {
                    this[c] = new QueueClientCustomerRepo();
                }
                this[c].add(client);
            };
            QueueClientRepository.prototype.get = function (c) {
                return this[c];
            };
            return QueueClientRepository;
        }());
        Javascript.QueueClientRepository = QueueClientRepository;
        var Options = /** @class */ (function () {
            function Options() {
                if (!this.targetUrlParams)
                    this.targetUrlParams = new Array();
            }
            Options.prototype.addTargetUrlParam = function (key, value) {
                this.targetUrlParams.push(new TargetUrlParam(key, value));
            };
            return Options;
        }());
        Javascript.Options = Options;
        var TargetUrlParam = /** @class */ (function () {
            function TargetUrlParam(key, value) {
                this.key = key;
                this.value = value;
                if (!key || !key.match("^[a-zA-Z0-9_]+$"))
                    throw new Error("Target URL parameter key '" + key + "' is invalid");
            }
            return TargetUrlParam;
        }());
        Javascript.TargetUrlParam = TargetUrlParam;
        var RedirectOptions = /** @class */ (function () {
            function RedirectOptions() {
            }
            return RedirectOptions;
        }());
        Javascript.RedirectOptions = RedirectOptions;
        var QueueClient = /** @class */ (function () {
            function QueueClient(c, e, options) {
                this.queueClientIsEnabled = false;
                this.queueClientIsVerified = false;
                this.timeoutTimer = null;
                this.customerId = c.toLowerCase().trim();
                this.eventId = e.toLowerCase().trim();
                if (!window.enqueuepro) {
                    window.enqueuepro = new QueueClientRepository();
                }
                window.enqueuepro.set(this.customerId, this.eventId, this);
                if (!options)
                    options = new Options();
                if (!options.host)
                    options.host = 'getqueued.enqueue.pro';
                if (!options.redirector)
                    options.redirector = function (url) {
                        if (confirm("Te redirijo?")) {
                            window.location.href = url;
                            document.close();
                        }
                    };
                if (!options.getCookies)
                    options.getCookies = function () { return document.cookie; };
                if (!options.setCookie)
                    options.setCookie = function (cookie) { document.cookie = cookie; };
                if (options.extendValidity === undefined)
                    options.extendValidity = true;
                if (!options.currentUrl)
                    options.currentUrl = window.location.href;
                this.options = options;
                if (isNaN(options.validity))
                    this.validity = 20;
                else
                    this.validity = Number(options.validity);
                this.language = options.culture;
                this.layoutName = options.layoutName;
                this.targetUrl = options.targetUrl;
                if (!options.createCookieManager) {
                    options.createCookieManager = function (customerId, eventId, host, cookieDomain, getCookies, setCookie) {
                        return new Javascript.CookieManager(customerId, eventId, host, cookieDomain, getCookies, setCookie);
                    };
                }
                this.cookieManager = options.createCookieManager(this.customerId, this.eventId, this.options.host, this.options.cookieDomain, this.options.getCookies, this.options.setCookie);
                this.initialize(this.customerId, this.eventId);
            }
            QueueClient.prototype.initialize = function (customerId, eventId) {
                var _this = this;
                if (this.options.removeTokenFromUrl && this.hasBeenThroughQueue(this.getCurrentUrl())) {
                    var token = new Javascript.Addons.token(this, this.options.queryStringPrefix);
                    token.removeTokenFromUrl();
                }
                var userverified = this.cookieManager.getValidationState();
                //if user has a enqueuetoken we try to first validate the token and add a new cookie before validating old cookie
                //by this we are avoiding the scenario which browser has an invalid knownuser timeouted cookie 
                if (this.enqueueproTokenExist(this.getCurrentUrl())) {
                    this.queueClientIsEnabled = true;
                }
                else if (userverified === 'verified') {
                    if (this.options.extendValidity) {
                        this.cookieManager.extendCookie(this.validity);
                    }
                    this.queueClientIsVerified = true;
                    this.queueClientIsEnabled = true;
                    this.executeCallback(this.options.onVerified);
                }
                else if (userverified === 'disabled' && !this.hasBeenThroughQueue(this.getCurrentUrl())) {
                    this.queueClientIsEnabled = false;
                    this.executeCallback(this.options.onDisabled);
                }
                else if (userverified === 'timeout' && !this.hasBeenThroughQueue(this.getCurrentUrl())) {
                    this.queueClientIsEnabled = false;
                    this.executeCallback(this.options.onTimeout);
                }
                else {
                    this.queueClientIsEnabled = this.cookieManager.cookieIsEnabled();
                }
                if (!this.queueClientIsVerified && this.queueClientIsEnabled) {
                    var queueStateCookie = this.cookieManager.getQueueStateCookie();
                    var queueUrl = 'https://getqueued.enqueue.pro' +
                        '?t=' + encodeURIComponent(this.getTargetUrl()) +
                        '&e=' + eventId +
                        '&ver=js' + EnqueuePro.Javascript.Version +
                        (!this.language ? '' : '&cid=' + this.language) +
                        (!this.layoutName ? '' : '&l=' + encodeURIComponent(this.layoutName)) +
                        (!queueStateCookie ? '' : ('&_cval=' + encodeURIComponent(queueStateCookie) + '&_cv=' + this.options.validity)) +
                        this.generateTargetUrlParams();
                    this.options.redirector(queueUrl);
                }
            };
            QueueClient.prototype.getCustomerId = function () {
                return this.customerId;
            };
            QueueClient.prototype.getEventId = function () {
                return this.eventId;
            };
            QueueClient.prototype.enqueue = function (redirectInfo) {
                if (!redirectInfo)
                    return;
                clearTimeout(this.timeoutTimer);
                if (this.queueClientIsVerified)
                    return;
                if (!this.queueClientIsEnabled)
                    return;
                if (redirectInfo.redirect) {
                    this.options.redirector(redirectInfo.redirectUrl);
                    return;
                }
                if (redirectInfo.isError) {
                    this.executeCallback(this.options.onDisabled);
                    return;
                }
                this.cookieManager.setCookieValue(redirectInfo.cookieValue, redirectInfo.fixedCookieValidity || this.validity);
                var state = this.cookieManager.getValidationState();
                if (state == 'disabled' || redirectInfo.isError) {
                    this.executeCallback(this.options.onDisabled);
                    return;
                }
                else if (state == 'verified') {
                    this.queueClientIsVerified = true;
                    this.executeCallback(this.options.onVerified);
                    return;
                }
                throw "enqueuepro could not set cookie.";
            };
            QueueClient.prototype.cancel = function (returnUrl) {
                if (returnUrl === void 0) { returnUrl = null; }
                this.cancelSession();
                this.cancelQueueItem(returnUrl);
            };
            QueueClient.prototype.cancelSession = function () {
                this.cookieManager.cancelCookie();
            };
            QueueClient.prototype.cancelQueueItem = function (returnUrl) {
                if (returnUrl === void 0) { returnUrl = null; }
                var cancelUrl = '//' +
                    this.options.host +
                    '/cancel.aspx?c=' +
                    this.customerId +
                    '&e=' +
                    this.eventId +
                    '&t=' +
                    encodeURIComponent(window.location.href);
                if (returnUrl)
                    cancelUrl =
                        cancelUrl +
                            '&r=' +
                            encodeURIComponent(returnUrl);
                this.options.redirector(cancelUrl);
            };
            QueueClient.prototype.getTargetUrl = function () {
                var currentUrl = this.getCurrentUrl();
                if (this.hasBeenThroughQueue(currentUrl))
                    return currentUrl; // return the url with known user token so it can be verified server side
                if (this.options.useEventTargetUrl)
                    return ""; // send an empty t so the event target url is used
                if (this.targetUrl)
                    return this.targetUrl; // target url is set, use that
                return currentUrl; // use current page
            };
            QueueClient.prototype.generateTargetUrlParams = function () {
                if (!this.options.useEventTargetUrl || !this.options.targetUrlParams)
                    return "";
                var params = "";
                for (var i = 0; i < this.options.targetUrlParams.length; i++) {
                    var param = this.options.targetUrlParams[i];
                    params += "&t_" + param.key + "=" + encodeURIComponent(param.value);
                }
                return params;
            };
            QueueClient.prototype.getCurrentUrl = function () {
                return this.options.currentUrl;
            };
            QueueClient.prototype.hasBeenThroughQueue = function (currentUrl) {
                return currentUrl.match("[?&][a-zA-Z]{0,4}q=[0-9a-f-]{36}.*&[a-zA-Z]{0,4}h=[0-9a-f]{32}")
                    || currentUrl.toLowerCase().indexOf('enqueuetoken') > -1;
            };
            QueueClient.prototype.enqueueproTokenExist = function (currentUrl) {
                return currentUrl.toLowerCase().indexOf('enqueuetoken') > -1;
            };
            QueueClient.prototype.executeCallback = function (callback) {
                if (!callback)
                    return;
                try {
                    callback();
                }
                catch (e) {
                    window.console && window.console.error("Error in onVerified callback: " + e.message);
                }
            };
            return QueueClient;
        }());
        Javascript.QueueClient = QueueClient;
    })(Javascript = EnqueuePro.Javascript || (EnqueuePro.Javascript = {}));
})(EnqueuePro || (EnqueuePro = {}));

var EnqueuePro;
(function (EnqueuePro) {
    var Javascript;
    (function (Javascript) {
        var CookieManager = /** @class */ (function () {
            function CookieManager(customerId, eventId, host, cookieDomain, getCookies, setCookie, getNow) {
                if (getCookies === void 0) { getCookies = function () { return document.cookie; }; }
                if (setCookie === void 0) { setCookie = function (cookie) { return document.cookie = cookie; }; }
                if (getNow === void 0) { getNow = function () { return new Date(); }; }
                this.customerId = customerId;
                this.eventId = eventId;
                this.host = host;
                this.cookieDomain = cookieDomain;
                this.getCookies = getCookies;
                this.setCookie = setCookie;
                this.getNow = getNow;
            }
            CookieManager.prototype.extendCookie = function (validityMinutes) {
                var cookie = this.getQueueStateCookie();
                if (!cookie) {
                    return;
                }
                if (cookie === 'timeout') {
                    return;
                }
                this.setCookieValue(cookie, validityMinutes);
            };
            CookieManager.prototype.getValidationState = function () {
                var cookieValue = this.getQueueStateCookie();
                if (!cookieValue) {
                    return undefined;
                }
                if (cookieValue === 'timeout') {
                    return 'timeout';
                }
                var valueMap = this.toQueueState(cookieValue);
                if (valueMap.redirectType === 'idle') {
                    var timeNow = this.getNow();
                    //issuetime is in second converting to js time
                    valueMap.issueTime = valueMap.issueTime * 1000;
                    var upperValidity = new Date(valueMap.issueTime);
                    upperValidity.setMinutes(upperValidity.getMinutes() + valueMap.fixedCookieValidity);
                    var lowerValidity = new Date(valueMap.issueTime);
                    lowerValidity.setMinutes(lowerValidity.getMinutes() - valueMap.fixedCookieValidity);
                    //this case might happen when user go from KU to JS when queue is disabled
                    if (timeNow > upperValidity)
                        return undefined;
                    //this case might happen when user go from KU to JS when queue is disabled abnd user timer is not valid
                    if (timeNow < lowerValidity)
                        return undefined;
                    return 'disabled';
                }
                else {
                    return 'verified';
                }
            };
            CookieManager.prototype.cookieIsEnabled = function () {
                return navigator.cookieEnabled;
            };
            CookieManager.prototype.setTimeoutState = function () {
                this.setQueueStateCookie(this.getCookieName(), 'timeout', 3);
            };
            CookieManager.prototype.setCookieValue = function (value, validityMinutes) {
                this.setQueueStateCookie(this.getCookieName(), value, validityMinutes);
            };
            CookieManager.prototype.cancelCookie = function () {
                this.setQueueStateCookie(this.getCookieName(), '', -1);
            };
            CookieManager.prototype.getQueueStateCookie = function () {
                var name = this.getCookieName();
                var allCookies = this.getCookies();
                if (!allCookies)
                    return undefined;
                var i, x, y, ARRcookies = allCookies.split(';');
                for (i = 0; i < ARRcookies.length; i++) {
                    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
                    y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
                    x = x.replace(/^\s+|\s+$/g, '');
                    if (x == name) {
                        return decodeURIComponent(y);
                    }
                }
                return undefined;
            };
            CookieManager.prototype.cancelQueueId = function () {
                var queueId = this.getQueueIdFromQueueStateCookie();
                this.removeLocalSession();
                if (queueId) {
                    this.removeSessionInQueueITDomain(queueId);
                }
            };
            CookieManager.prototype.setQueueStateCookie = function (name, value, exminutes) {
                var newCookieExist = false;
                //try to store cookie with cookiedomain
                var c_value = encodeURIComponent(value) + ';path=/';
                var exdate = this.getNow();
                exdate.setMinutes(exdate.getMinutes() + exminutes);
                if (exminutes > 0) {
                    c_value = c_value + ';expires=' + exdate.toUTCString();
                }
                else {
                    c_value = c_value + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
                }
                if (this.cookieDomain) {
                    c_value = c_value + ';domain=' + this.cookieDomain;
                }
                this.setCookie(name + '=' + c_value);
                //////////////////
                //try to store cookie without subdomain if cookiedomain was wrong
                if (exminutes > 0 && this.getQueueStateCookie() !== value) {
                    c_value = encodeURIComponent(value) + ';path=/;expires=' + exdate.toUTCString();
                    this.setCookie(name + '=' + c_value);
                }
                else if (exminutes <= 0 && this.getQueueStateCookie()) {
                    c_value = encodeURIComponent(value) + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
                    this.setCookie(name + '=' + c_value);
                }
            };
            CookieManager.prototype.getCookieName = function () {
                return CookieManager.CookieNameInitializer + this.eventId;
            };
            CookieManager.prototype.getQueueIdFromQueueStateCookie = function () {
                try {
                    var cookieValue = this.getQueueStateCookie();
                    if (!cookieValue)
                        return null;
                    return this.toQueueState(cookieValue).queueId;
                }
                catch (_a) {
                    console.warn("Resolving QueueId from cookie failed");
                }
            };
            CookieManager.prototype.toQueueState = function (queueStateCookie) {
                var result = {
                    redirectType: "",
                    issueTime: 0,
                    fixedCookieValidity: 0,
                    queueId: null
                };
                for (var _i = 0, _a = queueStateCookie.split('&'); _i < _a.length; _i++) {
                    var keyVal = _a[_i];
                    var keyValArray = keyVal.split('=');
                    if (keyValArray.length != 2) {
                        return undefined;
                    }
                    switch (keyValArray[0].toLowerCase()) {
                        case 'redirecttype':
                            result.redirectType = keyValArray[1].toLowerCase();
                            break;
                        case 'issuetime':
                            result.issueTime = Number(keyValArray[1]);
                            break;
                        case 'fixedvaliditymins':
                            result.fixedCookieValidity = Number(keyValArray[1]);
                            break;
                        case 'queueid':
                            result.queueId = keyValArray[1];
                            break;
                    }
                }
                return result;
            };
            CookieManager.prototype.removeLocalSession = function () {
                var cookieValue = this.getCookieName() + '=';
                if (this.cookieDomain) {
                    cookieValue += ';domain=' + this.cookieDomain;
                }
                cookieValue += ';path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = cookieValue;
                this.setCookie(cookieValue);
            };
            CookieManager.prototype.removeSessionInQueueITDomain = function (queueId) {
                var script = document.createElement('script');
                script.src = this.host + "/cancel/" + this.customerId + "/" + this.eventId + "/" + queueId + "/cancelqueueid";
                document.getElementsByTagName('head')[0].appendChild(script);
            };
            CookieManager.CookieNameInitializer = 'EnqueueProAccepted-SDFrts345E-V3_';
            return CookieManager;
        }());
        Javascript.CookieManager = CookieManager;
    })(Javascript = EnqueuePro.Javascript || (EnqueuePro.Javascript = {}));
})(EnqueuePro || (EnqueuePro = {}));