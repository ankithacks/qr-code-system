class Api::V1::Admin::AnalyticsController < ApplicationController
  before_action :authenticate_admin
  before_action :set_store

  def customers
    customers = @store.customers.includes(:customer_interactions, :reviews, :purchases)
    
    render json: {
      total_customers: customers.count,
      verified_customers: customers.where(verified: true).count,
      customers: customers.map { |customer|
        {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          verified: customer.verified,
          interactions_count: customer.customer_interactions.count,
          reviews_count: customer.reviews.count,
          purchases_count: customer.purchases.count,
          joined_at: customer.created_at
        }
      }
    }
  end

  def interactions
    interactions = @store.customers.joins(:customer_interactions)
                        .includes(:customer_interactions => :catalog_item)
                        .flat_map(&:customer_interactions)
                        .sort_by(&:created_at).reverse
                        .first(100)

    render json: {
      total_interactions: @store.customers.joins(:customer_interactions).count,
      recent_interactions: interactions.map { |interaction|
        {
          id: interaction.id,
          customer_name: interaction.customer.name,
          interaction_type: interaction.interaction_type,
          catalog_item: interaction.catalog_item&.name,
          timestamp: interaction.created_at,
          metadata: interaction.metadata
        }
      }
    }
  end

  def reviews
    reviews = @store.catalog_items.joins(:reviews)
                   .includes(reviews: [:customer, :review_answers])
                   .flat_map(&:reviews)
                   .sort_by(&:created_at).reverse
                   .first(50)

    render json: {
      total_reviews: @store.catalog_items.joins(:reviews).count,
      average_rating: Review.joins(catalog_item: :store)
                           .where(stores: { id: @store.id })
                           .average(:overall_rating)&.round(2) || 0,
      recent_reviews: reviews.map { |review|
        {
          id: review.id,
          customer_name: review.customer.name,
          catalog_item: review.catalog_item.name,
          overall_rating: review.overall_rating,
          comment: review.comment,
          answers: review.review_answers.map { |answer|
            {
              question: answer.review_question.question,
              answer: answer.answer
            }
          },
          created_at: review.created_at
        }
      }
    }
  end

  private

  def set_store
    @store = current_admin.stores.find(params[:store_id])
  end
end