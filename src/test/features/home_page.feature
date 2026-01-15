Feature: automationexercise application Home Page functionality
As a User when I visit the automationexercise application
I should see a valid Title
@Regression_TC001
Scenario: Home Page has a valid Title
Given User Visits HomePage
When User Observes Title
Then title should match "Automation Exercise"
# @Regression_TC002
# Scenario: Home Page has a valid sub Title
# Given User Visits HomePage
# When User Observes sub Title
# Then sub title should match "Available Examples"  
 

