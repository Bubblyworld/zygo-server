<!DOCTYPE HTML>

<html>
  <script src="/jspm_packages/system.js"></script>
  <script src="/config.js"></script>
{{#each cssTrace}}
  <link rel="stylesheet" type="text/css" href="{{{this}}}"></link>
{{/each}}


  <head>
    <title> {{{meta.title}}} </title>
  </head>

  <body>
    <div id="__zygo-body-container__">
      {{{component}}}
    </div>
  </body>

  <script>
  System.baseURL = "{{{baseURL}}}";

  System.import("zygo").then(function(zygo) {
{{#if bundles}}
    zygo._setBundles({{{bundles}}});
{{#each visibleBundles}}
    System.bundles['{{{this.path}}}'] = [{{#each this.modules}}'{{{this}}}',{{/each}}];
{{/each}}
{{/if}}

    zygo._setContext({{{context}}});
    zygo._setRoutes({{{routes}}});

{{#if addLinkHandlers}}
    zygo._addLinkHandlers();
{{/if}}

    zygo.setVisibleBundles(zygo.context.loadingRequest.routes);
    zygo._deserializeContext(zygo.context.loadingRequest.routes);
    zygo.setMetadata();
    zygo.refresh();
  });
</script>
</html>
