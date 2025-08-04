class Api::V1::Admin::ReviewQuestionsController < ApplicationController
  before_action :authenticate_admin
  before_action :set_store
  before_action :set_question, only: [:update, :destroy]

  def index
    questions = @store.review_questions.ordered
    render json: questions
  end

  def create
    question = @store.review_questions.build(question_params)
    
    if question.save
      render json: { message: 'Question created successfully', question: question }, status: :created
    else
      render json: { errors: question.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @question.update(question_params)
      render json: { message: 'Question updated successfully', question: @question }
    else
      render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @question.destroy
    render json: { message: 'Question deleted successfully' }
  end

  private

  def set_store
    @store = current_admin.stores.find(params[:store_id])
  end

  def set_question
    @question = @store.review_questions.find(params[:id])
  end

  def question_params
    params.require(:review_question).permit(:question, :question_type, :order_index, :active, options: [])
  end
end