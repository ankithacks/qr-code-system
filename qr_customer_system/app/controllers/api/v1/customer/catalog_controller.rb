class Api::V1::Customer::CatalogController < ApplicationController
  before_action :set_store

  def index
    # Show only 2 items initially before requiring user details
    items = @store.catalog_items.active.limit(params[:authenticated] ? nil : 2)
    
    render json: {
      items: items.map { |item|
        {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          offer_price: item.offer_price,
          category: item.category,
          has_offer: item.offer_price.present?
        }
      },
      requires_auth: !params[:authenticated] && @store.catalog_items.active.count > 2,
      total_items: @store.catalog_items.active.count
    }
  end

  def show
    item = @store.catalog_items.active.find(params[:id])
    
    # Track interaction if customer is provided
    if params[:customer_id]
      customer = Customer.find(params[:customer_id])
      CustomerInteraction.create!(
        customer: customer,
        catalog_item: item,
        interaction_type: 'view'
      )
    end

    render json: {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      offer_price: item.offer_price,
      category: item.category,
      reviews_count: item.reviews.count,
      average_rating: item.reviews.average(:overall_rating)&.round(2) || 0
    }
  end

  private

  def set_store
    @store = Store.find(params[:store_id])
  end
end