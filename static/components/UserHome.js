export default {
    template:` <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">
    <div class="container mt-5">
      <h2 class="mb-4">All Sections</h2>
      <div class="text-danger">{{ error }}</div>
      <div class="text-success">{{ success }}</div>

      
      <button type="button" class="btn btn-primary mb-3" @click="toggleSearchOptions">
        {{ showSearchOptions ? 'Hide Search Options' : 'Show Search Options' }}
      </button>

      <!-- Search Section-->
      <div v-show="showSearchOptions">
        <!-- Section name filter -->
        <div class="mb-3">
          <label for="sectionName">Search by Section Name:</label>
          <input v-model="sectionNameSearch" type="text" class="form-control" id="sectionName">
        </div>
      </div>

      <ul class="list-group">
        <li v-for="section in filteredSections" :key="section.SectionID" :value="section.SectionID" class="list-group-item bg-dark text-white mb-2">
          <strong>{{ section.SectionName }}</strong>
          <ul v-if="section.products && section.products.length" class="list-group">
            <li v-for="product in section.products" :key="product.ProductID" :value="product.ProductID" class="list-group-item bg-secondary text-white d-flex justify-content-between align-items-center">
              <span class="flex-grow-1">
                <strong>{{ product.ProductName }}</strong> | {{ product.Description }} | ₹{{ product.RatePerUnit }}
              </span>
              <div class="d-flex align-items-center">
                <label class="mr-2" style="width: 60px;">Quantity:</label>
                <select v-model="product.Quantity" class="form-control" style="width: 60px;">
                  <option v-for="quantity in quantities" :key="quantity" :value="quantity">{{ quantity }}</option>
                </select>
                <button type="button" class="btn btn-info btn-sm ml-2" style="width: 100px;" @click="addToCart(product)">Add to Cart</button>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
`
,
  data() {
    return {
      token: localStorage.getItem('auth-token'),
      existingSections: [],
      error: null,
      quantities: [1, 2, 3, 4, 5],
      success: null,
      sectionNameSearch: '', 
      showSearchOptions: false,
    };
  },
  computed: {
   
    filteredSections() {
      return this.existingSections.filter(section => {
        const nameMatch = section.SectionName.toLowerCase().includes(this.sectionNameSearch.toLowerCase());
        return nameMatch;
      });
    },
  },
  methods: {
    async fetchSections() {
      try {
        const res = await fetch('/api/sections', {
          headers: {
            'Authentication-Token': this.token,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.existingSections = data;
        } else {
          this.error = data.message;
          this.existingSections = [];
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
        this.existingSections = [];
      }
    },
      async addToCart(product) {
        const user_id = localStorage.getItem('id'); 
        const quantity = product.Quantity || 1; 
  
        try {
          const res = await fetch(`/api/cart`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            },
            body: JSON.stringify({
              ProductID: product.ProductID,
              Quantity: quantity,
            }),
          });
  
          if (res.ok) {
           
            this.success='Product added to cart successfully';
          } else {
            
            const data = await res.json();
            this.error= data.message;
          }
        } catch (error) {
          console.error('Error adding product to cart:', error);
        }
      },
      toggleSearchOptions() {
        this.showSearchOptions = !this.showSearchOptions;
      },  
  },
  mounted() {
    this.fetchSections();
    this.error=null;
    this.success=null;
  },
}