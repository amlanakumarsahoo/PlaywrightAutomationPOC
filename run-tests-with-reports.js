#!/usr/bin/env node

/**
 * Complete Test Runner with Cucumber HTML Reports
 * This script runs the full test suite and generates comprehensive reports
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.reportsDir = 'reports';
    this.htmlReportDir = path.join(this.reportsDir, 'cucumber-html-report');
  }

  /**
   * Main execution function
   */
  async run() {
    console.log('🚀 Starting Playwright BDD Test Execution with Cucumber Reports');
    console.log('=' .repeat(70));

    try {
      // Step 1: Clean old reports
      await this.cleanOldReports();

      // Step 2: Run BDD tests
      await this.runTests();

      // Step 3: Generate Cucumber HTML report
      await this.generateReports();

      // Step 4: Open report (optional)
      await this.openReport();

      console.log('🎉 Test execution and reporting completed successfully!');

    } catch (error) {
      console.error('💥 Test execution failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Clean old reports
   */
  async cleanOldReports() {
    console.log('\n🧹 Cleaning old reports...');
    
    try {
      if (fs.existsSync(this.htmlReportDir)) {
        fs.rmSync(this.htmlReportDir, { recursive: true, force: true });
        console.log('   ✅ Cleaned HTML reports');
      }

      const jsonReportPath = path.join(this.reportsDir, 'cucumber-report.json');
      if (fs.existsSync(jsonReportPath)) {
        fs.unlinkSync(jsonReportPath);
        console.log('   ✅ Cleaned JSON reports');
      }

      // Ensure reports directory exists
      if (!fs.existsSync(this.reportsDir)) {
        fs.mkdirSync(this.reportsDir, { recursive: true });
        console.log('   📁 Created reports directory');
      }

    } catch (error) {
      console.warn('   ⚠️  Warning: Could not clean all old reports:', error.message);
    }
  }

  /**
   * Run BDD tests
   */
  async runTests() {
    console.log('\n🎭 Running Playwright BDD Tests...');
    
    try {
      // Generate BDD test files
      console.log('   📝 Generating BDD test files...');
      execSync('npm run bddgen', { stdio: 'inherit' });

      // Run the tests
      console.log('   🧪 Executing tests...');
      execSync('npx playwright test', { stdio: 'inherit' });

      console.log('   ✅ Tests completed successfully');

    } catch (error) {
      console.error('   ❌ Test execution failed');
      throw error;
    }
  }

  /**
   * Generate Cucumber HTML reports
   */
  async generateReports() {
    console.log('\n📊 Generating Cucumber HTML Reports...');

    try {
      // Check if JSON report exists
      const jsonReportPath = path.join(this.reportsDir, 'cucumber-report.json');
      
      if (!fs.existsSync(jsonReportPath)) {
        console.log('   ⚠️  No JSON report found, creating empty report...');
        // The report generator will handle this case
      }

      // Generate HTML report
      execSync('npm run report:cucumber', { stdio: 'inherit' });
      
      console.log('   ✅ HTML report generated successfully');
      console.log(`   📂 Report location: ${path.resolve(this.htmlReportDir)}`);

    } catch (error) {
      console.error('   ❌ Report generation failed:', error.message);
      throw error;
    }
  }

  /**
   * Open the generated report
   */
  async openReport() {
    const shouldOpen = process.argv.includes('--open') || process.argv.includes('-o');
    
    if (!shouldOpen) {
      console.log('\n💡 Tip: Use --open or -o flag to automatically open the report');
      console.log(`🌐 Report available at: ${path.resolve(this.htmlReportDir, 'index.html')}`);
      return;
    }

    console.log('\n🌐 Opening Cucumber HTML Report...');

    try {
      const reportPath = path.join(this.htmlReportDir, 'index.html');
      
      if (fs.existsSync(reportPath)) {
        // Open report based on platform
        const command = process.platform === 'win32' ? 'start' : 
                       process.platform === 'darwin' ? 'open' : 'xdg-open';
        
        execSync(`${command} "${reportPath}"`, { stdio: 'ignore' });
        console.log('   ✅ Report opened in default browser');
      } else {
        console.log('   ⚠️  Report file not found, skipping auto-open');
      }

    } catch (error) {
      console.warn('   ⚠️  Could not open report automatically:', error.message);
      console.log(`   🌐 Please manually open: ${path.resolve(this.htmlReportDir, 'index.html')}`);
    }
  }

  /**
   * Display help information
   */
  static showHelp() {
    console.log(`
🥒 Playwright BDD Test Runner with Cucumber Reports

Usage: node run-tests-with-reports.js [options]

Options:
  --open, -o     Open the HTML report in browser after generation
  --help, -h     Show this help message

Examples:
  node run-tests-with-reports.js              # Run tests and generate reports
  node run-tests-with-reports.js --open       # Run tests, generate reports, and open in browser
  npm run test:full                           # Alternative using npm script

Report Locations:
  📊 HTML Report: reports/cucumber-html-report/index.html
  📄 JSON Report: reports/cucumber-report.json
  🎭 Playwright Report: reports/playwright-html-report/index.html

For more information, visit: https://github.com/playwright-community/playwright-bdd
    `);
  }
}

// CLI execution
if (require.main === module) {
  // Handle help flag
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    TestRunner.showHelp();
    process.exit(0);
  }

  // Run the test suite
  const runner = new TestRunner();
  runner.run().catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
