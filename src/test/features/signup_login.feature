Feature: automationexercise application user signup functionality

    @Regression_UserSignUp_TC001 @Regression
    Scenario Outline: New user signup to the automationexercise application
        Given User Visits HomePage
        When User Clicks on Signup
        Then user should be redirected to the signup page
        Then user should be able to enter the username "<username>"
        Then user should be able to enter the email address "<emailaddress>"
        Then user should be able to click on signup button
        Examples:
            | username | emailaddress    |
            | Amlana   | amlana@gmail.com |
            | Ram      | ram@gmail.com    |

