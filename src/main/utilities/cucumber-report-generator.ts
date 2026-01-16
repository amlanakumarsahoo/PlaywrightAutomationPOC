import * as fs from 'fs';
import * as path from 'path';
import { generate } from 'multiple-cucumber-html-reporter';
import { getEnvironmentConfig } from '../config/report-config';

/**
 * Cucumber HTML Report Generator
 * Generates comprehensive HTML reports from Cucumber JSON results
 */
export class CucumberReportGenerator {
  private static readonly REPORTS_DIR = 'reports';
  private static readonly JSON_REPORT_PATH = path.join(CucumberReportGenerator.REPORTS_DIR, 'cucumber-report.json');
  private static readonly HTML_REPORT_DIR = path.join(CucumberReportGenerator.REPORTS_DIR, 'cucumber-html-report');

  /**
   * Generate HTML report from JSON results
   */
  public static async generateReport(): Promise<void> {
    try {
      console.log('🎯 Starting Cucumber HTML report generation...');

      // Ensure reports directory exists
      this.ensureDirectoryExists(this.REPORTS_DIR);
      this.ensureDirectoryExists(this.HTML_REPORT_DIR);

      // Check if JSON report exists
      if (!fs.existsSync(this.JSON_REPORT_PATH)) {
        console.warn(`⚠️  JSON report not found at: ${this.JSON_REPORT_PATH}`);
        console.log('📝 Creating empty report structure...');
        this.createEmptyReport();
        return;
      }

      // Read and validate JSON report
      const jsonData = this.readJsonReport();
      if (!jsonData) {
        console.warn('⚠️  JSON report is empty or invalid');
        this.createEmptyReport();
        return;
      }
      
      // Check if it's an array (Cucumber format) or object (Playwright format)
      if (Array.isArray(jsonData) && jsonData.length === 0) {
        console.warn('⚠️  JSON report array is empty');
        this.createEmptyReport();
        return;
      }

      // Generate HTML report
      await this.generateHtmlReport(jsonData);
      
      console.log('✅ Cucumber HTML report generated successfully!');
      console.log(`📂 Report location: ${path.resolve(this.HTML_REPORT_DIR)}`);
      console.log(`🌐 Open: ${path.resolve(this.HTML_REPORT_DIR, 'index.html')}`);

    } catch (error) {
      console.error('❌ Error generating Cucumber HTML report:', error);
      throw error;
    }
  }

  /**
   * Read and parse JSON report
   */
  private static readJsonReport(): any {
    try {
      const jsonContent = fs.readFileSync(this.JSON_REPORT_PATH, 'utf8');
      return JSON.parse(jsonContent);
    } catch (error) {
      console.error('❌ Error reading JSON report:', error);
      return null;
    }
  }

  /**
   * Generate HTML report - handles both Cucumber and Playwright JSON formats
   */
  private static async generateHtmlReport(jsonData: any): Promise<void> {
    // Get environment-specific configuration
    const environment = process.env.NODE_ENV || process.env.TEST_ENV || 'test';
    const reportOptions = getEnvironmentConfig(environment);

    console.log(`🎨 Using ${environment} environment configuration`);
    console.log(`📋 Report will be generated at: ${reportOptions.reportPath}`);

    // Check if this is Playwright JSON format (object) or Cucumber JSON format (array)
    if (Array.isArray(jsonData)) {
      // Traditional Cucumber JSON format
      console.log('📊 Detected Cucumber JSON format');
      try {
        generate(reportOptions);
        this.logReportStatistics(jsonData);
      } catch (error) {
        console.warn('⚠️  Failed to generate with multiple-cucumber-html-reporter:', error);
        this.createPlaywrightCompatibleReport(jsonData);
      }
    } else {
      // Playwright JSON format
      console.log('📊 Detected Playwright JSON format - creating compatible report');
      this.createPlaywrightCompatibleReport(jsonData);
    }
  }

