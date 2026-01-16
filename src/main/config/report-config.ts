/**
 * Cucumber HTML Report Configuration
 * Centralized configuration for all reporting options
 */

export interface ReportConfig {
  jsonDir: string;
  reportPath: string;
  openReportInBrowser: boolean;
  saveCollectedJSON: boolean;
  displayDuration: boolean;
  displayReportTime: boolean;
  useCDN: boolean;
  pageTitle: string;
  reportName: string;
  pageFooter: string;
  customData: {
    title: string;
    data: Array<{ label: string; value: string }>;
  };
  customStyle: string;
}

/**
 * Default report configuration
 */
export const getReportConfig = (): ReportConfig => {
  const currentDate = new Date();
  
  return {
    jsonDir: 'reports',
    reportPath: 'reports/cucumber-html-report',
    openReportInBrowser: false,
    saveCollectedJSON: true,
    displayDuration: true,
    displayReportTime: true,
    useCDN: false,
    pageTitle: 'Playwright BDD Test Results - Automation Framework',
    reportName: 'Cucumber HTML Test Report',
    pageFooter: `
      <div class="text-center mt-4">
        <div class="row">
          <div class="col-md-6">
            <h6 class="text-muted">Test Execution Details</h6>
            <p class="small text-muted">
              Generated on: ${currentDate.toLocaleString()}<br>
              Framework: Playwright BDD with TypeScript<br>
              Environment: ${process.env.NODE_ENV || 'Test'}
            </p>
          </div>
          <div class="col-md-6">
            <h6 class="text-muted">System Information</h6>
            <p class="small text-muted">
              Platform: ${process.platform}<br>
              Node Version: ${process.version}<br>
              Architecture: ${process.arch}
            </p>
          </div>
        </div>
        <hr class="my-3">
        <p class="small text-muted">
          🎭 Playwright BDD Automation Framework | 
          🥒 Cucumber HTML Reports | 
          📊 Comprehensive Test Analytics
        </p>
      </div>
    `,
    customData: {
      title: 'Test Execution Summary',
      data: [
        { label: 'Project Name', value: 'Playwright BDD Automation' },
        { label: 'Test Environment', value: process.env.NODE_ENV || 'Test' },
        { label: 'Browser Support', value: 'Chromium, Firefox, WebKit' },
        { label: 'Platform', value: `${process.platform} (${process.arch})` },
        { label: 'Node.js Version', value: process.version },
        { label: 'Execution Date', value: currentDate.toLocaleDateString() },
        { label: 'Execution Time', value: currentDate.toLocaleTimeString() },
        { label: 'Report Generated', value: currentDate.toISOString() }
      ]
    },
    customStyle: `
      /* Custom CSS for enhanced report styling */
      
      /* Header and Navigation */
      .navbar-brand { 
        color: #28a745 !important; 
        font-weight: bold;
      }
      
      .navbar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      }
      
      /* Cards and Panels */
      .card-header { 
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-bottom: 2px solid #dee2e6;
        font-weight: 600;
      }
      
      .card {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: none;
        margin-bottom: 1rem;
      }
      
      /* Status Badges */
      .badge-success { 
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
        color: white;
      }
      
      .badge-danger { 
        background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%) !important;
        color: white;
      }
      
      .badge-warning { 
        background: linear-gradient(135deg, #ffc107 0%, #f39c12 100%) !important;
        color: #212529;
      }
      
      .badge-info { 
        background: linear-gradient(135deg, #17a2b8 0%, #3498db 100%) !important;
        color: white;
      }
      
      /* Progress Bars */
      .progress {
        height: 8px;
        border-radius: 4px;
        background-color: #f8f9fa;
      }
      
      .progress-bar {
        border-radius: 4px;
      }
      
      /* Tables */
      .table {
        border-radius: 8px;
        overflow: hidden;
      }
      
      .table thead th {
        background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
        color: white;
        border: none;
        font-weight: 600;
      }
      
      .table tbody tr:hover {
        background-color: #f8f9fa;
        transition: background-color 0.2s ease;
      }
      
      /* Feature and Scenario Styling */
      .feature-title {
        color: #495057;
        font-weight: 700;
        margin-bottom: 1rem;
      }
      
      .scenario-title {
        color: #6c757d;
        font-weight: 600;
      }
      
      /* Step Styling */
      .step-passed {
        color: #28a745;
        font-weight: 500;
      }
      
      .step-failed {
        color: #dc3545;
        font-weight: 500;
      }
      
      .step-skipped {
        color: #6c757d;
        font-style: italic;
      }
      
      /* Duration and Timing */
      .duration {
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        color: #6c757d;
      }
      
      /* Custom Data Section */
      .custom-data-section {
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border: 1px solid #dee2e6;
      }
      
      .custom-data-title {
        color: #495057;
        font-weight: 700;
        margin-bottom: 1rem;
        text-align: center;
      }
      
      .custom-data-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f8f9fa;
      }
      
      .custom-data-label {
        font-weight: 600;
        color: #6c757d;
      }
      
      .custom-data-value {
        color: #495057;
        font-family: 'Courier New', monospace;
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .card {
          margin-bottom: 0.5rem;
        }
        
        .custom-data-item {
          flex-direction: column;
          text-align: center;
        }
        
        .custom-data-label,
        .custom-data-value {
          margin-bottom: 0.25rem;
        }
      }
      
      /* Animation for loading states */
      .loading-animation {
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
      
      /* Footer Styling */
      .report-footer {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-top: 2px solid #dee2e6;
        margin-top: 3rem;
        padding: 2rem 0;
      }
      
      /* Print Styles */
      @media print {
        .navbar,
        .btn,
        .no-print {
          display: none !important;
        }
        
        .card {
          break-inside: avoid;
          box-shadow: none;
          border: 1px solid #dee2e6;
        }
      }
    `
  };
};

/**
 * Environment-specific configurations
 */
export const getEnvironmentConfig = (environment: string = 'test') => {
  const baseConfig = getReportConfig();
  
  switch (environment.toLowerCase()) {
    case 'production':
    case 'prod':
      return {
        ...baseConfig,
        pageTitle: 'Production Test Results - Playwright BDD',
        customData: {
          ...baseConfig.customData,
          data: [
            ...baseConfig.customData.data.map(item => 
              item.label === 'Test Environment' 
                ? { ...item, value: 'Production' }
                : item
            )
          ]
        }
      };
      
    case 'staging':
    case 'stage':
      return {
        ...baseConfig,
        pageTitle: 'Staging Test Results - Playwright BDD',
        customData: {
          ...baseConfig.customData,
          data: [
            ...baseConfig.customData.data.map(item => 
              item.label === 'Test Environment' 
                ? { ...item, value: 'Staging' }
                : item
            )
          ]
        }
      };
      
    case 'development':
    case 'dev':
      return {
        ...baseConfig,
        pageTitle: 'Development Test Results - Playwright BDD',
        customData: {
          ...baseConfig.customData,
          data: [
            ...baseConfig.customData.data.map(item => 
              item.label === 'Test Environment' 
                ? { ...item, value: 'Development' }
                : item
            )
          ]
        }
      };
      
    default:
      return baseConfig;
  }
};
