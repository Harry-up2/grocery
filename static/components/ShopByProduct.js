export default {
    template:` <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">

    <div class="container mt-5">
      <h2 class="mb-4">All Products</h2>
      <div class="text-danger">{{ error }}</div>
      <div class="text-success">{{ success }}</div>
  
     
      <button type="button" class="btn btn-primary mb-3" @click="toggleSearchOptions">
        {{ showSearchOptions ? 'Hide Search Options' : 'Show Search Options' }}
      </button>
  
      <!-- Search Products) -->
      <div v-show="showSearchOptions">
        <div class="mb-3">
          <label for="productName">Search by Product Name:</label>
          <input v-model="productNameSearch" type="text" class="form-control" id="productName">
        </div>
  
       
        <div class="mb-3">
          <label for="priceRange">Filter by Price Range:</label>
          <input v-model="minPrice" type="number" placeholder="Min Price" class="form-control" id="minPrice">
          <input v-model="maxPrice" type="number" placeholder="Max Price" class="form-control" id="maxPrice">
        </div>
      </div>
  
      <ul class="list-group">
            <li v-for="product in filteredProducts" :key="product.ProductID"" class="list-group-item bg-secondary text-white d-flex justify-content-between align-items-center">
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
    </div>
  
  </div>

  `,
  data() {
    return {
      token: localStorage.getItem('auth-token'),
      existingProducts: [],
      error: null,
      quantities: [1, 2, 3, 4, 5],
      success: null,
      productNameSearch: '', 
      minPrice: null, 
      maxPrice: null, 
      showSearchOptions: false,
    };
  },
  computed: {
    
    filteredProducts() {
        const minPriceValue = this.minPrice !== null ? Number(this.minPrice) : null;
        const maxPriceValue = this.maxPrice !== null ? Number(this.maxPrice) : null;
      
        return this.existingProducts.filter(product => {
          const nameMatch = product.ProductName.toLowerCase().includes(this.productNameSearch.toLowerCase());
          const priceMatch =
            (minPriceValue === null || product.RatePerUnit >= minPriceValue) &&
            (maxPriceValue === null || product.RatePerUnit <= maxPriceValue);
      
          return nameMatch && priceMatch;
        });
    },
  },
  methods: {
    async fetchProducts() {
        try {
          const res = await fetch('/api/all-products', {
            headers: {
              'Authentication-Token': this.token,
            },
          });
          const data = await res.json();
          if (res.ok) {
            this.existingProducts = data;
          } else {
            this.error=data.message;
            this.existingProducts = [];
          }
        } catch (error) {
          console.error('Error fetching sections:', error);
          this.existingProducts = [];
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
    this.fetchProducts();
    this.error=null;
    this.success=null;
  },
}