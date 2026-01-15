// Generated from: src\test\features\home_page.feature
import { test } from "playwright-bdd";

test.describe('Heroku App Home Page functionality', () => {

  test('Home Page has a valid Title', async ({ Given, When, Then, page }) => { 
    await Given('User Visits HomePage', null, { page }); 
    await When('User Observes Title'); 
    await Then('title should match "Welcome to the-internet"'); 
  });

  test('Home Page has a valid sub Title', async ({ Given, When, Then, page }) => { 
    await Given('User Visits HomePage', null, { page }); 
    await When('User Observes sub Title'); 
    await Then('sub title should match "Available Examples"'); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\test\\features\\home_page.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given User Visits HomePage","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When User Observes Title","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then title should match \"Welcome to the-internet\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Welcome to the-internet\"","children":[{"start":20,"value":"Welcome to the-internet","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":12,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"Given User Visits HomePage","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When User Observes sub Title","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then sub title should match \"Available Examples\"","stepMatchArguments":[{"group":{"start":23,"value":"\"Available Examples\"","children":[{"start":24,"value":"Available Examples","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end