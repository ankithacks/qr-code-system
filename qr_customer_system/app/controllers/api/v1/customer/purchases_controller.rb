class Api::V1::Customer::PurchasesController < ApplicationController
  before_action :set_customer

  def create
    catalog_item = CatalogItem.find(params[:catalog_item_id])
    
    purchase = @customer.purchases.build(
      catalog_item: catalog_item,
      quantity: params[:quantity] || 1,
      price_paid: params[:price_paid] || catalog_item.offer_price || catalog_item.price
    )

    if purchase.save
      # Track interaction
      CustomerInteraction.create!(
        customer: @customer,
        catalog_item: catalog_item,
        interaction_type: 'catalog_browse',
        metadata: { action: 'purchase', quantity: purchase.quantity }
      )

      render json: {
        message: 'Purchase recorded successfully',
        purchase: {
          id: purchase.id,
          catalog_item: catalog_item.name,
          quantity: purchase.quantity,
          price_paid: purchase.price_paid,
          purchased_at: purchase.created_at
        }
      }, status: :created
    else
      render json: { errors: purchase.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_customer
    @customer = Customer.find(params[:customer_id])
  end
end