  /**
   * Create a simple HTML report compatible with Playwright JSON format
   */
  private static createPlaywrightCompatibleReport(jsonData: any): void {
    try {
      const reportHtml = this.generatePlaywrightReportHtml(jsonData);
      const reportPath = path.join(this.HTML_REPORT_DIR, 'index.html');
      fs.writeFileSync(reportPath, reportHtml);
      console.log('✅ Playwright-compatible HTML report created');
      
      // Log basic statistics
      this.logPlaywrightStatistics(jsonData);
    } catch (error) {
      console.error('❌ Error creating Playwright-compatible report:', error);
      this.createEmptyReport();
    }
  }

  /**
   * Generate HTML content for Playwright report
   */
  private static generatePlaywrightReportHtml(jsonData: any): string {
    const currentDate = new Date();
    const stats = this.extractPlaywrightStats(jsonData);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - Playwright BDD</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .status-passed { color: #28a745; }
        .status-failed { color: #dc3545; }
        .status-skipped { color: #6c757d; }
        .stats-card { transition: transform 0.2s; }
        .stats-card:hover { transform: translateY(-2px); }
        .progress-custom { height: 8px; }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark bg-primary">
        <div class="container">
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-theater-masks"></i> Playwright BDD Test Report
            </span>
            <span class="navbar-text">Generated on ${currentDate.toLocaleString()}</span>
        </div>
    </nav>
    
    <div class="container-fluid mt-4">
        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card stats-card border-success">
                    <div class="card-body text-center">
                        <i class="fas fa-check-circle fa-2x status-passed mb-2"></i>
                        <h4 class="status-passed">${stats.passed}</h4>
                        <p class="card-text">Passed</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card border-danger">
                    <div class="card-body text-center">
                        <i class="fas fa-times-circle fa-2x status-failed mb-2"></i>
                        <h4 class="status-failed">${stats.failed}</h4>
                        <p class="card-text">Failed</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card border-warning">
                    <div class="card-body text-center">
                        <i class="fas fa-minus-circle fa-2x status-skipped mb-2"></i>
                        <h4 class="status-skipped">${stats.skipped}</h4>
                        <p class="card-text">Skipped</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card border-info">
                    <div class="card-body text-center">
                        <i class="fas fa-clock fa-2x text-info mb-2"></i>
                        <h4 class="text-info">${stats.duration}ms</h4>
                        <p class="card-text">Duration</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-bar"></i> Test Results Overview</h5>
                    </div>
                    <div class="card-body">
                        <div class="progress progress-custom mb-3">
                            <div class="progress-bar bg-success" style="width: ${stats.passRate}%"></div>
                            <div class="progress-bar bg-danger" style="width: ${stats.failRate}%"></div>
                            <div class="progress-bar bg-warning" style="width: ${stats.skipRate}%"></div>
                        </div>
                        <div class="row text-center">
                            <div class="col-md-4">
                                <small class="text-muted">Pass Rate: <strong class="status-passed">${stats.passRate.toFixed(1)}%</strong></small>
                            </div>
                            <div class="col-md-4">
                                <small class="text-muted">Total Tests: <strong>${stats.total}</strong></small>
                            </div>
                            <div class="col-md-4">
                                <small class="text-muted">Duration: <strong>${stats.duration}ms</strong></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Info Card -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-info-circle"></i> Report Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-info">
                            <h6><i class="fas fa-lightbulb"></i> Recommendation</h6>
                            <p class="mb-2">For detailed test results with screenshots, videos, and interactive features, use the <strong>Playwright HTML Report</strong>:</p>
                            <div class="d-flex gap-2 flex-wrap">
                                <code class="bg-light p-1 rounded">npm run report:playwright</code>
                                <span class="text-muted">or</span>
                                <code class="bg-light p-1 rounded">npm run report</code>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Report Details</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-calendar"></i> Generated: ${currentDate.toLocaleString()}</li>
                                    <li><i class="fas fa-cogs"></i> Framework: Playwright BDD</li>
                                    <li><i class="fas fa-file-code"></i> Format: ${Array.isArray(jsonData) ? 'Cucumber' : 'Playwright'} JSON</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6>Available Reports</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-html5"></i> Playwright HTML: <code>reports/playwright-html-report/</code></li>
                                    <li><i class="fas fa-file-code"></i> JSON Report: <code>reports/cucumber-report.json</code></li>
                                    <li><i class="fas fa-file-alt"></i> JUnit XML: <code>reports/cucumber-junit.xml</code></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <footer class="bg-light text-center py-3 mt-5">
        <div class="container">
            <small class="text-muted">
                <i class="fas fa-theater-masks"></i> Playwright BDD Automation Framework | 
                Generated by Cucumber Report Generator
            </small>
        </div>
    </footer>
</body>
</html>`;
  }

  /**
   * Extract statistics from Playwright JSON format
   */
  private static extractPlaywrightStats(jsonData: any): any {
    const stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      passRate: 0,
      failRate: 0,
      skipRate: 0
    };

    try {
      // Extract stats from Playwright JSON structure
      if (jsonData.stats) {
        // Playwright stats structure:
        // - expected: passed tests
        // - unexpected: failed tests  
        // - skipped: skipped tests
        // - flaky: flaky tests (count as passed)
        stats.passed = (jsonData.stats.expected || 0) + (jsonData.stats.flaky || 0);
        stats.failed = jsonData.stats.unexpected || 0;
        stats.skipped = jsonData.stats.skipped || 0;
        stats.total = stats.passed + stats.failed + stats.skipped;
        stats.duration = Math.round(jsonData.stats.duration || 0);
        
        console.log(`📊 Raw Playwright Stats:`);
        console.log(`   - Expected (Passed): ${jsonData.stats.expected || 0}`);
        console.log(`   - Unexpected (Failed): ${jsonData.stats.unexpected || 0}`);
        console.log(`   - Skipped: ${jsonData.stats.skipped || 0}`);
        console.log(`   - Flaky: ${jsonData.stats.flaky || 0}`);
        console.log(`   - Duration: ${stats.duration}ms`);
      } else {
        // Fallback: try to count from suites structure
        console.log('🔍 No stats object found, trying to count from suites...');
        if (jsonData.suites && Array.isArray(jsonData.suites)) {
          this.countTestsInSuites(jsonData.suites, stats);
        }
      }

      // Calculate percentages
      if (stats.total > 0) {
        stats.passRate = (stats.passed / stats.total) * 100;
        stats.failRate = (stats.failed / stats.total) * 100;
        stats.skipRate = (stats.skipped / stats.total) * 100;
      }
    } catch (error) {
      console.warn('⚠️  Could not extract detailed statistics:', error);
    }

    return stats;
  }

  /**
   * Recursively count tests in suites
   */
  private static countTestsInSuites(suites: any[], stats: any): void {
    suites.forEach(suite => {
      if (suite.tests && Array.isArray(suite.tests)) {
        suite.tests.forEach((test: any) => {
          stats.total++;
          if (test.status === 'passed') stats.passed++;
          else if (test.status === 'failed') stats.failed++;
          else if (test.status === 'skipped') stats.skipped++;
          
          if (test.duration) stats.duration += test.duration;
        });
      }
      
      if (suite.suites && Array.isArray(suite.suites)) {
        this.countTestsInSuites(suite.suites, stats);
      }
    });
  }

  /**
   * Log statistics for Playwright format
   */
  private static logPlaywrightStatistics(jsonData: any): void {
    const stats = this.extractPlaywrightStats(jsonData);
    
    console.log('📊 Test Execution Statistics:');
    console.log(`   🎭 Total Tests: ${stats.total}`);
    console.log(`   ✅ Passed: ${stats.passed}`);
    console.log(`   ❌ Failed: ${stats.failed}`);
    console.log(`   ⏭️  Skipped: ${stats.skipped}`);
    console.log(`   📈 Pass Rate: ${stats.passRate.toFixed(1)}%`);
    console.log(`   ⏱️  Total Duration: ${stats.duration}ms`);
  }

  /**
   * Create empty report when no test results are available
   */
  private static createEmptyReport(): void {
    const emptyReportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cucumber Test Report</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .empty-report {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        .report-icon {
            font-size: 4rem;
            color: #6c757d;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark bg-primary">
        <div class="container">
            <span class="navbar-brand mb-0 h1">🥒 Cucumber Test Report</span>
            <span class="navbar-text">Generated on ${new Date().toLocaleString()}</span>
        </div>
    </nav>
    
    <div class="container-fluid">
        <div class="empty-report">
            <div class="report-icon">📊</div>
            <h2 class="text-muted">No Test Results Available</h2>
            <p class="text-muted">Run your tests to generate a comprehensive report</p>
            <div class="mt-4">
                <code>npm run testbdd</code>
            </div>
        </div>
    </div>
    
    <footer class="bg-light text-center py-3 mt-5">
        <div class="container">
            <small class="text-muted">Playwright BDD Automation Framework</small>
        </div>
    </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(this.HTML_REPORT_DIR, 'index.html'), emptyReportHtml);
    console.log('📄 Empty report created');
  }

  /**
   * Log report statistics from JSON data
   */
  private static logReportStatistics(jsonData: any[]): void {
    try {
      let totalScenarios = 0;
      let passedScenarios = 0;
      let failedScenarios = 0;
      let skippedScenarios = 0;
      let totalSteps = 0;
      let totalDuration = 0;

      jsonData.forEach((feature: any) => {
        if (feature.elements) {
          feature.elements.forEach((scenario: any) => {
            totalScenarios++;
            
            if (scenario.steps) {
              totalSteps += scenario.steps.length;
              
              // Calculate scenario status based on steps
              const hasFailedStep = scenario.steps.some((step: any) => 
                step.result && step.result.status === 'failed'
              );
              const hasSkippedStep = scenario.steps.some((step: any) => 
                step.result && step.result.status === 'skipped'
              );
              
              if (hasFailedStep) {
                failedScenarios++;
              } else if (hasSkippedStep) {
                skippedScenarios++;
              } else {
                passedScenarios++;
              }
              
              // Calculate total duration
              scenario.steps.forEach((step: any) => {
                if (step.result && step.result.duration) {
                  totalDuration += step.result.duration;
                }
              });
            }
          });
        }
      });

      // Convert nanoseconds to milliseconds
      const durationMs = Math.round(totalDuration / 1000000);
      const passRate = totalScenarios > 0 ? ((passedScenarios / totalScenarios) * 100).toFixed(1) : '0.0';

      console.log('📊 Test Execution Statistics:');
      console.log(`   📋 Total Features: ${jsonData.length}`);
      console.log(`   🎭 Total Scenarios: ${totalScenarios}`);
      console.log(`   ✅ Passed: ${passedScenarios}`);
      console.log(`   ❌ Failed: ${failedScenarios}`);
      console.log(`   ⏭️  Skipped: ${skippedScenarios}`);
      console.log(`   📈 Pass Rate: ${passRate}%`);
      console.log(`   🔢 Total Steps: ${totalSteps}`);
      console.log(`   ⏱️  Total Duration: ${durationMs}ms`);
      
    } catch (error) {
      console.warn('⚠️  Could not calculate report statistics:', error);
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   */
  private static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }
  }

  /**
   * Clean old reports
   */
  public static cleanOldReports(): void {
    try {
      if (fs.existsSync(this.HTML_REPORT_DIR)) {
        fs.rmSync(this.HTML_REPORT_DIR, { recursive: true, force: true });
        console.log('🧹 Cleaned old HTML reports');
      }
      
      if (fs.existsSync(this.JSON_REPORT_PATH)) {
        fs.unlinkSync(this.JSON_REPORT_PATH);
        console.log('🧹 Cleaned old JSON reports');
      }
    } catch (error) {
      console.warn('⚠️  Warning: Could not clean old reports:', error);
    }
  }
}

// CLI execution
if (require.main === module) {
  CucumberReportGenerator.generateReport()
    .then(() => {
      console.log('🎉 Report generation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Report generation failed:', error);
      process.exit(1);
    });
}
