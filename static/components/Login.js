export default {
    template:`
    <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #343a40; color: #ffffff;">
    
    <div style="background-color: #212529; padding: 20px; border-radius: 8px; width: 300px;">
    <div style="display: flex; justify-content: center; align-items: center; border: 2px solid #77dd77; border-radius: 8px; padding: 10px;">
    <div style="text-align: center; font-size: 2em; color: #ffffff; margin-bottom: 20px;">
    GroceryMart 
  </div>
  </div>

  <div style="display: flex; justify-content: center; align-items: center;">
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-basket2" viewBox="0 0 16 16">
    <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0z"/>
    <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6H2.163z"/>
  </svg>
</div>
  
      
      <form>
        <div style="margin-bottom: 20px;">
          <label for="email" style="color: #ffffff;">Email address</label>
          <input type="email" class="form-control" id="email" aria-describedby="emailHelp" v-model="cred.email" required>
          <small id="emailHelp" class="form-text text-muted">Please enter your email address.</small>
        </div>
        <div style="margin-bottom: 20px;">
          <label for="password" style="color: #ffffff;">Password</label>
          <input type="password" class="form-control" id="password" v-model="cred.password" required>
        </div>

        
        <div v-if="isRegister">
          <label for="confirmPassword" style="color: #ffffff;">Confirm Password</label>
          <input type="password" class="form-control" id="confirmPassword" v-model="cred.confirmPassword" required>
        </div>

        <div v-if="isRegister" style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center;">
            <input class="form-check-input" type="radio" name="userRole" id="userRole" checked>
            <label for="userRole" style="color: #ffffff; margin-left: 5px;">User Role</label>
          </div>
        </div>
        <div v-if="isRegister" style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center;">
            <input class="form-check-input" type="radio" name="userRole" id="managerRole">
            <label for="managerRole" style="color: #ffffff; margin-left: 5px;">Manager Role</label>
          </div>
        </div>
        <div class="alert alert-dark" role="alert" style="background-color: #008080;" >
        <span style="color: #ffffff;" >
        <div style="text-align: center;">
          {{ isRegister ? "Already registered?" : "Haven't registered yet?" }}
        </div>
          </span>
          <div class="alert-link" style="text-align: center;">
            <button class="link active" class="btn btn-outline-warning" @click="toggleForm">
              {{ isRegister ? "Login here" : "Click here to register" }}
            </button>
          </div>
        </div>
        <div class="text-danger">{{ error }}</div>

        <div style="text-align: center;">
  <button type="submit" class="btn btn-info" @click.prevent="isRegister ? register() : login()" style="width: 100%;">
    {{ isRegister ? "Register" : "Login" }}
  </button>
</div>

      </form>
    </div>
  </div>  
    `,
    data() {
        return {
            cred: {
                "email": null,
                "password": null,
                "confirmPassword":null
            },
            error:null,
            isRegister:false
        };
       
    },
    methods: {
        async login() {
            const res= await fetch('/user-login',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            })
            const data = await res.json()
            if(res.ok){
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                this.$router.push({ path: '/' })
                // location.reload()
            }
            else{
                this.error=data.message
            }
        },
        async register(){
          if (this.cred.password !== this.cred.confirmPassword) {
            this.error = "Passwords do not match";
            return;
          }
          // don't want to send the password double
          const { confirmPassword, ...requestData } = this.cred;
         
          requestData.role = document.getElementById('userRole').checked ? 'user' : 'manager';
          const res = await fetch('/user-register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: requestData.email,
              password: requestData.password,
              role: requestData.role,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            
            if (requestData.role === 'manager') {
              this.$router.push('/login');
            }
            await this.login();
          } else {
            this.error = data.message;
          }
        },
        toggleForm() {
          this.isRegister = !this.isRegister; 
          this.error = null; 
        }
    },
}