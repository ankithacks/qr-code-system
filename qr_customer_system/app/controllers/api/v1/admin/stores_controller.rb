class Api::V1::Admin::StoresController < ApplicationController
  before_action :authenticate_admin
  before_action :set_store, only: [:show, :update, :destroy]

  def index
    stores = current_admin.stores.includes(:catalog_items, :customers)
    render json: stores.map { |store|
      {
        id: store.id,
        name: store.name,
        description: store.description,
        address: store.address,
        phone: store.phone,
        email: store.email,
        catalog_items_count: store.catalog_items.count,
        customers_count: store.customers.count,
        created_at: store.created_at
      }
    }
  end

  def show
  latest_qr_code = @store.qr_codes.order(created_at: :desc).first

  render json: {
    id: @store.id,
    name: @store.name,
    description: @store.description,
    address: @store.address,
    phone: @store.phone,
    email: @store.email,
    qr_codes: latest_qr_code.present? ? [{
      id: latest_qr_code.id,
      code: latest_qr_code.code,
      scan_url: "#{request.base_url}/scan/#{latest_qr_code.code}"
    }] : []
  }
end


  def create
    store = current_admin.stores.build(store_params)
    
    if store.save
      # Generate initial QR code
      qr_code = store.generate_qr_code
      
      render json: {
        message: 'Store created successfully',
        store: {
          id: store.id,
          name: store.name,
          description: store.description,
          address: store.address,
          qr_code: {
            code: qr_code.code,
            scan_url: "#{request.base_url}/scan/#{qr_code.code}"
          }
        }
      }, status: :created
    else
      render json: { errors: store.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @store.update(store_params)
      render json: { message: 'Store updated successfully', store: @store }
    else
      render json: { errors: @store.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @store.destroy
    render json: { message: 'Store deleted successfully' }
  end

  private

  def set_store
    @store = current_admin.stores.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Store not found' }, status: :not_found
  end

  def store_params
    params.require(:store).permit(:name, :description, :address, :phone, :email)
  end
end