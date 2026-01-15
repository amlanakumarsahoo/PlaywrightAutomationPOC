Feature: automationexercise application Home Page functionality
As a User when I visit the automationexercise application
I should see a valid Title
@Regression_HomePage_TC001 @Regression
Scenario: Home Page has a valid Title
Given User Visits HomePage
When User Observes Title
Then title should match "Automation Exercise"


 

