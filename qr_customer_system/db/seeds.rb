# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
admin = Admin.create!(
  name: "Store Admin",
  email: "admin@example.com",
  password: "password123",
  password_confirmation: "password123"
)

# Create sample stores
store1 = admin.stores.create!(
  name: "Tech Store",
  description: "Latest gadgets and electronics",
  address: "123 Tech Street, Silicon Valley",
  phone: "+1-555-0123",
  email: "tech@store.com"
)

store2 = admin.stores.create!(
  name: "Fashion Boutique", 
  description: "Trendy clothing and accessories",
  address: "456 Fashion Ave, NYC",
  phone: "+1-555-0456",
  email: "fashion@boutique.com"
)

# Generate QR codes for stores
store1.generate_qr_code
store2.generate_qr_code

# Create sample catalog items for Tech Store
tech_items = [
  {
    name: "Smartphone Pro",
    description: "Latest flagship smartphone with advanced features",
    price: 999.99,
    offer_price: 899.99,
    category: "Electronics"
  },
  {
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 299.99,
    offer_price: 249.99,
    category: "Audio"
  },
  {
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    price: 399.99,
    category: "Wearables"
  },
  {
    name: "Laptop Stand",
    description: "Ergonomic aluminum laptop stand",
    price: 79.99,
    offer_price: 59.99,
    category: "Accessories"
  }
]

tech_items.each { |item| store1.catalog_items.create!(item) }

# Create sample catalog items for Fashion Boutique
fashion_items = [
  {
    name: "Designer Dress",
    description: "Elegant evening dress for special occasions",
    price: 199.99,
    offer_price: 149.99,
    category: "Dresses"
  },
  {
    name: "Leather Handbag",
    description: "Premium leather handbag with multiple compartments",
    price: 299.99,
    category: "Accessories"
  },
  {
    name: "Casual Sneakers",
    description: "Comfortable sneakers for everyday wear",
    price: 129.99,
    offer_price: 99.99,
    category: "Footwear"
  }
]

fashion_items.each { |item| store2.catalog_items.create!(item) }

# Create sample review questions for stores
tech_questions = [
  {
    question: "How would you rate the product quality?",
    question_type: "rating",
    order_index: 1
  },
  {
    question: "Would you recommend this product to others?",
    question_type: "multiple_choice",
    options: ["Definitely", "Probably", "Not sure", "Probably not", "Definitely not"],
    order_index: 2
  },
  {
    question: "What did you like most about this product?",
    question_type: "text",
    order_index: 3
  },
  {
    question: "How was your overall shopping experience?",
    question_type: "rating",
    order_index: 4
  }
]

tech_questions.each { |q| store1.review_questions.create!(q) }

fashion_questions = [
  {
    question: "How would you rate the style and design?",
    question_type: "rating",
    order_index: 1
  },
  {
    question: "How is the fit and comfort?",
    question_type: "rating", 
    order_index: 2
  },
  {
    question: "What's your favorite aspect of this item?",
    question_type: "text",
    order_index: 3
  }
]

fashion_questions.each { |q| store2.review_questions.create!(q) }


puts "Sample data created successfully!"
puts "Admin Login: admin@example.com / password123"
puts "Store 1 QR Code: #{store1.qr_codes.first.code}"
puts "Store 2 QR Code: #{store2.qr_codes.first.code}"
