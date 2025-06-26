Employee Management Application
Create a web application using the LitElement JavaScript version.
The fictional web application should help our HR staff to help manage the company's employee
information.
The application should consist of the functionality below:
- List all employee records
- Add a new employee record
- Edit an existing employee record
- Delete an existing employee record
1. List All Employee Records
- Create a web component to display the employee records. The data presentation format can be in two
forms: a list or a table. The user should be able to select the data presentation format.
- The web component should contain pagination and search functionalities for each data presentation
formats.
- For each record displayed the user should be able to perform Edit and Delete operations on that record
as well.
2. Add a New Employee Record
- Create a web component to allow a user to create a new employee record.
- The user will need to enter the information below in order to create a new record:
* First Name
* Last name
* Date of Employment
* Date of Birth
* Phone Number
* Email Address
* Department - This is a predefined list which will have the values: Analytics, Tech
* Position - This is a predefined list which will have the values: Junior, Medior, Senior
- When the operation is completed, the user should be navigated to the employee list page.
NOTE: Please add the appropriate validations to the input fields in order to prevent the submission of
data in an incorrect format or to ensure the uniqueness of a record.
3. Edit an Existing Employee Record
- Create a web component to allow a user to edit and update an existing employee record.
- The web component should be accessible from the employee list page through the Edit button and
should take the selected employee object as a reactive input property in order to display its fields.
- When the operation is completed, the user should be navigated to the employee list page.
NOTE-1: The same rules apply to the editing an existing record as in creating a new one, so those steps
are not repeated here to reduce redundancy so please be aware of them.
NOTE-2: Prompt the user before updating the employee record as soon as the user submits them in
order to prevent mistakes.
TIP: You can create a single reusable web component for both creating and editing a user record. This
might save some development time for you.
4. Delete an Existing Employee Record
- When the user clicks the Delete button of an existing record, the selected record should be removed,
and the listing should be updated.
NOTE: Prompt the user before deleting the employee record as soon as the user submits them in order
to prevent mistakes.
Additional Requirements:
- Create a navigation menu web component for allowing the user to navigate between the different
pages of the application.
- Integrate a router and configurate the appropriate routes for navigation. You can use Vaadin Router for
this or any other router you like.
- Design each component/page of the application to be viewed both in desktop mode and in responsive
mode without any flaws. You're forbidden to use any responsive css libraries like Bootstrap.
- Implement a state management mechanism to persist data in the browser memory since you won't
have a backend to work with for persistence. You can use a 3rd party library like Redux or can come up
with your own solution for this.
- Add the localization support to your web components for Turkish and English languages. You can read
the localization setting from the root html's lang attribute for this.
- Add detailed unit tests for each web component and the functionality you create. The coverage ratio
must be at least 85%.
- Please use the LitElement's JavaScript version for creating the application as stated in the description
above.
IMPORTANT: Please make sure to submit a working application. Any applications that are not working
will not be considered for further evaluation.
You can use the LitElement Javascript starter project for working upon by downloading it from:
https://github.com/lit/lit-element-starter-js
For further information about LitElement you can visit: https://lit.dev/docs/getting-started/
