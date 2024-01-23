export default {
    template:`
    <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">
    <div style="background-color: #343a40; color: #ffffff; padding: 20px; border-radius: 8px;" class="container mt-5">
    <h2 style="color: #ffffff;">Welcome Store Manager</h2>
    <p style="font-size: 1.2em; margin-bottom: 1em;">You are the store manager of GroceryMart.</p>
    <p style="font-size: 1em; line-height: 1.6; margin-bottom: 1em;">As the store manager, you have specific privileges. Here's a quick overview:</p>
    <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 1em;">
        <li style="margin-bottom: 0.5em;">
            <strong>Section Management:</strong>
            <br />
            You can create, update, and remove any section created by you not by the administrator. However, when a new section is created, it goes to the administrator for approval. Once approved, you'll have complete freedom with that particular section. However,you will not be able to update or remove sections which are created by the administrator.
        </li>
        <li style="margin-bottom: 0.5em;">
            <strong>Product Management:</strong>
            <br />
            You can create, update, and remove products within any section created by you or the administrator. When a new product is created, it gets assigned to an "Unknown" section for security purposes. You can later update the section by selecting the product and choosing the appropriate section from the dropdown menu.
        </li>
    </ul>
</div>
</div>
    `,
}