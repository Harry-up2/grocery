export default {
    template:`
    <div style="background-color: #d4edda; min-height: 100vh; padding: 20px;">
    <div class="container mt-5">
    <div class="text-danger">{{ error }}</div>
    <h2 class="mb-4">My Cart</h2>
    <div class="text-success">{{ success }}</div>
    <div
    <ul v-if="cartItems && cartItems.length" class="list-group">
  <li v-for="cartItem in cartItems" :key="cartItem.CartID" v-if="cartItem.Quantity !== 0" class="list-group-item bg-secondary text-white d-flex justify-content-between align-items-center">
    <span class="flex-grow-1">
      <strong>{{ cartItem.PName }}</strong> | Quantity: {{ cartItem.Quantity }}  |  Price ₹{{ cartItem.TotalPrice }} 
    </span>
    <div class="d-flex align-items-center">
      <label class="mr-2" style="width: 60px;">Update Quantity:</label>
      <input v-model="cartItem.updatedQuantity" type="number" class="form-control" style="width: 60px;">
      <button type="button" class="btn btn-info btn-sm ml-2" style="width: 100px;" @click="updateQuantity(cartItem)">Update</button>
    </div>
  </li>
</ul>

    <div v-else>
      <p>Your cart is empty.</p>
    </div>

    <button v-if="cartItems && cartItems.length" type="button" class="btn btn-danger mt-3" @click="clearCart">Clear Cart</button>

    <button v-if="cartItems && cartItems.length" type="button" class="btn btn-success mt-3" @click="purchase">Purchase</button>
  </div>
</div>
    `,
    data() {
    return {
      token: localStorage.getItem('auth-token'),
      cartItems: [],
      error:null,
      success:null,
    };
  },
  methods: {
    async fetchCartItems() {
      try {
        const res = await fetch('/api/cart', {
          headers: {
            'Authentication-Token': this.token,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.cartItems = data;
        } else {
          this.error= data.message;
          this.cartItems = [];
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        this.cartItems = [];
      }
    },

    async updateQuantity(cartItem) {
        
        if (cartItem.updatedQuantity > 0) {
        try {
          const res = await fetch(`/api/cart/${cartItem.CartID}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            },
            body: JSON.stringify({
              ProductID: cartItem.ProductID,
              Quantity: cartItem.updatedQuantity,
            }),
          });
  
          if (res.ok) {
            
            this.success='Quantity updated successfully';
            
            cartItem.Quantity = cartItem.updatedQuantity;
            this.fetchCartItems();
          } else {
            
            const data = await res.json();
            this.error= data.message;
          }
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
    } else {
        
        this.error='Quantity must be greater than zero';
      }
      },

    // async removeCartItem(cartItem) {
    //   // Implement the logic to delete the cart item on the server
    //   try {
    //     const res = await fetch(`/api/cart/${cartItem.CartID}`, {
    //       method: 'DELETE',
    //       headers: {
    //         'Authentication-Token': this.token,
    //       },
    //     });

    //     if (res.ok) {
    //       // Handle success (e.g., show a success message)
    //       console.log('CartItem removed successfully');
    //       // Remove the cartItem from the local cartItems array
    //       this.cartItems = this.cartItems.filter(item => item.CartID !== cartItem.CartID);
    //     } else {
    //       // Handle error (e.g., show an error message)
    //       const data = await res.json();
    //       console.error('Error removing cartItem:', data.message);
    //     }
    //   } catch (error) {
    //     console.error('Error removing cartItem:', error);
    //   }
    // },

    calculateTotalPrice() {
      return this.cartItems.reduce((total, cartItem) => total + cartItem.TotalPrice, 0);
    },

    async confirmPurchase() {
      const confirmed = window.confirm('Are you sure you want to make the purchase?');
      if (confirmed) {
        
      }
    },
    async clearCart() {
        try {
          const res = await fetch('/api/cart', {
            method: 'DELETE',
            headers: {
              'Authentication-Token': this.token,
            },
          });
  
          if (res.ok) {
            
            console.log('Cart cleared successfully');
            
            this.cartItems = [];
          } else {
          
            const data = await res.json();
            console.error('Error clearing cart:', data.message);
          }
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      },
  
      async purchase() {
        try {
            await this.confirmPurchase();
            const res = await fetch('/api/purchase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            },
            body: JSON.stringify({
              UserID: localStorage.getItem('id'), 
            }),
          });
  
          if (res.ok) {
            
            this.success='Purchase completed successfully.Thank you for shopping from GroceryMart';
            
            this.cartItems = [];
          } else {
            
            const data = await res.json();
            this.error= data.message;
          }
        } catch (error) {
          console.error('Error completing purchase:', error);
        }
      },
  },

  mounted() {
    this.fetchCartItems();
    this.error=null;
    this.success=null;
  },
};