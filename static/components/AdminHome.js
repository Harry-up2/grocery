export default {
    template:`
    <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">
    <div style="background-color: #343a40; color: #ffffff; padding: 20px; border-radius: 8px;" class="container mt-5">
    <h2 style="color: #ffffff;">Welcome Admin</h2>
    <p style="font-size: 1.2em; margin-bottom: 1em;">You are the administrator of this GroceryMart website.</p>
    <p style="font-size: 1em; line-height: 1.6; margin-bottom: 1em;">As the administrator, you have specific privileges. Here's a quick overview:</p>
    <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 1em;">
        <li style="margin-bottom: 0.5em;">
            <strong>Manager Requests:</strong>
            <br />
            Whenever a new store manager is registered, you will receive the account activation requests here. Two options are available: 
            <span style="font-weight: normal;">Approve</span> (store manager can now login) and 
            <span style="font-weight: normal;">Decline</span> (store manager account will be deleted).
        </li>
        <li style="margin-bottom: 0.5em;">
            <strong>Section Requests:</strong>
            <br />
            Whenever a new store manager creates a new section, you will receive the section activation requests here. Two options are available: 
            <span style="font-weight: normal;">Approve</span> (store manager is given complete access to that section) and 
            <span style="font-weight: normal;">Decline</span> (section will be deleted).
        </li>
        <li>
            <strong>Section Managements:</strong>
            <br />
            You can create a section, rename it, and remove the section created by you. Admin doesn't have privileges regarding products, as that's the department of store managers. Any user doesn't have privileges to the section created by someone else.
        </li>
    </ul>
</div>
</div>
    `,
}