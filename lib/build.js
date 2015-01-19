import builder from 'systemjs-builder';
import jspm from 'jspm';
import path from 'path';
import sanitize from 'sanitize-filename';

//We bundle per-route - the common imports and extracted into a core
// bundle which is loaded with the css in the zygo footer before render.
//Optimisations can be specified in the config - for instance, two routes
// might share a huge core route which you don't want to bundle twice.
// This can be solved by extracting it into it's own route.
export function build(zygo) {
  return getRouteTrees(zygo.routes)
    .then(extractCommonTree)
    .then((trees) => bundleTrees(trees, zygo))
    .then(() => console.log("Finished build."));
}

function bundleTrees(routeTrees, zygo) {
  if (!zygo.config.buildDir) throw new Error("buildDir has not been set in config zygo.json.");

  Object.keys(routeTrees).map((key) => {
    builder.buildTree(routeTrees[key], path.resolve(zygo.config.buildDir, sanitize(key, {replacement: '_'})) + '.js');
  });
}

function extractCommonTree(routeTrees) {
  let common;
  Object.keys(routeTrees).map((key) => {
    if (common) common = builder.intersectTrees(common, routeTrees[key]);
    else common = routeTrees[key];
  });

  //remove common from the other trees
  Object.keys(routeTrees).map((key) => {
    routeTrees[key] = builder.subtractTrees(routeTrees[key], common);
  });

  routeTrees.common = common;
  return routeTrees;
}

function getRouteTrees(routes) {
  let routeTrees = {};

  return Object.keys(routes).reduce((chain, next) => {
    return chain
      .then(() => getRouteTree(routes[next]))
      .then((tree) => routeTrees[next] = tree);

  }, Promise.resolve())
    .then(() => routeTrees);
}

function getRouteTree(route) {
  if (!(route instanceof Array)) route = [route];

  let deps = route;
  return Promise.all(route.map((handler) => jspm.import(handler)))
    .then((handlers) => handlers.map((handler) => deps.push(handler.component)))
    .then(() => Promise.all(deps.map((dep) => builder.trace(dep))))
    .then((trees) => trees.reduce((result, next) => builder.addTrees(result, next.tree), {}));
}