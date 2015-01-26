require('traceur-runtime');

var Zygo = require('../build/zygo-server').default;
var Render = require('../build/render');
var assert = require('chai').assert;
var zygo;

var routes = [
{component: 'app/two.jsx!', handler: 'app/one'},
{component: 'app/one.jsx!', handler: 'app/two'}
];

describe("render.js tests", function() {
  this.timeout(5000);

  before(function(done) {
    zygo = new Zygo('test/fake-app/zygo.json');
    zygo.initialize().then(done).catch(console.log.bind(console));
  });

  it("renders a given component module correctly", function(done) {
    Render.renderComponent('app/one.jsx!')
      .then(function(result) {
        assert(!!result); //result should be non null
        assert(!!result.cssTrace);
        assert(!!result.component);

        var combinedCss = result.cssTrace[0] + result.cssTrace[1];
        assert.match(combinedCss, /one.css/);
        assert.match(combinedCss, /two.css/);

        assert.match(result.component, /One/);
        done();
      }).catch(function(error) { console.log(error.stack); });
  });

  it("renders a given route correctly", function(done) {
    Render.renderRoutes(routes, {context: 'context'})
      .then(function(result) {
        assert(!!result); //result should be non null
        assert(!!result.cssTrace);
        assert(!!result.component);

        var combinedCss = result.cssTrace[0] + result.cssTrace[1];
        assert.match(combinedCss, /one.css/);
        assert.match(combinedCss, /two.css/);

        assert.match(result.component, /One/);
        assert.match(result.component, /Two/);
        done();
      }).catch(function(error) { console.log(error.stack); });
  });

  it("renders a given page correctly", function(done) {
    Render.renderRoutes(routes, {context: {name: 'context'}})
      .then(function(result) {
        return Render.renderPage(result, zygo);
      })
      .then(function(result) {
        console.log("TODO: complete the render.js tests");
        done();
      }).catch(function(error) { console.log(error.stack); });
  });
});
