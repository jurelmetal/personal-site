window.enqueuepro_clientside_config = {
    description: "Test company",
    integrations: [
        {
              name: "TEST EVENT",
              actionType: "Queue",
              eventId: "275367c1-7d61-419a-a73d-1e6b5d4e72fe",
              cookieDomain: "juanito.cl",
              layoutName: null,
              culture: "",
              extendValidity: false,
              validity: 10,
              triggers: [{
                triggerParts: [{
                  operator: "Contains",
                  valueToCompare: "juanito.cl",
                  valuesToCompare: null,
                  urlPart: "HostName",
                  cookieName: null,
                  httpHeaderName: null,
                  validatorType: "UrlValidator",
                  isNegative: false,
                  isIgnoreCase: true
                }],
                logicalOperator: "And"
              }],
              queueDomain: "getqueued.enqueue.pro",
              redirectLogic: "AllowTParameter",
              forcedTargetUrl: ""
        }
    ],
    customerId: "a9690a11-4ee6-4724-b53f-a104b8c80bb7",
    "Version": 95,
    "PublishDate": "2020-07-01T14:12:49.2068857Z",
    "ConfigDataVersion": "1.0.0.4"
};

EnqueuePro.Tools.EnvironmentHelper.environemntVariable = {
    cid: window.enqueuepro_clientside_config.customerId,
    intercept: false,
    host: "",
    jsHost: "",
    noCacheRequest: false,
    noAutorun: false,
    domainToIntercept: "",
    enqueueproKURedirectHeaderName: ""
};

if (!EnqueuePro.Javascript.IntegrationConfig.isInitialized) {
    var en = EnqueuePro.Tools.EnvironmentHelper.retrieveEnvInfoFromScriptTag();
    if (en && en.cid && en.intercept) {
        EnqueuePro.Javascript.KnownUser.AjaxInterceptor.interceptOpen(en.domainToIntercept, en);
    }
    EnqueuePro.Javascript.IntegrationConfig.isInitialized = true;
    EnqueuePro.Javascript.PageEventIntegration.initQueueClient(window.enqueuepro_clientside_config);
}
else {
    console.log("IntegrationConfigLoader is alreday initialized!");
}