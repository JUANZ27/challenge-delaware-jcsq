module.exports = {
 default: {
  requireModule: ['tsx/cjs'],
  require: ['src/support/world.ts','src/support/hooks.ts','src/steps/login.steps.ts'],
  paths: ['features/**/*.feature'],
  format: ['progress','html:reports/cucumber.html','json:reports/cucumber.json'],
  parallel: Number(process.env.WORKERS || 1),
  publishQuiet: true
 }
};
