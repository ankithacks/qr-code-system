class Api::V1::Admin::CatalogItemsController < ApplicationController
  before_action :authenticate_admin
  before_action :set_store
  before_action :set_catalog_item, only: [:update, :destroy]  

  def index
    items = @store.catalog_items.includes(:reviews, :purchases)
    render json: items.map { |item|
      {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        offer_price: item.offer_price,
        category: item.category,
        active: item.active,
        reviews_count: item.reviews.count,
        average_rating: item.reviews.average(:overall_rating)&.round(2) || 0,
        purchases_count: item.purchases.count
      }
    }
  end

  def create
    item = @store.catalog_items.build(catalog_item_params)
    
    if item.save
      render json: { message: 'Item created successfully', item: item }, status: :created
    else
      render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @catalog_item.update(catalog_item_params)
      render json: { message: 'Item updated successfully', item: @catalog_item }
    else
      render json: { errors: @catalog_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @catalog_item.destroy
    render json: { message: 'Item deleted successfully' }
  end

  private

  def set_store
    @store = current_admin.stores.find(params[:store_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Store not found' }, status: :not_found
  end

  def set_catalog_item
    @catalog_item = @store.catalog_items.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Catalog item not found' }, status: :not_found
  end

  def catalog_item_params
    params.require(:catalog_item).permit(:name, :description, :price, :offer_price, :category, :active)
  end
end
