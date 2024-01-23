export default {
    template: `
    <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">
      <div class="container mt-5">
        <h2 class="mb-4">Previous Purchases</h2>
        <h5>Product - Quantity - Total Amount- Purchased Date/Time</h5>
        <ul v-if="purchases && purchases.length" class="list-group">
          <li v-for="purchase in purchases" :key="purchase.PurchaseID" class="list-group-item bg-secondary text-white d-flex justify-content-between align-items-center">
            <span class="flex-grow-1" >
              <strong>{{ purchase.PName }}</strong> | {{ purchase.Quantity }}   | ₹{{ purchase.TotalPrice }}   | {{ purchase.PurchaseDate }}  
            </span>
          </li>
        </ul>
        <div v-else>
          <p>You haven't made any purchase yet.</p>
        </div>
      </div>
    </div>  
    `,
    data() {
      return {
        token: localStorage.getItem('auth-token'),
        purchases: [],
        error:null,
      };
    },
    methods: {
      async fetchPurchases() {
        try {
          const res = await fetch('/api/purchase', {
            headers: {
              'Authentication-Token': this.token,
            },
          });
          const data = await res.json();
          if (res.ok) {
            this.purchases = data;
          } else {
            this.error=data.message;
            this.purchases = [];
          }
        } catch (error) {
          console.error('Error fetching purchases:', error);
          this.purchases = [];
        }
      },
    },
    mounted() {
      this.fetchPurchases();
      this.error=null;
    },
  };