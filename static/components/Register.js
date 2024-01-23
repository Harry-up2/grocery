export default {
    template:`<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #343a40; color: #ffffff;">

    <div style="background-color: #212529; padding: 20px; border-radius: 8px; width: 300px;">
      <!-- Your content goes here -->
      <form>
        <div style="margin-bottom: 20px;">
          <label for="email" style="color: #ffffff;">Email address</label>
          <input type="email" class="form-control" id="email" aria-describedby="emailHelp" v-model="cred.email">
          <small id="emailHelp" class="form-text text-muted">Please enter your email address.</small>
        </div>
        <div style="margin-bottom: 20px;">
          <label for="password" style="color: #ffffff;">Password</label>
          <input type="password" class="form-control" id="password" v-model="cred.password">
        </div>
        <div style="margin-bottom: 20px;">
          <label for="confirmPassword" style="color: #ffffff;">Confirm Password</label>
          <input type="password" class="form-control" id="confirmPassword" v-model="cred.confirmPassword">
        </div>
        <div style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center;">
            <input class="form-check-input" type="radio" name="userRole" id="userRole" checked>
            <label for="userRole" style="color: #ffffff; margin-left: 5px;">User Role</label>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center;">
            <input class="form-check-input" type="radio" name="userRole" id="managerRole">
            <label for="managerRole" style="color: #ffffff; margin-left: 5px;">Manager Role</label>
          </div>
        </div>
        <div class="alert alert-dark" role="alert">
          Haven't registered yet?
          <div class="alert-link">
            <router-link class="link active" to="/register">Click here to register</router-link>
          </div>
        </div>
        <div class="text-danger">{{ error }}</div>
        <router-link to="/register">
          <button type="submit" class="btn btn-info">Register</button>
        </router-link>
      </form>
    </div>
  </div>`,
}