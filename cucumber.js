module.exports = {
  default: {
    // Feature files location
    features: ['src/test/features/**/*.feature'],
    
    // Step definitions location
    glue: ['src/test/step-definitions/**/*.ts'],
    
    // Require TypeScript support
    requireModule: ['ts-node/register'],
    
    // Format options
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    
    // Parallel execution
    parallel: 1,
    
    // Retry failed scenarios
    retry: 1
  }
};
