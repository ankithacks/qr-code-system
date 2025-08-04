class Api::V1::Customer::ReviewsController < ApplicationController
  before_action :set_customer
  before_action :set_store

  def questions
    questions = @store.review_questions.active.ordered
    render json: questions.map { |q|
      {
        id: q.id,
        question: q.question,
        question_type: q.question_type,
        options: q.options
      }
    }
  end

  def create
    catalog_item = @store.catalog_items.find(params[:catalog_item_id])
    
    review = @customer.reviews.build(
      catalog_item: catalog_item,
      overall_rating: params[:overall_rating],
      comment: params[:comment]
    )

    if review.save
      # Save individual question answers
      params[:answers]&.each do |answer_data|
        ReviewAnswer.create!(
          review: review,
          review_question_id: answer_data[:question_id],
          answer: answer_data[:answer]
        )
      end

      # Track interaction
      CustomerInteraction.create!(
        customer: @customer,
        catalog_item: catalog_item,
        interaction_type: 'review_submit'
      )

      render json: { message: 'Review submitted successfully', review: review }, status: :created
    else
      render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def purchased_items
    purchases = @customer.purchases.includes(:catalog_item)
    render json: purchases.map { |purchase|
      {
        id: purchase.catalog_item.id,
        name: purchase.catalog_item.name,
        price_paid: purchase.price_paid,
        purchased_at: purchase.created_at,
        already_reviewed: @customer.reviews.exists?(catalog_item: purchase.catalog_item)
      }
    }
  end

  private

  def set_customer
    @customer = Customer.find(params[:customer_id])
  end

  def set_store
    @store = @customer.store
  end
end