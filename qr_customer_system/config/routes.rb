# config/routes.rb
Rails.application.routes.draw do
  # QR Code scanning endpoint (top-level for simple access)
  get '/scan/:qr_code', to: 'api/v1/customer/scan#scan'

  namespace :api do
    namespace :v1 do
      # Admin routes
      namespace :admin do
        # Authentication
        post '/auth/login', to: 'auth#login'
        post '/auth/register', to: 'auth#register'
        
        # Store management
        resources :stores do
          resources :catalog_items, except: [:show]
          resources :review_questions, except: [:show]
          
          # Analytics endpoints
          get '/analytics/customers', to: 'analytics#customers'
          get '/analytics/interactions', to: 'analytics#interactions'
          get '/analytics/reviews', to: 'analytics#reviews'
        end
      end

      # Customer routes
      namespace :customer do
        # Add the scan route here too
        get '/scan/:qr_code', to: 'scan#scan'
        
        # Authentication
        post '/stores/:store_id/auth/register', to: 'auth#register'
        post '/stores/:store_id/auth/verify_otp', to: 'auth#verify_otp'
        post '/stores/:store_id/auth/send_otp', to: 'auth#send_otp'
        post '/auth/login', to: 'auth#login'
        
        # Catalog browsing
        get '/stores/:store_id/catalog', to: 'catalog#index'
        get '/stores/:store_id/catalog/:id', to: 'catalog#show'
        
        # Reviews
        get '/customers/:customer_id/review_questions', to: 'reviews#questions'
        get '/customers/:customer_id/purchased_items', to: 'reviews#purchased_items'
        post '/customers/:customer_id/reviews', to: 'reviews#create'
        
        # Purchases (for demo purposes)
        post '/customers/:customer_id/purchases', to: 'purchases#create'
      end
    end
  end

  # Health check
  get '/health', to: proc { [200, {}, ['OK']] }
end